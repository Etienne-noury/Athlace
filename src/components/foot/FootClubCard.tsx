import { Link } from 'react-router-dom';
import { MapPin, Star, Phone, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FootClub } from '@/lib/api/foot';

interface Props {
  club: FootClub;
}

export function FootClubCard({ club }: Props) {
  return (
    <article className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground truncate">
            {club.nom}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {club.code_postal} {club.ville}
            </span>
          </div>
        </div>
        {club.niveau_ligue && (
          <Badge variant="secondary" className="flex-shrink-0">
            {club.niveau_ligue}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {club.google_rating != null && (
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-lime-500 text-lime-500" />
            <span className="font-semibold text-foreground">{club.google_rating.toFixed(1)}</span>
            {club.google_nb_avis != null && (
              <span className="text-muted-foreground">({club.google_nb_avis})</span>
            )}
          </span>
        )}
        {(club.prix_adulte != null || club.prix_enfant != null) && (
          <span className="text-muted-foreground">
            💶{' '}
            {club.prix_adulte != null && <span>Adulte {club.prix_adulte}€</span>}
            {club.prix_adulte != null && club.prix_enfant != null && ' · '}
            {club.prix_enfant != null && <span>Enfant {club.prix_enfant}€</span>}
          </span>
        )}
        {club.telephone && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Phone className="w-4 h-4" />
            {club.telephone}
          </span>
        )}
        {club.site_web && (
          <a
            href={club.site_web}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <Globe className="w-4 h-4" />
            Site web
          </a>
        )}
      </div>

      <div className="pt-2 mt-auto">
        <Link to={`/football/club/${encodeURIComponent(club.data_es_id)}`}>
          <Button variant="outline" size="sm" className="w-full">
            Voir la fiche
          </Button>
        </Link>
      </div>
    </article>
  );
}
