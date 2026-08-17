import { MapPin, Trophy, Map, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function formatClubs(count: number): string {
  if (count < 100) return `${count}`;
  const rounded = Math.floor(count / 100) * 100;
  return `${rounded.toLocaleString('fr-FR')}+`;
}

export function StatsSection() {
  const { data: clubsCount, isLoading: loadingClubs } = useQuery({
    queryKey: ['stats-clubs-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('clubs_enriched')
        .select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: fedsCount, isLoading: loadingFeds } = useQuery({
    queryKey: ['stats-federations-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('federations_sportives')
        .select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const stats = [
    {
      icon: MapPin,
      value: loadingClubs ? null : formatClubs(clubsCount ?? 0),
      label: 'Clubs référencés',
      description: 'Données publiques officielles',
    },
    {
      icon: Trophy,
      value: loadingFeds ? null : `${fedsCount ?? 0}`,
      label: 'Fédérations sportives',
      description: 'Fédérations françaises agréées',
    },
    {
      icon: Map,
      value: 'France entière',
      label: 'Couverture',
      description: 'Métropole et Outre-mer',
    },
    {
      icon: Database,
      value: '100%',
      label: 'Données ouvertes',
      description: 'Open data gouvernemental',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-background/10 mb-4">
                <stat.icon className="w-7 h-7 text-background" />
              </div>
              <div className="font-display text-2xl lg:text-4xl font-bold mb-1">
                {stat.value === null ? (
                  <span className="inline-block h-8 w-24 rounded bg-background/10 animate-pulse align-middle" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="font-medium text-background/90 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-background/60">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
