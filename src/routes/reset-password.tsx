import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — SR Creation" },
      {
        name: "description",
        content: "Choose a new password for your SR Creation buyer portal account.",
      },
      { property: "og:title", content: "Set a New Password — SR Creation" },
      { property: "og:description", content: "Complete your password reset for the buyer portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  return (
    <PublicShell>
      <div className="mx-auto max-w-md px-6 py-24">
        <p className="text-eyebrow">Account security</p>
        <h1 className="mt-4 text-3xl font-semibold">Set a new password</h1>
        <form
          className="mt-10 grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            const { error } = await supabase.auth.updateUser({ password });
            setPending(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("Password updated.");
            navigate({ to: "/dashboard" });
          }}
        >
          <div className="grid gap-2">
            <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              New password
            </Label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          Open this page from the reset link in your email so the change applies to your account.
        </p>
      </div>
    </PublicShell>
  );
}
