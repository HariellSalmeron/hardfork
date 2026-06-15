import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Landing from './components/Landing'
import LoginPage from './components/LoginPage'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <AuthProvider>
      {isLoginOpen ? (
        <LoginPage onNavigate={() => setIsLoginOpen(false)} />
      ) : (
        <Landing onLoginClick={() => setIsLoginOpen(true)} />
      )}
    </AuthProvider>
  )
}

export default App