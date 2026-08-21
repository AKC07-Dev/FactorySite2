import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/orders";

const searchSchema = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/_authenticated/order/new")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "New Bulk Order — SR Creation" },
      {
        name: "description",
        content: "Build a bulk apparel requirement with size and colour breakdown and request a quote.",
      },
      { property: "og:title", content: "New Bulk Order — SR Creation" },
      { property: "og:description", content: "Submit a production requirement to SR Creation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewOrderPage,
});

const selectClass =
  "h-10 w-full border border-input bg-background px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function NewOrderPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [slug, setSlug] = useState(search.product ?? "");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [pending, setPending] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["order-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, sizes, colors, moq, base_price")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const product = useMemo(
    () => (products ?? []).find((item) => item.slug === slug) ?? null,
    [products, slug],
  );

  const total = Object.values(quantities).reduce((sum, value) => sum + (Number(value) || 0), 0);

  return (
    <PortalShell
      title="New bulk order"
      description="Pick a style, enter the size and colour breakdown, and we will send a costed quotation."
    >
      <form
        className="max-w-3xl grid gap-8"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!product) {
            toast.error("Select a product first.");
            return;
          }
          if (total < product.moq) {
            toast.error(`Minimum order quantity for this style is ${product.moq} pcs.`);
            return;
          }
          setPending(true);
          const { data: auth } = await supabase.auth.getUser();
          if (!auth.user) {
            setPending(false);
            toast.error("Session expired. Please sign in again.");
            return;
          }
          const { data: order, error } = await supabase
            .from("orders")
            .insert({
              user_id: auth.user.id,
              total_quantity: total,
              customer_notes: notes,
              target_date: targetDate || null,
            })
            .select("id")
            .single();

          if (error || !order) {
            setPending(false);
            toast.error(error?.message ?? "Could not create the order.");
            return;
          }

          const rows = Object.entries(quantities)
            .filter(([, value]) => Number(value) > 0)
            .map(([key, value]) => {
              const [size = "", color = ""] = key.split("__");
              return {
                order_id: order.id,
                product_id: product.id,
                product_name: product.name,
                size,
                color,
                quantity: Number(value),
              };
            });

          const itemsResult = await supabase.from("order_items").insert(rows);
          setPending(false);
          if (itemsResult.error) {
            toast.error(itemsResult.error.message);
            return;
          }
          toast.success("Requirement submitted. We will respond with a quotation.");
          navigate({ to: "/orders/$id", params: { id: order.id } });
        }}
      >
        <div className="grid gap-2">
          <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Product
          </Label>
          <select
            className={selectClass}
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setQuantities({});
            }}
          >
            <option value="">Select a style</option>
            {(products ?? []).map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name} — MOQ {item.moq} pcs
              </option>
            ))}
          </select>
        </div>

        {product && (
          <div>
            <p className="text-eyebrow">Breakdown</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Indicative price {formatCurrency(product.base_price)} per piece · MOQ {product.moq} pcs
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border border-border text-sm">
                <thead>
                  <tr className="bg-surface">
                    <th className="p-3 text-left font-medium">Colour</th>
                    {product.sizes.map((size) => (
                      <th key={size} className="p-3 text-left font-medium">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.colors.map((color) => (
                    <tr key={color} className="border-t border-border">
                      <td className="p-3">{color}</td>
                      {product.sizes.map((size) => {
                        const key = `${size}__${color}`;
                        return (
                          <td key={key} className="p-2">
                            <Input
                              type="number"
                              min={0}
                              inputMode="numeric"
                              className="h-9 w-20"
                              value={quantities[key] ?? ""}
                              onChange={(event) =>
                                setQuantities((prev) => ({ ...prev, [key]: event.target.value }))
                              }
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm">
              Total: <span className="font-medium">{total.toLocaleString("en-IN")} pcs</span>
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Target delivery date
            </Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Notes for production
          </Label>
          <Textarea
            rows={4}
            placeholder="Fabric preference, print/embroidery details, labels, packing instructions…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Submitting…" : "Submit requirement"}
          </Button>
        </div>
      </form>
    </PortalShell>
  );
}
