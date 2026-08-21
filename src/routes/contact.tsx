import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/catalog.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SR Creation — Bulk Order Enquiries" },
      {
        name: "description",
        content:
          "Send SR Creation your bulk apparel requirement — styles, quantities and timelines — and receive a costed quotation.",
      },
      { property: "og:title", content: "Contact SR Creation — Bulk Order Enquiries" },
      {
        property: "og:description",
        content: "Share your tech pack or requirement and our merchandising team will respond.",
      },
    ],
  }),
  component: ContactPage,
});

const EMPTY = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  product_interest: "",
  estimated_quantity: "",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const send = useServerFn(submitInquiry);

  const mutation = useMutation({
    mutationFn: () => send({ data: form }),
    onSuccess: () => {
      toast.success("Enquiry received. Our team will respond within one working day.");
      setForm(EMPTY);
    },
    onError: () => toast.error("Could not send the enquiry. Please check the fields and retry."),
  });

  const set = (key: keyof typeof EMPTY) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-eyebrow">Contact</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold md:text-5xl">
          Tell us what you need produced.
        </h1>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <Field label="Company name" required>
              <Input required value={form.company_name} onChange={set("company_name")} />
            </Field>
            <Field label="Contact person" required>
              <Input required value={form.contact_person} onChange={set("contact_person")} />
            </Field>
            <Field label="Email" required>
              <Input type="email" required value={form.email} onChange={set("email")} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={set("phone")} />
            </Field>
            <Field label="Product interest">
              <Input
                placeholder="e.g. round neck tees, oxford shirts"
                value={form.product_interest}
                onChange={set("product_interest")}
              />
            </Field>
            <Field label="Estimated quantity">
              <Input
                placeholder="e.g. 2,000 pcs per style"
                value={form.estimated_quantity}
                onChange={set("estimated_quantity")}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Requirement details">
                <Textarea
                  rows={5}
                  placeholder="Fabric, GSM, decoration, delivery window, any reference styles."
                  value={form.message}
                  onChange={set("message")}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending…" : "Send enquiry"}
              </Button>
            </div>
          </form>

          <aside className="space-y-8 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Merchandising</p>
              <a href="mailto:ruppeshthorat3521@gmail.com" className="mt-2 block text-sm transition-colors hover:text-primary">
                ruppeshthorat3521@gmail.com
              </a>
              <a href="tel:+919016902420" className="block text-sm transition-colors hover:text-primary">
                +91 90169 02420
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Unit address</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                SR Creation Apparel Unit
                <br />
                Industrial Estate, Phase II
                <br />
                India
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Working hours</p>
              <p className="mt-2 text-sm text-muted-foreground">Monday – Saturday, 9:30 to 18:30 IST</p>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
    </div>
  );
}
