import { useState } from 'react'
import LoginPage from './components/LoginPage'
import Landing from './components/Landing'

function App() {
  const [showLanding, setShowLanding] = useState(false)

  return showLanding ? (
    <Landing />
  ) : (
    <LoginPage onNavigate={() => setShowLanding(true)} />
  )
}

export default App