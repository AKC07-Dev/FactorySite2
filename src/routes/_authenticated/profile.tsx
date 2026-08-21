import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Company Profile — SR Creation" },
      {
        name: "description",
        content: "Keep your company, contact and shipping details up to date for production orders.",
      },
      { property: "og:title", content: "Company Profile — SR Creation" },
      { property: "og:description", content: "Manage your buyer account details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const EMPTY = {
  company_name: "",
  contact_person: "",
  phone: "",
  gst_number: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function ProfilePage() {
  const [form, setForm] = useState(EMPTY);
  const [pending, setPending] = useState(false);

  const { data } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      company_name: data.company_name ?? "",
      contact_person: data.contact_person ?? "",
      phone: data.phone ?? "",
      gst_number: data.gst_number ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      pincode: data.pincode ?? "",
    });
  }, [data]);

  const field = (key: keyof typeof EMPTY, label: string) => (
    <div className="grid gap-2">
      <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{label}</Label>
      <Input
        value={form[key]}
        onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
      />
    </div>
  );

  return (
    <PortalShell title="Company" description="Details used on quotations and dispatch documents.">
      <form
        className="max-w-2xl grid gap-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!data?.id) return;
          setPending(true);
          const { error } = await supabase.from("profiles").update(form).eq("id", data.id);
          setPending(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Company details saved.");
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {field("company_name", "Company name")}
          {field("contact_person", "Contact person")}
          {field("phone", "Phone")}
          {field("gst_number", "GST number")}
        </div>
        <div className="grid gap-2">
          <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Address
          </Label>
          <Textarea
            rows={3}
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {field("city", "City")}
          {field("state", "State")}
          {field("pincode", "Pincode")}
        </div>
        <div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Saving…" : "Save details"}
          </Button>
        </div>
        {data?.status && data.status !== "approved" && (
          <p className="text-xs text-muted-foreground">
            Account status: {data.status}. Our team reviews new buyer accounts before quoting.
          </p>
        )}
      </form>
    </PortalShell>
  );
}
