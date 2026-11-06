import { useState, type FormEvent } from 'react'
import { ArrowRight, LoaderCircle, ShieldCheck } from 'lucide-react'
import type { AuthMode } from '../types/auth'
import BrandMark from './BrandMark'

interface AuthScreenProps {
  onAuthenticate: (mode: AuthMode, values: Record<string, string>) => Promise<void>
  message: string
}

export default function AuthScreen({ onAuthenticate, message }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setFormError('')
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>

    try {
      await onAuthenticate(mode, values)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No fue posible completar la solicitud.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" id="login">
        <div className="login-brand">
          <BrandMark />
          <span className="login-brand-name">cobalto<span>.</span></span>
        </div>

        <div className="auth-intro">
          <span className="eyebrow">ACCESO</span>
          <h2>{mode === 'login' ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'}</h2>
          <p>{mode === 'login' ? 'Entra para ver tus cuentas y movimientos.' : 'Solo toma un minuto empezar.'}</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Acceso a la cuenta">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setMode('login'); setFormError('') }}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setMode('register'); setFormError('') }}
            role="tab"
            aria-selected={mode === 'register'}
          >
            Registrarme
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <div className="name-fields">
              <label>Nombre<input name="firstName" autoComplete="given-name" required placeholder="Tu nombre" /></label>
              <label>Apellido<input name="lastName" autoComplete="family-name" required placeholder="Tu apellido" /></label>
            </div>
          )}
          <label>Correo electrónico<input name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" /></label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
              placeholder={mode === 'login' ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
            />
          </label>
          {(formError || message) && <div className="alert alert-error" role="alert">{formError || message}</div>}
          <button className="primary-button auth-submit" type="submit" disabled={busy}>
            {busy
              ? <LoaderCircle className="spin" size={18} />
              : <>{mode === 'login' ? 'Ingresar' : 'Crear mi cuenta'}<ArrowRight size={17} /></>}
          </button>
        </form>

        <div className="auth-assurance"><ShieldCheck size={17} /><span>Tu conexión está cifrada.</span></div>
      </section>

      <footer className="login-footer"><span>© 2026 Cobalto</span><span>Proyecto de demostración</span></footer>
    </main>
  )
}