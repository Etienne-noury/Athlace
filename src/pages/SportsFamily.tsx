import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SPORT_FAMILIES, getFamilyById, getSportsByFamily } from '@/lib/sports-menu';
import { ArrowRight } from 'lucide-react';

export default function SportsFamily() {
  const { familyId } = useParams<{ familyId: string }>();
  const family = useMemo(() => getFamilyById(familyId || ''), [familyId]);
  const sports = useMemo(() => (family ? getSportsByFamily(family.id) : []), [family]);

  useEffect(() => {
    if (family) document.title = `${family.name} - Athlace`;
  }, [family]);

  if (!family) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold">Famille introuvable</h1>
            <p className="text-muted-foreground mt-4">Cette famille de sports n'existe pas.</p>
            <Link to="/sports/" className="text-primary hover:underline mt-4 inline-block">
              Retour aux sports
            </Link>
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
            <span>/</span>
            <span className="text-foreground">{family.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">{family.icon}</span>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {family.name}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {sports.length} discipline{sports.length > 1 ? 's' : ''} référencée{sports.length > 1 ? 's' : ''} dans cette famille.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              to={`/sports/${sport.id}/`}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <h2 className="font-display font-semibold text-xl group-hover:text-primary transition-colors">
                {sport.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {sport.description || `Trouvez un club de ${sport.name} près de chez vous.`}
              </p>
              <span className="inline-flex items-center mt-4 text-sm font-medium text-primary">
                Voir les clubs <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
