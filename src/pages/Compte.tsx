import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { Card } from '@/components/ui/card';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useAthleteFavorites } from '@/hooks/useAthleteFavorites';
import { User, Heart, Bell, CalendarDays, MessageSquare, ClipboardList } from 'lucide-react';

export default function Compte() {
  const { user, profile } = useAuth();
  const favorites = useAthleteFavorites();
  const firstName = (profile?.full_name || user?.user_metadata?.full_name || '').trim().split(/\s+/)[0];
  const count = (value: number | undefined) => favorites.loading || favorites.error ? '-' : String(value ?? 0);
  const cards = [
    { to: '/compte/favoris/', icon: Heart, title: 'Mes favoris', desc: `${count(favorites.clubs.data)} clubs · ${count(favorites.cities.data?.length)} villes · ${count(favorites.sports.data?.length)} sports suivis` },
    { to: '/compte/alertes/', icon: Bell, title: 'Mes alertes', desc: 'Mes préférences d’alertes.' },
    { to: '/compte/profil/', icon: User, title: 'Mon profil', desc: 'Mes informations personnelles.' },
  ];
  return <Layout><PageTitle title="Espace sportif" />
    <section className="bg-muted border-b border-border py-8 lg:py-12"><div className="container mx-auto px-4"><h1 className="text-3xl font-black">Bonjour{firstName ? ` ${firstName}` : ''}</h1><p className="mt-2 text-muted-foreground">Mon espace sportif</p></div></section>
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{cards.map((card) => <Card key={card.to}><Link to={card.to} className="block p-6 h-full focus-visible:ring-2 focus-visible:ring-ring"><card.icon className="h-8 w-8 text-primary mb-4" /><h2 className="text-xl font-black">{card.title}</h2><p className="text-sm text-muted-foreground mt-2">{card.desc}</p></Link></Card>)}</div>
      {favorites.error && <div role="alert" className="space-y-2"><p>Impossible de charger les compteurs de favoris.</p><Button variant="outline" onClick={() => favorites.refresh()}>Réessayer</Button></div>}
      <section className="border-t border-border pt-8"><div className="flex flex-wrap items-center gap-3 mb-6"><h2 className="text-2xl font-black">Bientôt sur Athlace</h2><SoonBadge /></div><ul className="grid gap-6 sm:grid-cols-3">{[{ icon: ClipboardList, name: 'Inscription en ligne à un club' }, { icon: CalendarDays, name: 'Calendrier de mes entraînements' }, { icon: MessageSquare, name: 'Messagerie de mon club' }].map((item) => <li key={item.name} className="flex gap-3 items-start"><item.icon className="h-5 w-5 shrink-0 text-primary" /><span>{item.name}</span></li>)}</ul></section>
    </div>
  </Layout>;
}
