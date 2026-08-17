import { ExternalLink, MapPin } from 'lucide-react';

interface Props {
  lat: number | null;
  lng: number | null;
  address?: string;
  className?: string;
}

export function ClubMiniMap({ lat, lng, address, className = '' }: Props) {
  const hasCoords = lat != null && lng != null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hasCoords ? `${lat},${lng}` : (address ?? ''),
  )}`;

  return (
    <div className={`space-y-3 ${className}`}>
      {hasCoords ? (
        <iframe
          title="Carte de localisation du club"
          className="w-full h-48 rounded-xl border border-border"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-24 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground gap-2 px-4 text-center">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>Coordonnées GPS non disponibles pour ce club</span>
        </div>
      )}

      {(hasCoords || address) && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ExternalLink className="w-4 h-4" /> Ouvrir dans Google Maps
        </a>
      )}
    </div>
  );
}
