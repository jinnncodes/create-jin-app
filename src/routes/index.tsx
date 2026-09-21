import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Settings } from '@/pages/Settings'
import { ProtectedLayout } from './protected-layout'

export { appRoutePaths } from './app.routes'
export { authRoutePaths } from './auth.routes'
export { publicRoutePaths } from './public.routes'

export function RootRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
