import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PRODUCTION_STAGES,
  PRODUCTION_STAGE_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — SR Creation" },
      {
        name: "description",
        content: "Manage orders, quotations, buyers, inventory and production stages for SR Creation.",
      },
      { property: "og:title", content: "Admin Console — SR Creation" },
      { property: "og:description", content: "Internal operations console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const selectClass =
  "h-9 border border-input bg-background px-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <PortalShell title="Admin">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </PortalShell>
    );
  }

  if (!isAdmin) {
    return (
      <PortalShell title="Admin">
        <p className="text-sm text-muted-foreground">
          You do not have admin access. Head back to your{" "}
          <Link to="/dashboard" className="text-primary hover:underline">
            dashboard
          </Link>
          .
        </p>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Admin console" description="Orders, buyers, inventory and production.">
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-8">
          <AdminOrders />
        </TabsContent>
        <TabsContent value="buyers" className="mt-8">
          <AdminBuyers />
        </TabsContent>
        <TabsContent value="inventory" className="mt-8">
          <AdminInventory />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-8">
          <AdminInquiries />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const [orders, jobs] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("production_jobs").select("*"),
      ]);
      if (orders.error) throw orders.error;
      if (jobs.error) throw jobs.error;
      return { orders: orders.data ?? [], jobs: jobs.data ?? [] };
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data?.orders.length) return <p className="text-sm text-muted-foreground">No orders yet.</p>;

  return (
    <div className="grid gap-6">
      {data.orders.map((order) => {
        const job = data.jobs.find((item) => item.order_id === order.id);
        return (
          <div key={order.id} className="border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link
                  to="/orders/$id"
                  params={{ id: order.id }}
                  className="font-medium hover:underline"
                >
                  {order.order_number}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(order.created_at)} · {order.total_quantity.toLocaleString("en-IN")} pcs
                  · {formatCurrency(order.quoted_price)}
                </p>
              </div>
              <select
                className={selectClass}
                value={order.status}
                onChange={async (event) => {
                  const { error } = await supabase
                    .from("orders")
                    .update({ status: event.target.value })
                    .eq("id", order.id);
                  if (error) { toast.error(error.message); return; }
                  toast.success("Status updated.");
                  queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
                }}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <QuoteForm
                orderId={order.id}
                initialPrice={order.quoted_price}
                onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
              />
              <div className="grid gap-1">
                <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Production stage
                </span>
                <select
                  className={selectClass}
                  value={job?.stage ?? ""}
                  onChange={async (event) => {
                    const stage = event.target.value;
                    const result = job
                      ? await supabase.from("production_jobs").update({ stage }).eq("id", job.id)
                      : await supabase
                          .from("production_jobs")
                          .insert({ order_id: order.id, stage });
                    if (result.error) { toast.error(result.error.message); return; }
                    toast.success("Production updated.");
                    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
                  }}
                >
                  <option value="">Not started</option>
                  {PRODUCTION_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {PRODUCTION_STAGE_LABELS[stage]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuoteForm({
  orderId,
  initialPrice,
  onSaved,
}: {
  orderId: string;
  initialPrice: number | null;
  onSaved: () => void;
}) {
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : "");

  return (
    <div className="grid gap-1">
      <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Quote (INR)</span>
      <div className="flex gap-2">
        <Input
          type="number"
          min={0}
          className="h-9 w-32"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const { error } = await supabase
              .from("orders")
              .update({ quoted_price: price === "" ? null : Number(price), status: "quoted" })
              .eq("id", orderId);
            if (error) { toast.error(error.message); return; }
            toast.success("Quotation sent.");
            onSaved();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function AdminBuyers() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="divide-y divide-border border border-border bg-card">
      {(data ?? []).map((profile) => (
        <div key={profile.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-medium">{profile.company_name || "Unnamed company"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.contact_person} · {profile.email} · {profile.phone || "no phone"}
            </p>
          </div>
          <select
            className={selectClass}
            value={profile.status}
            onChange={async (event) => {
              const { error } = await supabase
                .from("profiles")
                .update({ status: event.target.value })
                .eq("id", profile.id);
              if (error) { toast.error(error.message); return; }
              toast.success("Buyer updated.");
              queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
            }}
          >
            {["pending", "approved", "suspended"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function AdminInventory() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory_items").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="divide-y divide-border border border-border bg-card">
      {(data ?? []).map((item) => (
        <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.kind} · reorder at {item.reorder_level} {item.unit}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${item.quantity <= item.reorder_level ? "text-destructive" : "text-foreground"}`}
            >
              {item.quantity} {item.unit}
            </span>
            {[-50, 50].map((change) => (
              <Button
                key={change}
                size="sm"
                variant="outline"
                onClick={async () => {
                  const next = Math.max(0, item.quantity + change);
                  const { error } = await supabase
                    .from("inventory_items")
                    .update({ quantity: next })
                    .eq("id", item.id);
                  if (error) { toast.error(error.message); return; }
                  await supabase
                    .from("inventory_movements")
                    .insert({ item_id: item.id, change, reason: "manual adjustment" });
                  queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
                }}
              >
                {change > 0 ? `+${change}` : change}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminInquiries() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data?.length) return <p className="text-sm text-muted-foreground">No inquiries yet.</p>;

  return (
    <div className="divide-y divide-border border border-border bg-card">
      {data.map((inquiry) => (
        <div key={inquiry.id} className="p-5">
          <p className="font-medium">
            {inquiry.company_name} · {inquiry.contact_person}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {inquiry.email} · {inquiry.phone || "no phone"} · {formatDate(inquiry.created_at)}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {inquiry.product_interest && `${inquiry.product_interest} — `}
            {inquiry.estimated_quantity && `${inquiry.estimated_quantity} pcs. `}
            {inquiry.message}
          </p>
        </div>
      ))}
    </div>
  );
}
