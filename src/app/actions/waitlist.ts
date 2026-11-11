'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendWaitlistConfirmationEmail } from '@/lib/email'

export interface WaitlistResult {
  success: boolean
  position?: number
  alreadyRegistered?: boolean
  error?: string
}

export async function joinWaitlistAction(formData: FormData): Promise<WaitlistResult> {
  const emailRaw = formData.get('email') as string
  const source = (formData.get('source') as string) || 'direct'
  const honeypot = formData.get('bot_field') as string

  // 1. Verificação anti-spam (Honeypot)
  if (honeypot && honeypot.trim().length > 0) {
    // Se um bot preencheu o campo invisível, simulamos sucesso sem gravar
    return {
      success: true,
      position: 999,
      alreadyRegistered: false,
    }
  }

  // 2. Validação de formato do email no servidor
  if (!emailRaw) {
    return { success: false, error: 'Por favor, introduza o seu e-mail.' }
  }

  const email = emailRaw.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return { success: false, error: 'Por favor, introduza um e-mail válido.' }
  }

  try {
    const supabase = await createClient()

    // 3. Chamada à função RPC atómica no Supabase
    const { data, error } = await supabase.rpc('join_waitlist', {
      email_input: email,
      source_input: source,
    })

    if (error) {
      console.error('[Supabase RPC join_waitlist error]:', error)
      return {
        success: false,
        error: 'Não foi possível concluir o registo. Por favor, tente novamente dentro de instantes.',
      }
    }

    // data é retornado como array de registros da função table(...)
    const record = Array.isArray(data) ? data[0] : data

    if (!record || typeof record.position === 'undefined') {
      return {
        success: false,
        error: 'Resposta inesperada do servidor. Tente novamente.',
      }
    }

    const position = Number(record.position)
    const alreadyRegistered = Boolean(record.already_registered)

    // 4. Envio do email de confirmação aguardado (garante envio no ambiente serverless)
    try {
      const emailResult = await sendWaitlistConfirmationEmail({
        email,
        position,
        alreadyRegistered,
      })

      if (emailResult.success) {
        await supabase.rpc('mark_email_sent', { email_input: email })
      } else {
        console.warn('[Nodemailer send notice]:', emailResult.error)
      }
    } catch (emailErr) {
      console.error('[Background Email Error]:', emailErr)
    }

    return {
      success: true,
      position,
      alreadyRegistered,
    }
  } catch (err: unknown) {
    console.error('[joinWaitlistAction Exception]:', err)
    return {
      success: false,
      error: 'Erro de ligação ao servidor. Verifique a sua ligação à internet.',
    }
  }
}

export interface ResendPendingResult {
  success: boolean
  totalProcessed: number
  sentCount: number
  error?: string
}

/**
 * Ação de administração para processar e reenviar e-mails pendentes
 */
export async function resendPendingWaitlistEmailsAction(): Promise<ResendPendingResult> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  try {
    const supabase = await createAdminClient()

    const { data: pending, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email_sent', false)
      .order('position', { ascending: true })

    if (error || !pending) {
      return { success: false, totalProcessed: 0, sentCount: 0, error: error?.message }
    }

    let sentCount = 0

    for (const item of pending) {
      const cleanEmail = (item.email || '').trim().toLowerCase()
      if (!emailRegex.test(cleanEmail)) continue

      const res = await sendWaitlistConfirmationEmail({
        email: cleanEmail,
        position: item.position,
      })

      if (res.success) {
        await supabase
          .from('waitlist')
          .update({ email_sent: true })
          .eq('id', item.id)
        sentCount++
      }
    }

    return {
      success: true,
      totalProcessed: pending.length,
      sentCount,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar e-mails pendentes'
    return { success: false, totalProcessed: 0, sentCount: 0, error: msg }
  }
}
