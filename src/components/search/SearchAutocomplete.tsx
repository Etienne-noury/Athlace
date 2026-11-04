import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Loader2, LocateFixed, MapPin, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getParentDisciplines } from '@/data/disciplines';
import { useAvailableDisciplines } from '@/hooks/useAvailableDisciplines';
import { suggestCities, normalizeText, type CityHit } from '@/lib/api/geo-search';

type Suggestion =
  | { kind: 'around' }
  | { kind: 'sport'; id: string; label: string; icon: string }
  | { kind: 'city'; city: CityHit };

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Si fourni, les sports sont proposés et leur choix appelle ce callback. */
  onPickSport?: (sportId: string) => void;
  placeholder?: string;
  inputClassName?: string;
  iconClassName?: string;
  className?: string;
  /** Active la recherche « Autour de moi » (bouton dans le champ + première suggestion). */
  onLocate?: () => void;
  /** Position en cours de détection. */
  locating?: boolean;
  /** Recherche autour de la position active : libellé affiché dans le champ (ex. « Paris 13e Arrondissement »). */
  aroundLabel?: string | null;
  aroundActive?: boolean;
  onClearAround?: () => void;
}

export function SearchAutocomplete({ value, onChange, onPickSport, placeholder, inputClassName, iconClassName, className, onLocate, locating, aroundLabel, aroundActive, onClearAround }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [cities, setCities] = useState<CityHit[]>([]);
  const avail = useAvailableDisciplines();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) { setCities([]); return; }
    const t = setTimeout(() => { suggestCities(q).then(setCities); }, 200);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const sports = useMemo(() => {
    const q = normalizeText(value);
    if (!onPickSport || q.length < 2) return [];
    return getParentDisciplines()
      .filter((d) => avail.isSportAvailable(d.id))
      .map((d) => ({ d, n: normalizeText(d.name) }))
      .filter(({ n }) => n.includes(q))
      .sort((a, b) => Number(!a.n.startsWith(q)) - Number(!b.n.startsWith(q)))
      .slice(0, 4)
      .map(({ d }) => ({ kind: 'sport' as const, id: d.id, label: d.name, icon: d.icon }));
  }, [value, onPickSport, avail]);

  const items: Suggestion[] = [
    ...(onLocate && !aroundActive && value.trim().length < 2 ? [{ kind: 'around' as const }] : []),
    ...sports,
    ...cities.map((city) => ({ kind: 'city' as const, city })),
  ];
  const show = open && items.length > 0;

  const pick = (s: Suggestion) => {
    if (s.kind === 'around') onLocate?.();
    else if (s.kind === 'sport') { onPickSport?.(s.id); onChange(''); }
    else onChange(s.city.name);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!show) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(items[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <Search className={cn('absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground', iconClassName)} />
      <Input
        type="text"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={aroundActive ? `Autour de moi${aroundLabel ? ` · ${aroundLabel}` : ''}` : placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(inputClassName, onLocate && 'pr-12', aroundActive && 'placeholder:text-primary placeholder:font-bold')}
      />
      {onLocate && (
        aroundActive ? (
          <button type="button" onClick={onClearAround} aria-label="Ne plus chercher autour de moi"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-pill text-foreground/60 hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={() => { setOpen(false); onLocate(); }} aria-label="Autour de moi" title="Autour de moi"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-pill text-primary hover:bg-muted">
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          </button>
        )
      )}
      {show && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-[2100] rounded-xl border border-border bg-popover text-popover-foreground shadow-md py-1 text-left max-h-80 overflow-auto"
        >
          {items.map((s, i) => (
            <li
              key={s.kind === 'around' ? 'around' : s.kind === 'sport' ? `s-${s.id}` : `c-${s.city.postcode}-${s.city.name}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setActive(i)}
              className={cn('flex items-center gap-3 px-4 py-2 cursor-pointer text-sm', i === active && 'bg-muted')}
            >
              {s.kind === 'around' ? (
                <>
                  <LocateFixed className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block font-bold text-primary">Autour de moi</span>
                    <span className="block text-xs text-muted-foreground">Utiliser ma position</span>
                  </span>
                </>
              ) : s.kind === 'sport' ? (
                <>
                  <span aria-hidden className="text-lg">{s.icon}</span>
                  <span className="font-bold text-foreground">{s.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Sport</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">{s.city.name}</span>
                  <span className="text-xs text-muted-foreground">{s.city.postcode}</span>
                  <span className="ml-auto text-xs text-muted-foreground truncate">{s.city.context.split(',').slice(1).join(',').trim()}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
