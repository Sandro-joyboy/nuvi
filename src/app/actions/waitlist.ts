'use server'

import { createClient } from '@/utils/supabase/server'
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

    // 4. Envio do email em background seguro (não bloqueia nem falha o registo)
    sendWaitlistConfirmationEmail({
      email,
      position,
      alreadyRegistered,
    })
      .then(async (emailResult) => {
        if (emailResult.success) {
          try {
            // Marca no Supabase que o email foi enviado
            await supabase.rpc('mark_email_sent', { email_input: email })
          } catch (err) {
            console.error('[mark_email_sent error]:', err)
          }
        }
      })
      .catch((err) => {
        console.error('[Background Email Error]:', err)
      })

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
