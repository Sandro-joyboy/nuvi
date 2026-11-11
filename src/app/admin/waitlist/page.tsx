import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { getWaitlistMetrics } from '@/lib/admin-waitlist'
import { AdminWaitlistDashboard } from './dashboard-client'
import { signOut } from '@/app/actions/auth'

export const metadata = {
  title: 'Admin Waitlist — Nuvi',
  description: 'Dashboard de métricas e inscritos na lista de espera Nuvi.',
}

export default async function AdminWaitlistPage() {
  const supabase = await createClient()

  // 1. Verificação de autenticação no servidor
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login?redirectTo=/admin/waitlist')
  }

  // 2. Verificação de autorização de administrador via variável de ambiente
  const adminEmails = [
    process.env.ADMIN_EMAIL,
    ...(process.env.ADMIN_EMAILS || '').split(','),
    'sandro2006vieira@gmail.com',
  ]
    .filter(Boolean)
    .map((e) => (e as string).trim().toLowerCase())

  const currentUserEmail = (user.email || '').toLowerCase()
  const isAdmin = adminEmails.includes(currentUserEmail)

  if (!isAdmin) {
    return (
      <main className="unauthorized-main">
        <div className="unauthorized-bg-wrapper">
          <Image
            src="/hero-bg.png"
            alt="Nuvi Background"
            fill
            priority
            draggable={false}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
          />
          <div className="unauthorized-bg-overlay" />
        </div>

        <div className="unauthorized-card">
          <div className="lock-icon">🔒</div>
          <h1 className="unauthorized-title">Acesso Restrito</h1>
          <p className="unauthorized-desc">
            A área <strong>/admin/waitlist</strong> é reservada exclusivamente a
            administradores autorizados da Nuvi.
          </p>
          <div className="user-email-pill">
            Conectado como: <strong>{user.email}</strong>
          </div>

          <div className="unauthorized-actions">
            <Link href="/" className="unauth-btn primary">
              Voltar à Página Inicial
            </Link>
            <form action={signOut}>
              <button type="submit" className="unauth-btn secondary">
                Terminar Sessão
              </button>
            </form>
          </div>
        </div>

        <style>{`
          .unauthorized-main {
            position: relative;
            min-height: 100vh;
            min-height: 100dvh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
          }
          .unauthorized-bg-wrapper {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
          }
          .unauthorized-bg-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(10, 20, 35, 0.7);
            backdrop-filter: blur(8px);
          }
          .unauthorized-card {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 480px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 28px;
            padding: 44px 32px;
            text-align: center;
            color: #FFFFFF;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          }
          .lock-icon {
            font-size: 40px;
            margin-bottom: 16px;
          }
          .unauthorized-title {
            font-family: var(--font-gt-mechanik), sans-serif;
            font-size: 28px;
            margin: 0 0 10px 0;
          }
          .unauthorized-desc {
            font-family: var(--font-sf-pro), sans-serif;
            font-size: 15px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
            margin: 0 0 20px 0;
          }
          .user-email-pill {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13.5px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 28px;
          }
          .unauthorized-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .unauth-btn {
            font-family: var(--font-sf-pro), sans-serif;
            font-size: 14px;
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 9999px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            border: none;
            transition: all 0.2s;
          }
          .unauth-btn.primary {
            background: #0082F6;
            color: #FFFFFF;
          }
          .unauth-btn.primary:hover {
            filter: brightness(1.1);
          }
          .unauth-btn.secondary {
            background: rgba(255, 255, 255, 0.14);
            color: #FFFFFF;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .unauth-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.25);
          }
        `}</style>
      </main>
    )
  }

  // 3. Obtenção das métricas
  const metrics = await getWaitlistMetrics()

  return (
    <main className="admin-page-bg">
      <div className="admin-bg-wrapper">
        <Image
          src="/hero-bg.png"
          alt="Nuvi Background"
          fill
          priority
          draggable={false}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
        />
        <div className="admin-bg-overlay" />
      </div>

      <div className="admin-page-content">
        <AdminWaitlistDashboard
          metrics={metrics}
          adminEmail={currentUserEmail}
        />
      </div>

      <style>{`
        .admin-page-bg {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          overflow-x: hidden;
        }
        .admin-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .admin-bg-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(6, 14, 28, 0.88);
          backdrop-filter: blur(14px);
        }
        .admin-page-content {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </main>
  )
}
