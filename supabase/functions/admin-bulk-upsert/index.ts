// Admin bulk upsert for clubs_enriched.
// Accepts { clubs: Row[] } and upserts on (federation_code, external_id).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Row = {
  federation_code?: string;
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
  source_url?: string;
  raw?: Record<string, unknown> | null;
};

// Chunk size for DB upserts to avoid statement/timeout limits.
const DB_CHUNK = 100;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const clubs: Row[] = Array.isArray(body?.clubs)
      ? body.clubs
      : Array.isArray(body?.rows)
        ? body.rows
        : [];

    if (clubs.length === 0) {
      return new Response(
        JSON.stringify({ received: 0, upserted: 0, errors: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (clubs.length > 2000) {
      return new Response(JSON.stringify({ error: "Max 2000 rows per request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleaned = clubs
      .filter((r) => r && typeof r.name === "string" && r.name.trim().length > 0)
      .map((r) => ({
        federation_code: r.federation_code || "RNA",
        external_id: r.external_id || null,
        name: String(r.name).slice(0, 500),
        discipline: r.discipline ?? null,
        address: r.address ?? null,
        postal_code: r.postal_code ?? null,
        city: r.city ?? null,
        region: r.region ?? null,
        latitude: typeof r.latitude === "number" ? r.latitude : null,
        longitude: typeof r.longitude === "number" ? r.longitude : null,
        phone: r.phone ?? null,
        email: r.email ?? null,
        website: r.website ?? null,
        source_url: r.source_url || "csv-upload",
        raw: r.raw ?? null,
      }));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let upserted = 0;
    const errors: string[] = [];

    // Only rows with external_id can be upserted on conflict; the rest are inserted.
    const withExt = cleaned.filter((r) => r.external_id);
    const withoutExt = cleaned.filter((r) => !r.external_id);

    for (let i = 0; i < withExt.length; i += DB_CHUNK) {
      const chunk = withExt.slice(i, i + DB_CHUNK);
      const { error, count } = await supabase
        .from("clubs_enriched")
        .upsert(chunk, {
          onConflict: "federation_code,external_id",
          count: "exact",
        });
      if (error) errors.push(`upsert[${i}]: ${error.message}`);
      else upserted += count ?? chunk.length;
    }

    for (let i = 0; i < withoutExt.length; i += DB_CHUNK) {
      const chunk = withoutExt.slice(i, i + DB_CHUNK);
      const { error, count } = await supabase
        .from("clubs_enriched")
        .insert(chunk, { count: "exact" });
      if (error) errors.push(`insert[${i}]: ${error.message}`);
      else upserted += count ?? chunk.length;
    }

    return new Response(
      JSON.stringify({
        received: clubs.length,
        cleaned: cleaned.length,
        upserted,
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
