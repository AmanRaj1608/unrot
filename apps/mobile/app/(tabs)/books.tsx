import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, type Book } from "../../lib/api";
import { BookCard } from "../../components/BookCard";
import { CategoryChip } from "../../components/CategoryChip";

export default function BooksScreen() {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={22} color="#10B981" />
        <Text style={styles.headerTitle}>Books</Text>
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
        <ActivityIndicator style={styles.center} size="large" color="#10B981" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  chipContent: { paddingHorizontal: 20, paddingBottom: 14 },
  list: { paddingTop: 4, paddingBottom: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#EF4444", marginTop: 40, fontSize: 15 },
});
