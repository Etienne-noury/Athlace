// Admin bulk upsert for clubs_enriched.
// Auth: shared token via x-admin-token header matching ADMIN_IMPORT_TOKEN secret.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Row = {
  federation_code: string;
  external_id?: string | null;
  name: string;
  discipline?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  source_url: string;
  raw?: Record<string, unknown> | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const adminToken = Deno.env.get("ADMIN_IMPORT_TOKEN");
    if (!adminToken) throw new Error("ADMIN_IMPORT_TOKEN not configured");
    const provided = req.headers.get("x-admin-token");
    if (provided !== adminToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const rows: Row[] = Array.isArray(body?.rows) ? body.rows : [];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ inserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (rows.length > 1000) {
      return new Response(JSON.stringify({ error: "Max 1000 rows per batch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic validation
    const cleaned = rows
      .filter((r) => r && typeof r.name === "string" && r.name.trim().length > 0)
      .map((r) => ({
        federation_code: r.federation_code || "RNA",
        external_id: r.external_id || null,
        name: String(r.name).slice(0, 500),
        discipline: r.discipline || null,
        address: r.address || null,
        postal_code: r.postal_code || null,
        city: r.city || null,
        region: r.region || null,
        latitude: typeof r.latitude === "number" ? r.latitude : null,
        longitude: typeof r.longitude === "number" ? r.longitude : null,
        phone: r.phone || null,
        email: r.email || null,
        website: r.website || null,
        source_url: r.source_url || "csv-upload",
        raw: r.raw ?? null,
      }));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Split: rows with external_id -> upsert on conflict; rows without -> plain insert
    const withExt = cleaned.filter((r) => r.external_id);
    const withoutExt = cleaned.filter((r) => !r.external_id);

    let upserted = 0;
    let inserted = 0;
    const errors: string[] = [];

    if (withExt.length > 0) {
      const { error, count } = await supabase
        .from("clubs_enriched")
        .upsert(withExt, { onConflict: "federation_code,external_id", count: "exact" });
      if (error) errors.push(`upsert: ${error.message}`);
      else upserted = count ?? withExt.length;
    }
    if (withoutExt.length > 0) {
      const { error, count } = await supabase
        .from("clubs_enriched")
        .insert(withoutExt, { count: "exact" });
      if (error) errors.push(`insert: ${error.message}`);
      else inserted = count ?? withoutExt.length;
    }

    return new Response(
      JSON.stringify({
        received: rows.length,
        cleaned: cleaned.length,
        upserted,
        inserted,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
