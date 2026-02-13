import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { api, type Article } from "../lib/api";
import { ArticleCard } from "./ArticleCard";
import { CategoryChip } from "./CategoryChip";

const ALL_CATEGORIES = ["ai", "crypto", "devops", "founders"];
const PREVIEW_COUNT = 3;

export function NewsSection() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(["ai"])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (categories: Set<string>) => {
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
    }
  }, []);

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

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="newspaper-outline" size={22} color="#10B981" />
        <Text style={styles.heading}>News</Text>
        {articles.length > PREVIEW_COUNT && (
          <Pressable
            onPress={() => router.push("/news")}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color="#10B981" />
          </Pressable>
        )}
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
        <ActivityIndicator style={styles.loader} size="small" color="#10B981" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : articles.length === 0 ? (
        <Text style={styles.empty}>No articles found</Text>
      ) : (
        articles.slice(0, PREVIEW_COUNT).map((article, i) => (
          <ArticleCard
            key={`${article.url}-${i}`}
            article={article}
            onPress={() => WebBrowser.openBrowserAsync(article.url)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    flex: 1,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  chipContent: { paddingHorizontal: 20, paddingBottom: 14 },
  loader: { paddingVertical: 24 },
  error: { textAlign: "center", color: "#EF4444", paddingVertical: 12, fontSize: 14 },
  empty: { textAlign: "center", color: "#9CA3AF", paddingVertical: 12, fontSize: 14 },
});
