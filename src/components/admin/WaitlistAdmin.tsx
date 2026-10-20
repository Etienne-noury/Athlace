import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

export function WaitlistAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['club-waitlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_waitlist')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="space-y-4">
      <h2 className="font-sans text-2xl font-black text-nuit">
        Liste d'attente Athlace Club {data ? `(${data.length})` : ''}
      </h2>
      <Card className="overflow-x-auto p-4">
        {isLoading && <p className="text-small text-muted-foreground">Chargement…</p>}
        {error && <p className="text-small text-destructive">Impossible de charger la liste.</p>}
        {data && data.length === 0 && <p className="text-small text-muted-foreground">Aucun inscrit pour l'instant.</p>}
        {data && data.length > 0 && (
          <table className="w-full text-small">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4">Date</th><th className="pr-4">Club</th><th className="pr-4">Email</th><th className="pr-4">Sport</th><th>Adhérents</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2 pr-4">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="pr-4">{r.club_name}</td>
                  <td className="pr-4"><a className="text-primary underline" href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td className="pr-4">{r.sport ?? '-'}</td>
                  <td>{r.members_estimate ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
