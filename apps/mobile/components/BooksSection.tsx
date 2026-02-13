import { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, type Book } from "../lib/api";

export function BooksSection() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.books.list();
      setBooks(data);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="book-outline" size={22} color="#10B981" />
        <Text style={styles.heading}>Books</Text>
        <Pressable
          onPress={() => router.push("/books")}
          style={styles.seeAll}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <Ionicons name="chevron-forward" size={16} color="#10B981" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="small" color="#10B981" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {books.slice(0, 8).map((book) => (
            <Pressable
              key={book.id}
              style={styles.card}
              onPress={() => router.push(`/book/${book.id}`)}
            >
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.cover}
              />
              <Text style={styles.title} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                {book.author}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
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
  scrollContent: { paddingHorizontal: 20, gap: 14 },
  card: {
    width: 110,
  },
  cover: {
    width: 110,
    height: 160,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 17,
    marginBottom: 2,
  },
  author: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  loader: { paddingVertical: 24 },
  error: { textAlign: "center", color: "#EF4444", paddingVertical: 12, fontSize: 14 },
});
