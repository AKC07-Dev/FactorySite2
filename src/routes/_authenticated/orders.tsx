import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUS_LABELS, formatCurrency, formatDate, statusTone } from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — SR Creation" },
      {
        name: "description",
        content: "Review every bulk order you have placed with SR Creation and its current status.",
      },
      { property: "og:title", content: "My Orders — SR Creation" },
      { property: "og:description", content: "All your SR Creation production orders in one list." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
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

  return (
    <PortalShell
      title="My orders"
      description="Every requirement you have submitted, with quotation and status."
      actions={
        <Button asChild>
          <Link to="/order/new">New bulk order</Link>
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {(data ?? []).map((order) => (
            <Link
              key={order.id}
              to="/orders/$id"
              params={{ id: order.id }}
              className="grid gap-2 p-5 transition-colors hover:bg-surface sm:grid-cols-4 sm:items-center"
            >
              <p className="font-medium">{order.order_number}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.created_at)} · target {formatDate(order.target_date)}
              </p>
              <p className="text-sm">{order.total_quantity.toLocaleString("en-IN")} pcs</p>
              <div className="sm:text-right">
                <span className={`text-sm ${statusTone(order.status)}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
                <p className="text-xs text-muted-foreground">{formatCurrency(order.quoted_price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
