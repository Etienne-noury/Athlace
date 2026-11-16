/**
 * Photos et schémas des fiches sport, lus directement dans le dépôt au moment du build.
 *
 * - Photos : src/assets/sport-photos/<id>/<emplacement>.<jpg|jpeg|png|webp|avif>
 *   <id> = id du sport (ex. « rugby ») ou de la discipline (ex. « rugby--competition-a-xv »).
 * - Schémas : src/assets/sport-schemas/<clé>.svg (titre et légende dans src/data/sport-schemas.ts).
 *
 * Ajouter ou remplacer un fichier suffit : aucun code à toucher. Mode d'emploi : docs/PHOTOS-ET-SCHEMAS.md
 */
import { SPORT_SCHEMA_TEXTS } from '@/data/sport-schemas';

/** Emplacements photo d'une fiche sport, dans l'ordre d'affichage. */
export const SPORT_PHOTO_SLOTS = ['principe', 'galerie-1', 'galerie-2', 'galerie-3', 'materiel'] as const;
/** Emplacements photo d'une fiche discipline. */
export const DISCIPLINE_PHOTO_SLOTS = ['principe'] as const;
export type PhotoSlot = (typeof SPORT_PHOTO_SLOTS)[number];

/** Sujet de chaque emplacement : sert de texte alternatif et de consigne de prise de vue. */
export const PHOTO_SLOT_SUBJECT: Record<PhotoSlot, string> = {
  principe: 'une situation de jeu typique',
  'galerie-1': "une séance d'entraînement",
  'galerie-2': 'un moment de compétition',
  'galerie-3': 'la vie du club',
  materiel: 'le matériel et la tenue',
};

export const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

const photoFiles = import.meta.glob('/src/assets/sport-photos/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const PHOTOS: Record<string, string> = {};
for (const [path, url] of Object.entries(photoFiles)) {
  const m = path.match(/\/sport-photos\/([^/]+)\/([^/.]+)\.[a-z]+$/i);
  if (m) PHOTOS[`${m[1]}/${m[2].toLowerCase()}`] = url;
}

/** URL de la photo déposée pour cet emplacement, ou undefined (le cadre décoratif s'affiche alors). */
export function getSportPhoto(id: string, slot: PhotoSlot): string | undefined {
  return PHOTOS[`${id}/${slot}`];
}

const schemaFiles = import.meta.glob('/src/assets/sport-schemas/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

/**
 * Les fichiers SVG gardent les vraies couleurs de la charte (lisibles dans n'importe quel éditeur).
 * À l'affichage, on les remplace par les variables CSS de src/index.css.
 */
const BRAND_COLORS: Record<string, string> = {
  '#415caf': 'hsl(var(--bleu-athlace))',
  '#0f172a': 'hsl(var(--nuit))',
  '#f2efe6': 'hsl(var(--creme))',
  '#d5de5b': 'hsl(var(--lime))',
  '#ffffff': 'hsl(var(--blanc))',
  '#fff': 'hsl(var(--blanc))',
  '#34498c': 'color-mix(in srgb, hsl(var(--bleu-athlace)) 78%, hsl(var(--nuit)))',
  '#8fa2dc': 'color-mix(in srgb, hsl(var(--bleu-athlace)) 55%, hsl(var(--blanc)))',
};
const brand = (hex: string) => BRAND_COLORS[hex.toLowerCase()];

function toBrandColors(svg: string): string {
  return svg
    .replace(/<\?xml[^>]*>|<!--[\s\S]*?-->/g, '')
    .replace(/<([a-zA-Z][\w:-]*)(\s[^<>]*?)?(\/?)>/g, (tag, name: string, attrs = '', selfClose: string) => {
      const style: string[] = [];
      let rest = attrs.replace(/\s(fill|stroke|stop-color)="(#[0-9a-fA-F]{3,6})"/g, (m: string, prop: string, hex: string) => {
        const v = brand(hex);
        if (!v) return m;
        style.push(`${prop}:${v}`);
        return '';
      });
      rest = rest.replace(/\sstyle="([^"]*)"/, (_m: string, css: string) => {
        style.unshift(css.replace(/#[0-9a-fA-F]{3,6}\b/g, (hex) => brand(hex) ?? hex).replace(/;\s*$/, ''));
        return '';
      });
      return style.length ? `<${name}${rest} style="${style.join(';')}"${selfClose}>` : tag;
    });
}

export interface SportSchema { cap: string; legend: string[]; svg: string }

const SCHEMAS: Record<string, SportSchema> = {};
for (const [path, raw] of Object.entries(schemaFiles)) {
  const key = path.split('/').pop()!.replace(/\.svg$/, '');
  const text = SPORT_SCHEMA_TEXTS[key];
  if (!text) continue;
  const svg = toBrandColors(raw).replace(/<svg\b/, `<svg role="img" aria-label="${text.cap.replace(/"/g, '&quot;')}"`);
  SCHEMAS[key] = { ...text, svg };
}

export function getSportSchema(key: string | null): SportSchema | undefined {
  return key ? SCHEMAS[key] : undefined;
}

/** Pour les tests : ce que le build a trouvé dans le dépôt. */
export const __media = { photoPaths: Object.keys(photoFiles), schemaKeys: Object.keys(SCHEMAS) };
