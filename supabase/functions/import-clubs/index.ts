// Bulk upsert for public.clubs (federal club data).
// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin } from "../_shared/require-admin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Raw = Record<string, unknown>;

const DEPT_REGION: Record<string, string> = {};
const add = (region: string, depts: string[]) => depts.forEach((d) => (DEPT_REGION[d] = region));
add("Auvergne-Rhône-Alpes", ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"]);
add("Bourgogne-Franche-Comté", ["21", "25", "39", "58", "70", "71", "89", "90"]);
add("Bretagne", ["22", "29", "35", "56"]);
add("Centre-Val de Loire", ["18", "28", "36", "37", "41", "45"]);
add("Corse", ["2A", "2B", "20"]);
add("Grand Est", ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"]);
add("Hauts-de-France", ["02", "59", "60", "62", "80"]);
add("Île-de-France", ["75", "77", "78", "91", "92", "93", "94", "95"]);
add("Normandie", ["14", "27", "50", "61", "76"]);
add("Nouvelle-Aquitaine", ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"]);
add("Occitanie", ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"]);
add("Pays de la Loire", ["44", "49", "53", "72", "85"]);
add("Provence-Alpes-Côte d'Azur", ["04", "05", "06", "13", "83", "84"]);
add("Guadeloupe", ["971"]);
add("Martinique", ["972"]);
add("Guyane", ["973"]);
add("La Réunion", ["974"]);
add("Mayotte", ["976"]);

const str = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const num = (v: unknown): number | null => {
  const s = str(v);
  if (s === null) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

function parseArray(v: unknown): string[] | null {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  const s = str(v);
  if (s === null) return null;
  const inner = s.replace(/^\{/, "").replace(/\}$/, "").trim();
  if (!inner) return [];
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === "\\" && i + 1 < inner.length) { cur += inner[++i]; continue; }
    if (c === '"') { q = !q; continue; }
    if (c === "," && !q) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function deptFromPostal(cp: string | null): string | null {
  if (!cp) return null;
  const c = cp.replace(/\s/g, "");
  if (!/^\d{5}$/.test(c)) return null;
  if (c.startsWith("97") || c.startsWith("98")) return c.slice(0, 3);
  if (c.startsWith("20")) return Number(c) < 20200 ? "2A" : "2B";
  return c.slice(0, 2);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authError = await requireAdmin(req, corsHeaders);
    if (authError) return authError;

    const body = await req.json();
    const rows: Raw[] = Array.isArray(body?.rows) ? body.rows : [];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ received: 0, cleaned: 0, upserted: 0, errors: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (rows.length > 1000) {
      return new Response(JSON.stringify({ error: "Max 1000 rows per batch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();
    const seen = new Set<string>();
    const cleaned = [];
    for (const r of rows) {
      if (!r || typeof r !== "object") continue;
      const federation_code = str(r.federation_code);
      const external_id = str(r.external_id);
      const name = str(r.name);
      const discipline = str(r.discipline);
      if (!federation_code || !external_id || !name || !discipline) continue;
      const key = `${federation_code}::${external_id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const postal_code = str(r.postal_code);
      const department_code = str(r.department_code) ?? deptFromPostal(postal_code);
      const region = str(r.region) ?? (department_code ? DEPT_REGION[department_code.toUpperCase()] ?? null : null);

      cleaned.push({
        federation_code,
        external_id,
        name,
        discipline,
        sub_disciplines: parseArray(r.sub_disciplines),
        level: str(r.level),
        address: str(r.address),
        address_complement: str(r.address_complement),
        postal_code,
        city: str(r.city),
        department_code,
        region,
        latitude: num(r.latitude),
        longitude: num(r.longitude),
        phone: str(r.phone),
        email: str(r.email),
        website: str(r.website),
        description: str(r.description),
        creation_date: str(r.creation_date),
        source_url: str(r.source_url),
        scraped_at: str(r.scraped_at),
        updated_at: now,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const errors: string[] = [];
    let upserted = 0;
    if (cleaned.length > 0) {
      const { error, count } = await supabase
        .from("clubs")
        .upsert(cleaned, { onConflict: "federation_code,external_id", count: "exact" });
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
