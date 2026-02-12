import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { api, type MathTopic } from "../lib/api";
import { SpeechButton } from "./SpeechButton";
import { useSpeech } from "../hooks/useSpeech";

export function MathSection() {
  const [topic, setTopic] = useState<MathTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, toggle, stop } = useSpeech();

  const loadRandom = useCallback(async () => {
    try {
      stop();
      setLoading(true);
      setError(null);
      const data = await api.math.random();
      setTopic(data);
    } catch {
      setError("Failed to load topic");
    } finally {
      setLoading(false);
    }
  }, [stop]);

  useEffect(() => {
    loadRandom();
  }, []);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Math Refresher</Text>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color="#2563eb"
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : topic ? (
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{topic.category}</Text>
          </View>
          <Text style={styles.title}>{topic.title}</Text>

          {topic.explanation && (
            <View style={styles.speechRow}>
              <SpeechButton
                isSpeaking={isSpeaking}
                onPress={() =>
                  toggle(`${topic.title}. ${topic.explanation}`)
                }
              />
            </View>
          )}

          <Text style={styles.explanation}>{topic.explanation}</Text>
        </View>
      ) : null}

      <Pressable style={styles.nextButton} onPress={loadRandom}>
        <Text style={styles.nextText}>Next Topic</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 40 },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { fontSize: 12, color: "#2563eb", fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 12 },
  speechRow: { alignItems: "flex-start", marginBottom: 12 },
  explanation: { fontSize: 14, lineHeight: 24, color: "#334155" },
  nextButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  loader: { paddingVertical: 20 },
  error: { textAlign: "center", color: "#dc2626", paddingVertical: 12, fontSize: 14 },
});
