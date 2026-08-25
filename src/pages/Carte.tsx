import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { FranceMap } from '@/components/map/FranceMap';
import { regions } from '@/data/clubs';

export default function Carte() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <Layout>
      {/* Header */}
      <section className="bg-sport-gradient text-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-2xl lg:text-4xl font-bold mb-2">
            Carte des clubs sportifs
          </h1>
          <p className="text-white/80 text-lg">
            Visualisez et trouvez tous les clubs de France
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-card border-b border-border sticky top-0 z-[1001]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtres :</span>
            </div>

            <DisciplineFilter
              sport={selectedDiscipline}
              sub={selectedSub}
              onSportChange={setSelectedDiscipline}
              onSubChange={setSelectedSub}
              showLabels={false}
              layout="inline"
              triggerClassName="w-[220px]"
              contentClassName="bg-card z-[2000]"
            />

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent className="bg-card z-[2000]">
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-220px)]">
        <FranceMap
          height="100%"
          selectedDiscipline={selectedDiscipline}
          selectedSub={selectedSub}
          selectedRegion={selectedRegion}
          maxClubs={100}
        />
      </div>
    </Layout>
  );
}
