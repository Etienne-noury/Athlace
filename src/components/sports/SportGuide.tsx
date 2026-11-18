import { useEffect, useState } from 'react';
import { safeExternalUrl } from '@/lib/safe-url';
import type { DisciplineGuide, GuideSource, SportGuide } from '@/data/sport-guides';
import { PHOTO_CREDITS } from '@/data/photo-credits';
import { getSportPhoto, getSportSchema, PHOTO_SLOT_SUBJECT, type PhotoSlot } from './sport-media';
import '@/styles/sport-guide.css';

/** Matériel du sport, même référentiel que l'étape 4 du questionnaire club (src/data/club-form-catalog.ts). */
export interface SportEquipment { provided: string[]; toBuy: string[] }

function Equipment({ equipment, dark }: { equipment?: SportEquipment; dark?: boolean }) {
  if (!equipment || (!equipment.provided.length && !equipment.toBuy.length)) return null;
  return (
    <div className={`equip${dark ? ' dark' : ''}`}>
      {equipment.provided.length > 0 && (
        <div>
          <h3>Souvent fourni par le club</h3>
          <div className="tags">{equipment.provided.map((x) => <span key={x}>{x}</span>)}</div>
        </div>
      )}
      {equipment.toBuy.length > 0 && (
        <div>
          <h3>À prévoir soi-même</h3>
          <div className="tags">{equipment.toBuy.map((x) => <span key={x}>{x}</span>)}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Fiches « Comprendre le sport » des pages /sports/:sportId/, mise en page reprise de la maquette
 * validée (styles dans src/styles/sport-guide.css). Chaque cadre photo affiche la photo déposée dans
 * src/assets/sport-photos/<id>/<emplacement>.jpg, sinon un décor aux couleurs de la marque
 * (voir docs/PHOTOS-ET-SCHEMAS.md).
 */

const BENEFIT_ICONS: [RegExp, string][] = [
  [/endurance|cardio|souffle|santé cardio/i, '🫀'],
  [/force|puissance|renforcement|haut du corps|densité/i, '💪'],
  [/vitesse|explosiv|réflexe|détente/i, '⚡'],
  [/équilibre|gainage|posture|glisse/i, '🧘'],
  [/souplesse/i, '🤸'],
  [/équipe|collectif|cohésion|solidarit|lien social|convivialit|mixit|fair-play|équipage|intergénération|avec son chien|lien avec/i, '🤝'],
  [/concentration|patience|calme|mental|réflexion|logique|mémoire|stratégi|tactique|lecture|décision|précision|sang-froid/i, '🧠'],
  [/confiance|courage|dépassement|maîtrise|stress|émotions|ténacité|persévérance/i, '🦁'],
  [/coordination|adresse|dextérité|habileté|agilité/i, '🎯'],
  [/nature|plein air|découverte|contact|émerveillement|liberté|mer|océan|curiosit/i, '🌿'],
  [/patrimoine/i, '🏛️'],
  [/santé|bien-être|sans chocs|sans contact|à vie|toute la vie/i, '❤️'],
  [/autonomie|responsabilit|rigueur|discipline|gestion du risque|orientation|météo/i, '🧭'],
  [/expression|artistique|rythme|respect|éducation/i, '🎨'],
  [/sensation|pilotage|culture/i, '🎢'],
  [/marche|course|polyvalence|jambes/i, '🏃'],
];
const benefitIcon = (t: string) => BENEFIT_ICONS.find(([r]) => r.test(t))?.[1] ?? '✨';
const sentences = (t: string) => t.split(/(?<=[.!])\s+(?=[A-ZÀ-Ý])/).map((x) => x.trim()).filter(Boolean);
const BUDGET_LABEL = ['', 'Accessible', 'Modéré', 'Élevé'];

/** Crédit obligatoire pour les photos sous licence CC BY / CC BY-SA. */
function PhotoCredit({ id, slot }: { id: string; slot: PhotoSlot }) {
  const credit = PHOTO_CREDITS[`${id}/${slot}`];
  if (!credit) return null;
  const href = safeExternalUrl(credit.url);
  const text = `Photo : ${credit.author} · ${credit.license}`;
  return href ? (
    <a className="credit" href={href} target="_blank" rel="noopener noreferrer">{text}</a>
  ) : (
    <span className="credit">{text}</span>
  );
}

function Photo({ id, slot, name, icon, variant = '' }: { id: string; slot: PhotoSlot; name: string; icon?: string; variant?: '' | 'v2' | 'v3' }) {
  const src = getSportPhoto(id, slot);
  if (src) {
    return (
      <div className="photo">
        <img src={src} alt={`${name} : ${PHOTO_SLOT_SUBJECT[slot]}`} loading="lazy" decoding="async" />
        <PhotoCredit id={id} slot={slot} />
      </div>
    );
  }
  return (
    <div className={`photo ${variant}`} aria-hidden>
      <div className="pat" />
      {icon && <div className="emo">{icon}</div>}
    </div>
  );
}

function SectionHead({ index, label, title, intro }: { index: number; label: string; title: string; intro?: string }) {
  return (
    <div className="sh">
      <div className="num">{String(index).padStart(2, '0')} · {label}</div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function Rules({ items, schemaKey, threeCols }: { items: string[]; schemaKey: string | null; threeCols?: boolean }) {
  const schema = getSportSchema(schemaKey);
  const list = (cls: string) => (
    <div className={cls}>
      {items.map((r, i) => (
        <div className="rule" key={i}><div className="k">{i + 1}</div><p>{r}</p></div>
      ))}
    </div>
  );
  if (!schema) return list(threeCols ? 'rules r3' : 'rules');
  return (
    <div className="rules-wrap">
      {list('rules stack')}
      <figure className="schema">
        <figcaption className="cap">{schema.cap}</figcaption>
        {/* SVG du dépôt (src/assets/sport-schemas), sans contenu utilisateur */}
        <div dangerouslySetInnerHTML={{ __html: schema.svg }} />
        <ol>{schema.legend.map((l, i) => <li key={i}>{l}</li>)}</ol>
      </figure>
    </div>
  );
}

function AgeRuler({ age, label }: { age: number; label: string }) {
  const pos = (Math.min(age, 70) / 70) * 100;
  return (
    <div className="ruler" aria-hidden>
      <div className="track">
        <div className="fill" style={{ left: `${pos}%` }} />
        <div className={`pin${age < 12 ? ' lft' : ''}`} style={{ left: `${pos}%` }}>{label}</div>
      </div>
      <div className="ticks">{['0', '10', '20', '30', '40', '50', '60', '70+'].map((t) => <span key={t}>{t}</span>)}</div>
    </div>
  );
}

/** Menu de sections collant, avec la section visible surlignée. */
function SubNav({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0]?.[0]);
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="subnav" aria-label="Sections de la fiche">
      <div className="container mx-auto px-4 bar">
        {items.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? 'on' : undefined}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Sources({ sources, verifiedOn, note }: { sources: GuideSource[]; verifiedOn: string; note?: string }) {
  const links = sources
    .map((s) => ({ ...s, href: safeExternalUrl(s.url) }))
    .filter((s): s is GuideSource & { href: string } => !!s.href);
  if (!links.length) return null;
  return (
    <section className="srcband">
      <div className="container mx-auto px-4 in">
        <div>
          <h4>Sources de cette fiche</h4>
          <div className="vd">
            Informations vérifiées auprès des fédérations le {verifiedOn}
            {note ? `. ${note}` : ''}. Les règlements évoluent : le site fédéral fait foi.
          </div>
        </div>
        <ul>
          {links.map((s) => (
            <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const SPORT_NAV: [string, string][] = [
  ['sg-principe', 'Le principe'],
  ['sg-jeu', 'Comment on joue'],
  ['sg-materiel', 'Matériel'],
  ['sg-pourqui', 'Pour qui'],
  ['sg-niveaux', 'Progression'],
  ['sg-competitions', 'Compétitions'],
  ['sg-bienfaits', 'Bienfaits & budget'],
];

export function SportGuideSection({ id, name, guide, icon, verifiedOn, equipment }: { id: string; name: string; guide: SportGuide; icon: string; verifiedOn: string; equipment?: SportEquipment }) {
  const r = guide.repere;
  const ageLabel = r?.age ?? 'Tout âge';
  const extra = [...guide.offres.map((o) => `🎈 ${o}`), ...guide.handi.map((o) => `♿ ${o}`)];
  const comp = [...guide.competitions].reverse();
  const n = guide.budget.niveau;

  return (
    <div className="sg">
      <div className="container mx-auto px-4">
        <div className="facts">
          <div className="fact"><div className="ic">👥</div><div><small>Format</small><b>{r?.format ?? '—'}</b></div></div>
          <div className="fact"><div className="ic">📍</div><div><small>Où</small><b>{r?.lieu ?? '—'}</b></div></div>
          <div className="fact"><div className="ic">🎂</div><div><small>Âge</small><b>{ageLabel}</b></div></div>
          <div className="fact"><div className="ic">💶</div><div><small>Budget</small><b>{'€'.repeat(n)} · {BUDGET_LABEL[n]}</b></div></div>
        </div>
      </div>

      <SubNav items={SPORT_NAV} />

      <section className="sp" id="sg-principe">
        <div className="container mx-auto px-4 split">
          <div>
            <SectionHead index={1} label="Le principe" title="Le principe en 30 secondes" />
            <p className="bigtext">{guide.principe}</p>
          </div>
          <Photo id={id} slot="principe" name={name} icon={icon} variant="v2" />
        </div>
      </section>

      <section className="sp white" id="sg-jeu">
        <div className="container mx-auto px-4">
          <SectionHead
            index={2}
            label="Comment on joue"
            title="Comment on joue"
            intro={guide.schema ? "Les règles essentielles, et le terrain en un coup d'œil." : 'Les règles essentielles pour comprendre ta première séance.'}
          />
          <Rules items={guide.jeu} schemaKey={guide.schema} />
        </div>
      </section>

      <section className="sp" style={{ paddingBottom: 0 }}>
        <div className="container mx-auto px-4 gallery">
          <Photo id={id} slot="galerie-1" name={name} variant="v3" />
          <Photo id={id} slot="galerie-2" name={name} />
          <Photo id={id} slot="galerie-3" name={name} variant="v2" />
        </div>
      </section>

      <section className="sp" id="sg-materiel">
        <div className="container mx-auto px-4 split rev">
          <div>
            <SectionHead index={3} label="Matériel" title="Matériel et tenue" intro="Ce qu'il te faut pour commencer." />
            <ul className="checks">{sentences(guide.materiel).map((x) => <li key={x}>{x}</li>)}</ul>
            <Equipment equipment={equipment} />
          </div>
          <Photo id={id} slot="materiel" name={name} icon={icon} variant="v3" />
        </div>
      </section>

      <section className="sp navy" id="sg-pourqui">
        <div className="container mx-auto px-4 agebox">
          <div>
            <SectionHead index={4} label="Pour qui" title="Pour qui, dès quel âge" />
            <div className="agetag">{ageLabel}</div>
            {r?.ageMin != null && <AgeRuler age={r.ageMin} label={ageLabel} />}
          </div>
          <div>
            <p>{guide.pourQui}</p>
            {extra.length > 0 && <div className="ptags">{extra.map((x) => <span key={x}>{x}</span>)}</div>}
          </div>
        </div>
      </section>

      <section className="sp" id="sg-niveaux">
        <div className="container mx-auto px-4">
          <SectionHead index={5} label="Progression" title="Niveaux et progression" intro="Chacun avance à son rythme, du premier entraînement au niveau qui te plaît." />
          <div className="steps" style={{ gridTemplateColumns: `repeat(${guide.niveaux.length}, 1fr)` }}>
            {guide.niveaux.map((lv, i) => (
              <div className="step" key={i}><div className="dot">{i + 1}</div><div className="card">{lv}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp white" id="sg-competitions">
        <div className="container mx-auto px-4 pyr-wrap">
          <div className="pyr">
            {comp.map((c, i) => (
              <div className="lv" key={i} style={{ width: `${comp.length > 1 ? 55 + (45 * i) / (comp.length - 1) : 100}%` }}>{c}</div>
            ))}
          </div>
          <div className="pyr-side">
            <SectionHead index={6} label="Compétitions" title="Compétitions, du club au haut niveau" />
            <div className="medal">{comp.length > 1 ? '🏆' : '🎖️'}</div>
            <h3>{comp.length > 1 ? 'Monte les marches' : 'Le plaisir avant tout'}</h3>
            <p>
              {comp.length > 1
                ? "La compétition commence près de chez toi. Tu peux t'arrêter à l'étage qui te convient : beaucoup de pratiquants jouent toute leur vie en loisir."
                : 'Ici, pas de course aux titres : on progresse pour soi et avec les autres.'}
            </p>
          </div>
        </div>
      </section>

      <section className="sp" id="sg-bienfaits">
        <div className="container mx-auto px-4">
          <SectionHead index={7} label="Bienfaits & budget" title="Bienfaits et budget" intro="Ce que ce sport t'apporte, et ce qu'il coûte." />
          <div className="bb">
            <div className="benef">
              {guide.bienfaits.map((b) => (
                <div className="bf" key={b}><div className="ic">{benefitIcon(b)}</div><b>{b}</b></div>
              ))}
            </div>
            <div className="budget">
              <h3>Budget indicatif</h3>
              <div className="gauge">
                {[1, 2, 3].map((i) => <span key={i} className={i <= n ? 'on' : undefined}>{'€'.repeat(i)}</span>)}
              </div>
              <div className="lv">{BUDGET_LABEL[n]}</div>
              <p>{guide.budget.texte}</p>
              <small>Les tarifs varient d'un club à l'autre : demande-les directement au club.</small>
            </div>
          </div>
        </div>
      </section>

      <Sources sources={guide.sources} verifiedOn={verifiedOn} />
    </div>
  );
}

const DISC_NAV: [string, string][] = [
  ['sg-dprincipe', 'Le principe'],
  ['sg-dpratique', 'En pratique'],
  ['sg-dpourqui', 'Pour qui & matériel'],
];

export function DisciplineGuideSection({
  id,
  name,
  parentName,
  guide,
  parentGuide,
  icon,
  verifiedOn,
  equipment,
}: {
  id: string;
  name: string;
  parentName: string;
  guide: DisciplineGuide;
  parentGuide?: SportGuide;
  icon: string;
  verifiedOn: string;
  equipment?: SportEquipment;
}) {
  return (
    <div className="sg">
      <div className="container mx-auto px-4">
        <div className="facts">
          <div className="fact"><div className="ic">👥</div><div><small>Format</small><b>{guide.format}</b></div></div>
          <div className="fact"><div className="ic">📍</div><div><small>Où</small><b>{guide.lieu}</b></div></div>
          <div className="fact"><div className="ic">🎂</div><div><small>Âge</small><b>{guide.age}</b></div></div>
          <div className="fact"><div className="ic">🎯</div><div><small>Esprit</small><b>{guide.tags.join(' · ')}</b></div></div>
        </div>
      </div>

      <SubNav items={DISC_NAV} />

      <section className="sp" id="sg-dprincipe">
        <div className="container mx-auto px-4 split">
          <div>
            <SectionHead index={1} label="Le principe" title="Le principe" />
            <p className="bigtext">{guide.principe}</p>
          </div>
          <Photo id={id} slot="principe" name={name} icon={icon} variant="v2" />
        </div>
      </section>

      <section className="sp white" id="sg-dpratique">
        <div className="container mx-auto px-4">
          <SectionHead index={2} label="En pratique" title="Comment ça se pratique" />
          <Rules items={guide.pratique} schemaKey={guide.schema} threeCols />
        </div>
      </section>

      <section className="sp navy" id="sg-dpourqui">
        <div className="container mx-auto px-4 agebox">
          <div>
            <SectionHead index={3} label="Pour qui & matériel" title="Pour qui, et avec quoi ?" />
            <div className="agetag">{guide.age}</div>
            <p>{guide.pourQui}</p>
          </div>
          <div>
            <h3 className="subh">🎒 Matériel et tenue</h3>
            <ul className="checks dark">{sentences(guide.materiel).map((x) => <li key={x}>{x}</li>)}</ul>
            <Equipment equipment={equipment} dark />
          </div>
        </div>
      </section>

      {parentGuide && (
        <Sources
          sources={parentGuide.sources}
          verifiedOn={verifiedOn}
          note={`${name} reprend les sources du sport ${parentName}`}
        />
      )}
    </div>
  );
}
