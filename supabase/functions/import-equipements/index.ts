// Bulk upsert for equipements_sportifs (DATA ES).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Row = {
  external_id?: string | null;
  nom_installation?: string | null;
  adresse?: string | null;
  postal_code?: string | null;
  city?: string | null;
  departement?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type_equipement?: string | null;
  famille_equipement?: string | null;
  activites?: string | null;
  website?: string | null;
  acces_libre?: boolean | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const rows: Row[] = Array.isArray(body?.rows) ? body.rows : [];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ upserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (rows.length > 1000) {
      return new Response(JSON.stringify({ error: "Max 1000 rows per batch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const seen = new Set<string>();
    const cleaned = rows
      .filter((r) => r && typeof r.external_id === "string" && r.external_id.trim().length > 0)
      .map((r) => ({
        external_id: String(r.external_id).trim(),
        nom_installation: r.nom_installation || null,
        adresse: r.adresse || null,
        postal_code: r.postal_code || null,
        city: r.city || null,
        departement: r.departement || null,
        region: r.region || null,
        latitude: typeof r.latitude === "number" && !isNaN(r.latitude) ? r.latitude : null,
        longitude: typeof r.longitude === "number" && !isNaN(r.longitude) ? r.longitude : null,
        type_equipement: r.type_equipement || null,
        famille_equipement: r.famille_equipement || null,
        activites: r.activites || null,
        website: r.website || null,
        acces_libre: typeof r.acces_libre === "boolean" ? r.acces_libre : null,
      }))
      .filter((r) => {
        if (seen.has(r.external_id)) return false;
        seen.add(r.external_id);
        return true;
      });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const errors: string[] = [];
    let upserted = 0;

    if (cleaned.length > 0) {
      const { error, count } = await supabase
        .from("equipements_sportifs")
        .upsert(cleaned, { onConflict: "external_id", count: "exact" });
      if (error) errors.push(error.message);
      else upserted = count ?? cleaned.length;
    }

    return new Response(
      JSON.stringify({ received: rows.length, cleaned: cleaned.length, upserted, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
