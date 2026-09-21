import { Link } from 'react-router-dom'
import { LayoutDashboard, Settings, UserRound } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Seo, privatePageSeo } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const { user, userProfile, profileLoading } = useAuth()
  const displayName = userProfile?.displayName || user?.displayName || user?.email || 'there'

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <Seo {...privatePageSeo('Dashboard', '/dashboard')} />

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {displayName}. This is the default signed-in home for the starter kit.
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="h-4 w-4" />
              Account
            </CardTitle>
              <CardDescription>Your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profileLoading ? (
              <>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </>
            ) : (
              <>
                <p>
                  <span className="text-muted-foreground">Name: </span>
                  {userProfile?.displayName || 'Not set'}
                </p>
                <p>
                  <span className="text-muted-foreground">Email: </span>
                  {user?.email || 'Anonymous session'}
                </p>
                <p>
                  <span className="text-muted-foreground">UID: </span>
                  <span className="break-all font-mono text-xs">{user?.uid}</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutDashboard className="h-4 w-4" />
              Status
            </CardTitle>
            <CardDescription>Session type</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              {user?.isAnonymous
                ? 'You are on an anonymous session. Sign in to keep this account.'
                : 'You are signed in with a persistent account.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Quick actions
            </CardTitle>
            <CardDescription>Starter shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/settings">Edit profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
