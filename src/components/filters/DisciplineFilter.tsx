import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ARBORESCENCE,
  getDisciplineById,
  getSubDisciplines,
  slugifyDiscipline,
} from '@/data/disciplines';

interface DisciplineFilterProps {
  sport: string;
  sub: string;
  onSportChange: (value: string) => void;
  onSubChange: (value: string) => void;
  /** Affiche les libellés au-dessus des champs */
  showLabels?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  layout?: 'stacked' | 'inline';
}

export function DisciplineFilter({
  sport,
  sub,
  onSportChange,
  onSubChange,
  showLabels = true,
  className,
  triggerClassName,
  contentClassName,
  layout = 'stacked',
}: DisciplineFilterProps) {
  const [sportOpen, setSportOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const selectedSport = sport !== 'all' ? getDisciplineById(sport) : undefined;
  const subs = selectedSport ? getSubDisciplines(selectedSport.id) : [];
  const selectedSub = sub !== 'all' ? getDisciplineById(sub) : undefined;

  const selectSport = (value: string) => {
    onSportChange(value);
    onSubChange('all');
    setSportOpen(false);
  };

  return (
    <div
      className={cn(
        layout === 'inline' ? 'flex flex-wrap items-end gap-3' : 'space-y-4',
        className,
      )}
    >
      <div className="min-w-0">
        {showLabels && (
          <label className="text-sm font-medium text-foreground mb-2 block">Sport</label>
        )}
        <Popover open={sportOpen} onOpenChange={setSportOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={sportOpen}
              aria-label="Choisir un sport"
              className={cn('justify-between font-normal bg-background', triggerClassName)}
            >
              <span className="truncate">
                {selectedSport ? `${selectedSport.icon} ${selectedSport.name}` : 'Tous les sports'}
              </span>
              <span className="flex items-center gap-1 shrink-0">
                {selectedSport && (
                  <X
                    className="h-4 w-4 opacity-60 hover:opacity-100"
                    role="button"
                    aria-label="Effacer le sport"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      selectSport('all');
                    }}
                  />
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className={cn('w-[min(22rem,calc(100vw-2rem))] p-0 bg-popover', contentClassName)}
          >
            <Command>
              <CommandInput placeholder="Rechercher un sport…" />
              <CommandList className="max-h-[60dvh]">
                <CommandEmpty>Aucun sport trouvé.</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="Tous les sports" onSelect={() => selectSport('all')}>
                    <Check
                      className={cn('mr-2 h-4 w-4', sport === 'all' ? 'opacity-100' : 'opacity-0')}
                    />
                    Tous les sports
                  </CommandItem>
                </CommandGroup>
                {ARBORESCENCE.map((cat) => (
                  <CommandGroup key={cat.id} heading={`${cat.icon} ${cat.name}`}>
                    {cat.sports.map((s) => {
                      const sportId = slugifyDiscipline(s.name);
                      return (
                        <CommandItem
                          key={sportId}
                          value={`${s.name} ${cat.name}`}
                          onSelect={() => selectSport(sportId)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              sport === sportId ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span className="mr-2">{s.icon}</span>
                          {s.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {subs.length > 0 && (
        <div className="min-w-0">
          {showLabels && (
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sous-discipline
            </label>
          )}
          <Popover open={subOpen} onOpenChange={setSubOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={subOpen}
                aria-label="Choisir une sous-discipline"
                className={cn('justify-between font-normal bg-background', triggerClassName)}
              >
                <span className="truncate">
                  {selectedSub ? selectedSub.name : 'Toutes les sous-disciplines'}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className={cn('w-[min(22rem,calc(100vw-2rem))] p-0 bg-popover', contentClassName)}
            >
              <Command>
                <CommandInput placeholder="Rechercher une sous-discipline…" />
                <CommandList className="max-h-[60dvh]">
                  <CommandEmpty>Aucune sous-discipline trouvée.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="Toutes les sous-disciplines"
                      onSelect={() => {
                        onSubChange('all');
                        setSubOpen(false);
                      }}
                    >
                      <Check
                        className={cn('mr-2 h-4 w-4', sub === 'all' ? 'opacity-100' : 'opacity-0')}
                      />
                      Toutes les sous-disciplines
                    </CommandItem>
                    {subs.map((d) => (
                      <CommandItem
                        key={d.id}
                        value={d.name}
                        onSelect={() => {
                          onSubChange(d.id);
                          setSubOpen(false);
                        }}
                      >
                        <Check
                          className={cn('mr-2 h-4 w-4', sub === d.id ? 'opacity-100' : 'opacity-0')}
                        />
                        {d.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
