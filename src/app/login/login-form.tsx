'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { login, type AuthResponse } from '@/app/actions/auth'

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin/waitlist'
  const urlError = searchParams.get('error')

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === 'auth-code-error'
      ? 'Não foi possível autenticar o código de verificação. Tente novamente.'
      : null
  )
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('redirectTo', redirectTo)

    startTransition(async () => {
      try {
        const result: AuthResponse | void = await login(formData)

        if (result?.error) {
          setErrorMessage(result.error)
        }
      } catch (err: unknown) {
        // Next.js redirect() throws a NEXT_REDIRECT error which is caught here, so ignore it if so
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof (err as { digest: string }).digest === 'string' &&
          (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
        ) {
          throw err
        }
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
      }
    })
  }

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <div className="admin-pill">
          <ShieldCheck size={14} className="admin-pill-icon" />
          <span>Acesso Exclusivo Admin</span>
        </div>
        <h1 className="auth-title">Painel de Controlo</h1>
        <p className="auth-subtitle">
          Autentique-se com as credenciais de administrador definidas no ambiente.
        </p>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="auth-alert error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <Lock size={16} className="alert-icon" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-mail de Administrador
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin@exemplo.com"
            required
            autoComplete="email"
            autoFocus
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Palavra-passe
          </label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="form-input password-input"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="auth-submit-btn">
          {isPending ? (
            <span className="btn-spinner" />
          ) : (
            'Aceder à Dashboard'
          )}
        </button>
      </form>

      <div className="auth-footer-note">
        <span>Não existe registo público. Apenas administradores autorizados têm acesso.</span>
      </div>

      <style>{`
        .auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 28px;
          padding: 36px 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .admin-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          padding: 4px 12px;
          border-radius: 9999px;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: 14px;
        }

        .admin-pill-icon {
          color: #4EA7EB;
        }

        .auth-title {
          font-family: var(--font-gt-mechanik), -apple-system, sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
        }

        .auth-subtitle {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.45;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 13.5px;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.22);
          border: 1px solid rgba(239, 68, 68, 0.45);
          color: #FEE2E2;
        }

        .alert-icon {
          flex-shrink: 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .form-input {
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 14px;
          padding: 0 16px;
          color: #FFFFFF;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .form-input:focus {
          border-color: #FFFFFF;
          background: rgba(255, 255, 255, 0.16);
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input {
          padding-right: 46px;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover {
          color: #FFFFFF;
        }

        .auth-submit-btn {
          margin-top: 8px;
          height: 52px;
          width: 100%;
          border-radius: 9999px;
          background: #4EA7EB;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.4), inset 0 1.5px 2px rgba(255, 255, 255, 0.5);
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .auth-submit-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: scale(1.01);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .auth-footer-note {
          margin-top: 22px;
          text-align: center;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 28px 20px;
            border-radius: 22px;
          }
        }
      `}</style>
    </div>
  )
}
