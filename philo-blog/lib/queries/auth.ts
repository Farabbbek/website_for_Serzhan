import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[getCurrentUser] Supabase error:", error.message);
    return null;
  }

  return data.user;
}

export async function getCurrentProfile(): Promise<Tables<"profiles"> | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[getCurrentProfile] Supabase error:", error.message);
    return null;
  }

  return data;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}
