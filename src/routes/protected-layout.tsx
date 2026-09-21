import { Navigate } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { useAuth } from '@/lib/auth-context'
import { hasAppAccess } from '@/lib/auth-access'

export function ProtectedLayout() {
  const { user } = useAuth()

  if (!hasAppAccess(user)) {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}
