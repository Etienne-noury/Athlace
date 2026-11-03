import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { Badge } from '@/components/ui/badge';
import { VenuesMap } from '@/components/clubs/VenuesMap';
import { useEvent } from '@/hooks/useEvents';
import { eventDates } from '@/lib/events';
import { getDisciplineById } from '@/data/disciplines';
import { safeExternalUrl } from '@/lib/safe-url';
import NotFound from '@/pages/NotFound';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const query = useEvent(slug);
  const event = query.data;
  // Use text-only labels: Leaflet popup strings are interpreted as HTML.
  const points = useMemo(() => event && event.latitude !== null && event.longitude !== null ? [{ lat: event.latitude, lng: event.longitude, label: event.city.replace(/[<>&"']/g, '') }] : [], [event]);
  if (query.isLoading) return <Layout><p role="status" className="container mx-auto px-4 py-16">Chargement de l’événement…</p></Layout>;
  if (query.isError) return <Layout><div role="alert" className="container mx-auto px-4 py-16 space-y-4"><p>L’événement ne peut pas être chargé pour le moment.</p><Button variant="outline" onClick={() => query.refetch()}>Réessayer</Button></div></Layout>;
  if (!event) return <NotFound />;
  const sport = getDisciplineById(event.sport_id);
  const registration = safeExternalUrl(event.external_url);
  const image = safeExternalUrl(event.image_url);
  return <Layout>
    <PageTitle title={event.title} description={`${eventDates(event.start_date, event.end_date)} · ${event.city}`} />
    <section className="bg-muted border-b border-border py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6"><Link to="/" className="hover:text-primary">Accueil</Link><span aria-hidden="true">&gt;</span><Link to="/evenements/" className="hover:text-primary">Événements</Link><span aria-hidden="true">&gt;</span><span aria-current="page" className="break-words text-foreground">{event.title}</span></nav>
        {event.is_athlace && <Badge variant="secondary" className="mb-3">Athlace</Badge>}
        <h1 className="font-black text-3xl lg:text-4xl break-words mb-6">{event.title}</h1>
        <div className="space-y-3">
          <p className="flex items-start gap-2"><CalendarDays className="h-5 w-5 shrink-0" />{eventDates(event.start_date, event.end_date)}</p>
          <p className="flex items-start gap-2"><MapPin className="h-5 w-5 shrink-0" /><span>{event.address && <>{event.address}, </>}{event.city}</span></p>
          <Link to={`/sports/${event.sport_id}/`} className="inline-block text-primary underline underline-offset-4">{sport?.icon} {sport?.name ?? event.sport_id}</Link>
          <p className="text-muted-foreground break-words">{event.organizer_name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {event.is_athlace ? <><Button disabled>S'inscrire sur Athlace</Button><SoonBadge /></> : registration ? <Button asChild className="gap-2"><a href={registration} target="_blank" rel="noopener noreferrer">S'inscrire chez l'organisateur<ExternalLink className="h-4 w-4 shrink-0" /></a></Button> : <Button disabled>S'inscrire chez l'organisateur</Button>}
        </div>
      </div>
    </section>
    <div className="container mx-auto px-4 py-12 space-y-8">
      {image && <img src={image} alt={event.title} className="w-full max-w-3xl aspect-video object-cover rounded-lg" />}
      {event.description && <section className="max-w-3xl"><h2 className="text-2xl font-black mb-4">À propos de l’événement</h2><p className="whitespace-pre-wrap break-words">{event.description}</p></section>}
      {points.length > 0 && <section className="max-w-3xl"><h2 className="text-2xl font-black mb-4">Le lieu</h2><VenuesMap points={points} /></section>}
      {event.federation_code && <Button asChild variant="outline"><Link to={`/federations/${encodeURIComponent(event.federation_code.toLowerCase())}/`}>La fédération {event.federation_code}</Link></Button>}
    </div>
  </Layout>;
}