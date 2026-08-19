import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const SOURCE_URL =
  "https://www.data.gouv.fr/fr/datasets/repertoire-national-des-associations/";

function isSport(row: Record<string, string>): boolean {
  const raw = (row.objet_social1 || '').replace(/\D/g, '');
  const code = parseInt(raw, 10);
  return code >= 11000 && code <= 11999;
}

const mapRow = (row: Record<string, string>) => {
  const address = [
    row.adrs_numvoie,
    row.adrs_typevoie,
    row.adrs_libvoie,
  ].filter((p) => p && p.trim()).join(' ').trim();

  return {
    federation_code: 'RNA',
    external_id: row.id || null,
    name: row.titre || 'Sans nom',
    description: row.objet || null,
    discipline: null,
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
    <div className="container mx-auto max-w-2xl py-10 space-y-6">
      <h1 className="text-3xl font-bold">Import RNA — Clubs sportifs</h1>

      <Card className="p-6 space-y-4">
        <Input
          type="file"
          accept=".csv"
          multiple
          disabled={running}
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        {files.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {files.length} fichier(s) sélectionné(s)
          </p>
        )}

        <Button onClick={runImport} disabled={running || !files.length}>
          {running ? "Import en cours…" : "Lancer l'import"}
        </Button>

        {(running || progress > 0) && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
        )}

        {result && (
          <div className="rounded-md border p-4 space-y-1 text-sm">
            <p><strong>Lignes filtrées (sport) :</strong> {result.filtered}</p>
            <p><strong>Importées :</strong> {result.imported}</p>
            <p><strong>Erreurs :</strong> {result.errors}</p>
            {result.lastError && (
              <p className="text-red-500"><strong>Dernière erreur :</strong> {result.lastError}</p>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Importer DATA ES (équipements sportifs)</h2>
        <p className="text-sm text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">{esFiles.length} fichier(s) sélectionné(s)</p>
        )}
        <Button onClick={runEquipementsImport} disabled={esRunning || !esFiles.length}>
          {esRunning ? "Import en cours…" : "Lancer l'import équipements"}
        </Button>
        {(esRunning || esProgress > 0) && (
          <div className="space-y-2">
            <Progress value={esProgress} />
            <p className="text-sm text-muted-foreground">{esStatus}</p>
          </div>
        )}
        {esResult && (
          <div className="rounded-md border p-4 space-y-1 text-sm">
            <p><strong>Enregistrés :</strong> {esResult.upserted}</p>
            <p><strong>Erreurs :</strong> {esResult.errors}</p>
            {esResult.lastError && (
              <p className="text-red-500"><strong>Dernière erreur :</strong> {esResult.lastError}</p>
            )}
          </div>
        )}
      </Card>



      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Géocodage des clubs</h2>
        <p className="text-sm text-muted-foreground">
          Géocode jusqu'à 50 clubs sans coordonnées via l'API adresse.data.gouv.fr.
        </p>
        <Button onClick={runGeocode} disabled={geocoding}>
          {geocoding ? "Géocodage…" : "Géocoder TOUS les clubs"}
        </Button>
        {geocodeResult && (
          <p className="text-sm">{geocodeResult}</p>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Suggestion de fédérations</h2>
        <p className="text-sm text-muted-foreground">
          Analyse la description des clubs sans discipline et leur associe la fédération correspondante.
        </p>
        <Button onClick={runSuggestFederation} disabled={suggesting}>
          {suggesting ? "Analyse en cours…" : "Suggérer les fédérations"}
        </Button>
        {suggestResult && <p className="text-sm">{suggestResult}</p>}
      </Card>

    </div>
  );
}
