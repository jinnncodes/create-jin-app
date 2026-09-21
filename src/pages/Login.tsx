import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/login-form'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuth } from '@/lib/auth-context'
import { isFullySignedIn } from '@/lib/auth-access'
import { getAppName, Seo } from '@/lib/seo'

export function LoginPage() {
  const { user } = useAuth()
  const appName = getAppName()

  if (isFullySignedIn(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Seo
        title="Sign in"
        description={`Sign in or create an account to use ${appName}.`}
        path="/login"
        robots="noindex,nofollow"
      />
      <header className="flex h-12 items-center justify-between border-b px-4">
        <span className="font-semibold">{appName}</span>
        <ModeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  )
}
