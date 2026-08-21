export const ORDER_STATUSES = [
  "requested",
  "quoted",
  "confirmed",
  "in_production",
  "qc",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_production: "In production",
  qc: "Quality check",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_TIMELINE: OrderStatus[] = [
  "requested",
  "quoted",
  "confirmed",
  "in_production",
  "qc",
  "shipped",
  "delivered",
];

export const PRODUCTION_STAGES = [
  "cutting",
  "stitching",
  "printing",
  "finishing",
  "packing",
  "dispatched",
] as const;

export const PRODUCTION_STAGE_LABELS: Record<string, string> = {
  cutting: "Cutting",
  stitching: "Stitching",
  printing: "Printing / embroidery",
  finishing: "Finishing",
  packing: "Packing",
  dispatched: "Dispatched",
};

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function statusTone(status: string) {
  switch (status) {
    case "delivered":
      return "text-success";
    case "cancelled":
      return "text-destructive";
    case "requested":
      return "text-muted-foreground";
    default:
      return "text-primary";
  }
}
