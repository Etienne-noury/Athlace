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
  slugifyDiscipline,
} from '@/data/disciplines';
import { useAvailableDisciplines, formatClubCount } from '@/hooks/useAvailableDisciplines';

interface DisciplineFilterProps {
  sport: string;
  sub: string;
  onSportChange: (value: string) => void;
  onSubChange: (value: string) => void;
  /** Affiche les libellés au-dessus des champs */
  showLabels?: boolean;
  /** Affiche le menu sous-discipline (désactivé dans le hero) */
  showSub?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  layout?: 'stacked' | 'inline';
}

// Sur téléphone, ne pas ouvrir le clavier à l'ouverture de la liste : il masque les options.
const preventKeyboardOnTouch = (event: Event) => {
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    event.preventDefault();
  }
};

export function DisciplineFilter({
  sport,
  sub,
  onSportChange,
  onSubChange,
  showLabels = true,
  showSub = true,
  className,
  triggerClassName,
  contentClassName,
  layout = 'stacked',
}: DisciplineFilterProps) {
  const [sportOpen, setSportOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const selectedSport = sport !== 'all' ? getDisciplineById(sport) : undefined;
  const avail = useAvailableDisciplines();
  const subs = selectedSport
    ? avail.getSport(selectedSport.id).subList.map(({ name }) => ({
        id: `${selectedSport.id}--${slugifyDiscipline(name)}`,
        name,
      }))
    : [];
  const selectedSub = sub !== 'all' ? getDisciplineById(sub, avail.sports) : undefined;

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
      <div className={cn('min-w-0', layout === 'inline' && 'w-full lg:w-auto')}>
        {showLabels && (
          <label className="text-sm font-bold text-foreground mb-2 block">Sport</label>
        )}
        <Popover open={sportOpen} onOpenChange={setSportOpen} modal>
          <div className="relative">
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={sportOpen}
                aria-label="Choisir un sport"
                className={cn('w-full justify-between font-light bg-background', selectedSport && 'pr-16', triggerClassName)}
              >
                <span className="truncate">
                  {selectedSport ? `${selectedSport.icon} ${selectedSport.name}` : 'Tous les sports'}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            {selectedSport && (
              <button
                type="button"
                aria-label="Effacer le sport"
                onClick={() => selectSport('all')}
                className="absolute right-8 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-pill text-foreground/60 hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <PopoverContent
            align="start"
            className={cn('w-[min(22rem,calc(100vw-2rem))] p-0 bg-popover', contentClassName)}
            onOpenAutoFocus={preventKeyboardOnTouch}
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
                      const ok = avail.isSportAvailable(sportId);
                      return (
                        <CommandItem
                          key={sportId}
                          value={`${s.name} ${cat.name}`}
                          disabled={!ok}
                          aria-disabled={!ok}
                          className={cn(!ok && 'opacity-50')}
                          onSelect={() => ok && selectSport(sportId)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              sport === sportId ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span className="mr-2">{s.icon}</span>
                          <span className="flex-1 truncate">{s.name}</span>
                          {avail.isReady && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {ok ? formatClubCount(avail.sportCount(sportId)) : 'Bientôt'}
                            </span>
                          )}
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

      {showSub && subs.length > 0 && (
        <div className="min-w-0">
          {showLabels && (
            <label className="text-sm font-bold text-foreground mb-2 block">
              Sous-discipline
            </label>
          )}
          <Popover open={subOpen} onOpenChange={setSubOpen} modal>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={subOpen}
                aria-label="Choisir une sous-discipline"
                className={cn('w-full justify-between font-light bg-background', triggerClassName)}
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
            onOpenAutoFocus={preventKeyboardOnTouch}
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
