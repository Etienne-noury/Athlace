import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';
import { useFederationDirectory } from '@/hooks/useFederationDirectory';
import { findFederationBySlug, findSportForSigle, getFederationStats, federationClubUrl } from '@/lib/federation-directory';
import { slugifyDiscipline } from '@/data/disciplines';
import { safeExternalUrl } from '@/lib/safe-url';
import NotFound from '@/pages/NotFound';

export default function FederationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const directory = useFederationDirectory();
  if (directory.isLoading) return <Layout><div role="status" className="container mx-auto px-4 py-16 flex items-center gap-3"><Loader2 className="h-6 w-6 animate-spin" />Chargement de la fédération…</div></Layout>;
  if (directory.isError) return <Layout><div role="alert" className="container mx-auto px-4 py-16 space-y-4"><p>La fédération ne peut pas être chargée pour le moment.</p><Button variant="outline" onClick={directory.retry}>Réessayer</Button></div></Layout>;
  const federation = findFederationBySlug(directory.federations, slug);
  if (!federation) return <NotFound />;
  const match = findSportForSigle(federation.sigle);
  const { count, disciplines } = getFederationStats(federation.sigle, directory.stats);
  const officialUrl = safeExternalUrl(federation.site_web);
  const sportId = match ? slugifyDiscipline(match.sport.name) : '';

  return <Layout>
    <PageTitle title={`${federation.sigle} - ${federation.nom}`} description={`Découvrez ${federation.nom} et ses clubs sur Athlace.`} />
    <section className="bg-muted border-b border-border py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Accueil</Link><span aria-hidden="true">&gt;</span>
          <Link to="/federations/" className="hover:text-primary">Fédérations</Link><span aria-hidden="true">&gt;</span>
          <span aria-current="page" className="text-foreground">{federation.sigle}</span>
        </nav>
        <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-3">{federation.sigle}</h1>
        <p className="text-xl font-bold mb-2">{federation.nom}</p>
        <p className="text-muted-foreground text-lg">{match?.category.icon} {match?.category.name ?? 'À classer'}</p>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {count > 0 && sportId ? <Button asChild className="gap-2"><Link to={federationClubUrl(sportId)}>Voir les clubs<ArrowRight className="h-4 w-4" /></Link></Button>
            : <><Button disabled>Voir les clubs</Button><SoonBadge /></>}
          <span className="text-sm text-muted-foreground">{count > 0 ? `${count.toLocaleString('fr-FR')} club${count > 1 ? 's' : ''} sur Athlace` : 'Clubs bientôt disponibles'}</span>
        </div>
      </div>
    </section>
    <div className="container mx-auto px-4 py-12 space-y-12">
      {disciplines.length > 0 && <section>
        <h2 className="text-2xl font-black mb-6">Disciplines</h2>
        <div className="flex flex-wrap gap-3">{disciplines.map((sub) => <Button key={sub.id} asChild variant="outline" size="sm"><Link to={federationClubUrl(sub.sportId, sub.id)}>{sub.name}</Link></Button>)}</div>
      </section>}
      <section className="border-t border-border pt-8">
        <div className="flex flex-wrap items-center gap-3 mb-3"><h2 className="text-2xl font-black">Événements de la fédération</h2><SoonBadge /></div>
        <p className="text-muted-foreground">Bientôt disponible</p>
      </section>
      {officialUrl && <Button asChild variant="outline" className="gap-2"><a href={officialUrl} target="_blank" rel="noopener noreferrer">Site officiel de la fédération<ExternalLink className="h-4 w-4 shrink-0" /></a></Button>}
    </div>
  </Layout>;
}