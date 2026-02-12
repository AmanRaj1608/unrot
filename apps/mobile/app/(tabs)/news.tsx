import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ScrollView,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api, type Article } from "../../lib/api";
import { ArticleCard } from "../../components/ArticleCard";
import { CategoryChip } from "../../components/CategoryChip";

const ALL_CATEGORIES = ["ai", "crypto", "devops", "founders"];

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(["ai"])
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(
    async (categories: Set<string>) => {
      try {
        setError(null);
        const promises = Array.from(categories).map((cat) =>
          api.news.get(cat).catch(() => [] as Article[])
        );
        const results = await Promise.all(promises);
        setArticles(results.flat());
      } catch {
        setError("Failed to load news");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNews(enabledCategories);
  }, [enabledCategories, loadNews]);

  const toggleCategory = (category: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        if (next.size > 1) next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNews(enabledCategories);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <Text style={styles.date}>{today}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipContent}
      >
        {ALL_CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            selected={enabledCategories.has(cat)}
            onPress={() => toggleCategory(cat)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" color="#2563eb" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, i) => `${item.url}-${i}`}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() => WebBrowser.openBrowserAsync(item.url)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No articles found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  dateRow: { paddingHorizontal: 16, paddingTop: 12 },
  date: { fontSize: 13, color: "#94a3b8", fontWeight: "500" },
  chipRow: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  chipContent: { paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" },
  list: { paddingTop: 12, paddingBottom: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#dc2626", marginTop: 40, fontSize: 15 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 40, fontSize: 15 },
});
