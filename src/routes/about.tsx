import { createFileRoute, Link } from "@tanstack/react-router";

import heroFactory from "@/assets/hero-factory.jpg";
import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SR Creation — Our Apparel Unit" },
      {
        name: "description",
        content:
          "SR Creation is an apparel manufacturing unit with in-house cutting, stitching, printing, finishing and quality control for brand production.",
      },
      { property: "og:title", content: "About SR Creation — Our Apparel Unit" },
      {
        property: "og:description",
        content: "Capacity, compliance and the way we run production for brands.",
      },
    ],
  }),
  component: AboutPage,
});

export default function noop() {}

function AboutPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-eyebrow">About us</p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold md:text-5xl">
          A manufacturing partner that behaves like part of your team.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          SR Creation started as a small stitching unit and grew into a full-service apparel
          manufacturer. We work with growing labels and established brands who need consistent
          quality, honest lead times and clear communication through every stage of production.
        </p>
      </section>

      <section className="border-y border-border/70">
        <img
          src={heroFactory}
          alt="Inside the SR Creation stitching floor"
          loading="lazy"
          width={1600}
          height={1104}
          className="h-[380px] w-full object-cover opacity-90"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">How we work</h2>
            <ol className="mt-8 space-y-6 text-sm text-muted-foreground">
              {[
                "Tech pack and fabric review, followed by costing and an indicative lead time.",
                "Proto and fit sample approval with clear comments captured against each measurement.",
                "Fabric booking, cutting and line loading with in-line quality checks.",
                "Final audit, packing to your specification and dispatch with documentation.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4 border-t border-border pt-5">
                  <span className="font-display text-primary">0{index + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">The unit</h2>
            <dl className="mt-8 space-y-6 text-sm">
              {[
                ["Monthly capacity", "40,000+ pieces across knits and wovens"],
                ["Lines", "8 balanced stitching lines, 2 dedicated to activewear"],
                ["In-house", "Cutting, stitching, screen printing, embroidery, finishing"],
                ["Quality", "In-line and end-line AQL inspection with documented reports"],
                ["Compliance", "Documented worker records, fire safety and hygiene audits"],
              ].map(([label, value]) => (
                <div key={label} className="border-t border-border pt-5">
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    {label}
                  </dt>
                  <dd className="mt-2 leading-relaxed">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold">Visit or start a programme</h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            We welcome factory visits before you place your first order.
          </p>
          <Button asChild className="mt-6">
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
