import { AuthProvider, useAuth } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { RootRoutes } from '@/routes'
import { BrowserRouter as Router } from 'react-router-dom'

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  return <RootRoutes />
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="jin-app-theme"
      >
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
