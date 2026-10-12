/** Formatage cohérent des compteurs affichés sur le site. */
function safe(count: unknown): number {
  const n = Number(count);
  return Number.isFinite(n) ? n : 0;
}

export function formatCount(count: number | null | undefined): string {
  const n = safe(count);
  if (n < 1000) return n.toLocaleString('fr-FR');
  const rounded = Math.floor(n / 100) * 100;
  return `${rounded.toLocaleString('fr-FR')}+`;
}

export function formatExact(count: number | null | undefined): string {
  return safe(count).toLocaleString('fr-FR');
}
