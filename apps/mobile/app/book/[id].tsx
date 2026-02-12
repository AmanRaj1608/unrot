import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api, type Book } from "../../lib/api";
import { SpeechButton } from "../../components/SpeechButton";
import { useSpeech } from "../../hooks/useSpeech";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, toggle, stop } = useSpeech();

  useEffect(() => {
    if (!id) return;
    api.books
      .get(id)
      .then(setBook)
      .catch(() => setError("Failed to load book"))
      .finally(() => setLoading(false));

    return () => {
      stop();
    };
  }, [id, stop]);

  if (loading) {
    return (
      <ActivityIndicator style={styles.center} size="large" color="#10B981" />
    );
  }

  if (error || !book) {
    return <Text style={styles.error}>{error || "Book not found"}</Text>;
  }

  const speechText = `${book.title} by ${book.author}. ${book.summary}. Key takeaways: ${book.keyTakeaways.join(". ")}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {book.category.replace(/-/g, " ")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.speechRow}>
        <SpeechButton
          isSpeaking={isSpeaking}
          onPress={() => toggle(speechText)}
        />
      </View>

      <Text style={styles.sectionTitle}>Summary</Text>
      <Text style={styles.body}>{book.summary}</Text>

      <Text style={styles.sectionTitle}>Key Takeaways</Text>
      {book.keyTakeaways.map((takeaway, i) => (
        <View key={i} style={styles.takeaway}>
          <Text style={styles.bullet}>{i + 1}.</Text>
          <Text style={styles.takeawayText}>{takeaway}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#EF4444", marginTop: 40, fontSize: 15 },
  header: { flexDirection: "row", marginBottom: 24 },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  headerInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  author: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    color: "#059669",
    textTransform: "capitalize",
    fontWeight: "600",
  },
  speechRow: { alignItems: "flex-start", marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: -0.2,
  },
  body: { fontSize: 15, lineHeight: 26, color: "#4B5563", marginBottom: 24 },
  takeaway: { flexDirection: "row", marginBottom: 12, paddingRight: 8 },
  bullet: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
    marginRight: 10,
    minWidth: 20,
  },
  takeawayText: { flex: 1, fontSize: 14, lineHeight: 22, color: "#4B5563" },
});
