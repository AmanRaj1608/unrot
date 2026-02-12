import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Article } from "../lib/api";

interface Props {
  article: Article;
  onPress: () => void;
}

export function ArticleCard({ article, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.meta}>
        <Text style={styles.section}>{article.section}</Text>
        {article.readTime > 0 && (
          <Text style={styles.readTime}>{article.readTime} min</Text>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {article.title}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {article.summary}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  section: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748b",
  },
});
