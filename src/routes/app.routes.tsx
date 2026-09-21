import { Dashboard } from '@/pages/Dashboard'
import { Settings } from '@/pages/Settings'

/**
 * Authenticated application routes.
 *
 * This starter does not hardcode domain roles. When a future project has
 * distinct user types, create additional files such as:
 *   src/routes/patient.routes.tsx
 *   src/routes/clinic.routes.tsx
 *   src/routes/admin.routes.tsx
 * Determine those user types from that project's requirements — do not
 * assume Patient / Clinic / Admin exist here.
 */
export const appRoutePaths = ['/dashboard', '/settings'] as const

export { Dashboard, Settings }
