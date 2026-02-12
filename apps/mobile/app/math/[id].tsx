import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api, type MathTopic } from "../../lib/api";
import { SpeechButton } from "../../components/SpeechButton";
import { useSpeech } from "../../hooks/useSpeech";

export default function MathDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<MathTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, toggle, stop } = useSpeech();

  useEffect(() => {
    if (!id) return;
    api.math
      .get(id)
      .then(setTopic)
      .catch(() => setError("Failed to load topic"))
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

  if (error || !topic) {
    return <Text style={styles.error}>{error || "Topic not found"}</Text>;
  }

  const speechText = `${topic.title}. ${topic.explanation ?? ""}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{topic.category}</Text>
      </View>
      <Text style={styles.title}>{topic.title}</Text>

      {topic.explanation && (
        <>
          <View style={styles.speechRow}>
            <SpeechButton
              isSpeaking={isSpeaking}
              onPress={() => toggle(speechText)}
            />
          </View>
          <Text style={styles.explanation}>{topic.explanation}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", color: "#EF4444", marginTop: 40, fontSize: 15 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    color: "#8B5CF6",
    textTransform: "capitalize",
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  speechRow: { alignItems: "flex-start", marginBottom: 16 },
  explanation: { fontSize: 15, lineHeight: 26, color: "#4B5563" },
});
