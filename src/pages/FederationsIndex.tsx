import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFederationDirectory } from '@/hooks/useFederationDirectory';
import { groupFederationsByArborescence } from '@/lib/federations-officielles';
import { getFederationSports, getFederationStats } from '@/lib/federation-directory';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function FederationsIndex() {
  const [search, setSearch] = useState('');
  const directory = useFederationDirectory();
  const groups = useMemo(() => groupFederationsByArborescence(directory.federations.filter((fed) =>
    normalize(`${fed.sigle} ${fed.nom}`).includes(normalize(search.trim())),
  ), (fed) => fed.sigle), [directory.federations, search]);

  return <Layout>
    <PageTitle title="Les fédérations agréées" description="Découvrez les fédérations agréées par l'État et leurs clubs sur Athlace." />
    <section className="bg-muted border-b border-border py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-3">Les fédérations agréées</h1>
        <p className="text-muted-foreground text-lg">Athlace ne référence que des fédérations agréées par l'État.</p>
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Rechercher une fédération par nom ou sigle" placeholder="Nom ou sigle de la fédération" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10 bg-background" />
        </div>
      </div>
    </section>
    <section className="container mx-auto px-4 py-12 space-y-12">
      {directory.isLoading ? <div role="status" className="flex items-center justify-center gap-3 py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" />Chargement des fédérations…</div>
        : directory.isError ? <div role="alert" className="space-y-4"><p>Les fédérations ne peuvent pas être chargées pour le moment.</p><Button variant="outline" onClick={directory.retry}>Réessayer</Button></div>
        : groups.length === 0 ? <p className="text-muted-foreground">Aucune fédération trouvée.</p>
        : groups.map((family) => <div key={family.id}>
          <h2 className="text-2xl font-black mb-6">{family.icon} {family.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {family.sports.flatMap((sport) => sport.federations).map((fed) => {
              const { count } = getFederationStats(fed.sigle, directory.stats);
              return <Link key={fed.id} to={`/federations/${fed.sigle?.toLowerCase()}/`} className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Card className="h-full transition-colors group-hover:border-primary">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-bold text-primary mb-2">{fed.sigle}</h3>
                    <p className="font-bold text-foreground mb-3">{fed.nom}</p>
                    <p className="text-sm text-muted-foreground flex-1">{getFederationSports(fed.sigle).map((node) => node.name).join(', ')}</p>
                    <div className="flex items-center justify-between gap-3 mt-6 text-sm">
                      <span className="text-muted-foreground">{count > 0 ? `${count.toLocaleString('fr-FR')} club${count > 1 ? 's' : ''} sur Athlace` : 'Clubs bientôt disponibles'}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>;
            })}
          </div>
        </div>)}
    </section>
  </Layout>;
}