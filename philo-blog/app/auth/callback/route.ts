import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  let redirectPath = next.startsWith("/") ? next : "/";

  if (code) {
    const supabase = await getSupabaseServerClient();

    if (supabase) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name,user_type")
            .eq("id", user.id)
            .maybeSingle();

          const needsProfileSetup = !profile?.full_name || !profile?.user_type;
          redirectPath = needsProfileSetup ? "/profile?welcome=1" : "/";
        }
      }
    }
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
