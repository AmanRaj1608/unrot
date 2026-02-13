import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
      <View style={styles.sectionHeader}>
        <Ionicons name="calculator-outline" size={22} color="#10B981" />
        <Text style={styles.heading}>Math Refresher</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color="#10B981"
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 10,
  },
  badgeText: { fontSize: 12, color: "#059669", fontWeight: "600" },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  speechRow: { alignItems: "flex-start", marginBottom: 14 },
  explanation: { fontSize: 14, lineHeight: 24, color: "#4B5563" },
  nextButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  loader: { paddingVertical: 24 },
  error: { textAlign: "center", color: "#EF4444", paddingVertical: 12, fontSize: 14 },
});
