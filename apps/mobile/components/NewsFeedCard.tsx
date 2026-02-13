import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import type { FeedItem } from "../lib/api";

interface Props {
  item: FeedItem;
  onViewed: (itemId: string) => void;
}

export function NewsFeedCard({ item, onViewed }: Props) {
  const handlePress = () => {
    const url = item.type === "news" ? item.url : item.htmlUrl;
    if (url) {
      onViewed(item.id);
      WebBrowser.openBrowserAsync(url);
    }
  };

  const isNews = item.type === "news";
  const badgeColor = isNews ? "#10B981" : "#6B7280";
  const badgeBg = isNews ? "#ECFDF5" : "#F3F4F6";
  const badgeIcon = isNews ? "newspaper-outline" : "logo-github";
  const badgeLabel = isNews ? item.section || "News" : "GitHub";

  return (
    <Pressable
      style={[styles.card, item.viewed && styles.cardViewed]}
      onPress={handlePress}
    >
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <Ionicons name={badgeIcon as any} size={12} color={badgeColor} />
        <Text style={[styles.badgeText, { color: badgeColor }]}>
          {badgeLabel}
        </Text>
      </View>

      {isNews ? (
        <>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.summary ? (
            <Text style={styles.summary} numberOfLines={3}>
              {item.summary}
            </Text>
          ) : null}
          {item.readTime && item.readTime > 0 ? (
            <Text style={styles.meta}>{item.readTime} min read</Text>
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.prHeader}>
            <Text style={styles.prNumber}>#{item.number}</Text>
            <Text
              style={[
                styles.prState,
                item.state === "open" ? styles.prOpen : styles.prClosed,
              ]}
            >
              {item.state}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.meta}>
            {item.author} · {item.repoFullName}
          </Text>
        </>
      )}
    </Pressable>
  );
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
  cardViewed: {
    opacity: 0.55,
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
