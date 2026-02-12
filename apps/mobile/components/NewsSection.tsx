import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api, type Article } from "../lib/api";
import { ArticleCard } from "./ArticleCard";
import { CategoryChip } from "./CategoryChip";

const ALL_CATEGORIES = ["ai", "crypto", "devops", "founders"];

export function NewsSection() {
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>News</Text>
      <Text style={styles.date}>{today}</Text>

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
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color="#2563eb"
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : articles.length === 0 ? (
        <Text style={styles.empty}>No articles found</Text>
      ) : (
        articles.map((article, i) => (
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
  section: { marginBottom: 24 },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chipContent: { paddingHorizontal: 16, paddingBottom: 12 },
  loader: { paddingVertical: 20 },
  error: { textAlign: "center", color: "#dc2626", paddingVertical: 12, fontSize: 14 },
  empty: { textAlign: "center", color: "#94a3b8", paddingVertical: 12, fontSize: 14 },
});
