/** Formatage cohérent des compteurs affichés sur le site. */
export function formatCount(count: number): string {
  if (count < 1000) return count.toLocaleString('fr-FR');
  const rounded = Math.floor(count / 100) * 100;
  return `${rounded.toLocaleString('fr-FR')}+`;
}

export function formatExact(count: number): string {
  return count.toLocaleString('fr-FR');
}
