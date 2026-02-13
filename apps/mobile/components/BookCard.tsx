import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import type { Book } from "../lib/api";

interface Props {
  book: Book;
  onPress: () => void;
}

export function BookCard({ book, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: book.coverUrl }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>{book.author}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {book.category.replace(/-/g, " ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cover: {
    width: 56,
    height: 84,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 11,
    color: "#059669",
    textTransform: "capitalize",
    fontWeight: "600",
  },
});
