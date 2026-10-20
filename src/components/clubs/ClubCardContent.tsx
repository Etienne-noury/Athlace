import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EnrichedClub } from '@/lib/api/enriched-clubs';

/** Visuel d'une carte club : logo réel s'il existe, sinon icône du sport. */
export function ClubCardVisual({ club, className, children }: { club: EnrichedClub; className?: string; children?: React.ReactNode }) {
  const [broken, setBroken] = useState(false);
  const logo = club.logoUrl && !broken ? club.logoUrl : null;
  return (
    <div className={cn('relative', logo ? 'bg-card' : 'bg-tint-100', className)}>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {logo ? (
          <img src={logo} onError={() => setBroken(true)} alt={`Logo de ${club.name}`} loading="lazy" className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-5xl opacity-50" aria-hidden>{club.icon}</span>
        )}
      </div>
      {children}
    </div>
  );
}

/** Texte d'une carte club : sport + fédération, nom, ville + département, badges réels. */
export function ClubCardBody({ club }: { club: EnrichedClub }) {
  const place = [club.city, club.departmentCode ? `(${club.departmentCode})` : null].filter(Boolean).join(' ');
  return (
    <>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <p className="text-sm text-primary font-bold">{club.disciplineName}</p>
        {club.federationCode && (
          <Badge variant="outline" className="text-micro px-1.5 py-0">{club.federationCode}</Badge>
        )}
      </div>
      <h3 className="font-sans font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {club.name}
      </h3>
      {place && (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{place}</span>
        </div>
      )}
      {club.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {club.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs font-light">{t}</Badge>
          ))}
        </div>
      )}
    </>
  );
}
