import { ExternalLink } from 'lucide-react';
import { safeExternalUrl } from '@/lib/safe-url';
import type { DisciplineGuide, GuideSource, SportGuide } from '@/data/sport-guides';

/**
 * Bloc « Comprendre le sport » des pages /sports/:sportId/ (fiches de src/data/sport-guides.ts,
 * chargées à la demande via useSportGuides).
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-primary">{children}</p>;
}

function Repere({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border px-5 py-4">
      <div className="text-xs font-bold uppercase tracking-wide text-nuit/70">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 rounded-2xl bg-card border border-border p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-secondary font-black text-secondary-foreground">
            {i + 1}
          </span>
          <p className="font-light leading-relaxed">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 font-light leading-relaxed">
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-pill bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Sources({ sources, verifiedOn, note }: { sources: GuideSource[]; verifiedOn: string; note?: string }) {
  const links = sources
    .map((s) => ({ ...s, href: safeExternalUrl(s.url) }))
    .filter((s): s is GuideSource & { href: string } => !!s.href);
  if (!links.length) return null;
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6 lg:flex-row lg:items-start lg:gap-10">
      <div className="max-w-xs space-y-1">
        <p className="font-bold">Sources de cette fiche</p>
        <p className="text-sm font-light text-nuit/70">
          Informations vérifiées auprès des fédérations le {verifiedOn}
          {note ? `. ${note}` : ''}. Les règlements évoluent : le site fédéral fait foi.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {links.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-pill border border-primary/30 bg-card px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {s.label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SportGuideSection({ name, guide, verifiedOn }: { name: string; guide: SportGuide; verifiedOn: string }) {
  return (
    <section className="container mx-auto px-4 pt-12 space-y-10" aria-labelledby="comprendre">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <Eyebrow>Comprendre le sport</Eyebrow>
          <h2 id="comprendre" className="font-sans text-2xl lg:text-4xl font-black">{name} en 30 secondes</h2>
          <p className="text-lg font-bold">{guide.accroche}</p>
          <p className="text-lg font-light leading-relaxed">{guide.principe}</p>
        </div>
        {guide.repere && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Repere label="Format" value={guide.repere.format} />
            <Repere label="Où" value={guide.repere.lieu} />
            <Repere label="Âge" value={guide.repere.age} />
          </div>
        )}
      </div>

      <div className="space-y-5">
        <h3 className="font-sans text-xl lg:text-2xl font-black">Comment on joue</h3>
        <Steps items={guide.jeu} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-primary p-6 lg:p-8 text-primary-foreground space-y-3">
          <h3 className="font-sans text-xl font-black">Pour qui ?</h3>
          <p className="font-light leading-relaxed">{guide.pourQui}</p>
        </div>
        <div className="rounded-3xl bg-card border border-border p-6 lg:p-8 space-y-3">
          <h3 className="font-sans text-xl font-black">Le matériel</h3>
          <p className="font-light leading-relaxed">{guide.materiel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-sans text-xl lg:text-2xl font-black">Progresser</h3>
          <Bullets items={guide.niveaux} />
        </div>
        <div className="space-y-4">
          <h3 className="font-sans text-xl lg:text-2xl font-black">Les compétitions</h3>
          <Bullets items={guide.competitions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <h3 className="font-sans text-xl lg:text-2xl font-black">Ce que ça t'apporte</h3>
          <div className="flex flex-wrap gap-2">
            {guide.bienfaits.map((b) => (
              <span key={b} className="rounded-pill bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">{b}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-nuit p-6 text-creme space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide">Budget indicatif</p>
          <p className="text-3xl font-black" aria-label={`Budget niveau ${guide.budget.niveau} sur 3`}>
            {'€'.repeat(guide.budget.niveau)}
            <span className="text-creme/40">{'€'.repeat(3 - guide.budget.niveau)}</span>
          </p>
          <p className="text-sm font-light">{guide.budget.texte}</p>
        </div>
      </div>

      <Sources sources={guide.sources} verifiedOn={verifiedOn} />
    </section>
  );
}

export function DisciplineGuideSection({
  name,
  parentName,
  guide,
  parentGuide,
  verifiedOn,
}: {
  name: string;
  parentName: string;
  guide: DisciplineGuide;
  parentGuide?: SportGuide;
  verifiedOn: string;
}) {
  return (
    <section className="container mx-auto px-4 pt-12 space-y-10" aria-labelledby="comprendre">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <Eyebrow>Discipline · {parentName}</Eyebrow>
          <h2 id="comprendre" className="font-sans text-2xl lg:text-4xl font-black">{`${name}, c'est quoi\u00a0?`}</h2>
          <p className="text-lg font-bold">{guide.accroche}</p>
          <p className="text-lg font-light leading-relaxed">{guide.principe}</p>
          <div className="flex flex-wrap gap-2">
            {guide.tags.map((t) => (
              <span key={t} className="rounded-pill bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Repere label="Format" value={guide.format} />
          <Repere label="Où" value={guide.lieu} />
          <Repere label="Âge" value={guide.age} />
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="font-sans text-xl lg:text-2xl font-black">Comment ça se pratique</h3>
        <Steps items={guide.pratique} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-primary p-6 lg:p-8 text-primary-foreground space-y-3">
          <h3 className="font-sans text-xl font-black">Pour qui ?</h3>
          <p className="font-light leading-relaxed">{guide.pourQui}</p>
        </div>
        <div className="rounded-3xl bg-card border border-border p-6 lg:p-8 space-y-3">
          <h3 className="font-sans text-xl font-black">Le matériel</h3>
          <p className="font-light leading-relaxed">{guide.materiel}</p>
        </div>
      </div>

      {parentGuide && (
        <Sources
          sources={parentGuide.sources}
          verifiedOn={verifiedOn}
          note={`Cette discipline reprend les sources du sport ${parentName}`}
        />
      )}
    </section>
  );
}
