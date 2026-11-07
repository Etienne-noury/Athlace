import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isFederationRow } from '@/lib/federation-directory';

type Status = 'done' | 'in_progress' | 'to_import' | 'blocked' | 'todo';

interface Row {
  sigle: string;
  nom: string;
  categorie: string;
  status: Status;
  block_reason: string | null;
  next_step: string | null;
  source_total: number | null;
  last_scraped_on: string | null;
  clubs: number;
  gps: number;
}

const STATUS: Record<Status, { label: string; bar: string; badge: string }> = {
  done: { label: 'En base', bar: 'bg-lime', badge: 'border-lime bg-lime/20 text-nuit' },
  in_progress: { label: 'En cours', bar: 'bg-bleu-athlace', badge: 'border-bleu-athlace bg-bleu-athlace/10 text-bleu-athlace' },
  to_import: { label: 'À importer', bar: 'bg-bleu-athlace/50', badge: 'border-bleu-athlace/50 text-bleu-athlace' },
  blocked: { label: 'Bloquée', bar: 'bg-destructive', badge: 'border-destructive bg-destructive/10 text-destructive' },
  todo: { label: 'À tenter', bar: 'bg-muted-foreground/30', badge: 'border-border text-muted-foreground' },
};
const ORDER: Status[] = ['done', 'in_progress', 'to_import', 'blocked', 'todo'];
const fr = new Intl.NumberFormat('fr-FR');
const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

function StatusBadge({ status }: { status: Status }) {
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2 text-eyebrow ${STATUS[status].badge}`}>{STATUS[status].label}</span>;
}

function Kpi({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <Card className={`flex flex-col justify-between gap-2 p-4 ${alert ? 'border-2 border-destructive' : ''}`}>
      <p className="text-small leading-tight text-muted-foreground">{label}</p>
      <p className={`whitespace-nowrap text-subhead font-black tabular-nums ${alert ? 'text-destructive' : 'text-nuit'}`}>{value}</p>
    </Card>
  );
}

function EditableCell({ row, field, onSave }: { row: Row; field: 'block_reason' | 'next_step'; onSave: (sigle: string, patch: Partial<Row>) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row[field] ?? '');
  if (!editing) {
    return (
      <button
        type="button"
        className="w-full rounded-md px-1 py-0.5 text-left text-small hover:bg-muted"
        title="Cliquer pour modifier"
        onClick={() => { setValue(row[field] ?? ''); setEditing(true); }}
      >
        {row[field] || <span className="text-muted-foreground">Ajouter…</span>}
      </button>
    );
  }
  return (
    <textarea
      autoFocus
      className="w-full rounded-md border border-input bg-background px-1 py-0.5 text-small focus:outline-none"
      rows={Math.max(2, Math.ceil(value.length / 35))}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
      onBlur={() => {
        setEditing(false);
        if ((row[field] ?? '') !== value.trim()) onSave(row.sigle, { [field]: value.trim() || null });
      }}
    />
  );
}

export function ScrapingAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: keyof Row; dir: 1 | -1 }>({ key: 'clubs', dir: -1 });

  const statusQuery = useQuery({
    queryKey: ['admin-scraping-status'],
    queryFn: async () => {
      const [{ data: feds, error: e1 }, { data: statuses, error: e2 }] = await Promise.all([
        supabase.from('federations_sportives').select('sigle, nom, categorie'),
        supabase.from('federation_scraping_status').select('*'),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { feds: feds ?? [], statuses: statuses ?? [] };
    },
  });
  const statsQuery = useQuery({
    queryKey: ['admin-scraping-club-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_scraping_stats');
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, clubs: Number(r.clubs), gps: Number(r.gps) }));
    },
    refetchOnWindowFocus: true,
  });

  const rows = useMemo<Row[]>(() => {
    if (!statusQuery.data || !statsQuery.data) return [];
    const bySigle = new Map(statusQuery.data.statuses.map((s) => [s.sigle, s]));
    return statusQuery.data.feds.map((f) => {
      const s = bySigle.get(f.sigle);
      const stats = statsQuery.data.filter((r) => isFederationRow(f.sigle, r));
      const clubs = stats.reduce((a, r) => a + r.clubs, 0);
      const lastImport = stats.reduce<string | null>((max, r) => (r.last_import && (!max || r.last_import > max) ? r.last_import : max), null);
      // Statut automatique : des clubs en base font passer une fédé "à tenter", "à importer" ou "bloquée" en "en base".
      const manual = (s?.status ?? 'todo') as Status;
      const status: Status = clubs > 0 && ['todo', 'to_import', 'blocked'].includes(manual) ? 'done' : manual;
      return {
        sigle: f.sigle,
        nom: f.nom,
        categorie: f.categorie,
        status,
        block_reason: s?.block_reason ?? null,
        next_step: s?.next_step ?? null,
        source_total: s?.source_total ?? null,
        last_scraped_on: lastImport ?? s?.last_scraped_on ?? null,
        clubs,
        gps: stats.reduce((a, r) => a + r.gps, 0),
      };
    });
  }, [statusQuery.data, statsQuery.data]);

  const save = async (sigle: string, patch: Partial<Row>) => {
    const { error } = await supabase
      .from('federation_scraping_status')
      .upsert({ sigle, ...patch, updated_at: new Date().toISOString() } as never, { onConflict: 'sigle' });
    if (error) { setSaveError(error.message); return; }
    setSaveError(null);
    queryClient.invalidateQueries({ queryKey: ['admin-scraping-status'] });
  };

  const total = rows.length;
  const count = (s: Status) => rows.filter((r) => r.status === s).length;
  const lastDate = rows.reduce<string | null>((max, r) => (r.last_scraped_on && (!max || r.last_scraped_on > max) ? r.last_scraped_on : max), null);
  const lastBatch = lastDate ? rows.filter((r) => r.last_scraped_on === lastDate) : [];
  const toUnblock = rows.filter((r) => r.status === 'blocked' || (r.status === 'done' && r.block_reason));
  const ongoing = rows.filter((r) => r.status === 'in_progress' || r.status === 'to_import');
  const todo = rows.filter((r) => r.status === 'todo');
  const maxClubs = Math.max(1, ...rows.map((r) => r.clubs));

  const q = search.trim().toLowerCase();
  const allRows = rows
    .filter((r) => !q || `${r.sigle} ${r.nom} ${r.categorie} ${STATUS[r.status].label}`.toLowerCase().includes(q))
    .sort((a, b) => {
      const va = a[sort.key]; const vb = b[sort.key];
      return sort.dir * (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va ?? '').localeCompare(String(vb ?? ''), 'fr'));
    });
  const sortBy = (key: keyof Row) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === 'clubs' ? -1 : 1 }));
  const th = (key: keyof Row, label: string, right?: boolean) => (
    <th className={`py-2 pr-4 ${right ? 'text-right' : ''}`} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
      <button type="button" className="font-bold hover:text-nuit" onClick={() => sortBy(key)}>{label}{sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}</button>
    </th>
  );

  if (statusQuery.isLoading || statsQuery.isLoading) return <p className="text-small text-muted-foreground">Chargement…</p>;
  if (statusQuery.error || statsQuery.error) return <p className="text-small text-destructive">Impossible de charger le suivi du scraping.</p>;

  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-sans text-2xl font-black text-nuit">Scraping des fédérations</h2>
        <p className="text-small text-muted-foreground">
          {count('done')} fédérations sur {total} en base, {fr.format(rows.reduce((a, r) => a + r.clubs, 0))} clubs visibles. {count('blocked')} bloquées à débloquer.
        </p>
        {saveError && <p className="text-small text-destructive">Enregistrement impossible : {saveError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label={`Fédés en base (sur ${total})`} value={String(count('done'))} />
        <Kpi label="Clubs visibles" value={fr.format(rows.reduce((a, r) => a + r.clubs, 0))} />
        <Kpi label={lastDate ? `Importées le ${fmtDate(lastDate)}` : 'Dernier lot'} value={String(lastBatch.length)} />
        <Kpi label="En cours" value={String(ongoing.length)} />
        <Kpi label="Bloquées" value={String(count('blocked'))} alert />
        <Kpi label="Pas encore tentées" value={String(todo.length)} />
      </div>

      <Card className="p-4">
        <h3 className="text-subhead-sm text-nuit">Avancement sur les {total} fédérations</h3>
        <div className="mt-3 flex h-7 gap-0.5 overflow-hidden rounded-md">
          {ORDER.map((s) => count(s) > 0 && <div key={s} className={STATUS[s].bar} style={{ flex: count(s) }} title={`${STATUS[s].label} : ${count(s)}`} />)}
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-small text-muted-foreground">
          {ORDER.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <i className={`inline-block h-2.5 w-2.5 rounded-sm ${STATUS[s].bar}`} />
              {STATUS[s].label} : {count(s)} ({total ? Math.round((count(s) / total) * 100) : 0} %)
            </span>
          ))}
        </div>
      </Card>

      <Card className="border-2 border-destructive p-4">
        <h3 className="text-subhead-sm text-destructive">À débloquer ({toUnblock.length})</h3>
        <p className="text-small text-muted-foreground">Ce qu'on n'arrive pas à scraper, la raison et la piste pour l'avoir. Blocage et piste sont modifiables.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-small">
            <thead><tr className="text-left text-muted-foreground"><th className="py-2 pr-4">Sigle</th><th className="pr-4">Fédération</th><th className="pr-4">Statut</th><th className="min-w-56 pr-4">Blocage</th><th className="min-w-56">Piste</th></tr></thead>
            <tbody>
              {toUnblock.map((r) => (
                <tr key={r.sigle} className="border-t border-border align-top">
                  <td className="py-2 pr-4 font-bold">{r.sigle}</td>
                  <td className="py-2 pr-4">{r.nom}</td>
                  <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-1 pr-4"><EditableCell row={r} field="block_reason" onSave={save} /></td>
                  <td className="py-1"><EditableCell row={r} field="next_step" onSave={save} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-subhead-sm text-nuit">En cours ou à importer</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-small">
              <thead><tr className="text-left text-muted-foreground"><th className="py-2 pr-4">Sigle</th><th className="pr-4">Statut</th><th className="pr-4 text-right">En base</th><th className="pr-4 text-right">Total source</th><th className="min-w-48">Prochaine étape</th></tr></thead>
              <tbody>
                {ongoing.map((r) => (
                  <tr key={r.sigle} className="border-t border-border align-top">
                    <td className="py-2 pr-4 font-bold">{r.sigle}</td>
                    <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-2 pr-4 text-right tabular-nums">{fr.format(r.clubs)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{r.source_total != null ? fr.format(r.source_total) : '-'}</td>
                    <td className="py-1"><EditableCell row={r} field="next_step" onSave={save} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-subhead-sm text-nuit">Pas encore tentées</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-small">
              <thead><tr className="text-left text-muted-foreground"><th className="py-2 pr-4">Sigle</th><th className="pr-4">Fédération</th><th>Catégorie</th></tr></thead>
              <tbody>
                {todo.map((r) => (
                  <tr key={r.sigle} className="border-t border-border">
                    <td className="py-2 pr-4 font-bold">{r.sigle}</td><td className="py-2 pr-4">{r.nom}</td><td className="py-2">{r.categorie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {lastDate && (
        <Card className="p-4">
          <h3 className="text-subhead-sm text-nuit">Dernier lot : {fmtDate(lastDate)} ({lastBatch.length} fédés)</h3>
          <div className="mt-3 max-h-96 overflow-auto">
            <table className="w-full text-small">
              <thead className="sticky top-0 bg-card"><tr className="text-left text-muted-foreground"><th className="py-2 pr-4">Sigle</th><th className="pr-4">Fédération</th><th className="pr-4">Statut</th><th className="text-right">Clubs en base</th></tr></thead>
              <tbody>
                {[...lastBatch].sort((a, b) => b.clubs - a.clubs).map((r) => (
                  <tr key={r.sigle} className="border-t border-border">
                    <td className="py-2 pr-4 font-bold">{r.sigle}</td><td className="py-2 pr-4">{r.nom}</td>
                    <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-2 text-right tabular-nums">{fr.format(r.clubs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="text-subhead-sm text-nuit">Toutes les fédérations</h3>
        <Input className="mt-3 max-w-sm" type="search" placeholder="Chercher une fédé, un sigle, un statut" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="mt-3 max-h-[36rem] overflow-auto">
          <table className="w-full text-small">
            <thead className="sticky top-0 bg-card"><tr className="text-left text-muted-foreground">{th('sigle', 'Sigle')}{th('nom', 'Fédération')}{th('categorie', 'Catégorie')}{th('status', 'Statut')}{th('clubs', 'Clubs', true)}{th('gps', 'Avec GPS', true)}</tr></thead>
            <tbody>
              {allRows.map((r) => (
                <tr key={r.sigle} className="border-t border-border">
                  <td className="py-2 pr-4 font-bold">{r.sigle}</td>
                  <td className="py-2 pr-4">{r.nom}</td>
                  <td className="py-2 pr-4">{r.categorie}</td>
                  <td className="py-2 pr-4">
                    <select
                      className="rounded-md border border-input bg-background px-1 text-small"
                      value={r.status}
                      aria-label={`Statut ${r.sigle}`}
                      onChange={(e) => save(r.sigle, { status: e.target.value as Status })}
                    >
                      {ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center justify-end gap-2 tabular-nums">
                      <span className="inline-block h-1.5 rounded-sm bg-bleu-athlace/40" style={{ width: `${Math.round((r.clubs / maxClubs) * 80)}px` }} />
                      {fr.format(r.clubs)}
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">{fr.format(r.gps)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
