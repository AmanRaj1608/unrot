import type { Article } from "./scraper";

const cache = new Map<string, Article[]>();

function key(category: string, date: string): string {
  return `${category}-${date}`;
}

export function getCached(category: string, date: string): Article[] | null {
  return cache.get(key(category, date)) ?? null;
}

export function setCache(
  category: string,
  date: string,
  articles: Article[]
): void {
  cache.set(key(category, date), articles);
}
