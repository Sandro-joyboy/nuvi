import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from './server'

/**
 * Retorna o cliente com service_role (se disponível) para operações administrativas
 * ou o cliente do servidor autenticado como fallback.
 */
export async function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (serviceKey && supabaseUrl) {
    return createSupabaseClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  // Fallback para o cliente autenticado de sessão
  return await createServerClient()
}
