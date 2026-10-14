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

// Treat 0, out-of-range and metropolitan-out-of-rectangle values as missing.
// Mainland France (+ Corsica): lat 41–51.5, lng -5.5–10. Overseas (97x/98x):
// full world ranges still apply, checked below after department derivation.
const num = (v: unknown, min?: number, max?: number): number | null => {
  const s = str(v);
  if (s === null) return null;
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  if (n === 0) return null;
  if (min !== undefined && n < min) return null;
  if (max !== undefined && n > max) return null;
  return n;
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

/** Supprime les espaces en trop et dédoublonne sans tenir compte de la casse (garde la 1re écriture). */
function cleanLabels(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = String(raw).replace(/\s+/g, " ").trim();
    if (!v) continue;
    const key = v.toLocaleLowerCase("fr");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function convert(v: unknown, dataType: string, udt: string): unknown {
  if (dataType === "ARRAY") {
    if (Array.isArray(v)) return parseArray(v);
    const s = str(v);
    if (s === null) return null;
    if (s.startsWith("{")) return parseArray(s);
    return s.split(";").map((x) => x.trim()).filter(Boolean);
  }
  const s = str(v);
  if (s === null) return null;
  if (["integer", "bigint", "smallint"].includes(dataType)) {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }
  if (["numeric", "double precision", "real"].includes(dataType)) {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  if (dataType === "boolean") {
    const b = s.toLowerCase();
    if (["true", "oui", "1", "t", "yes"].includes(b)) return true;
    if (["false", "non", "0", "f", "no"].includes(b)) return false;
    return null;
  }
  if (dataType === "date") {
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const iso = m ? `${m[3]}-${m[2]}-${m[1]}` : s.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(iso) && !isNaN(Date.parse(iso)) ? iso : null;
  }
  void udt;
  return s;
}

// Columns handled by the dedicated logic below (or managed server-side).
const RESERVED = new Set([
  "id", "created_at", "updated_at", "federation_code", "external_id", "name", "discipline",
  "postal_code", "department_code", "region", "latitude", "longitude", "position_checked_at",
]);

// Child tables fed from JSON columns "venues" / "schedules" of the CSV.
const VENUE_COLS: Record<string, string> = {
  name: "text", kind: "text", address: "text", address_complement: "text", postal_code: "text",
  city: "text", latitude: "double precision", longitude: "double precision", is_main: "boolean",
  accessibility: "ARRAY", amenities: "ARRAY",
};
const SCHEDULE_COLS: Record<string, string> = {
  venue_name: "text", day: "text", start_time: "time", end_time: "time", title: "text",
  category: "text", level: "text", discipline: "text", notes: "text",
};

function toHHMM(v: unknown): string | null {
  const s = str(v);
  if (s === null) return null;
  const m = s.match(/^(\d{1,2})\s*[:hH]\s*(\d{2})?/);
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2] ?? "0");
  if (h > 23 || mi > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}

// Returns undefined when the field is absent/empty (leave existing rows),
// null when JSON is invalid, or the cleaned list of rows.
function parseChildren(v: unknown, cols: Record<string, string>): Record<string, unknown>[] | null | undefined {
  let arr: unknown = v;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return undefined;
    try { arr = JSON.parse(s); } catch { return null; }
  } else if (v === null || v === undefined) return undefined;
  if (!Array.isArray(arr)) return null;
  const out: Record<string, unknown>[] = [];
  for (const o of arr) {
    if (!o || typeof o !== "object" || Array.isArray(o)) continue;
    const row: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(o as Record<string, unknown>)) {
      const t = cols[k];
      if (!t) continue;
      row[k] = t === "time" ? toHHMM(val) : convert(val, t, "");
    }
    out.push(row);
  }
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
      return new Response(JSON.stringify({ received: 0, cleaned: 0, upserted: 0, venues_inserted: 0, schedules_inserted: 0, json_errors: 0, errors: [], ignored_columns: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (rows.length > 1000) {
      return new Response(JSON.stringify({ error: "Max 1000 rows per batch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: colRows, error: colErr } = await supabase.rpc("get_clubs_columns");
    if (colErr) throw new Error(`Lecture des colonnes impossible: ${colErr.message}`);
    const columns = new Map<string, { data_type: string; udt_name: string }>();
    for (const c of (colRows ?? []) as Array<{ column_name: string; data_type: string; udt_name: string }>) {
      columns.set(c.column_name, c);
    }
    const ignored = new Set<string>();
    for (const r of rows) {
      if (r && typeof r === "object") for (const k of Object.keys(r)) if (!columns.has(k) && k !== "venues" && k !== "schedules") ignored.add(k);
    }

    const now = new Date().toISOString();
    const seen = new Set<string>();
    const cleaned = [];
    const children = new Map<string, { venues?: Record<string, unknown>[]; schedules?: Record<string, unknown>[] }>();
    let json_errors = 0;
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

      // Coordinates: world-range check first, then metropolitan rectangle.
      // If the club is not overseas (no department or not 97x/98x), coordinates
      // must fall inside mainland France + Corsica (lat 41–51.5, lng -5.5–10),
      // otherwise they are recorded as missing.
      let latitude = num(r.latitude, -90, 90);
      let longitude = num(r.longitude, -180, 180);
      const isOverseas =
        department_code !== null &&
        (department_code.startsWith("97") || department_code.startsWith("98"));
      if (!isOverseas && latitude !== null &&
          (latitude < 41 || latitude > 51.5)) latitude = null;
      if (!isOverseas && longitude !== null &&
          (longitude < -5.5 || longitude > 10)) longitude = null;

      const generic: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        const col = columns.get(k);
        if (!col || RESERVED.has(k)) continue;
        generic[k] = convert(v, col.data_type, col.udt_name);
        if ((k === "sub_disciplines" || k === "dance_families") && Array.isArray(generic[k])) {
          generic[k] = cleanLabels(generic[k] as string[]);
        }
      }

      const ch: { venues?: Record<string, unknown>[]; schedules?: Record<string, unknown>[] } = {};
      const v = parseChildren(r.venues, VENUE_COLS);
      if (v === null) json_errors++; else if (v !== undefined) ch.venues = v;
      const sc = parseChildren(r.schedules, SCHEDULE_COLS);
      if (sc === null) json_errors++; else if (sc !== undefined) ch.schedules = sc;
      if (ch.venues || ch.schedules) children.set(key, ch);

      cleaned.push({
        ...generic,
        federation_code,
        external_id,
        name,
        discipline,
        postal_code,
        department_code,
        region,
        latitude,
        longitude,
        updated_at: now,
      });
    }

    const errors: string[] = [];
    let upserted = 0;
    let venues_inserted = 0;
    let schedules_inserted = 0;
    if (cleaned.length > 0) {
      // Reset position_checked_at when coordinates change (or row is new);
      // keep the existing value otherwise.
      const existing = new Map<string, { id: string; latitude: number | null; longitude: number | null; position_checked_at: string | null }>();
      const extIds = [...new Set(cleaned.map((c) => c.external_id))];
      for (let i = 0; i < extIds.length; i += 200) {
        const { data } = await supabase
          .from("clubs")
          .select("id, federation_code, external_id, latitude, longitude, position_checked_at")
          .in("external_id", extIds.slice(i, i + 200));
        for (const e of data ?? []) existing.set(`${e.federation_code}::${e.external_id}`, e);
      }
      for (const c of cleaned as Array<Record<string, unknown>>) {
        const e = existing.get(`${c.federation_code}::${c.external_id}`);
        // Keep already-known coordinates when the CSV has none.
        if (e && c.latitude == null && c.longitude == null && e.latitude != null && e.longitude != null) {
          c.latitude = e.latitude;
          c.longitude = e.longitude;
        }
        const same = e && e.latitude === c.latitude && e.longitude === c.longitude;
        c.position_checked_at = same ? e!.position_checked_at : null;
      }

      // Field-level protection (club_field_status): locked fields keep the
      // club's validated value; the federation value is stored for review.
      type FieldStatus = { club_id: string; field: string; source: string; club_value: string | null; locked: boolean; conflict: boolean };
      const existingIds = [...existing.values()].map((e) => e.id);
      const statusByClub = new Map<string, FieldStatus[]>();
      for (let i = 0; i < existingIds.length; i += 200) {
        const { data, error: sErr } = await supabase
          .from("club_field_status")
          .select("club_id, field, source, club_value, locked, conflict")
          .in("club_id", existingIds.slice(i, i + 200));
        if (sErr) throw new Error(`Lecture club_field_status impossible: ${sErr.message}`);
        for (const s of (data ?? []) as FieldStatus[]) {
          const list = statusByClub.get(s.club_id) ?? [];
          list.push(s);
          statusByClub.set(s.club_id, list);
        }
      }
      const asText = (v: unknown): string | null =>
        v === null || v === undefined ? null : Array.isArray(v) ? JSON.stringify(v) : String(v);
      const statusUpdates: Array<{ club_id: string; field: string; source: string; federation_value: string | null; conflict: boolean }> = [];
      if (statusByClub.size > 0) {
        const lockedFields = new Set<string>();
        for (const list of statusByClub.values()) for (const s of list) if (s.locked && columns.has(s.field)) lockedFields.add(s.field);
        const current = new Map<string, Record<string, unknown>>();
        if (lockedFields.size > 0) {
          const lockedClubIds = [...statusByClub.entries()].filter(([, l]) => l.some((s) => s.locked)).map(([id]) => id);
          const sel = ["id", ...lockedFields].join(", ");
          for (let i = 0; i < lockedClubIds.length; i += 200) {
            const { data, error: cErr } = await supabase.from("clubs").select(sel).in("id", lockedClubIds.slice(i, i + 200));
            if (cErr) throw new Error(`Lecture des valeurs verrouillées impossible: ${cErr.message}`);
            for (const row of (data ?? []) as unknown as Record<string, unknown>[]) current.set(String(row.id), row);
          }
        }
        for (const c of cleaned as Array<Record<string, unknown>>) {
          const e = existing.get(`${c.federation_code}::${c.external_id}`);
          const list = e ? statusByClub.get(e.id) : undefined;
          if (!e || !list) continue;
          for (const s of list) {
            if (!(s.field in c) || s.field === "updated_at" || s.field === "position_checked_at") continue;
            const fedValue = asText(c[s.field]);
            if (s.locked) {
              const cur = current.get(e.id);
              c[s.field] = cur ? cur[s.field] ?? null : null;
              statusUpdates.push({ club_id: e.id, field: s.field, source: s.source, federation_value: fedValue, conflict: fedValue !== s.club_value });
            } else {
              statusUpdates.push({ club_id: e.id, field: s.field, source: s.source, federation_value: fedValue, conflict: s.conflict });
            }
          }
        }
      }

      const { data: upRows, error, count } = await supabase
        .from("clubs")
        .upsert(cleaned, { onConflict: "federation_code,external_id", count: "exact" })
        .select("id, federation_code, external_id");
      if (error) errors.push(error.message);
      else {
        upserted = count ?? cleaned.length;
        for (let i = 0; i < statusUpdates.length; i += 500) {
          const { error: fErr } = await supabase
            .from("club_field_status")
            .upsert(statusUpdates.slice(i, i + 500), { onConflict: "club_id,field" });
          if (fErr) errors.push(`club_field_status: ${fErr.message}`);
        }
        if (children.size > 0) {
          const idByKey = new Map<string, string>();
          for (const u of upRows ?? []) idByKey.set(`${u.federation_code}::${u.external_id}`, u.id);
          for (const [table, field] of [["club_venues", "venues"], ["club_schedules", "schedules"]] as const) {
            const ids: string[] = [];
            const inserts: Record<string, unknown>[] = [];
            for (const [k, ch] of children) {
              const list = ch[field];
              const id = idByKey.get(k);
              if (!list || !id) continue;
              ids.push(id);
              for (const row of list) inserts.push({ ...row, club_id: id });
            }
            if (ids.length === 0) continue;
            for (let i = 0; i < ids.length; i += 200) {
              const { error: dErr } = await supabase.from(table).delete().in("club_id", ids.slice(i, i + 200));
              if (dErr) errors.push(`${table}: ${dErr.message}`);
            }
            for (let i = 0; i < inserts.length; i += 500) {
              const { error: iErr } = await supabase.from(table).insert(inserts.slice(i, i + 500));
              if (iErr) errors.push(`${table}: ${iErr.message}`);
              else if (field === "venues") venues_inserted += inserts.slice(i, i + 500).length;
              else schedules_inserted += inserts.slice(i, i + 500).length;
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: rows.length, cleaned: cleaned.length, upserted, venues_inserted, schedules_inserted, json_errors, errors, ignored_columns: [...ignored].sort() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
