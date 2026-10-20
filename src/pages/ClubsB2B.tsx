import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { Search, CheckCircle, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                <p className="font-bold text-foreground truncate"{c.name}</p>
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

const waitlistSchema = z.object({
  club_name: z.string().trim().min(1, 'Indiquez le nom du club').max(200),
  email: z.string().trim().email('Email invalide').max(255),
  sport: z.string().trim().max(100).optional(),
  members_estimate: z.string().trim().max(50).optional(),
});

function WaitlistForm() {
  const [form, setForm] = useState({ club_name: '', email: '', sport: '', members_estimate: '' });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = waitlistSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    const { error } = await supabase.from('club_waitlist').insert({
      club_name: parsed.data.club_name,
      email: parsed.data.email,
      sport: parsed.data.sport || null,
      members_estimate: parsed.data.members_estimate || null,
    });
    setSending(false);
    if (error) setError("L'envoi a échoué, réessayez dans un instant.");
    else setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-6" role="status">
        <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" aria-hidden />
        <p className="font-sans text-xl font-bold"Merci, c'est noté !</p>
        <p className="text-muted-foreground mt-1">Nous vous préviendrons dès le lancement d'Athlace Club.</p>
      </div>
    );
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`wl-${key}`}>{label}</Label>
      <Input id={`wl-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
      {field('club_name', 'Nom du club *', { required: true, maxLength: 200 })}
      {field('email', 'Email *', { type: 'email', required: true, maxLength: 255 })}
      {field('sport', 'Sport', { maxLength: 100 })}
      {field('members_estimate', "Nombre d'adhérents (approx.)", { maxLength: 50, placeholder: 'ex. 150' })}
      {error && <p className="sm:col-span-2 text-sm text-destructive" role="alert">{error}</p>}
      <div className="sm:col-span-2 text-center">
        <Button type="submit" disabled={sending}>{sending ? 'Envoi…' : 'Me prévenir'}</Button>
      </div>
    </form>
  );
}

export default function ClubsB2B() {
  return (
    <Layout>
      <section className="bg-muted border-b border-border py-10 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-sans text-3xl lg:text-5xl font-black text-foreground mb-3"Athlace pour les clubs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Votre club est déjà sur Athlace. Prenez la main sur votre fiche, puis gérez et animez votre club au même endroit.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="font-sans text-2xl lg:text-3xl font-black text-center mb-6"Votre fiche existe déjà</h2>
        <ClubFinder />
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-sans text-2xl lg:text-3xl font-black text-center mb-8"Les offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((o) => (
              <Card key={o.name} className="flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-sans text-xl font-bold"{o.name}</h3>
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
                  {o.available && (
                    <Button asChild className="mt-6">
                      <Link to="/compte/mon-club/">Compléter ma fiche</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 lg:p-8">
          <h2 className="font-sans text-2xl font-black text-center mb-6"Être prévenu du lancement d'Athlace Club</h2>
          <WaitlistForm />
        </div>
      </section>
    </Layout>
  );
}
