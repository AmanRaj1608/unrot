import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { api, type Article } from "../lib/api";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => WebBrowser.openBrowserAsync(article.url)}
    >
      {article.section ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{article.section}</Text>
        </View>
      ) : null}
      <Text style={styles.title} numberOfLines={2}>
        {article.title}
      </Text>
      {article.summary ? (
        <Text style={styles.summary} numberOfLines={3}>
          {article.summary}
        </Text>
      ) : null}
      {article.readTime > 0 ? (
        <Text style={styles.meta}>{article.readTime} min read</Text>
      ) : null}
    </Pressable>
  );
}

export default function CatchupScreen() {
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const date = today();
  const displayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    api.catchup
      .get(date)
      .then(setArticles)
      .catch(() => setError("Failed to load digest"))
      .finally(() => setLoading(false));
  }, [date]);

  const header = (
    <View style={styles.headerSection}>
      <Ionicons name="sparkles" size={24} color="#10B981" />
      <Text style={styles.headerTitle}>TLDR Daily Digest</Text>
      <Text style={styles.headerDate}>{displayDate}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={articles}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => <ArticleCard article={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <Text style={styles.empty}>No articles for today</Text>
      }
      contentContainerStyle={[styles.content, { paddingTop: insets.top ? 0 : 16 }]}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  center: { justifyContent: "center", alignItems: "center" },
  content: { paddingBottom: 40 },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  headerDate: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  summary: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
  },
  meta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },
  error: {
    textAlign: "center",
    color: "#EF4444",
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
  },
});
