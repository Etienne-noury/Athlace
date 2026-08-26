import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Verifies that the request carries a valid user session (Authorization header)
 * belonging to a user with the 'admin' role (public.user_roles / has_role()).
 * Returns a Response to short-circuit with (401/403) on failure, or null when authorized.
 */
export async function requireAdmin(req: Request, corsHeaders: Record<string, string>): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "Session invalide" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: isAdmin, error: roleError } = await userClient.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });

  if (roleError || !isAdmin) {
    return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return null;
}
