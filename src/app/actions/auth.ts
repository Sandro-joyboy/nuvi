'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export type AuthResponse = {
  error?: string
  success?: boolean
  message?: string
}

export async function login(formData: FormData): Promise<AuthResponse | void> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/admin/waitlist'

  if (!email || !password) {
    return { error: 'Por favor, preencha o e-mail e a palavra-passe.' }
  }

  // 1. Obter credenciais de admin configuradas via variáveis de ambiente
  const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const envAdminPassword = process.env.ADMIN_PASSWORD
  const envAdminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (!envAdminPassword) {
    console.error('[Auth Error]: ADMIN_PASSWORD não está definida no arquivo .env')
    return {
      error: 'Erro de configuração no servidor. Defina ADMIN_PASSWORD no arquivo .env.',
    }
  }

  const isEmailAuthorized =
    (envAdminEmail && email === envAdminEmail) || envAdminEmails.includes(email)

  // 2. Acesso estritamente restrito ao administrador
  if (!isEmailAuthorized || password !== envAdminPassword) {
    return {
      error: 'Credenciais inválidas. O acesso à dashboard é exclusivo para o administrador.',
    }
  }

  // 3. Garantir conta sincronizada no Supabase Auth usando a chave de serviço (admin)
  try {
    const adminSupabase = await createAdminClient()
    const { data: usersData, error: listError } = await adminSupabase.auth.admin.listUsers()

    if (listError) {
      console.error('[Supabase listUsers warning]:', listError)
    }

    const existingUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === email
    )

    if (!existingUser) {
      // Cria o utilizador admin diretamente com email confirmado
      const { error: createError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
      })
      if (createError) {
        console.error('[Supabase createUser error]:', createError)
        return {
          error: 'Falha ao provisionar utilizador de administração: ' + createError.message,
        }
      }
    } else {
      // Atualiza a palavra-passe no Supabase caso tenha sido alterada no .env
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        existingUser.id,
        { password, email_confirm: true }
      )
      if (updateError) {
        console.warn('[Supabase updateUser warning]:', updateError)
      }
    }
  } catch (syncError) {
    console.error('[Supabase Admin Sync Error]:', syncError)
  }

  // 4. Iniciar sessão no cliente SSR (define os cookies da sessão)
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Supabase signInWithPassword error]:', error)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
