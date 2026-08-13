import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

// CSV column aliases -> table column
const ALIASES: Record<string, string> = {
  nom: 'name', name: 'name', titre: 'name',
  federation: 'federation_code', federation_code: 'federation_code',
  id: 'external_id', external_id: 'external_id', siren: 'external_id', rna: 'external_id', id_association: 'external_id',
  adresse: 'address', address: 'address', adresse_complete: 'address',
  code_postal: 'postal_code', cp: 'postal_code', postal_code: 'postal_code',
  ville: 'city', city: 'city', commune: 'city',
  region: 'region',
  discipline: 'discipline', activite: 'discipline', sport: 'discipline', objet: 'discipline',
  telephone: 'phone', phone: 'phone', tel: 'phone',
  email: 'email', mail: 'email', courriel: 'email',
  site_web: 'website', website: 'website', url: 'website', site: 'website',
  latitude: 'latitude', lat: 'latitude',
  longitude: 'longitude', lng: 'longitude', lon: 'longitude',
};

type Row = Record<string, string | number | undefined>;

const BATCH_SIZE = 500;

export default function CSVUploader() {
  const [token, setToken] = useState('');
  const [federation, setFederation] = useState('RNA');
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [totals, setTotals] = useState({ upserted: 0, inserted: 0, errors: 0 });

  const log = (s: string) => setLogs((l) => [...l, s]);

  const mapRow = (raw: Row): Row => {
    const out: Row = { federation_code: federation, source_url: 'csv-upload' };
    for (const [k, v] of Object.entries(raw)) {
      const key = k.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const target = ALIASES[key];
      if (!target) continue;
      if (v == null || v === '') continue;
      if (target === 'latitude' || target === 'longitude') {
        const n = parseFloat(String(v).replace(',', '.'));
        if (!isNaN(n)) out[target] = n;
      } else {
        out[target] = String(v).trim();
      }
    }
    return out;
  };

  const sendBatch = async (rows: Row[]) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-bulk-upsert`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ rows }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  };

  const processFile = (file: File): Promise<void> =>
    new Promise((resolve, reject) => {
      log(`▶ ${file.name}`);
      const rows: Row[] = [];
      Papa.parse<Row>(file, {
        header: true,
        skipEmptyLines: true,
        worker: false,
        step: (res) => {
          const mapped = mapRow(res.data);
          if (mapped.name) rows.push(mapped);
        },
        complete: async () => {
          log(`  parsed ${rows.length} rows`);
          try {
            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
              const batch = rows.slice(i, i + BATCH_SIZE);
              const r = await sendBatch(batch);
              setTotals((t) => ({
                upserted: t.upserted + (r.upserted || 0),
                inserted: t.inserted + (r.inserted || 0),
                errors: t.errors + (r.errors?.length || 0),
              }));
              if (r.errors?.length) log(`  ⚠ ${r.errors.join('; ')}`);
            }
            log(`  ✓ ${file.name} done`);
            resolve();
          } catch (e: unknown) {
            log(`  ✗ ${file.name}: ${e instanceof Error ? e.message : String(e)}`);
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });

  const start = async () => {
    if (!token) return log('⚠ Token requis');
    if (files.length === 0) return log('⚠ Aucun fichier');
    setBusy(true);
    setProgress(0);
    setTotals({ upserted: 0, inserted: 0, errors: 0 });
    for (let i = 0; i < files.length; i++) {
      try {
        await processFile(files[i]);
      } catch {
        // continue to next file
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setBusy(false);
    log('— Terminé —');
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Import CSV (clubs_enriched)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Uploade un ou plusieurs CSV (1 par département). Parsing côté navigateur, envoi par batchs de {BATCH_SIZE}.
          Colonnes reconnues : nom, federation, id/siren, adresse, code_postal, ville, region, discipline, telephone, email, site_web, latitude, longitude.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="token">Token admin</Label>
          <Input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_IMPORT_TOKEN"
          />
        </div>
        <div>
          <Label htmlFor="fed">Code fédération par défaut</Label>
          <Input
            id="fed"
            value={federation}
            onChange={(e) => setFederation(e.target.value)}
            placeholder="RNA"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="files">Fichiers CSV</Label>
        <Input
          id="files"
          type="file"
          accept=".csv,text/csv"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{files.length} fichier(s) sélectionné(s)</p>
        )}
      </div>

      <Button onClick={start} disabled={busy || files.length === 0 || !token}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Importer
      </Button>

      {busy && <Progress value={progress} />}

      {(totals.upserted || totals.inserted || totals.errors) > 0 && (
        <div className="rounded-md border bg-muted/30 p-4 text-sm grid grid-cols-3 gap-2">
          <div><strong>Upserts:</strong> {totals.upserted}</div>
          <div><strong>Inserts:</strong> {totals.inserted}</div>
          <div><strong>Erreurs:</strong> {totals.errors}</div>
        </div>
      )}

      {logs.length > 0 && (
        <pre className="text-xs bg-muted/30 rounded p-3 max-h-72 overflow-auto whitespace-pre-wrap">
          {logs.join('\n')}
        </pre>
      )}
    </Card>
  );
}
