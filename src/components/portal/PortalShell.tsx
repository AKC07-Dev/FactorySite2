import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const CUSTOMER_NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/orders", label: "My orders" },
  { to: "/order/new", label: "New order" },
  { to: "/profile", label: "Company" },
] as const;

export function PortalShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-6 py-5">
          <Link to="/" className="font-display text-sm font-semibold tracking-[0.18em]">
            SR CREATION
          </Link>
          <nav className="flex flex-wrap items-center gap-5">
            {CUSTOMER_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm text-primary" }}
              >
                Admin
              </Link>
            )}
          </nav>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
