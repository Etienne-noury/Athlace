import { describe, it, expect } from "vitest";
import { computeDisciplineAvailability, type Row } from "@/hooks/useAvailableDisciplines";
import { ARBORESCENCE, slugifyDiscipline } from "@/data/disciplines";

const cat = ARBORESCENCE[0];
const sport = cat.sports[0];
const sportId = slugifyDiscipline(sport.name);
const sportWithSubs = cat.sports.find((s) => s.subs.length > 0) ?? sport;

describe("computeDisciplineAvailability", () => {
  it("compte zéro sport disponible quand la base est vide", () => {
    const res = computeDisciplineAvailability([]);
    expect(res.availableSportCount).toBe(0);
    expect(res.categories[cat.id]).toBe(false);
  });

  it("compte un sport une seule fois et additionne toutes ses valeurs match", () => {
    const values = sport.match.slice(0, 2);
    const rows: Row[] = values.map((d, i) => ({ discipline: d, clubs: i + 2, subs: null }));
    const res = computeDisciplineAvailability(rows);

    expect(res.sports[sportId]).toEqual({
      available: true,
      count: rows.reduce((s, r) => s + r.clubs, 0),
      subs: {},
    });
    expect(res.availableSportCount).toBe(1);
    expect(res.categories[cat.id]).toBe(true);
  });

  it("n'inclut pas un sport dont les disciplines ont zéro club", () => {
    const rows: Row[] = [{ discipline: sport.match[0], clubs: 0, subs: null }];
    const res = computeDisciplineAvailability(rows);

    expect(res.sports[sportId].available).toBe(false);
    expect(res.availableSportCount).toBe(0);
    expect(res.categories[cat.id]).toBe(false);
  });

  it("ignore une sous-discipline sans club et garde celle qui en a", () => {
    const sub = sportWithSubs.subs[0];
    const res = computeDisciplineAvailability([
      { discipline: sportWithSubs.match[0], clubs: 4, subs: { [sub]: 3 } },
    ]);
    expect(res.sports[slugifyDiscipline(sportWithSubs.name)].subs).toEqual({ [sub]: 3 });

    const sansClubs = computeDisciplineAvailability([
      { discipline: sportWithSubs.match[0], clubs: 4, subs: { [sub]: 0 } },
    ]);
    expect(sansClubs.sports[slugifyDiscipline(sportWithSubs.name)].subs).toEqual({});
  });
});
