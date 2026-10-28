import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Plus, Settings, UserRound } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Seo, privatePageSeo } from '@/lib/seo'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type DemoItem = {
  id: string
  title: string
}

/**
 * Starter demo of empty-vs-error: a successful empty list is empty copy only.
 * Soft-fail (permission/race noise) logs and still shows empty UI.
 * Page error only when the load truly failed.
 */
async function loadDemoItems(): Promise<DemoItem[]> {
  // Simulated empty API / no docs result — not an error.
  return []
}

export function Dashboard() {
  const { user, userProfile, profileLoading } = useAuth()
  const displayName = userProfile?.displayName || user?.displayName || user?.email || 'there'

  const [items, setItems] = useState<DemoItem[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setListLoading(true)
      setListError(null)
      try {
        const result = await loadDemoItems()
        if (!cancelled) setItems(result)
      } catch (error) {
        // Soft-fail list noise → log + empty UI (not a red page banner).
        console.error('Failed to load demo items (soft-fail):', error)
        if (!cancelled) {
          setItems([])
          // Uncomment / set listError only for true hard failures:
          // setListError(error instanceof Error ? error.message : 'Failed to load items')
        }
      } finally {
        if (!cancelled) setListLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleAddSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!newTitle.trim()) {
      setTitleError('Title is required')
      return
    }
    setTitleError(null)
    setItems((prev) => [...prev, { id: crypto.randomUUID(), title: newTitle.trim() }])
    setNewTitle('')
    setAddOpen(false)
  }

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

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Demo items</h2>
            <p className="text-sm text-muted-foreground">
              Empty API results show empty copy — never a red error banner.
            </p>
          </div>
          <Button type="button" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>

        {listError ? (
          <p className="text-sm text-destructive" role="alert">
            {listError}
          </p>
        ) : listLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet. Add one to get started.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
              >
                <span>{item.title}</span>
                {/* Disallowed actions stay visible but disabled, with tooltip via wrapper */}
                <span title="You cannot delete the only demo row pattern from here">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled
                    className="pointer-events-none"
                  >
                    Delete
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={addOpen}
        title="Add item"
        onClose={() => {
          setAddOpen(false)
          setTitleError(null)
          setNewTitle('')
        }}
      >
        <form className="space-y-4" onSubmit={handleAddSubmit}>
          <div className="space-y-2">
            <Label htmlFor="demo-item-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="demo-item-title"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value)
                if (titleError) setTitleError(null)
              }}
              aria-invalid={Boolean(titleError)}
              placeholder="Item title"
            />
            {titleError ? (
              <p className="text-sm text-destructive">{titleError}</p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddOpen(false)
                setTitleError(null)
                setNewTitle('')
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
