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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  section: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 11,
    color: "#9CA3AF",
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
});
