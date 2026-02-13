import { useState, useCallback, useEffect } from "react";
import { api, type FeedItem } from "../lib/api";
import { useUser } from "../lib/UserContext";

export function useNewsFeed() {
  const { userId } = useUser();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.feed.get(userId);
      setItems(data);
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await api.feed.refresh();
    } catch {
      // refresh failed, still reload existing feed
    }
    await load();
  }, [load]);

  const markViewed = useCallback(
    async (itemId: string) => {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, viewed: true } : item
        )
      );
      try {
        await api.feed.markViewed(userId, itemId);
      } catch {
        // revert on failure
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, viewed: false } : item
          )
        );
      }
    },
    [userId]
  );

  return { items, loading, refreshing, error, refresh, markViewed };
}
