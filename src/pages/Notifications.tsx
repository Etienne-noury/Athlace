import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { PageTitle } from '@/components/PageTitle';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAthleteFavorites } from '@/hooks/useAthleteFavorites';
import { EMPTY_ALERTS, ALERT_OPTIONS, type AlertKey } from '@/lib/athlete-account';
import { toast } from '@/hooks/use-toast';

export default function Notifications() {
  const { user } = useAuth();
  const favorites = useAthleteFavorites();
  const client = useQueryClient();
  const [saving, setSaving] = useState(false);
  const preferences = useQuery({ queryKey: ['alert-preferences', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return EMPTY_ALERTS;
    const { data, error } = await supabase.from('alert_preferences').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return data ?? EMPTY_ALERTS;
  } });
  const change = async (key: AlertKey, value: boolean) => {
    if (!user || saving || preferences.isError) return;
    setSaving(true);
    const current = preferences.data ?? EMPTY_ALERTS;
    const { error } = await supabase.from('alert_preferences').upsert({ user_id: user.id, new_club_city: key === 'new_club_city' ? value : current.new_club_city, new_club_sport: key === 'new_club_sport' ? value : current.new_club_sport, favorite_club_news: key === 'favorite_club_news' ? value : current.favorite_club_news, updated_at: new Date().toISOString() });
    if (error) toast({ title: 'Préférences non enregistrées', variant: 'destructive' });
    else await client.invalidateQueries({ queryKey: ['alert-preferences', user.id] });
    setSaving(false);
  };
  return (
    <Layout>
      <PageTitle title="Mes alertes" />
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl font-black text-foreground">Mes alertes</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl space-y-8">
          {preferences.isLoading ? <p role="status">Chargement des préférences…</p> : preferences.isError ? <div role="alert"><p>Impossible de charger vos préférences.</p><Button variant="outline" onClick={() => preferences.refetch()}>Réessayer</Button></div> : <div className="divide-y border-y border-border">{ALERT_OPTIONS.map((option) => <div key={option.key} className="flex items-center justify-between gap-6 py-6"><label htmlFor={option.key} className="font-bold">{option.label}</label><Switch id={option.key} checked={preferences.data?.[option.key] ?? false} onCheckedChange={(checked) => change(option.key, checked)} disabled={saving} /></div>)}</div>}
          <div className="flex flex-wrap items-center gap-3"><p className="text-muted-foreground">L'envoi des alertes par e-mail arrive bientôt.</p><SoonBadge /></div>
          {!favorites.loading && !favorites.error && favorites.total === 0 && <div className="space-y-3"><p>Ajoutez des favoris pour retrouver vos clubs, villes et sports.</p><Button asChild variant="outline"><Link to="/compte/favoris/">Ajouter des favoris</Link></Button></div>}
        </div>
      </section>
    </Layout>
  );
}
