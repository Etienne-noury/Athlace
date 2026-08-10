import { MapPin, Trophy, Map, Database } from 'lucide-react';

const stats = [
  {
    icon: MapPin,
    value: '300 000+',
    label: 'Clubs référencés',
    description: 'Source : Ministère des Sports',
  },
  {
    icon: Trophy,
    value: '250+',
    label: 'Disciplines sportives',
    description: 'Référencées sur Athlace',
  },
  {
    icon: Map,
    value: '18',
    label: 'Régions couvertes',
    description: 'Partout en France',
  },
  {
    icon: Database,
    value: '100%',
    label: 'Données ouvertes',
    description: 'Open data gouvernemental',
  },
];

export function StatsSection() {
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
              <div className="font-display text-3xl lg:text-4xl font-bold mb-1">
                {stat.value}
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
