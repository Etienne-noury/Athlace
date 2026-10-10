import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { resolveWaldec, WALDEC_NON_CLUB_CODES } from "@/lib/waldec-map";

const SOURCE_URL =
  "https://www.data.gouv.fr/fr/datasets/repertoire-national-des-associations/";
const NOT_DISSOLVED = "0001-01-01";
const NA = { sigle: "N/A", discipline: "N/A" };

/** Code WALDEC "011XXX" à partir d'objet_social1/2, ou null si association non sportive. */
function extractWaldecSport(row: Record<string, string>): string | null {
  for (const code of [row.objet_social1, row.objet_social2]) {
    const trimmed = (code || "").trim();
    if (trimmed.startsWith("011") && trimmed.length >= 6) return trimmed.slice(0, 6);
  }
  return null;
}

function isSport(row: Record<string, string>): boolean {
  // Association active et non dissoute uniquement
  if (row.position !== "A" || row.date_disso !== NOT_DISSOLVED) return false;
  const waldecCode = extractWaldecSport(row);
  if (!waldecCode || WALDEC_NON_CLUB_CODES.has(waldecCode)) return false;
  return true;
}

const mapRow = (row: Record<string, string>) => {
  const address = [
    row.adrs_numvoie,
    row.adrs_typevoie,
    row.adrs_libvoie,
  ].filter((p) => p && p.trim()).join(' ').trim();

  const waldecCode = extractWaldecSport(row) || '';
  const resolved = resolveWaldec(waldecCode, row.titre || '', row.objet || '') ?? NA;

  return {
    federation_code: resolved.sigle,
    external_id: row.id || null,
    name: row.titre || 'Sans nom',
    description: row.objet || null,
    discipline: resolved.discipline,
    address: address || null,
    complement: row.adrs_complement || null,
    distrib: row.adrs_distrib || null,
    postal_code: row.adrs_codepostal || null,
    city: row.adrs_libcommune || null,
    region: null,
    latitude: null,
    longitude: null,
    phone: null,
    email: null,
    website: row.siteweb || null,
    date_creation: row['date_creat'] || row['date_creat '] || row[' date_creat'] || null,
    source_url: SOURCE_URL,
  };
};

const BATCH_SIZE = 200;

const parseFile = (file: File): Promise<Record<string, string>[]> =>
  new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: reject,
    });
  });

const parseTabFile = (file: File): Promise<Record<string, string>[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      console.log('Premières colonnes:', content.split('\n')[0].split('\t').slice(0, 5));
      console.log('Nombre de lignes brutes:', content.split('\n').length);
      Papa.parse<Record<string, string>>(content, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (result) => {
          console.log('Lignes parsées:', result.data.length);
          console.log('Colonnes détectées:', result.meta.fields?.slice(0, 5));
          resolve(result.data);
        },
        error: reject,
      });
    };
    reader.readAsText(file, 'UTF-8');
  });

const normalizeKey = (k: string) =>
  k
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const pick = (row: Record<string, string>, label: string): string => {
  const target = normalizeKey(label);
  for (const [k, v] of Object.entries(row)) {
    if (normalizeKey(k) === target) return (v ?? "").trim();
  }
  return "";
};

const toNum = (v: string): number | null => {
  if (!v) return null;
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) ? null : n;
};

const mapEquipementRow = (row: Record<string, string>) => ({
  external_id: pick(row, "Numéro de l'équipement sportif") || null,
  nom_installation: pick(row, "Nom de l'installation sportive") || null,
  adresse: pick(row, "Adresse") || null,
  postal_code: pick(row, "Code Postal") || null,
  city: pick(row, "Commune nom") || null,
  departement: pick(row, "Département Nom") || null,
  region: pick(row, "Région Nom") || null,
  latitude: toNum(pick(row, "Latitude")),
  longitude: toNum(pick(row, "Longitude")),
  type_equipement: pick(row, "Type d'équipement sportif") || null,
  famille_equipement: pick(row, "Famille d'équipement sportif") || null,
  activites: pick(row, "Activités") || null,
  website: pick(row, "Adresse internet de l'équipement") || null,
  acces_libre: pick(row, "Equipement d'accès libre").toLowerCase() === "true",
});


export default function Admin() {
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<{
    imported: number;
    errors: number;
    filtered: number;
    lastError: string;
  } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<string>("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestResult, setSuggestResult] = useState<string>("");
  const [enriching, setEnriching] = useState(false);
  const [enrichResult, setEnrichResult] = useState<string>("");

  const [esFiles, setEsFiles] = useState<File[]>([]);
  const [esRunning, setEsRunning] = useState(false);
  const [esProgress, setEsProgress] = useState(0);
  const [esStatus, setEsStatus] = useState("");
  const [esResult, setEsResult] = useState<{ upserted: number; errors: number; lastError: string } | null>(null);

  const [clFiles, setClFiles] = useState<File[]>([]);
  const [clRunning, setClRunning] = useState(false);
  const [clProgress, setClProgress] = useState(0);
  const [clStatus, setClStatus] = useState("");
  const [clResult, setClResult] = useState<{ upserted: number; errors: number; lastError: string } | null>(null);

  const queryClient = useQueryClient();

  // Compteurs en direct, lus depuis la vue publique des clubs (miroir de la table clubs).
  const { data: stats } = useQuery({
    queryKey: ["admin-clubs-stats"],
    queryFn: async () => {
      const { count: total } = await supabase
        .from("clubs_public")
        .select("id", { count: "exact", head: true });
      const { count: withoutCoords } = await supabase
        .from("clubs_public")
        .select("id", { count: "exact", head: true })
        .is("latitude", null);

      const codes = new Set<string>();
      let from = 0;
      for (;;) {
        const { data, error } = await supabase
          .from("clubs_public")
          .select("federation_code")
          .range(from, from + 999);
        if (error || !data || data.length === 0) break;
        data.forEach((r) => {
          if (r.federation_code) codes.add(r.federation_code);
        });
        if (data.length < 1000) break;
        from += 1000;
      }
      return { total: total ?? 0, withoutCoords: withoutCoords ?? 0, federations: codes.size };
    },
  });

  const refreshStats = () => queryClient.invalidateQueries({ queryKey: ["admin-clubs-stats"] });


  const runEnrichFromEs = async () => {
    setEnriching(true);
    let gps = 0;
    let disc = 0;
    let equip = 0;

    for (let i = 0; i < 200; i++) {
      const { data, error } = await supabase.functions.invoke("enrich-from-es", {
        body: { batchSize: 500 },
      });
      if (error || !data || data.error) {
        setEnrichResult(`Erreur: ${error?.message || data?.error || "inconnue"}`);
        break;
      }

      gps += data.gps || 0;
      disc += data.disciplines || 0;
      equip += data.equipements || 0;
      setEnrichResult(`GPS : ${gps} — Disciplines : ${disc} — Équipements : ${equip}`);

      if (!data.updated) {
        setEnrichResult(`Terminé — GPS : ${gps}, Disciplines : ${disc}, Équipements : ${equip}`);
        break;
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    setEnriching(false);
  };

  const runSuggestFederation = async () => {

    setSuggesting(true);
    let totalUpdated = 0;
    let totalSkipped = 0;
    let offset = 0;

    while (true) {
      const { data, error } = await supabase.functions.invoke("suggest-federation", {
        body: { offset },
      });
      if (error || !data || data.error) {
        setSuggestResult(`Erreur: ${error?.message || data?.error || "inconnue"}`);
        break;
      }

      totalUpdated += data.updated || 0;
      totalSkipped += data.skipped || 0;
      setSuggestResult(`Assignés : ${totalUpdated} — Ignorés : ${totalSkipped}`);

      if (!data.processed) break;
      // Les clubs mis à jour sortent du filtre; on décale de ce qui reste ignoré.
      offset += data.skipped || 0;
      if ((data.updated || 0) === 0 && (data.skipped || 0) === 0) break;
      await new Promise((r) => setTimeout(r, 300));
    }

    setSuggesting(false);
    setSuggestResult((prev) => `Terminé — ${totalUpdated} assignés, ${totalSkipped} ignorés${prev.startsWith("Erreur") ? ` (${prev})` : ""}`);
  };


  const runEquipementsImport = async () => {
    if (!esFiles.length) return;
    setEsRunning(true);
    setEsProgress(0);
    setEsResult(null);

    let upserted = 0;
    let errors = 0;
    let lastError = "";

    try {
      for (let fi = 0; fi < esFiles.length; fi++) {
        const file = esFiles[fi];
        setEsStatus(`Lecture de ${file.name}…`);
        const rows = await parseTabFile(file);
        const mapped = rows.map(mapEquipementRow).filter((r) => r.external_id);

        for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
          const batch = mapped.slice(i, i + BATCH_SIZE);
          setEsStatus(
            `${file.name} — batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
              mapped.length / BATCH_SIZE
            )}`
          );
          const { data, error } = await supabase.functions.invoke("import-equipements", {
            body: { rows: batch },
          });
          if (error || data?.error || data?.errors?.length) {
            lastError = error?.message || data?.error || data?.errors?.join("; ");
            errors += batch.length;
          } else {
            upserted += data?.upserted || batch.length;
          }
          const fileProgress = (i + batch.length) / Math.max(mapped.length, 1);
          setEsProgress(((fi + fileProgress) / esFiles.length) * 100);
        }
        setEsProgress(((fi + 1) / esFiles.length) * 100);
      }
      setEsStatus("Terminé");
    } catch (e) {
      setEsStatus(`Erreur: ${(e as Error).message}`);
    } finally {
      setEsResult({ upserted, errors, lastError });
      setEsRunning(false);
    }
  };

  const runClubsImport = async () => {
    if (!clFiles.length) return;
    setClRunning(true);
    setClProgress(0);
    setClResult(null);
    let upserted = 0;
    let errors = 0;
    let lastError = "";
    try {
      for (let fi = 0; fi < clFiles.length; fi++) {
        const file = clFiles[fi];
        setClStatus(`Lecture de ${file.name}…`);
        const rows = await new Promise<Record<string, string>[]>((resolve, reject) => {
          Papa.parse<Record<string, string>>(file, {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
            complete: (r) => resolve(r.data),
            error: (err) => reject(err),
          });
        });
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const batch = rows.slice(i, i + BATCH_SIZE);
          setClStatus(`${file.name} — lot ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}`);
          const { data, error } = await supabase.functions.invoke("import-clubs", { body: { rows: batch } });
          if (error || data?.error || data?.errors?.length) {
            lastError = error?.message || data?.error || data?.errors?.join("; ");
            errors += batch.length;
          } else {
            upserted += data?.upserted ?? 0;
          }
          setClProgress(((fi + (i + batch.length) / Math.max(rows.length, 1)) / clFiles.length) * 100);
        }
        setClProgress(((fi + 1) / clFiles.length) * 100);
      }
      setClStatus("Terminé");
    } catch (e) {
      setClStatus(`Erreur: ${(e as Error).message}`);
    } finally {
      setClResult({ upserted, errors, lastError });
      setClRunning(false);
      refreshStats();
    }
  };

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ checked: number; reset: number; error: string } | null>(null);

  const runCheckPositions = async () => {
    setChecking(true);
    let checked = 0;
    let reset = 0;
    let errMsg = "";
    setCheckResult({ checked, reset, error: "" });
    while (true) {
      const { data, error } = await supabase.functions.invoke("check-club-positions");
      if (error || !data || data.error) {
        errMsg = error?.message ?? data?.error ?? "Réponse vide";
        break;
      }
      checked += data.checked || 0;
      reset += data.reset || 0;
      setCheckResult({ checked, reset, error: "" });
      if ((data.remaining || 0) === 0 || (data.checked || 0) === 0) break;
    }
    setCheckResult({ checked, reset, error: errMsg });
    setChecking(false);
    refreshStats();
  };


  const runGeocode = async () => {
    setGeocoding(true);
    let totalGeocoded = 0;
    let totalFailed = 0;

    while (true) {
      const { data, error } = await supabase.functions.invoke('geocode-clubs');
      if (error || !data) break;

      totalGeocoded += data.geocoded || 0;
      totalFailed += data.failed || 0;
      setGeocodeResult(`Géocodés : ${totalGeocoded} — Échecs : ${totalFailed}`);

      if ((data.geocoded || 0) === 0 && (data.failed || 0) === 0) break;

      await new Promise((r) => setTimeout(r, 1000));
    }

    setGeocoding(false);
    setGeocodeResult(`Terminé — ${totalGeocoded} géocodés, ${totalFailed} échecs`);
    refreshStats();
  };

  const runImport = async () => {
    if (!files.length) return;
    setRunning(true);
    setProgress(0);
    setResult(null);

    let imported = 0;
    let errors = 0;
    let filtered = 0;
    let lastError = '';

    try {
      for (let fi = 0; fi < files.length; fi++) {
        const file = files[fi];
        setStatus(`Lecture de ${file.name}…`);
        const rows = await parseFile(file);
        const matched = rows.filter(isSport);
        filtered += matched.length;
        const mapped = matched.map(mapRow).filter((r) => r.external_id);

        for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
          const batch = mapped.slice(i, i + BATCH_SIZE);
          setStatus(
            `${file.name} — batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
              mapped.length / BATCH_SIZE
            )}`
          );
          const { data, error } = await supabase.functions.invoke('admin-bulk-upsert', {
            body: { rows: batch }
          });
          if (error || data?.error) {
            lastError = error?.message || data?.error;
            console.error('Erreur upsert:', lastError);
            setStatus(`Erreur: ${lastError}`);
            errors += batch.length;
          } else {
            imported += data?.inserted || batch.length;
          }
          const fileProgress = (i + batch.length) / Math.max(mapped.length, 1);
          setProgress(((fi + fileProgress) / files.length) * 100);
        }

        setProgress(((fi + 1) / files.length) * 100);
      }
      setStatus("Terminé");
    } catch (e) {
      console.error(e);
      setStatus(`Erreur: ${(e as Error).message}`);
    } finally {
      setResult({ imported, errors, filtered, lastError });
      setRunning(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 space-y-10">
      <header className="space-y-6">
        <h1 className="font-display text-3xl font-extrabold text-ink">Administration Athlace</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-tint-100 p-4">
            <p className="font-display text-3xl font-extrabold text-blue-500">
              {stats ? stats.total.toLocaleString("fr-FR") : "—"}
            </p>
            <p className="text-small text-slate-600">Clubs référencés</p>
          </div>
          <div className="rounded-2xl bg-tint-100 p-4">
            <p className="font-display text-3xl font-extrabold text-blue-500">
              {stats ? stats.withoutCoords.toLocaleString("fr-FR") : "—"}
            </p>
            <p className="text-small text-slate-600">Sans coordonnées GPS</p>
          </div>
          <div className="rounded-2xl bg-tint-100 p-4">
            <p className="font-display text-3xl font-extrabold text-blue-500">
              {stats ? stats.federations.toLocaleString("fr-FR") : "—"}
            </p>
            <p className="text-small text-slate-600">Fédérations représentées</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-ink">Clubs fédéraux</h2>
          <p className="text-body text-slate-600">
            Importez les clubs depuis les CSV fédéraux, puis géocodez ceux qui n'ont pas de
            coordonnées. Ces clubs sont ceux affichés sur le site.
          </p>
        </div>

        <Card className="space-y-4 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink">Importer un CSV de clubs</h3>
          <p className="text-small text-slate-500">
            Fichier(s) CSV séparé(s) par des virgules, avec en-têtes identiques aux colonnes de la
            table clubs.
          </p>
          <Input
            type="file"
            accept=".csv,text/csv"
            multiple
            disabled={clRunning}
            onChange={(e) => setClFiles(Array.from(e.target.files || []))}
          />
          {clFiles.length > 0 && (
            <p className="text-small text-slate-500">{clFiles.length} fichier(s) sélectionné(s)</p>
          )}
          <Button onClick={runClubsImport} disabled={clRunning || !clFiles.length}>
            {clRunning ? "Import en cours…" : "Lancer l'import clubs"}
          </Button>
          {(clRunning || clProgress > 0) && (
            <div className="space-y-2">
              <Progress value={clProgress} />
              <p className="text-small text-slate-500">{clStatus}</p>
            </div>
          )}
          {clResult && (
            <div className="space-y-1 rounded-md border p-4 text-small">
              <p><strong>Enregistrés :</strong> {clResult.upserted}</p>
              <p><strong>Erreurs :</strong> {clResult.errors}</p>
              {clResult.lastError && (
                <p className="text-destructive"><strong>Dernière erreur :</strong> {clResult.lastError}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="space-y-4 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            Vérifier les positions des clubs
          </h3>
          <p className="text-small text-slate-500">
            Compare la position de chaque club au centre de sa commune (seuil 30 km, 120 km en
            Guyane). Les positions trop éloignées sont remises à zéro pour être re-géocodées.
          </p>
          <Button onClick={runCheckPositions} disabled={checking}>
            {checking ? "Vérification…" : "Vérifier les positions"}
          </Button>
          {(checking || checkResult) && (
            <p className="text-small">
              Vérifiés : {checkResult?.checked ?? 0} — Positions remises à zéro : {checkResult?.reset ?? 0}
            </p>
          )}
          {checkResult?.error && (
            <p className="text-small text-destructive">Erreur : {checkResult.error}</p>
          )}
        </Card>


        <Card className="space-y-4 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            Géocoder les clubs sans coordonnées
          </h3>
          <p className="text-small text-slate-500">
            Géocode jusqu'à 50 clubs de la table clubs sans coordonnées via l'API
            adresse.data.gouv.fr (adresse complète, puis centre de la commune en secours).
          </p>
          <Button onClick={runGeocode} disabled={geocoding}>
            {geocoding ? "Géocodage…" : "Géocoder TOUS les clubs"}
          </Button>
          {geocodeResult && <p className="text-small">{geocodeResult}</p>}
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-ink">Équipements sportifs</h2>
          <p className="text-body text-slate-600">
            Importez le référentiel des équipements sportifs (DATA ES), utilisé pour enrichir les
            clubs et afficher les installations.
          </p>
        </div>

        <Card className="space-y-4 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            Importer les équipements DATA ES
          </h3>
          <p className="text-small text-slate-500">
            Fichier CSV/TSV séparé par tabulations, avec en-têtes DATA ES.
          </p>
          <Input
            type="file"
            accept=".csv,.tsv,.txt,text/csv"
            multiple
            disabled={esRunning}
            onChange={(e) => setEsFiles(Array.from(e.target.files || []))}
          />
          {esFiles.length > 0 && (
            <p className="text-small text-slate-500">{esFiles.length} fichier(s) sélectionné(s)</p>
          )}
          <Button onClick={runEquipementsImport} disabled={esRunning || !esFiles.length}>
            {esRunning ? "Import en cours…" : "Lancer l'import équipements"}
          </Button>
          {(esRunning || esProgress > 0) && (
            <div className="space-y-2">
              <Progress value={esProgress} />
              <p className="text-small text-slate-500">{esStatus}</p>
            </div>
          )}
          {esResult && (
            <div className="space-y-1 rounded-md border p-4 text-small">
              <p><strong>Enregistrés :</strong> {esResult.upserted}</p>
              <p><strong>Erreurs :</strong> {esResult.errors}</p>
              {esResult.lastError && (
                <p className="text-destructive"><strong>Dernière erreur :</strong> {esResult.lastError}</p>
              )}
            </div>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-ink">
            Archives RNA (non affichées sur le site)
          </h2>
          <p className="text-body text-slate-600">
            Outils d'enrichissement de l'ancienne base RNA (clubs_enriched). Cette base n'est plus
            affichée sur le site.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="rna-import" className="border-none">
            <AccordionTrigger className="rounded-2xl border bg-surface px-6 py-4 text-left font-display text-lg font-semibold text-ink hover:no-underline">
              Importer le RNA (archives)
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                <p className="text-small text-slate-500">
                  Fichier(s) CSV du Répertoire national des associations (séparateur
                  point-virgule). Seules les associations sportives actives sont importées.
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  multiple
                  disabled={running}
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                {files.length > 0 && (
                  <p className="text-small text-slate-500">
                    {files.length} fichier(s) sélectionné(s)
                  </p>
                )}
                <Button onClick={runImport} disabled={running || !files.length}>
                  {running ? "Import en cours…" : "Lancer l'import"}
                </Button>
                {(running || progress > 0) && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-small text-slate-500">{status}</p>
                  </div>
                )}
                {result && (
                  <div className="space-y-1 rounded-md border p-4 text-small">
                    <p><strong>Lignes filtrées (sport) :</strong> {result.filtered}</p>
                    <p><strong>Importées :</strong> {result.imported}</p>
                    <p><strong>Erreurs :</strong> {result.errors}</p>
                    {result.lastError && (
                      <p className="text-destructive"><strong>Dernière erreur :</strong> {result.lastError}</p>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rna-enrich" className="border-none">
            <AccordionTrigger className="rounded-2xl border bg-surface px-6 py-4 text-left font-display text-lg font-semibold text-ink hover:no-underline">
              Enrichir les clubs RNA depuis DATA ES
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                <p className="text-small text-slate-500">
                  Complète les clubs RNA avec les coordonnées GPS, la discipline et les équipements
                  disponibles issus des équipements sportifs.
                </p>
                <Button onClick={runEnrichFromEs} disabled={enriching}>
                  {enriching ? "Enrichissement…" : "Enrichir depuis DATA ES"}
                </Button>
                {enrichResult && <p className="text-small">{enrichResult}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rna-federations" className="border-none">
            <AccordionTrigger className="rounded-2xl border bg-surface px-6 py-4 text-left font-display text-lg font-semibold text-ink hover:no-underline">
              Suggérer les fédérations
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                <p className="text-small text-slate-500">
                  Analyse la description des clubs sans discipline et leur associe la fédération
                  correspondante.
                </p>
                <Button onClick={runSuggestFederation} disabled={suggesting}>
                  {suggesting ? "Analyse en cours…" : "Suggérer les fédérations"}
                </Button>
                {suggestResult && <p className="text-small">{suggestResult}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
