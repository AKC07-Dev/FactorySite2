import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { categoryImage } from "@/lib/product-images";
import { formatCurrency } from "@/lib/orders";
import { cn } from "@/lib/utils";

const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => listCatalog(),
});

export const Route = createFileRoute("/products")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "Product Catalogue — SR Creation" },
      {
        name: "description",
        content:
          "Browse SR Creation's manufacturing catalogue: t-shirts, shirts, activewear and outerwear with fabric, GSM, size and MOQ details.",
      },
      { property: "og:title", content: "Product Catalogue — SR Creation" },
      {
        property: "og:description",
        content: "Fabric, GSM, sizes, colours and minimum order quantity for every style we produce.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data } = useSuspenseQuery(catalogQuery);
  const [category, setCategory] = useState<string | null>(null);
  const [fabric, setFabric] = useState<string | null>(null);

  const categoryById = useMemo(
    () => new Map(data.categories.map((c) => [c.id, c])),
    [data.categories],
  );

  const fabrics = useMemo(() => {
    const set = new Set<string>();
    data.products.forEach((p) => {
      if (p.fabric) set.add(p.fabric);
    });
    return [...set].sort();
  }, [data.products]);

  const products = data.products.filter((p) => {
    if (category && p.category_id !== category) return false;
    if (fabric && p.fabric !== fabric) return false;
    return true;
  });

  return (
    <PublicShell>
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-eyebrow">Catalogue</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold md:text-5xl">
            Styles we produce, ready for your labels.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground">
            Every style below can be re-engineered — fabric, GSM, trims, fit and decoration are all
            adjustable against your tech pack.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap gap-6">
          <FilterGroup
            label="Category"
            options={[
              { value: null, label: "All" },
              ...data.categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={category}
            onChange={setCategory}
          />
          <FilterGroup
            label="Fabric"
            options={[{ value: null, label: "All" }, ...fabrics.map((f) => ({ value: f, label: f }))]}
            value={fabric}
            onChange={setFabric}
          />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const cat = product.category_id ? categoryById.get(product.category_id) : null;
            return (
              <Link
                key={product.id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group flex flex-col border border-border bg-card"
              >
                <img
                  src={product.image_url || categoryImage(cat?.slug)}
                  alt={product.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    {cat?.name ?? "Custom"}
                  </p>
                  <h2 className="mt-3 text-lg font-medium">{product.name}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">{product.fabric}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                    <span className="text-sm text-primary">
                      {formatCurrency(Number(product.base_price))}
                    </span>
                    <span className="text-xs text-muted-foreground">MOQ {product.moq} pcs</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="mt-12 text-sm text-muted-foreground">
            No styles match these filters. Reset them or send us your requirement.
          </p>
        )}

        <div className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold">Need a style that isn't listed?</h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Share a tech pack or reference sample and we will develop it with costing and a proto
            timeline.
          </p>
          <Button asChild className="mt-6">
            <Link to="/contact">Send an enquiry</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string | null; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              "border px-3 py-1.5 text-xs transition-colors",
              value === option.value
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
