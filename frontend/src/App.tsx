import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './components/Landing'
import LoginPage from './components/LoginPage'
import Homepage from './components/Homepage'
import MarketplacePage from './components/MarketplacePage'
import Dashboard from './components/Dashboard'

function AppContent() {
  const { user, loading } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/')

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path)
      setCurrentPath(path)
    }
  }

  useEffect(() => {
    if (user) {
      setIsLoginOpen(false)
    }
  }, [user])

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading authentication status...</p>
      </div>
    )
  }

  // simple pathname-based routing for marketplace page
  if (currentPath === '/marketplace') {
    return <MarketplacePage onNavigate={navigate} />
  }

  if (currentPath === '/dashboard') {
    return <Dashboard onNavigate={navigate} />
  }

  if (user) {
    return <Homepage onNavigate={navigate} />
  }

  return isLoginOpen ? (
    <LoginPage onLoginSuccess={() => setIsLoginOpen(false)} />
  ) : (
    <Landing onLoginClick={() => setIsLoginOpen(true)} onNavigate={navigate} />
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
