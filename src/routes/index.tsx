import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Scissors, Shirt, Sparkles, PackageCheck, ArrowRight } from "lucide-react";

import heroFactory from "@/assets/hero-factory.jpg";
import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { categoryImage } from "@/lib/product-images";

const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => listCatalog(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "SR Creation — Clothing Manufacturing for Brands" },
      {
        name: "description",
        content:
          "SR Creation manufactures knits, wovens, activewear and outerwear at scale, with in-house cutting, stitching, printing and finishing.",
      },
      { property: "og:title", content: "SR Creation — Clothing Manufacturing for Brands" },
      {
        property: "og:description",
        content:
          "Bulk apparel manufacturing with a buyer portal for quotations, order tracking and production status.",
      },
    ],
  }),
  component: Home,
});

const CAPABILITIES = [
  {
    icon: Scissors,
    title: "Cutting",
    body: "Automated spreading and cutting with marker efficiency reviewed on every style.",
  },
  {
    icon: Shirt,
    title: "Stitching",
    body: "Eight balanced lines running knits and wovens with in-line quality checkpoints.",
  },
  {
    icon: Sparkles,
    title: "Printing & embroidery",
    body: "Screen, DTF and embroidery in-house, so decoration never becomes a bottleneck.",
  },
  {
    icon: PackageCheck,
    title: "Finishing",
    body: "Pressing, tagging, poly-bagging and carton packing to buyer-specified standards.",
  },
];

function Home() {
  const { data } = useSuspenseQuery(catalogQuery);

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-border/70">
        <img
          src={heroFactory}
          alt="Production floor at the SR Creation apparel unit"
          width={1600}
          height={1104}
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
          <p className="text-eyebrow">Apparel manufacturing since 2009</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold text-balance md:text-6xl">
            Garments built to your spec, produced at brand scale.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            SR Creation runs knits, wovens, activewear and outerwear from fabric sourcing through
            finished, packed cartons — with a buyer portal that shows exactly where your order stands.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Request buyer access
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-eyebrow">Capabilities</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold md:text-4xl">
          One unit, every stage of the garment.
        </h2>
        <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {CAPABILITIES.map((item) => (
            <div key={item.title} className="border-t border-border pt-6">
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow">Product range</p>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Categories in production</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              View full catalogue <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                className="group block overflow-hidden border border-border bg-card"
              >
                <img
                  src={categoryImage(category.slug)}
                  alt={category.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-5">
                  <h3 className="text-base font-medium">{category.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { value: "40,000+", label: "Pieces per month capacity" },
            { value: "8", label: "Balanced stitching lines" },
            { value: "18 days", label: "Typical lead time after approval" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-grain">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            Ready to run your next production with us?
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Register your company for portal access, submit a bulk requirement, and receive a costed
            quotation with a committed delivery window.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create buyer account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to our team</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
