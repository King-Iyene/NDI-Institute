import { useState, type ReactNode } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { useAuth } from "../auth-context";
import {
  LayoutDashboard, BookOpen, ClipboardList, Video, MessageSquare,
  Users, Settings, LogOut, GraduationCap, Menu, Bell, ChevronDown, X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: ("student" | "teacher" | "admin" | "super_admin")[];
}

const allRoles = ["student", "teacher", "admin", "super_admin"] as const;

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard, roles: [...allRoles] },
  { label: "Courses", href: "/portal/courses", icon: BookOpen, roles: [...allRoles] },
  { label: "Assignments", href: "/portal/assignments", icon: ClipboardList, roles: [...allRoles] },
  { label: "Classes", href: "/portal/classes", icon: Video, roles: [...allRoles] },
  { label: "Forums", href: "/portal/forums", icon: MessageSquare, roles: [...allRoles] },
  { label: "Users", href: "/portal/users", icon: Users, roles: ["admin", "super_admin"] },
  { label: "Settings", href: "/portal/settings", icon: Settings, roles: ["super_admin"] },
];

function NavLinks({ role, currentPath, onNavigate }: { role: string; currentPath: string; onNavigate?: () => void }) {
  const filtered = navItems.filter((item) => item.roles.includes(role as any));
  return (
    <nav className="flex flex-col gap-1 px-3">
      {filtered.map((item) => {
        const Icon = item.icon;
        const active = currentPath === item.href || (item.href !== "/portal" && currentPath.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <span className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-orange-500/15 text-orange-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}>
              <Icon size={18} />
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ role, currentPath, user, onNavigate }: { role: string; currentPath: string; user: { firstName: string; lastName: string; email: string; role: string; avatar?: string | null }; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">NDI Portal</h1>
          <p className="text-[11px] text-gray-500 leading-tight">Learning Management</p>
        </div>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto">
        <NavLinks role={role} currentPath={currentPath} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="bg-gray-700 text-sm text-gray-300">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-200">{user.firstName} {user.lastName}</p>
            <Badge variant="outline" className="mt-0.5 border-gray-700 text-[10px] text-gray-400 capitalize">
              {user.role.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortalLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 bg-gray-900 lg:block">
        <SidebarContent role={user.role} currentPath={location} user={user} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-none bg-gray-900 p-0 [&>button]:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent role={user.role} currentPath={location} user={user} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {navItems.find((n) => location === n.href || (n.href !== "/portal" && location.startsWith(n.href)))?.label || "Portal"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell size={18} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    {user.avatar && <AvatarImage src={user.avatar} />}
                    <AvatarFallback className="bg-orange-100 text-sm text-orange-700">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-gray-700 sm:inline">{user.firstName}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/portal/profile" className="cursor-pointer">
                    <Settings size={14} className="mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut size={14} className="mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/portal/login" />;
  }

  return <>{children}</>;
}
