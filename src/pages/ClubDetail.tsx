import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Phone, Globe, Star, Clock,
  ChevronLeft, CreditCard, Loader2, Info, Calendar, Trophy,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClubMiniMap } from '@/components/foot/ClubMiniMap';
import { levels } from '@/data/clubs';
import { fetchEnrichedClubById } from '@/lib/api/enriched-clubs';
import { getDisciplineById } from '@/data/disciplines';
import { cn } from '@/lib/utils';
import type { Club } from '@/data/clubs';

interface ClubWithDate extends Club {
  dateCreation?: string | null;
}

function formatDateCreation(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function ComingSoonSection({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 opacity-60">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-display text-lg font-semibold text-muted-foreground">
          {title}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">Disponible prochainement</p>
    </div>
  );
}

export default function ClubDetail() {
  const { id } = useParams();
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
          <Link to="/clubs/">
            <Button>Retour à la recherche</Button>
          </Link>

        </div>
      </Layout>
    );
  }

  const clubWithDate = club as ClubWithDate;
  const dateCreation = formatDateCreation(clubWithDate.dateCreation);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 h-64 lg:h-80 bg-gradient-to-br from-primary/90 to-primary" />

        <div className="relative container mx-auto px-4 pt-8">
          <Link
            to="/clubs/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux résultats
          </Link>


          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl lg:text-6xl">{discipline?.icon || '🏆'}</span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <Badge className={cn('text-white border-0', levels[club.level].color)}>
                    {levels[club.level].name}
                  </Badge>
                  <Badge variant="secondary">{club.disciplineName}</Badge>
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {club.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{club.city}, {club.region}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Localisation */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                Localisation
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {club.address}, {club.postalCode} {club.city}
            </p>
            <ClubMiniMap
              lat={club.coordinates.lat || null}
              lng={club.coordinates.lng || null}
              address={`${club.address}, ${club.postalCode} ${club.city}`}
            />
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                Description
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {club.description || 'Aucune description disponible'}
            </p>
          </div>

          {/* Date de création */}
          {dateCreation && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Date de création
                </h2>
              </div>
              <p className="text-muted-foreground">{dateCreation}</p>
            </div>
          )}

          {/* Site web */}
          {club.website && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Site web
                </h2>
              </div>
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {club.website}
              </a>
            </div>
          )}

          {/* À venir */}
          <ComingSoonSection icon={CreditCard} title="Prix" />
          <ComingSoonSection icon={Star} title="Avis" />
          <ComingSoonSection icon={Trophy} title="Niveau" />
          <ComingSoonSection icon={Phone} title="Contact" />
          <ComingSoonSection icon={Clock} title="Horaires" />
        </div>
      </div>
    </Layout>
  );
}
