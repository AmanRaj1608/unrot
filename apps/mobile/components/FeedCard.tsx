import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { FeedItem } from "../lib/feed";

const TYPE_CONFIG = {
  news: { color: "#10B981", bg: "#ECFDF5", icon: "newspaper-outline" as const, label: "News" },
  book: { color: "#F59E0B", bg: "#FFFBEB", icon: "book-outline" as const, label: "Book" },
  math: { color: "#8B5CF6", bg: "#F5F3FF", icon: "calculator-outline" as const, label: "Math" },
  github: { color: "#6B7280", bg: "#F3F4F6", icon: "logo-github" as const, label: "GitHub" },
};

export function FeedCard({ item }: { item: FeedItem }) {
  const router = useRouter();
  const config = TYPE_CONFIG[item.type];

  const handlePress = () => {
    switch (item.type) {
      case "news":
        WebBrowser.openBrowserAsync(item.data.url);
        break;
      case "book":
        router.push(`/book/${item.data.id}`);
        break;
      case "math":
        router.push(`/math/${item.data.id}`);
        break;
      case "github":
        WebBrowser.openBrowserAsync(item.data.htmlUrl);
        break;
    }
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={12} color={config.color} />
        <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
      </View>
      {renderContent(item)}
    </Pressable>
  );
}

function renderContent(item: FeedItem) {
  switch (item.type) {
    case "news":
      return (
        <>
          <Text style={styles.title} numberOfLines={2}>{item.data.title}</Text>
          <Text style={styles.summary} numberOfLines={3}>{item.data.summary}</Text>
          {item.data.readTime > 0 && (
            <Text style={styles.meta}>{item.data.readTime} min read</Text>
          )}
        </>
      );
    case "book":
      return (
        <View style={styles.bookRow}>
          <Image source={{ uri: item.data.coverUrl }} style={styles.bookCover} />
          <View style={styles.bookInfo}>
            <Text style={styles.title} numberOfLines={2}>{item.data.title}</Text>
            <Text style={styles.author}>{item.data.author}</Text>
            <Text style={styles.summary} numberOfLines={2}>{item.data.summary}</Text>
          </View>
        </View>
      );
    case "math":
      return (
        <>
          <Text style={styles.mathCategory}>{item.data.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.data.title}</Text>
          {item.data.explanation && (
            <Text style={styles.summary} numberOfLines={3}>{item.data.explanation}</Text>
          )}
        </>
      );
    case "github":
      return (
        <>
          <View style={styles.prHeader}>
            <Text style={styles.prNumber}>#{item.data.number}</Text>
            <Text style={[styles.prState, item.data.state === "open" ? styles.prOpen : styles.prClosed]}>
              {item.data.state}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.data.title}</Text>
          <Text style={styles.meta}>by {item.data.author}</Text>
        </>
      );
  }
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
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
  author: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  bookRow: {
    flexDirection: "row",
  },
  bookCover: {
    width: 56,
    height: 84,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mathCategory: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  prHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  prNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  prState: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    textTransform: "uppercase",
  },
  prOpen: {
    color: "#059669",
    backgroundColor: "#ECFDF5",
  },
  prClosed: {
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
});
