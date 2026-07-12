import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './components/Landing'
import LoginPage from './components/LoginPage'
import Homepage from './components/Homepage'

function AppContent() {
  const { user, loading } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setIsLoginOpen(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading authentication status...</p>
      </div>
    )
  }

  if (user) {
    return <Homepage />
  }

  return isLoginOpen ? (
    <LoginPage onLoginSuccess={() => setIsLoginOpen(false)} />
  ) : (
    <Landing onLoginClick={() => setIsLoginOpen(true)} />
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
