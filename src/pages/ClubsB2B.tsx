import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, CheckCircle, MapPin, Users, CalendarDays, MessageSquare, Newspaper, ChartNoAxesCombined, ClipboardList, ArrowDown, CalendarCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppointmentForm } from '@/components/clubs/AppointmentForm';
import { useAuth } from '@/lib/auth';
import { PageTitle } from '@/components/PageTitle';
import communityPhoto from '@/assets/espace-club-community.jpg';
import { Badge } from '@/components/ui/badge';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { supabase } from '@/integrations/supabase/client';

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function ClubFinder() {
  const [q, setQ] = useState('');
  const term = useDebounced(q.trim());
  const { data, isFetching } = useQuery({
    queryKey: ['b2b-club-search', term],
    enabled: term.length >= 2,
    queryFn: async () => {
      const safe = term.replace(/[%,()*]/g, ' ');
      const { data, error } = await supabase
        .from('clubs_public')
        .select('id, name, city, postal_code, discipline')
        .or(`name.ilike.%${safe}%,city.ilike.%${safe}%`)
        .order('name')
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nom du club ou ville"
          aria-label="Rechercher votre club par nom ou ville"
          className="pl-12 h-12 rounded-pill"
          maxLength={100}
        />
      </div>
      <div className="mt-4 space-y-2" aria-live="polite">
        {term.length >= 2 && isFetching && <p className="text-sm text-muted-foreground">Recherche…</p>}
        {term.length >= 2 && !isFetching && data?.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun club trouvé. Essayez un autre nom ou une autre ville.</p>
        )}
        {data?.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{c.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden />
                  {[c.postal_code, c.city].filter(Boolean).join(' ')}
                  {c.discipline ? ` · ${c.discipline}` : ''}
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link to={`/compte/mon-club/?club=${c.id}`}>C'est mon club</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const offers = [
  {
    name: 'Fiche gratuite',
    available: true,
    features: ['Mise à jour des infos', 'Horaires', 'Tarifs', 'Photos', 'Présentation', "Lien d'inscription"],
  },
  {
    name: 'Athlace Club Essentiel',
    available: false,
    features: ['Gestion des adhérents', 'Inscriptions en ligne', 'Statistiques de visite de la fiche'],
  },
  {
    name: 'Athlace Club Pro',
    available: false,
    features: [
      'Tout Essentiel',
      'Animation de la communauté (actus, événements, messagerie adhérents)',
      'Mise en avant dans les recherches',
    ],
  },
];

const tools = [
  { name: 'Adhérents', icon: Users }, { name: 'Inscriptions en ligne', icon: ClipboardList },
  { name: 'Calendrier et entraînements', icon: CalendarDays }, { name: 'Messagerie', icon: MessageSquare },
  { name: 'Actualités et événements', icon: Newspaper }, { name: 'Statistiques de la fiche', icon: ChartNoAxesCombined },
];
const steps = [
  { title: 'Trouvez votre club', text: 'Recherchez votre club par son nom ou sa ville.' },
  { title: 'Identifiez-vous', text: 'Indiquez votre rôle dans le club et votre numéro d’affiliation fédérale.' },
  { title: 'Complétez ou corrigez votre fiche', text: 'Horaires, tarifs, photos, contact : partagez les informations de votre club.' },
  { title: 'Nous vérifions, puis votre fiche est mise à jour', text: 'Votre fiche actualisée permet aux sportifs de découvrir votre club.' },
];

export default function ClubsB2B() {
  const { user } = useAuth();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'auto' });
  }, [hash]);
  return (
    <Layout>
      <PageTitle title="Espace club" description="Votre club est déjà sur Athlace. Prenez la main sur votre fiche, puis gérez et animez votre club au même endroit." />
      <section className="relative isolate overflow-hidden bg-bleu-athlace text-creme">
        <img src={communityPhoto} alt="" width={1536} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-bleu-athlace/85" aria-hidden="true" />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-black mb-6">Espace club</h1>
            <p className="text-lg leading-relaxed max-w-xl">Votre club est déjà sur Athlace. Prenez la main sur votre fiche, puis gérez et animez votre club au même endroit.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild variant="secondary" className="gap-2"><a href="#trouver-ma-fiche">Trouver ma fiche<ArrowDown className="h-4 w-4" /></a></Button>
              <Button asChild variant="tertiary" className="gap-2"><a href="#rendez-vous">Prendre rendez-vous<CalendarCheck className="h-4 w-4" /></a></Button>
            </div>
          </div>
        </div>
      </section>

      {user && <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8"><h2 className="text-2xl lg:text-3xl font-black">Mon espace club</h2><Button asChild><Link to="/compte/mon-club/">Accéder à ma fiche club</Link></Button></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <Card key={tool.name} className="p-6 flex items-start gap-4"><tool.icon className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 space-y-3"><h3 className="font-bold">{tool.name}</h3><SoonBadge /></div></Card>)}</div>
      </section>}

      <section id="trouver-ma-fiche" className="container mx-auto px-4 py-12 scroll-mt-24">
        <h2 className="font-sans text-2xl lg:text-3xl font-black text-center mb-6">Votre fiche existe déjà</h2>
        <ClubFinder />
      </section>

      <section id="comment-ca-marche" className="bg-bleu-athlace text-creme py-12 lg:py-16 scroll-mt-24">
        <div className="container mx-auto px-4"><h2 className="text-2xl lg:text-3xl font-black mb-10">Comment ça marche</h2>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, i) => <li key={step.title} className="space-y-4"><span className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-secondary text-secondary-foreground font-bold">{i + 1}</span><h3 className="text-lg font-bold">{step.title}</h3><p className="text-sm leading-relaxed">{step.text}</p></li>)}</ol>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-sans text-2xl lg:text-3xl font-black text-center mb-8">Les offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((o) => (
              <Card key={o.name} className="flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-sans text-xl font-bold">{o.name}</h3>
                    {o.available ? <Badge>Disponible</Badge> : <SoonBadge />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{o.available ? 'Gratuit' : 'Tarif à venir'}</p>
                  <ul className="space-y-2 flex-1">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                  {o.available ? <Button asChild className="mt-6"><Link to="/compte/mon-club/">Compléter ma fiche</Link></Button>
                    : <div className="mt-6 flex flex-wrap gap-2 items-center"><Button disabled>Choisir cette offre</Button><SoonBadge /></div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="rendez-vous" className="container mx-auto px-4 py-12 lg:py-16 scroll-mt-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-black mb-4">Prendre rendez-vous</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8"><CalendarCheck className="h-5 w-5 text-primary" /><span>Réservation d'un créneau en ligne</span><SoonBadge /></div>
          <AppointmentForm />
        </div>
      </section>
    </Layout>
  );
}
