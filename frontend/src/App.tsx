import { AuthProvider } from './context/AuthContext'
import Landing from './components/Landing'

function App() {
  return (
    <AuthProvider>
      <Landing />
    </AuthProvider>
  )
}

export default App