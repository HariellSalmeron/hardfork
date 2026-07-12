import { useState } from 'react'
import { signIn, resetPassword } from '../lib/auth'
import '../styles/LoginPage.css'

interface LoginPageProps {
  onLoginSuccess: () => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please enter both email and password')
        setLoading(false)
        return
      }

      const { user, error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message || 'Login failed')
      } else if (user) {
        setSuccessMessage('Login successful! Redirecting...')
        if (rememberMe) {
          localStorage.setItem('rememberEmail', email)
        }
        onLoginSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!resetEmail) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      const { error: resetError } = await resetPassword(resetEmail)

      if (resetError) {
        setError(resetError.message || 'Password reset failed')
      } else {
        setSuccessMessage('Check your email for password reset instructions')
        setTimeout(() => setShowForgotPassword(false), 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Load remembered email on mount
  import.meta.hot?.dispose(() => {})

  return (
    <div className="login-page">
      <div className="login-topbar" />
      <div className="login-content">
        <div className="login-header">
          <img src="/assets/images/Forker.png" alt="HARDFORK" className="login-logo" />
          <img src="/assets/images/login.png" alt="Login to continue" className="login-label-image" />
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Enter your email and password correctly.</p>
        </div>

        <div className={`login-card${showForgotPassword ? ' forgot-mode' : ''}`}>
          {showForgotPassword ? (
            <form className="login-form" onSubmit={handleForgotPassword}>
              <h2 className="login-card-title">Reset Password</h2>
              <label className="login-field">
                <div className="input-icon-wrapper">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={loading}
                  />
                  <img src="/assets/images/email.png" alt="Email" className="input-icon" />
                </div>
              </label>

              {error && <div className="login-error">{error}</div>}
              {successMessage && <div className="login-success">{successMessage}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                className="login-back-button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setError(null)
                  setSuccessMessage(null)
                }}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
              <label className="login-field">
                <div className="input-icon-wrapper">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <img src="/assets/images/email.png" alt="Email" className="input-icon" />
                </div>
              </label>
              <label className="login-field">
                <div className="input-icon-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img src="/assets/images/eye.png" alt="Toggle password" className="input-icon" />
                  </button>
                </div>
              </label>

              {error && <div className="login-error">{error}</div>}
              {successMessage && <div className="login-success">{successMessage}</div>}

              <div className="login-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login Now'}
              </button>
              <button
                type="button"
                className="login-forgot"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password <span className="arrow">&gt;</span>
              </button>
            </form>
          )}
        </div>

        <p className="login-footer">© Copyright HARDFORK 2026. All rights reserved.</p>
      </div>
    </div>
  )
}

export default LoginPage