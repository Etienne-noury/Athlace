import { describe, expect, it } from 'vitest';
import { JOURNAL_ARTICLES, filterJournalArticles, getJournalArticle } from './journal';

describe('journal consolidation', () => {
  it('retains all three discovery guide slugs as journal articles', () => {
    for (const id of ['guide-licences-federations', 'comment-choisir-son-club', 'fiches-sport-par-sport']) {
      expect(getJournalArticle(id)?.guide).toBe(true);
    }
  });
  it('directs the license guide to the federation directory', () => {
    expect(getJournalArticle('guide-licences-federations')?.further.href).toBe('/federations/');
  });
  it('assigns every article to a category and filters only that category', () => {
    expect(filterJournalArticles('Tous')).toHaveLength(8);
    expect(filterJournalArticles('Bien-être').map((article) => article.id)).toEqual(['sport-en-entreprise']);
    expect(filterJournalArticles('Nutrition')).toHaveLength(0);
    expect(JOURNAL_ARTICLES.every((article) => !!article.category)).toBe(true);
  });
});