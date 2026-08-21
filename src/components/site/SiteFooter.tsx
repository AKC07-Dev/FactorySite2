import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em]">SR CREATION</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Knits, wovens, activewear and outerwear manufactured for brands, with in-house cutting,
            stitching, printing and finishing.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:items-end">
          <Link to="/products" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          <p className="pt-2 text-xs">© {new Date().getFullYear()} SR Creation</p>
        </div>
      </div>
    </footer>
  );
}
