-- Optional: add role into JWT claims to avoid middleware DB fallback
-- Configure in Supabase Dashboard -> Auth -> Hooks

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;
  claims := event->'claims';
  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  END IF;
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;
