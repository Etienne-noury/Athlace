import { Layout } from '@/components/layout/Layout';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageTitle } from '@/components/PageTitle';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { eventDates } from '@/lib/events';
import { getDisciplineById } from '@/data/disciplines';
import { safeExternalUrl } from '@/lib/safe-url';

export default function Evenements() {
  const [params, setParams] = useSearchParams();
  const sport = params.get('discipline') || 'all';
  const city = params.get('ville') || '';
  const events = useEvents(sport, city);
  const filter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };
  return (
    <Layout>
      <PageTitle title="Événements" description="Les rendez-vous sportifs près de chez vous" />
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl font-black text-foreground">Événements</h1>
          <p className="text-muted-foreground mt-2">Les rendez-vous sportifs près de chez vous</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mb-10">
          <DisciplineFilter sport={sport} sub="all" onSportChange={(v) => filter('discipline', v)} onSubChange={() => {}} showSub={false} />
          <label className="block text-sm font-bold"><span className="block mb-2">Ville</span><Input type="search" maxLength={200} value={city} onChange={(e) => filter('ville', e.target.value)} placeholder="Toutes les villes" /></label>
        </div>
        {events.isLoading ? <p role="status">Chargement des événements…</p> : events.isError ? <div role="alert" className="space-y-4"><p>Les événements ne peuvent pas être chargés pour le moment.</p><Button variant="outline" onClick={() => events.refetch()}>Réessayer</Button></div> : events.data?.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.data.map((event) => {
            const image = safeExternalUrl(event.image_url);
            const discipline = getDisciplineById(event.sport_id);
            return <Card key={event.id} className="overflow-hidden">
              <Link to={`/evenements/${event.slug}/`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {image && <img src={image} alt="" loading="lazy" className="w-full aspect-video object-cover" />}
                <div className="p-6 space-y-3">
                  <p className="flex items-start gap-2 text-sm text-primary font-bold"><CalendarDays className="h-4 w-4 shrink-0 mt-0.5" />{eventDates(event.start_date, event.end_date)}</p>
                  {event.is_athlace && <Badge variant="secondary">Athlace</Badge>}
                  <h2 className="text-xl font-black break-words">{event.title}</h2>
                  <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{event.city}</p>
                  <p>{discipline?.icon} {discipline?.name ?? event.sport_id}</p>
                  <p className="text-sm text-muted-foreground break-words">{event.organizer_name}</p>
                  <ArrowRight className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
              </Link>
            </Card>;
          })}
        </div> : <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-muted">
          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Aucun événement à venir pour le moment. Les premiers arrivent bientôt.</p>
          <SoonBadge />
        </div>}
      </section>
    </Layout>
  );
}
