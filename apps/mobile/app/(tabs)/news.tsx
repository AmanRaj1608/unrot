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
import { Ionicons } from "@expo/vector-icons";
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="newspaper-outline" size={22} color="#10B981" />
        <Text style={styles.headerTitle}>News</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
        <ActivityIndicator style={styles.center} size="large" color="#10B981" />
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#10B981"
            />
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
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  chipContent: { paddingHorizontal: 20, paddingBottom: 14 },
  list: { paddingTop: 4, paddingBottom: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#EF4444", marginTop: 40, fontSize: 15 },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 15 },
});
