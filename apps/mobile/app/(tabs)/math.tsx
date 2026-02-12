import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { api, type MathTopic } from "../../lib/api";
import { SpeechButton } from "../../components/SpeechButton";
import { useSpeech } from "../../hooks/useSpeech";

export default function MathScreen() {
  const [topic, setTopic] = useState<MathTopic | null>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <View style={styles.container}>
      <Pressable style={styles.refreshButton} onPress={loadRandom}>
        <Text style={styles.refreshText}>
          {topic ? "Next Topic" : "Get a Topic"}
        </Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          style={styles.center}
          size="large"
          color="#2563eb"
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : topic ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
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
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.hint}>
            Tap the button to get a random math topic
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  refreshButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  refreshText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { fontSize: 12, color: "#2563eb", fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 16 },
  speechRow: { alignItems: "flex-start", marginBottom: 16 },
  explanation: { fontSize: 15, lineHeight: 26, color: "#334155" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#dc2626", marginTop: 40, fontSize: 15 },
  hint: { fontSize: 15, color: "#94a3b8", textAlign: "center", paddingHorizontal: 40 },
});
