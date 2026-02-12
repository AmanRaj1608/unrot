import { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
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
      <Text style={styles.heading}>Books</Text>

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
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color="#2563eb"
        />
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
  section: { marginBottom: 24 },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chipContent: { paddingHorizontal: 16, paddingBottom: 12 },
  loader: { paddingVertical: 20 },
  error: { textAlign: "center", color: "#dc2626", paddingVertical: 12, fontSize: 14 },
});
