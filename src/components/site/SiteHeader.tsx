import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-foreground">
            SR CREATION
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Buyer portal</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Request access
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className={cn("border-t border-border/70 md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={user ? "/dashboard" : "/auth"}
            onClick={() => setOpen(false)}
            className="py-2 text-sm text-primary"
          >
            {user ? "Buyer portal" : "Sign in / Request access"}
          </Link>
        </div>
      </div>
    </header>
  );
}
