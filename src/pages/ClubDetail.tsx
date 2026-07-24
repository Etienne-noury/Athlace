import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Phone, Mail, Globe, Star, Clock,
  ChevronLeft, Heart, Share2, Navigation, CreditCard, Check, Loader2,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleMiniMap } from '@/components/foot/GoogleMiniMap';
import { useToast } from '@/hooks/use-toast';
import { levels } from '@/data/clubs';
import { fetchEnrichedClubById } from '@/lib/api/enriched-clubs';
import { getDisciplineById } from '@/data/disciplines';
import { cn } from '@/lib/utils';

export default function ClubDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { data: club, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: () => fetchEnrichedClubById(id || ''),
    enabled: !!id,
  });
  const discipline = club ? getDisciplineById(club.discipline) : null;

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
          <Link to="/recherche">
            <Button>Retour à la recherche</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0 h-64 lg:h-80 bg-gradient-to-br from-primary/90 to-primary" />
        
        <div className="relative container mx-auto px-4 pt-8">
          {/* Back button */}
          <Link to="/recherche" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ChevronLeft className="w-5 h-5" />
            Retour aux résultats
          </Link>

          {/* Club header */}
          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl lg:text-6xl">{discipline?.icon || '🏆'}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <Badge className={cn("text-white border-0", levels[club.level].color)}>
                    {levels[club.level].name}
                  </Badge>
                  <Badge variant="secondary">{club.disciplineName}</Badge>
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {club.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{club.city}, {club.region}</span>
                  </div>
                  {club.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold text-foreground">{club.rating}</span>
                      <span>({club.reviewCount} avis)</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => toast({ title: 'Bientôt disponible' })}
                  >
                    <CreditCard className="w-5 h-5" />
                    S'inscrire en ligne
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => toast({ title: 'Bientôt disponible' })}
                  >
                    <Heart className="w-5 h-5" />
                    Favoris
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => toast({ title: 'Bientôt disponible' })}
                  >
                    <Share2 className="w-5 h-5" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Price card */}
              {club.licensePrice.adult > 0 ? (
                <div className="lg:w-64 bg-muted/50 rounded-xl p-5 flex-shrink-0">
                  <h3 className="font-semibold text-foreground mb-4">Tarifs licences</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Adulte</span>
                      <span className="font-bold text-xl text-foreground">{club.licensePrice.adult}€</span>
                    </div>
                    {club.licensePrice.child > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Enfant</span>
                        <span className="font-bold text-xl text-foreground">{club.licensePrice.child}€</span>
                      </div>
                    )}
                    {club.licensePrice.senior && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Senior</span>
                        <span className="font-bold text-xl text-foreground">{club.licensePrice.senior}€</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Par saison sportive</p>
                </div>
              ) : (
                <div className="lg:w-64 bg-muted/50 rounded-xl p-5 flex-shrink-0 text-sm text-muted-foreground">
                  Tarifs licence non communiqués.
                  <br />Contactez directement la structure.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="schedule">Horaires</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Description */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {club.description || "Aucune description disponible"}
                  </p>

                </div>

                {/* Amenities */}
                {club.amenities && club.amenities.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                      Équipements
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {club.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          <Check className="w-3 h-3" />
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Horaires d'entraînement
                  </h2>
                  {club.schedule && club.schedule.length > 0 ? (
                    <ul className="space-y-3">
                      {club.schedule.map((s, index) => (
                        <li key={index} className="flex items-center gap-3 text-foreground">
                          <Clock className="w-5 h-5 text-primary" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Contactez le club pour connaître les horaires.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">{club.rating}</div>
                      <div className="flex items-center gap-1 justify-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(club.rating) 
                                ? "fill-warning text-warning" 
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {club.reviewCount} avis
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-center">
                    Connectez-vous pour lire et laisser des avis.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Contact
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground">{club.address}</p>
                    <p className="text-foreground">{club.postalCode} {club.city}</p>
                  </div>
                </div>
                {club.phone && (
                  <a href={`tel:${club.phone}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                    {club.phone}
                  </a>
                )}
                {club.email && (
                  <a href={`mailto:${club.email}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                    {club.email}
                  </a>
                )}
                {club.website && (
                  <a href={club.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Globe className="w-5 h-5 text-primary" />
                    Site web
                  </a>
                )}
              </div>

              <Button
                className="w-full mt-6 gap-2"
                onClick={() => {
                  const { lat, lng } = club.coordinates;
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
              >
                <Navigation className="w-4 h-4" />
                Itinéraire
              </Button>
            </div>

            {/* Mini-carte du club */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <GoogleMiniMap
                lat={club.coordinates.lat || null}
                lng={club.coordinates.lng || null}
                address={`${club.address}, ${club.postalCode} ${club.city}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
