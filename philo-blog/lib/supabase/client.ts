"use client";

import { createClient } from "@supabase/supabase-js";

let browserClient:
  | ReturnType<typeof createClient>
  | null
  | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url === "placeholder" ||
    anonKey === "placeholder"
  ) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}
