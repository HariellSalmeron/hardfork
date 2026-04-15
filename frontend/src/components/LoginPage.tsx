import '../styles/LoginPage.css'

interface LoginPageProps {
  onNavigate: () => void
}

function LoginPage({ onNavigate }: LoginPageProps) {
  return (
    <div className="login-page" onClick={onNavigate}>
      <div className="login-topbar" />
      <div className="login-content">
        <div className="login-header">
          <img src="/assets/images/Forker.png" alt="HARDFORK" className="login-logo" />
          <img src="/assets/images/login.png" alt="Login to continue" className="login-label-image" />
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Enter your email and password correctly.</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={(e) => { e.preventDefault(); onNavigate(); }}>
            <label className="login-field">
              {/* <span>Email address</span> */}
              <div className="input-icon-wrapper">
                <input type="email" placeholder="Your email address" />
                <img src="/assets/images/email.png" alt="Email" className="input-icon" />
              </div>
            </label>
            <label className="login-field">
              {/* <span>Password</span> */}
              <div className="input-icon-wrapper">
                <input type="password" placeholder="Password" />
                <img src="/assets/images/eye.png" alt="Show password" className="input-icon" />
              </div>
            </label>

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" />
                Remember Me
              </label>
            </div>

            <button type="submit" className="login-button">Login Now</button>
            <a href="#" className="login-forgot">
  Forgot Password <span className="arrow">&gt;</span>
</a>
          </form>
        </div>

        <p className="login-footer">© Copyright HARDFORK 2026. All rights reserved.</p>
      </div>
    </div>
  )
}

export default LoginPage