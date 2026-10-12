import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Phone, Globe, Star, Clock, ChevronLeft, CreditCard, Loader2, Info,
  Trophy, Mail, Users, Award, Accessibility, Dumbbell, ExternalLink,
  Facebook, Instagram, Twitter, Linkedin, Youtube, Music2, UserPlus, Building2,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FavoriteButton } from '@/components/clubs/FavoriteButton';
import { VenuesMap, type VenuePoint } from '@/components/clubs/VenuesMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClubMiniMap } from '@/components/foot/ClubMiniMap';
import { fetchEnrichedClubById } from '@/lib/api/enriched-clubs';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { getDisciplineById } from '@/data/disciplines';
import { cn } from '@/lib/utils';

type Venue = Tables<'club_venues'>;
type Schedule = Tables<'club_schedules'>;

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

function normDay(d: string | null): string {
  return (d ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}
function hm(t: string | null): string {
  return t ? t.slice(0, 5) : '';
}
function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
function has(arr: string[] | null | undefined): arr is string[] {
  return !!arr && arr.filter(Boolean).length > 0;
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-primary" aria-hidden />
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ComingSoonSection({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 opacity-60">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" aria-hidden />
        <h2 className="font-display text-lg font-semibold text-muted-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">Disponible prochainement</p>
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.filter(Boolean).map((x) => (
        <span key={x} className="text-xs px-3 py-1 rounded-pill bg-surface-alt text-blue-500">{x}</span>
      ))}
    </div>
  );
}

function InfoTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function availability(notes: string | null): 'full' | 'open' | null {
  if (!notes) return null;
  const n = notes.toLowerCase();
  if (/complet/.test(n)) return 'full';
  if (/places?\s+disponibles?/.test(n)) return 'open';
  return null;
}

export default function ClubDetail() {
  const { id } = useParams();
  const cleanId = id?.startsWith('fed:') ? id.slice(4) : id;

  const { data: club, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: () => fetchEnrichedClubById(id || ''),
    enabled: !!id,
  });
  const { data: contact } = useQuery({
    queryKey: ['club-contact', cleanId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_club_contact', { p_club_id: cleanId! });
      if (error || !data?.length) return null;
      return data[0] as { email: string | null; phone: string | null };
    },
    enabled: !!cleanId,
  });
  const { data: venues = [] } = useQuery({
    queryKey: ['club-venues', cleanId],
    queryFn: async () => {
      const { data } = await supabase.from('club_venues').select('*').eq('club_id', cleanId!);
      return (data ?? []) as Venue[];
    },
    enabled: !!cleanId,
  });
  const { data: schedules = [] } = useQuery({
    queryKey: ['club-schedules', cleanId],
    queryFn: async () => {
      const { data } = await supabase.from('club_schedules').select('*').eq('club_id', cleanId!);
      return (data ?? []) as Schedule[];
    },
    enabled: !!cleanId,
  });

  const scheduleByDay = useMemo(() => {
    const groups = new Map<string, Schedule[]>();
    for (const s of schedules) {
      const key = normDay(s.day);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }
    const order = (k: string) => { const i = DAYS.indexOf(k); return i === -1 ? 99 : i; };
    return [...groups.entries()]
      .sort((a, b) => order(a[0]) - order(b[0]))
      .map(([key, list]) => ({
        day: list[0].day ?? key,
        list: [...list].sort((a, b) => hm(a.start_time).localeCompare(hm(b.start_time))),
      }));
  }, [schedules]);

  const venuePoints = useMemo<VenuePoint[]>(
    () => venues
      .filter((v) => v.latitude != null && v.longitude != null)
      .map((v) => ({ lat: v.latitude!, lng: v.longitude!, label: v.name ?? 'Lieu de pratique' })),
    [venues],
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

  if (!club) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Club non trouvé</h1>
          <Link to="/clubs/"><Button>Retour à la recherche</Button></Link>
        </div>
      </Layout>
    );
  }

  const r = club.row;
  const discipline = getDisciplineById(club.discipline);
  const registerUrl = r?.registration_url || r?.helloasso_url || null;
  const socials = [
    { url: r?.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: r?.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: r?.twitter_url, icon: Twitter, label: 'X / Twitter' },
    { url: r?.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: r?.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: r?.tiktok_url, icon: Music2, label: 'TikTok' },
  ].filter((s) => !!s.url);
  const hasActions = registerUrl || club.website || contact?.email || contact?.phone || socials.length > 0;

  const total = r?.licensees_total ?? null;
  const pct = (n: number | null | undefined) => (total && n != null ? Math.round((n / total) * 100) : null);
  const femalePct = pct(r?.licensees_female);
  const youthPct = pct(r?.licensees_youth);

  const essentials: { label: string; value: React.ReactNode }[] = [];
  if (has(r?.age_categories)) essentials.push({ label: "Catégories d'âge", value: r!.age_categories!.join(', ') });
  if (r?.min_age != null) essentials.push({ label: 'Âge minimum', value: `${r.min_age} ans` });
  if (has(r?.audiences)) essentials.push({ label: 'Publics', value: r!.audiences!.join(', ') });
  if (has(r?.practice_types)) essentials.push({ label: 'Types de pratique', value: r!.practice_types!.join(', ') });
  if (total != null) {
    const extra = [femalePct != null && `${femalePct} % de femmes`, youthPct != null && `${youthPct} % de jeunes`].filter(Boolean);
    essentials.push({
      label: 'Licenciés',
      value: <>{total.toLocaleString('fr-FR')}{extra.length > 0 && <span className="block text-muted-foreground">{extra.join(' · ')}</span>}</>,
    });
  }
  if (r?.committee) essentials.push({ label: 'Comité', value: r.committee });
  if (r?.structure_type) essentials.push({ label: 'Type de structure', value: r.structure_type });

  const cityLine = [club.city, r?.league].filter(Boolean).join(' · ');
  const updatedAt = formatDate(r?.scraped_at);
  const fullAddress = [club.address, r?.address_complement, `${club.postalCode} ${club.city}`.trim()].filter(Boolean).join(', ');

  return (
    <Layout>
      {/* 1. En-tête */}
      <section className="relative">
        <div className="absolute inset-0 h-64 lg:h-80 bg-blue-500" />
        <div className="relative container mx-auto px-4 pt-8">
          <Link to="/clubs/" className="inline-flex items-center gap-2 text-cream-100 hover:text-cream-100 mb-6">
            <ChevronLeft className="w-5 h-5" /> Retour aux résultats
          </Link>

          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-tint-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {r?.logo_url ? (
                  <img src={r.logo_url} alt={`Logo de ${club.name}`} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-5xl lg:text-6xl" aria-hidden>{discipline?.icon || '🏆'}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  {club.levelLabel && (
                    <Badge>{club.levelLabel}</Badge>
                  )}
                  <Badge variant="secondary">{club.disciplineName}</Badge>
                </div>

                <div className="flex items-start justify-between gap-4 mb-1">
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{club.name}</h1>
                  <FavoriteButton clubId={club.id} withLabel className="flex-shrink-0" />
                </div>
                {r?.acronym && <p className="text-sm text-muted-foreground mb-3">{r.acronym}</p>}

                {has(club.subDisciplines) && <div className="mb-3"><Pills items={club.subDisciplines} /></div>}

                {cityLine && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" aria-hidden /> <span>{cityLine}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Barre d'actions */}
            {hasActions && (
              <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3">
                {registerUrl && (
                  <Button asChild className="rounded-pill">
                    <a href={registerUrl} target="_blank" rel="noopener noreferrer"><UserPlus className="w-4 h-4" /> S'inscrire</a>
                  </Button>
                )}
                {club.website && (
                  <Button asChild variant="secondary" className="rounded-pill">
                    <a href={club.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" /> Site web</a>
                  </Button>
                )}
                {contact?.email && (
                  <Button asChild variant="secondary" className="rounded-pill">
                    <a href={`mailto:${contact.email}`}><Mail className="w-4 h-4" /> Email</a>
                  </Button>
                )}
                {contact?.phone && (
                  <Button asChild variant="secondary" className="rounded-pill">
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`}><Phone className="w-4 h-4" /> {contact.phone}</a>
                  </Button>
                )}
                {socials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {socials.map(({ url, icon: Icon, label }) => (
                      <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label}
                        className="w-10 h-10 rounded-pill bg-surface-alt text-blue-500 flex items-center justify-center hover:opacity-80">
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 3. L'essentiel */}
          {essentials.length > 0 && (
            <Section icon={Users} title="L'essentiel">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {essentials.map((e) => <InfoTile key={e.label} label={e.label}>{e.value}</InfoTile>)}
              </div>
            </Section>
          )}

          {/* 4. Horaires */}
          {scheduleByDay.length > 0 && (
            <Section icon={Clock} title="Horaires">
              <div className="space-y-5">
                {scheduleByDay.map(({ day, list }) => (
                  <div key={day}>
                    <h3 className="font-display font-semibold text-foreground capitalize mb-2">{day}</h3>
                    <ul className="space-y-2">
                      {list.map((s) => {
                        const av = availability(s.notes);
                        const meta = [s.category, s.discipline, s.venue_name].filter(Boolean).join(' · ');
                        return (
                          <li key={s.id} className="rounded-xl bg-muted/50 p-3 flex flex-wrap items-start gap-x-4 gap-y-1">
                            <span className="font-medium text-foreground tabular-nums">
                              {hm(s.start_time)}{s.end_time && `–${hm(s.end_time)}`}
                            </span>
                            <div className="flex-1 min-w-0">
                              {s.title && <p className="text-sm text-foreground">{s.title}</p>}
                              {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
                            </div>
                            {av === 'full' && <Badge variant="destructive">Complet</Badge>}
                            {av === 'open' && <Badge className="bg-secondary text-ink border-0">Places disponibles</Badge>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 5. Lieux de pratique */}
          {venues.length > 0 ? (
            <Section icon={Building2} title="Lieux de pratique">
              <ul className="space-y-3 mb-4">
                {venues.map((v) => {
                  const addr = [v.address, v.address_complement, [v.postal_code, v.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
                  return (
                    <li key={v.id} className="rounded-xl bg-muted/50 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{v.name || 'Lieu de pratique'}</p>
                        {v.kind && <span className="text-xs px-2 py-0.5 rounded-pill bg-surface-alt text-blue-500">{v.kind}</span>}
                        {v.is_main && <Badge variant="secondary">Principal</Badge>}
                      </div>
                      {addr && <p className="text-sm text-muted-foreground">{addr}</p>}
                    </li>
                  );
                })}
              </ul>
              <VenuesMap points={venuePoints} />
            </Section>
          ) : (
            <Section icon={MapPin} title="Localisation">
              {fullAddress && <p className="text-muted-foreground mb-4">{fullAddress}</p>}
              <ClubMiniMap lat={club.coordinates.lat || null} lng={club.coordinates.lng || null} address={fullAddress} />
            </Section>
          )}

          {/* 6. Compétitions */}
          {(has(r?.competitions) || has(r?.competition_categories)) && (
            <Section icon={Trophy} title="Compétitions">
              {has(r?.competitions) && (
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                  {r!.competitions!.map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
              {has(r?.competition_categories) && <Pills items={r!.competition_categories!} />}
            </Section>
          )}

          {/* 7. Labels et accessibilité */}
          {(has(r?.labels) || has(r?.accessibility)) && (
            <Section icon={Award} title="Labels et accessibilité">
              <div className="flex flex-wrap gap-2">
                {(r?.labels ?? []).filter(Boolean).map((l) => (
                  <Badge key={`l-${l}`} variant="secondary" className="gap-1"><Award className="w-3 h-3" />{l}</Badge>
                ))}
                {(r?.accessibility ?? []).filter(Boolean).map((a) => (
                  <Badge key={`a-${a}`} variant="outline" className="gap-1"><Accessibility className="w-3 h-3" />{a}</Badge>
                ))}
              </div>
            </Section>
          )}

          {/* 8. Équipements et services */}
          {has(r?.amenities) && (
            <Section icon={Dumbbell} title="Équipements et services">
              <Pills items={r!.amenities!} />
            </Section>
          )}

          {/* 9. Description, Prix, Avis */}
          {club.description && (
            <Section icon={Info} title="Description">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{club.description}</p>
            </Section>
          )}
          {r?.price_info ? (
            <Section icon={CreditCard} title="Prix">
              <p className="text-muted-foreground whitespace-pre-line">{r.price_info}</p>
            </Section>
          ) : (
            <ComingSoonSection icon={CreditCard} title="Prix" />
          )}
          <ComingSoonSection icon={Star} title="Avis" />

          {/* 10. Pied de fiche */}
          {(r?.source_url || r?.affiliation_number || updatedAt) && (
            <footer className="pt-2 space-y-1 text-center">
              {r?.source_url && (
                <a href={r.source_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ExternalLink className="w-4 h-4" /> Voir la fiche sur le site de la fédération
                </a>
              )}
              <p className="text-xs text-muted-foreground">
                {[r?.affiliation_number && `N° d'affiliation : ${r.affiliation_number}`, updatedAt && `Mis à jour le ${updatedAt}`]
                  .filter(Boolean).join(' · ')}
              </p>
            </footer>
          )}
        </div>
      </div>
    </Layout>
  );
}
