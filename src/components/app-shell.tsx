import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { AppSidebar } from '@/components/appSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function AppShell() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
