import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PortalShell } from "@/components/portal/PortalShell";
import { supabase } from "@/integrations/supabase/client";
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  PRODUCTION_STAGE_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order Details — SR Creation" },
      {
        name: "description",
        content: "Size and colour breakdown, quotation and production stage for your order.",
      },
      { property: "og:title", content: "Order Details — SR Creation" },
      { property: "og:description", content: "Full status detail for your SR Creation order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const [order, items, jobs] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", id).order("created_at"),
        supabase.from("production_jobs").select("*").eq("order_id", id).order("created_at"),
      ]);
      if (order.error) throw order.error;
      if (items.error) throw items.error;
      if (jobs.error) throw jobs.error;
      return { order: order.data, items: items.data ?? [], jobs: jobs.data ?? [] };
    },
  });

  if (isLoading) {
    return (
      <PortalShell title="Order">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </PortalShell>
    );
  }

  if (!data?.order) {
    return (
      <PortalShell title="Order not found">
        <p className="text-sm text-muted-foreground">This order does not exist or is not yours.</p>
      </PortalShell>
    );
  }

  const { order, items, jobs } = data;
  const currentIndex = ORDER_TIMELINE.indexOf(order.status as (typeof ORDER_TIMELINE)[number]);

  return (
    <PortalShell
      title={order.order_number}
      description={`Placed ${formatDate(order.created_at)} · ${order.total_quantity.toLocaleString("en-IN")} pcs`}
    >
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-lg font-medium">Breakdown</h2>
          <div className="mt-4 divide-y divide-border border border-border bg-card">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.size} · {item.color}
                  </p>
                </div>
                <p>{item.quantity.toLocaleString("en-IN")} pcs</p>
              </div>
            ))}
          </div>

          {order.customer_notes && (
            <>
              <h2 className="mt-10 text-lg font-medium">Your notes</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {order.customer_notes}
              </p>
            </>
          )}

          {order.admin_notes && (
            <>
              <h2 className="mt-10 text-lg font-medium">Notes from SR Creation</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {order.admin_notes}
              </p>
            </>
          )}

          {jobs.length > 0 && (
            <>
              <h2 className="mt-10 text-lg font-medium">Production</h2>
              <div className="mt-4 divide-y divide-border border border-border bg-card">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 text-sm">
                    <p className="font-medium">
                      {PRODUCTION_STAGE_LABELS[job.stage] ?? job.stage}
                      {job.line && ` · ${job.line}`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Target {formatDate(job.target_date)}
                      {job.progress_notes && ` — ${job.progress_notes}`}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside>
          <div className="border border-border bg-card p-6">
            <p className="text-eyebrow">Quotation</p>
            <p className="mt-3 font-display text-3xl font-semibold text-primary">
              {formatCurrency(order.quoted_price)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Target delivery {formatDate(order.target_date)}
            </p>
          </div>

          <h2 className="mt-10 text-lg font-medium">Status</h2>
          <ol className="mt-4 space-y-3">
            {ORDER_TIMELINE.map((status, index) => {
              const done = currentIndex >= index && currentIndex !== -1;
              return (
                <li key={status} className="flex items-center gap-3 text-sm">
                  <span
                    className={`size-2 rounded-full ${done ? "bg-primary" : "bg-border"}`}
                    aria-hidden
                  />
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                </li>
              );
            })}
          </ol>
          {order.status === "cancelled" && (
            <p className="mt-4 text-sm text-destructive">This order was cancelled.</p>
          )}
        </aside>
      </div>
    </PortalShell>
  );
}
