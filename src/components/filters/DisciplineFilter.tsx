import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ARBORESCENCE, getSubDisciplines, slugifyDiscipline } from '@/data/disciplines';

interface DisciplineFilterProps {
  sport: string;
  sub: string;
  onSportChange: (value: string) => void;
  onSubChange: (value: string) => void;
  /** Affiche les libellés au-dessus des selects */
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
  const subs = sport !== 'all' ? getSubDisciplines(sport) : [];

  return (
    <div
      className={[
        layout === 'inline' ? 'flex flex-wrap items-center gap-3' : 'space-y-4',
        className ?? '',
      ].join(' ')}
    >
      <div className={layout === 'inline' ? '' : undefined}>
        {showLabels && (
          <label className="text-sm font-medium text-foreground mb-2 block">Sport</label>
        )}
        <Select
          value={sport}
          onValueChange={(value) => {
            onSportChange(value);
            onSubChange('all');
          }}
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="Tous les sports" />
          </SelectTrigger>
          <SelectContent className={contentClassName}>
            <SelectItem value="all">Tous les sports</SelectItem>
            {ARBORESCENCE.map((cat) => (
              <SelectGroup key={cat.id}>
                <SelectLabel>
                  {cat.icon} {cat.name}
                </SelectLabel>
                {cat.sports.map((s) => {
                  const sportId = slugifyDiscipline(s.name);
                  return (
                    <SelectItem key={sportId} value={sportId}>
                      {s.icon} {s.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subs.length > 0 && (
        <div>
          {showLabels && (
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sous-discipline
            </label>
          )}
          <Select value={sub} onValueChange={onSubChange}>
            <SelectTrigger className={triggerClassName}>
              <SelectValue placeholder="Toutes les sous-disciplines" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all">Toutes les sous-disciplines</SelectItem>
              {subs.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
