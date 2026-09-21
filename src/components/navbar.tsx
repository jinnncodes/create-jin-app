import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAnonymous = user?.isAnonymous ?? false;

  return (
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center border-b bg-background px-2">
      <div className="flex items-center">
        <SidebarTrigger className="size-8">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <span className="ml-3 font-semibold">{import.meta.env.VITE_APP_NAME || "Jin App"}</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {user && !isAnonymous && (
          <span className="text-sm">
            Welcome, {user.displayName || user.email}
          </span>
        )}
        <ModeToggle />
        {user && (
          isAnonymous ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          )
        )}
      </div>
    </header>
  );
}
