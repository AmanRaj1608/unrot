import { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, type Book } from "../lib/api";
import { BookCard } from "./BookCard";
import { CategoryChip } from "./CategoryChip";

export function BooksSection() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async (category?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.books.list(category ?? undefined);
      setBooks(data);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.books.categories().then(setCategories).catch(() => {});
    loadBooks();
  }, [loadBooks]);

  const handleCategoryPress = (category: string) => {
    const next = selectedCategory === category ? null : category;
    setSelectedCategory(next);
    loadBooks(next);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="book-outline" size={22} color="#10B981" />
        <Text style={styles.heading}>Books</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContent}
      >
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => handleCategoryPress(cat)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="small" color="#10B981" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={() => router.push(`/book/${book.id}`)}
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
  },
  chipContent: { paddingHorizontal: 20, paddingBottom: 14 },
  loader: { paddingVertical: 24 },
  error: { textAlign: "center", color: "#EF4444", paddingVertical: 12, fontSize: 14 },
});
