import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Navigation, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { FranceMap } from '@/components/map/FranceMap';
import { SoonBadge } from '@/components/ui/SoonBadge';

export function InteractiveMapSection() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedSub, setSelectedSub] = useState('all');

  return (
    <section className="py-12 lg:py-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-creme text-primary text-sm font-bold mb-3">
              <Navigation className="w-4 h-4" />
              Carte interactive
            </div>
            <h2 className="font-sans text-2xl lg:text-3xl font-black text-foreground">
              Trouvez les clubs <span className="text-primary">près de chez vous</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground pb-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-bold">Filtres :</span>
            </div>

            <DisciplineFilter
              sport={selectedDiscipline}
              sub={selectedSub}
              onSportChange={setSelectedDiscipline}
              onSubChange={setSelectedSub}
              showLabels={false}
              layout="inline"
              triggerClassName="w-[220px] bg-card"
              contentClassName="z-[2000]"
            />

            <Button asChild variant="outline" className="gap-2">
              <Link to="/carte">
                Voir en plein écran
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Map */}
        <FranceMap
          height="450px"
          selectedDiscipline={selectedDiscipline}
          selectedSub={selectedSub}
        />

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: '📍', text: 'Localisation des clubs', soon: false },
            { icon: '🔍', text: 'Filtre par sport et sous-discipline', soon: false },
            { icon: '🗺️', text: 'Itinéraire GPS', soon: false },
            { icon: '⭐', text: 'Avis des membres', soon: true },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">{feature.icon}</span>
              <span>{feature.text}</span>
              {feature.soon && <SoonBadge />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
