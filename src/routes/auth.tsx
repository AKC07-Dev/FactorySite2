import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup", "reset"]).default("signin").catch("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buyer Portal Sign In — SR Creation" },
      {
        name: "description",
        content:
          "Sign in to the SR Creation buyer portal to place bulk orders, view quotations and track production status.",
      },
      { property: "og:title", content: "Buyer Portal Sign In — SR Creation" },
      {
        property: "og:description",
        content: "Access your company account for bulk ordering and order tracking.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { company_name: companyName, contact_person: contactPerson, phone },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setAwaitingConfirm(true);
          toast.success("Account created. Confirm your email to activate portal access.");
        } else {
          navigate({ to: "/dashboard" });
        }
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <PublicShell>
      <div className="mx-auto flex max-w-md flex-col px-6 py-20">
        <p className="text-eyebrow">Buyer portal</p>
        <h1 className="mt-4 text-3xl font-semibold">
          {mode === "signup"
            ? "Register your company"
            : mode === "reset"
              ? "Reset your password"
              : "Sign in"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Portal access lets you build bulk orders, receive quotations and track production."
            : mode === "reset"
              ? "We'll email you a link to set a new password."
              : "Access your orders, quotations and production status."}
        </p>

        {awaitingConfirm ? (
          <div className="mt-10 border border-border bg-card p-6">
            <h2 className="text-lg font-medium">Check your email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a confirmation link to {email}. Once confirmed, sign in to open your portal.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/auth" search={{ mode: "signin" }} onClick={() => setAwaitingConfirm(false)}>
                Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <form className="mt-10 grid gap-5" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <>
                  <FormField label="Company name">
                    <Input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Contact person">
                    <Input
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Phone">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </FormField>
                </>
              )}

              <FormField label="Work email">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField>

              {mode !== "reset" && (
                <FormField label="Password">
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormField>
              )}

              <Button type="submit" size="lg" disabled={pending}>
                {pending
                  ? "Please wait…"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "reset"
                      ? "Send reset link"
                      : "Sign in"}
              </Button>
            </form>

            {mode !== "reset" && (
              <>
                <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button variant="outline" size="lg" onClick={handleGoogle}>
                  Continue with Google
                </Button>
              </>
            )}

            <div className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground">
              {mode === "signin" && (
                <>
                  <Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">
                    Need an account? Register your company
                  </Link>
                  <Link to="/auth" search={{ mode: "reset" }} className="hover:text-foreground">
                    Forgot your password?
                  </Link>
                </>
              )}
              {mode !== "signin" && (
                <Link to="/auth" search={{ mode: "signin" }} className="hover:text-foreground">
                  Back to sign in
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </PublicShell>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{label}</Label>
      {children}
    </div>
  );
}
