import { cn } from '@/lib/utils';

interface SoonBadgeProps {
  className?: string;
  label?: string;
}

/** Pill discrète signalant une fonctionnalité non encore disponible. */
export function SoonBadge({ className, label = 'Bientôt' }: SoonBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border border-border bg-surface-alt px-2 py-0.5 text-[11px] font-medium leading-none text-muted-foreground',
        className,
      )}
    >
      {label}
    </span>
  );
}
