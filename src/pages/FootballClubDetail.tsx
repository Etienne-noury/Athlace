import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft, MapPin, Star, Phone, Globe, Clock, CreditCard,
  Loader2,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClubMiniMap } from '@/components/foot/ClubMiniMap';
import { fetchFootClubById, fetchGooglePlaces } from '@/lib/api/foot';

export default function FootballClubDetail() {
  const { id } = useParams<{ id: string }>();
  const dataEsId = decodeURIComponent(id ?? '');

  const { data: club, isLoading } = useQuery({
    queryKey: ['foot-club', dataEsId],
    queryFn: () => fetchFootClubById(dataEsId),
    enabled: !!dataEsId,
  });


  const { data: google } = useQuery({
    queryKey: ['foot-google', dataEsId, club?.nom, club?.ville],
    queryFn: () => fetchGooglePlaces(club!.nom, club!.ville),
    enabled: !!club,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

  if (!club) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Club non trouvé</h1>
          <Link to="/football"><Button>Retour à l'annuaire</Button></Link>
        </div>
      </Layout>
    );
  }

  // Source 2 priorité, sinon fallback Source 3 (Google)
  const rating = club.google_rating ?? google?.rating ?? null;
  const nbAvis = club.google_nb_avis ?? google?.user_ratings_total ?? null;
  const telephone = club.telephone ?? google?.formatted_phone_number ?? null;
  const siteWeb = club.site_web ?? google?.website ?? null;
  const horairesArr: string[] | null =
    Array.isArray(club.horaires)
      ? (club.horaires as string[])
      : google?.opening_hours ?? null;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/90 to-primary text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/football" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-5 h-5" /> Retour à l'annuaire
          </Link>
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="font-display text-2xl lg:text-3xl font-bold">{club.nom}</h1>
            {club.niveau_ligue && (
              <Badge variant="secondary" className="self-center">{club.niveau_ligue}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{club.adresse}, {club.code_postal} {club.ville}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Localisation</h2>
              <ClubMiniMap
                lat={club.lat}
                lng={club.lng}
                address={`${club.adresse} ${club.code_postal} ${club.ville}`}
              />
            </div>

            {horairesArr && horairesArr.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Horaires
                </h2>
                <ul className="space-y-2 text-foreground">
                  {horairesArr.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <aside className="space-y-6">
            {rating != null && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-lg font-semibold mb-3">Avis Google</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-warning text-warning" />
                  <span className="text-3xl font-bold">{rating.toFixed(1)}</span>
                  {nbAvis != null && (
                    <span className="text-muted-foreground">/ 5 · {nbAvis} avis</span>
                  )}
                </div>
              </div>
            )}

            {(club.prix_adulte != null || club.prix_enfant != null) && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Tarifs licence
                </h2>
                <div className="space-y-2">
                  {club.prix_adulte != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adulte</span>
                      <span className="font-bold">{club.prix_adulte}€</span>
                    </div>
                  )}
                  {club.prix_enfant != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enfant</span>
                      <span className="font-bold">{club.prix_enfant}€</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-lg font-semibold mb-3">Contact</h2>
              <div className="space-y-3">
                {telephone && (
                  <a href={`tel:${telephone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Phone className="w-4 h-4 text-primary" /> {telephone}
                  </a>
                )}
                {siteWeb && (
                  <a href={siteWeb} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary break-all">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" /> {siteWeb}
                  </a>
                )}
                {!telephone && !siteWeb && (
                  <p className="text-sm text-muted-foreground">
                    Aucune information de contact disponible.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

    </Layout>
  );
}
