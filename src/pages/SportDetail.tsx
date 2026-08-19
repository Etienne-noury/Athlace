import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { disciplines, getParentDisciplines } from '@/data/disciplines';
import { fetchFederationSources, getFederationForDiscipline } from '@/lib/federations-map';
import { MapPin, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/geo';

export default function SportDetail() {
  const { sportId } = useParams<{ sportId: string }>();
  const sport = useMemo(() => {
    if (!sportId) return undefined;
    return disciplines.find((d) => d.id === sportId || slugify(d.name) === sportId);
  }, [sportId]);

  const parentSports = useMemo(() => getParentDisciplines(), []);
  const isChild = !!sport?.parentId;
  const parent = useMemo(() => {
    if (!sport?.parentId) return undefined;
    return disciplines.find((d) => d.id === sport.parentId);
  }, [sport]);

  const subDisciplines = useMemo(() => {
    if (!sport || isChild) return [];
    return disciplines.filter((d) => d.parentId === sport.id);
  }, [sport, isChild]);

  const { data: federationSources = [] } = useQuery({
    queryKey: ['federations'],
    queryFn: fetchFederationSources,
  });

  const federation = useMemo(() => {
    if (!sport) return undefined;
    return getFederationForDiscipline(sport.id, federationSources);
  }, [sport, federationSources]);

  useEffect(() => {
    if (sport) document.title = `${sport.name} — Trouver un club - Athlace`;
  }, [sport]);

  const { data: result = { clubs: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['sport-detail', sport?.name],
    queryFn: () => fetchEnrichedClubs({ discipline: sport?.name || '', limit: 100 }),
    enabled: !!sport?.name,
    staleTime: 5 * 60 * 1000,
  });

  const clubs = result.clubs;


  if (!sport) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold">Sport non trouvé</h1>
            <p className="text-muted-foreground mt-4">
              Ce sport n'est pas encore référencé sur Athlace.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/sports/">Voir tous les sports</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link to="/sports/" className="hover:text-primary">Sports</Link>
            {parent && (
              <>
                <span>/</span>
                <Link to={`/sports/${parent.id}/`} className="hover:text-primary">{parent.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{sport.name}</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {sport.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            {sport.description || `Trouvez un club de ${sport.name} près de chez vous et comparez les options d'entraînement.`}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isChild && parent && (
              <Card>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    {sport.name} fait partie de la famille {parent.name}.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-1" asChild>
                    <Link to={`/sports/${parent.id}/`}>Voir tous les sports de {parent.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isChild && subDisciplines.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Sous-disciplines</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subDisciplines.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/sports/${sub.id}/`}
                      className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                    >
                      <h3 className="font-display font-semibold">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sub.description || `Clubs de ${sub.name}`}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">
                Clubs de {sport.name} en France
              </h2>
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement des clubs...
                </div>
              )}
              {!isLoading && clubs.length === 0 && (
                <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/30">
                  <p className="text-muted-foreground">
                    Aucun club référencé pour le moment.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.map((club) => (
                  <Card key={club.id} className="group hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <Link to={`/club/${club.id}`} className="block">
                        <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                          {club.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {club.address || `${club.postalCode} ${club.city}` || 'Adresse non précisée'}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {clubs.length > 0 && (
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link to={`/clubs/?discipline=${encodeURIComponent(sport.name)}`}>
                      Voir tous les clubs <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            {federation && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold mb-2">Fédération officielle</h3>
                  <p className="text-sm text-muted-foreground mb-3">{federation.name}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={federation.url} target="_blank" rel="noopener noreferrer">
                      Site fédéral <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold mb-3">Autres sports</h3>
                <div className="flex flex-wrap gap-2">
                  {parentSports.slice(0, 12).map((s) => (
                    <Button
                      key={s.id}
                      variant={s.id === sport.id ? 'default' : 'outline'}
                      size="sm"
                      asChild={s.id !== sport.id}
                      disabled={s.id === sport.id}
                    >
                      {s.id === sport.id ? (
                        <span>{s.name}</span>
                      ) : (
                        <Link to={`/sports/${s.id}/`}>{s.name}</Link>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
