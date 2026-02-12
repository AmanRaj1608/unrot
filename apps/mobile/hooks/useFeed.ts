import { useState, useCallback, useEffect } from "react";
import { api } from "../lib/api";
import type { FeedItem, FeedFilter } from "../lib/feed";

function interleave(groups: FeedItem[][]): FeedItem[] {
  const result: FeedItem[] = [];
  const maxLen = Math.max(...groups.map((g) => g.length), 0);
  for (let i = 0; i < maxLen; i++) {
    for (const group of groups) {
      if (i < group.length) {
        result.push(group[i]);
      }
    }
  }
  return result;
}

export function useFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeedFilter>("all");

  const load = useCallback(async () => {
    try {
      setError(null);

      const [newsArticles, books, mathTopic] = await Promise.all([
        api.news.get("tech").catch(() => []),
        api.books.list().catch(() => []),
        api.math.random().catch(() => null),
      ]);

      const newsItems: FeedItem[] = newsArticles.map((a, i) => ({
        type: "news" as const,
        data: a,
        id: `news-${a.url}-${i}`,
      }));

      const bookItems: FeedItem[] = books.map((b) => ({
        type: "book" as const,
        data: b,
        id: `book-${b.id}`,
      }));

      const mathItems: FeedItem[] = mathTopic
        ? [{ type: "math" as const, data: mathTopic, id: `math-${mathTopic.id}` }]
        : [];

      setItems(interleave([newsItems, bookItems, mathItems]));
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const filtered =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  return { items: filtered, loading, refreshing, error, refresh, filter, setFilter };
}
