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
        console.log('Premières lignes:', result.data.slice(0, 3));
        console.log('Colonnes:', result.meta.fields);
        console.log('Total lignes:', result.data.length);
        resolve(result.data);
      },
      error: reject,
    });
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
  } | null>(null);

  const runImport = async () => {
    if (!files.length) return;
    setRunning(true);
    setProgress(0);
    setResult(null);

    let imported = 0;
    let errors = 0;
    let filtered = 0;

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
          const { error } = await supabase
            .from("clubs_enriched")
            .upsert(batch, { onConflict: "federation_code,external_id" });
          if (error) {
            console.error(error);
            errors += batch.length;
          } else {
            imported += batch.length;
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
      setResult({ imported, errors, filtered });
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
            <p>
              <strong>Lignes filtrées (sport) :</strong> {result.filtered}
            </p>
            <p>
              <strong>Importées :</strong> {result.imported}
            </p>
            <p>
              <strong>Erreurs :</strong> {result.errors}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
