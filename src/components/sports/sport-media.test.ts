import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { disciplines } from '@/data/disciplines';
import { DISCIPLINE_GUIDES, SPORT_GUIDES } from '@/data/sport-guides';
import { SPORT_SCHEMA_TEXTS } from '@/data/sport-schemas';
import { __media, DISCIPLINE_PHOTO_SLOTS, getSportSchema, SPORT_PHOTO_SLOTS } from './sport-media';

/** Poids max d'une photo : au-delà, la page sport ralentit nettement sur mobile. */
const MAX_PHOTO_KB = 500;

describe('photos des fiches sport', () => {
  const sportIds = new Set(disciplines.filter((d) => !d.parentId).map((d) => d.id));
  const subIds = new Set(disciplines.filter((d) => d.parentId).map((d) => d.id));

  it('sont rangées dans un dossier de sport ou de discipline existant, avec un nom d’emplacement valide', () => {
    const errors = __media.photoPaths.flatMap((path) => {
      const [, folder, file] = path.match(/sport-photos\/([^/]+)\/([^/]+)$/) ?? [];
      const slot = file?.replace(/\.[^.]+$/, '').toLowerCase();
      if (sportIds.has(folder)) return (SPORT_PHOTO_SLOTS as readonly string[]).includes(slot) ? [] : [`${path} : emplacement inconnu`];
      if (subIds.has(folder)) return (DISCIPLINE_PHOTO_SLOTS as readonly string[]).includes(slot) ? [] : [`${path} : emplacement inconnu`];
      return [`${path} : dossier inconnu`];
    });
    expect(errors).toEqual([]);
  });

  it(`pèsent moins de ${MAX_PHOTO_KB} Ko`, () => {
    const lourdes = __media.photoPaths
      .map((p) => ({ p, kb: Math.round(statSync(join(process.cwd(), p)).size / 1024) }))
      .filter((x) => x.kb > MAX_PHOTO_KB)
      .map((x) => `${x.p} (${x.kb} Ko)`);
    expect(lourdes).toEqual([]);
  });
});

describe('schémas des fiches sport', () => {
  it('chaque schéma utilisé par une fiche existe (fichier SVG + titre et légende)', () => {
    const used = [
      ...Object.values(SPORT_GUIDES).map((g) => g.schema),
      ...Object.values(DISCIPLINE_GUIDES).map((g) => g.schema),
    ].filter((k): k is string => !!k);
    expect([...new Set(used)].filter((k) => !getSportSchema(k))).toEqual([]);
  });

  it('chaque fichier SVG a son titre et sa légende', () => {
    expect(Object.keys(SPORT_SCHEMA_TEXTS).filter((k) => !__media.schemaKeys.includes(k))).toEqual([]);
  });

  it('les couleurs de la charte passent par les variables CSS', () => {
    const svg = getSportSchema('rugby')!.svg;
    expect(svg).toContain('hsl(var(--bleu-athlace))');
    expect(svg).not.toMatch(/#415CAF/i);
  });
});

describe('crédits des photos', () => {
  it('chaque crédit visible correspond à une photo présente', async () => {
    const { PHOTO_CREDITS } = await import('@/data/photo-credits');
    const present = new Set(__media.photoPaths.map((p) => p.replace(/^.*sport-photos\//, '').replace(/\.[^.]+$/, '')));
    expect(Object.keys(PHOTO_CREDITS).filter((k) => !present.has(k))).toEqual([]);
  });

  it('chaque photo est listée dans CREDITS.md', () => {
    const credits = readFileSync(join(process.cwd(), 'src/assets/sport-photos/CREDITS.md'), 'utf8');
    const missing = __media.photoPaths
      .map((p) => p.replace(/^.*sport-photos\//, ''))
      .filter((f) => !credits.includes('`' + f + '`'));
    expect(missing).toEqual([]);
  });
});
