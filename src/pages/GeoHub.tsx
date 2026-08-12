import { useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { slugify, findRegionBySlug, findDepartmentByCode, DEPARTMENTS } from '@/lib/geo';
import { getDisciplineDisplayName } from '@/lib/sports-menu';
import { MapPin, ArrowLeft, Loader2, Building2 } from 'lucide-react';

export default function GeoHub() {

  const { a, b, c, d } = useParams<{
    a?: string;
    b?: string;
    c?: string;
    d?: string;
  }>();

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0', 10);

  const region = a;
  const dpt = b;
  const ville = c;
  const sport = d;


  const regionData = useMemo(() => (region ? findRegionBySlug(region) : undefined), [region]);
  const departmentData = useMemo(() => {
    if (!dpt) return undefined;
    if (dpt.length === 2) return findDepartmentByCode(dpt);
    return DEPARTMENTS.find((d) => slugify(d.name) === dpt || d.code === dpt);
  }, [dpt]);

  const cityName = useMemo(() => {
    if (!ville) return undefined;
    return ville
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
      .replace(/ D\s/g, " d'")
      .replace(/ L\s/g, " l'")
      .replace(/ S\s/g, ' s');
  }, [ville]);

  const title = useMemo(() => {
    if (sport && cityName) return `${getDisciplineDisplayName(sport)} à ${cityName}`;
    if (sport && departmentData) return `${getDisciplineDisplayName(sport)} en ${departmentData.name}`;
    if (sport && regionData) return `${getDisciplineDisplayName(sport)} en ${regionData.name}`;
    if (cityName) return `Clubs à ${cityName}`;
    if (departmentData) return `Clubs en ${departmentData.name}`;
    if (regionData) return `Clubs en ${regionData.name}`;
    return 'Clubs par zone';
  }, [sport, cityName, departmentData, regionData]);

  useEffect(() => {
    document.title = `${title} - Athlace`;
  }, [title]);

  const params = useMemo(() => {
    const base: Record<string, string> = { limit: '100' };
    if (sport && sport !== 'all') base.discipline = getDisciplineDisplayName(sport) || sport;
    if (regionData) base.region = regionData.name;
    if (departmentData) base.department = departmentData.code;
    if (cityName) base.city = cityName;
    base.offset = String(page * 100);
    return base;
  }, [sport, regionData, departmentData, cityName, page]);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['geo-hub', params],
    queryFn: () => fetchEnrichedClubs(params),
    staleTime: 5 * 60 * 1000,
  });

  // Sub-zones and sports for navigation
  const subZones = useMemo(() => {
    const counts = new Map<string, { label: string; slug: string; count: number }>();
    clubs.forEach((c) => {
      if (!regionData) return;
      if (departmentData) {
        if (!c.city) return;
        const key = slugify(cityName ? c.city : c.city);
        const existing = counts.get(key);
        if (existing) existing.count += 1;
        else counts.set(key, { label: c.city, slug: slugify(cityName ? c.city : c.city), count: 1 });
      } else {
        if (!c.postalCode) return;
        const dptCode = c.postalCode.slice(0, 2);
        const dep = findDepartmentByCode(dptCode);
        if (!dep) return;
        const key = dep.code;
        const existing = counts.get(key);
        if (existing) existing.count += 1;
        else counts.set(key, { label: dep.name, slug: slugify(dep.name), count: 1 });
      }
    });
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [clubs, regionData, departmentData, cityName]);

  const sports = useMemo(() => {
    const counts = new Map<string, { label: string; slug: string; count: number }>();
    clubs.forEach((c) => {
      if (!c.discipline) return;
      const key = slugify(c.discipline);
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { label: c.discipline, slug: slugify(c.discipline), count: 1 });
    });
    return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 30);
  }, [clubs]);

  const buildSubZoneLink = (slug: string) => {
    if (region && !dpt) return `/clubs/${region}/${slug}/`;
    if (region && dpt && !ville) return `/clubs/${region}/${dpt}/${slug}/`;
    return `/clubs/${region}/${dpt}/${ville}/${slug}/`;
  };

  const buildSportLink = (slug: string) => {
    if (region && dpt && ville) return `/clubs/${region}/${dpt}/${ville}/${slug}/`;
    if (region && dpt) return `/clubs/${region}/${dpt}/${slug}/`;
    if (region) return `/clubs/${region}/${slug}/`;
    return `/clubs/${slug}/`;
  };

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/clubs/" className="hover:text-primary">Clubs</Link>
            {region && <span>/</span>}
            {region && <Link to={`/clubs/${region}/`} className="hover:text-primary">{regionData?.name || region}</Link>}
            {dpt && <span>/</span>}
            {dpt && <Link to={`/clubs/${region}/${dpt}/`} className="hover:text-primary">{departmentData?.name || dpt}</Link>}
            {ville && <span>/</span>}
            {ville && <span className="text-foreground">{cityName}</span>}
            {sport && <span>/</span>}
            {sport && <span className="text-foreground">{getDisciplineDisplayName(sport)}</span>}
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLoading ? 'Chargement…' : `${clubs.length} club${clubs.length > 1 ? 's' : ''} trouvé${clubs.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Chargement des clubs...
              </div>
            )}

            {!isLoading && clubs.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/30">
                <p className="text-muted-foreground">
                  Aucun club ne correspond à cette zone.
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/clubs/">Retour à la recherche</Link>
                </Button>
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
                        {club.address || club.city || 'Adresse non précisée'}
                      </div>
                      {club.discipline && (
                        <div className="mt-3 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            {club.discipline}
                          </span>
                        </div>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {clubs.length > 0 && (
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  asChild={page > 0}
                >
                  {page > 0 ? (
                    <Link to={`?page=${page - 1}`}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
                    </Link>
                  ) : (
                    <span><ArrowLeft className="w-4 h-4 mr-2" /> Précédent</span>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">Page {page + 1}</span>
                <Button
                  variant="outline"
                  disabled={clubs.length < 100}
                  asChild={clubs.length >= 100}
                >
                  {clubs.length >= 100 ? (
                    <Link to={`?page=${page + 1}`}>
                      Suivant <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Link>
                  ) : (
                    <span>Suivant <ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></span>
                  )}
                </Button>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {subZones.length > 0 && (

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold mb-3">
                    {departmentData ? 'Quartiers / villes proches' : 'Départements'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subZones.map((z) => (
                      <Button
                        key={z.slug}
                        variant="secondary"
                        size="sm"
                        asChild
                      >
                        <Link to={buildSubZoneLink(z.slug)}>
                          {z.label} ({z.count})
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sports.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold mb-3">Sports</h3>
                  <div className="flex flex-wrap gap-2">
                    {sports.map((s) => (
                      <Button
                        key={s.slug}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={buildSportLink(s.slug)}>
                          {s.label} ({s.count})
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </Layout>
  );
}
