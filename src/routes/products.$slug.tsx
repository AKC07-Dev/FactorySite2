import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/catalog.functions";
import { categoryImage } from "@/lib/product-images";
import { formatCurrency } from "@/lib/orders";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return { name: product.name, description: product.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Style unavailable — SR Creation" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — SR Creation`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: StyleNotFound,
});

function StyleNotFound() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-6 py-32">
        <h1 className="text-3xl font-semibold">Style not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This style may have been retired from the catalogue.
        </p>
        <Button asChild className="mt-8">
          <Link to="/products">Back to catalogue</Link>
        </Button>
      </div>
    </PublicShell>
  );
}

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));

  if (!product) return <StyleNotFound />;

  const category = product.categories as { name: string; slug: string } | null;

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/products" className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          ← Catalogue
        </Link>

        <div className="mt-10 grid gap-14 lg:grid-cols-2">
          <img
            src={product.image_url || categoryImage(category?.slug)}
            alt={product.name}
            width={1024}
            height={1024}
            className="aspect-square w-full border border-border object-cover"
          />

          <div>
            <p className="text-eyebrow">{category?.name ?? "Custom development"}</p>
            <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{product.name}</h1>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 text-sm">
              <Spec label="Fabric" value={product.fabric} />
              <Spec label="GSM" value={product.gsm ? String(product.gsm) : "As per spec"} />
              <Spec label="Minimum order" value={`${product.moq} pcs`} />
              <Spec
                label="Indicative price"
                value={`${formatCurrency(Number(product.base_price))} / pc`}
              />
              <Spec label="Sizes" value={product.sizes.join(" · ")} />
              <Spec label="Stock colours" value={product.colors.join(" · ")} />
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/order/new" search={{ product: product.slug }}>
                  Build a bulk order
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Ask about customisation</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Pricing is indicative and confirmed after fabric, trims and decoration are locked.
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-2">{value}</dd>
    </div>
  );
}
