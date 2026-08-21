import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUS_LABELS, formatCurrency, formatDate, statusTone } from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Buyer Dashboard — SR Creation" },
      {
        name: "description",
        content: "Track your bulk apparel orders, quotations and production status with SR Creation.",
      },
      { property: "og:title", content: "Buyer Dashboard — SR Creation" },
      { property: "og:description", content: "Your live order and production overview." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total_quantity, quoted_price, target_date, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const orders = data ?? [];
  const open = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const pieces = orders.reduce((sum, o) => sum + o.total_quantity, 0);

  return (
    <PortalShell
      title="Dashboard"
      description="Your requirements, quotations and live production status."
      actions={
        <Button asChild>
          <Link to="/order/new">New bulk order</Link>
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Total orders", value: String(orders.length) },
          { label: "Open orders", value: String(open.length) },
          { label: "Pieces ordered", value: pieces.toLocaleString("en-IN") },
        ].map((stat) => (
          <div key={stat.label} className="border border-border bg-card p-6">
            <p className="font-display text-3xl font-semibold text-primary">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-lg font-medium">Recent orders</h2>
      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No orders yet. Submit your first bulk requirement to get a costed quotation.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border border border-border bg-card">
          {orders.slice(0, 6).map((order) => (
            <Link
              key={order.id}
              to="/orders/$id"
              params={{ id: order.id }}
              className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-surface"
            >
              <div>
                <p className="font-medium">{order.order_number}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(order.created_at)} · {order.total_quantity.toLocaleString("en-IN")} pcs
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${statusTone(order.status)}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(order.quoted_price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
