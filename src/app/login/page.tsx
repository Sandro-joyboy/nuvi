import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'Admin Login — Nuvi',
  description: 'Acesso exclusivo de administrador à dashboard da Nuvi.',
}

export default function LoginPage() {
  return (
    <main className="login-main">
      {/* Background with brand gradient overlay */}
      <div className="login-bg-wrapper">
        <Image
          src="/hero-bg.png"
          alt="Nuvi Background"
          fill
          priority
          draggable={false}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
        />
        <div className="login-bg-overlay" />
      </div>

      {/* Header Logo */}
      <header className="login-header">
        <Link href="/">
          <img
            src="/logo.svg"
            alt="Nuvi"
            draggable={false}
            className="login-top-logo"
          />
        </Link>
      </header>

      {/* Main Form Area */}
      <section className="login-center">
        <Suspense fallback={<div className="login-card-loading">A carregar...</div>}>
          <LoginForm />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="login-footer">
        <span className="footer-copyright">
          Nuvi &copy; 2026. Conectando marcas e criadores.
        </span>
      </footer>

      {/* Styles */}
      <style>{`
        .login-main {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: clamp(20px, 4vh, 36px) 20px clamp(16px, 3vh, 28px);
          box-sizing: border-box;
          user-select: none;
        }

        .login-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 130, 245, 0.45);
          backdrop-filter: blur(2px);
        }

        .login-header {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .login-top-logo {
          height: 22px;
          width: auto;
          display: block;
          cursor: pointer;
        }

        .login-center {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          margin: auto 0;
          padding: 20px 0;
        }

        .login-card-loading {
          padding: 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
        }

        .login-footer {
          position: relative;
          z-index: 10;
          text-align: center;
        }

        .footer-copyright {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
        }
      `}</style>
    </main>
  )
}
