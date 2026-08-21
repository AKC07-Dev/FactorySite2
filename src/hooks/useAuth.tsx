import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setUser(current?.user ?? null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const roleQuery = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data.map((row) => row.role as string);
    },
  });

  return {
    session,
    user,
    loading: loading || (Boolean(user) && roleQuery.isLoading),
    roles: roleQuery.data ?? [],
    isAdmin: (roleQuery.data ?? []).includes("admin"),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}
