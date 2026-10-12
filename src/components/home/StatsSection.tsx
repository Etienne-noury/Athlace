import { MapPin, Trophy, Map, Activity } from 'lucide-react';
import { useSiteStats } from '@/hooks/useSiteStats';
import { useAvailableDisciplines } from '@/hooks/useAvailableDisciplines';
import { formatCount, formatExact } from '@/lib/format-stats';

export function StatsSection() {
  const { stats, isReady } = useSiteStats();
  const { availableSportCount, isReady: sportsReady } = useAvailableDisciplines();

  const items = [
    {
      icon: MapPin,
      value: isReady ? formatCount(stats.clubs) : null,
      label: 'Clubs référencés',
      description: 'Données publiques officielles',
    },
    {
      icon: Trophy,
      value: isReady ? `${formatExact(stats.federations_covered)} / ${formatExact(stats.federations_total)}` : null,
      label: 'Fédérations couvertes',
      description: 'Fédérations françaises agréées',
    },
    {
      icon: Map,
      value: isReady ? formatExact(stats.cities) : null,
      label: 'Villes couvertes',
      description: 'Métropole et Outre-mer',
    },
    {
      icon: Activity,
      value: sportsReady ? formatExact(availableSportCount) : null,
      label: 'Sports disponibles',
      description: 'Et d\'autres chaque mois',
    },
  ];

  const lastUpdate = stats.last_update
    ? new Date(stats.last_update).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <section className="py-16 lg:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {items.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-background mb-4">
                <stat.icon className="w-7 h-7 text-background" />
              </div>
              <div className="font-display text-2xl lg:text-4xl font-bold mb-1">
                {stat.value === null ? (
                  <span className="inline-block h-8 w-24 rounded bg-background animate-pulse align-middle" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="font-medium text-background mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-background">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-background">
          Source : annuaires officiels des fédérations agréées
          {lastUpdate && ` · mis à jour le ${lastUpdate}`}
        </p>
      </div>
    </section>
  );
}
