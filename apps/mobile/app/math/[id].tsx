import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, type MathTopic } from "../../lib/api";
import { SpeechButton } from "../../components/SpeechButton";
import { useSpeech } from "../../hooks/useSpeech";
import {
  estimateReadMinutes,
  getCategoryTheme,
  parseTopicSections,
} from "../../lib/math";

function getSectionIcon(title: string): keyof typeof Ionicons.glyphMap {
  const key = title.toLowerCase();
  if (key.includes("core")) return "bulb-outline";
  if (key.includes("toolkit")) return "construct-outline";
  if (key.includes("real-life")) return "rocket-outline";
  if (key.includes("workflow")) return "map-outline";
  if (key.includes("formula")) return "calculator-outline";
  if (key.includes("approx")) return "options-outline";
  if (key.includes("interpret")) return "analytics-outline";
  return "ellipse-outline";
}

export default function MathDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<MathTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleError, setShuffleError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, toggle, stop } = useSpeech();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setShuffleError(null);

    api.math
      .get(id)
      .then(setTopic)
      .catch(() => setError("Failed to load topic"))
      .finally(() => setLoading(false));

    return () => {
      stop();
    };
  }, [id, stop]);

  const theme = useMemo(() => getCategoryTheme(topic?.category), [topic?.category]);
  const sections = useMemo(
    () => parseTopicSections(topic?.explanation),
    [topic?.explanation]
  );
  const readMinutes = useMemo(
    () => estimateReadMinutes(topic?.explanation),
    [topic?.explanation]
  );
  const speechText = useMemo(
    () => `${topic?.title ?? ""}. ${topic?.explanation ?? ""}`.trim(),
    [topic?.title, topic?.explanation]
  );

  const handleShuffle = useCallback(async () => {
    try {
      stop();
      setShuffleError(null);
      setShuffling(true);
      const nextTopic = await api.math.random();
      router.replace(`/math/${nextTopic.id}`);
    } catch {
      setShuffleError("Could not load another topic right now.");
    } finally {
      setShuffling(false);
    }
  }, [router, stop]);

  if (loading) {
    return (
      <ActivityIndicator style={styles.center} size="large" color="#10B981" />
    );
  }

  if (error || !topic) {
    return (
      <View style={styles.centerWrap}>
        <Text style={styles.error}>{error || "Topic not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.soft, borderColor: theme.chip },
        ]}
      >
        <View style={styles.heroTopRow}>
          <View style={[styles.badge, { backgroundColor: theme.chip }]}>
            <Text style={styles.badgeEmoji}>{theme.emoji}</Text>
            <Text style={[styles.badgeText, { color: theme.accent }]}>
              {topic.category}
            </Text>
          </View>
          <Text style={styles.metaText}>{readMinutes} min read</Text>
        </View>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.metaSubtitle}>
          {Math.max(1, sections.length)} section
          {sections.length === 1 ? "" : "s"} to master
        </Text>

        {topic.explanation && (
          <>
            <View style={styles.actionRow}>
              <SpeechButton
                isSpeaking={isSpeaking}
                onPress={() => toggle(speechText)}
              />
              <Pressable
                style={styles.shuffleButton}
                onPress={handleShuffle}
                disabled={shuffling}
              >
                <Ionicons
                  name="shuffle-outline"
                  size={16}
                  color={shuffling ? "#94A3B8" : "#0F172A"}
                />
                <Text
                  style={[
                    styles.shuffleText,
                    shuffling && styles.shuffleTextDisabled,
                  ]}
                >
                  {shuffling ? "Loading..." : "Shuffle topic"}
                </Text>
              </Pressable>
            </View>
            {shuffleError ? (
              <Text style={styles.shuffleError}>{shuffleError}</Text>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.sectionList}>
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <View key={`${section.title}-${index}`} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.sectionIconWrap,
                    { backgroundColor: theme.chip },
                  ]}
                >
                  <Ionicons
                    name={getSectionIcon(section.title)}
                    size={14}
                    color={theme.accent}
                  />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.explanation}>{section.content}</Text>
            </View>
          ))
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.explanation}>
              {topic.explanation ?? "No explanation available yet."}
            </Text>
          </View>
        )}
      </View>

      <Pressable style={styles.backButton} onPress={() => router.push("/math")}>
        <Ionicons name="library-outline" size={16} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Back to Math Playground</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerWrap: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  error: { textAlign: "center", color: "#DC2626", fontSize: 15 },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  badgeEmoji: { fontSize: 13 },
  badgeText: {
    fontSize: 12,
    textTransform: "capitalize",
    fontWeight: "700",
  },
  metaText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  metaSubtitle: {
    fontSize: 13,
    color: "#334155",
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
    lineHeight: 31,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  shuffleText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
  },
  shuffleTextDisabled: {
    color: "#94A3B8",
  },
  shuffleError: {
    marginTop: 8,
    fontSize: 12,
    color: "#B91C1C",
  },
  sectionList: {
    marginTop: 14,
    gap: 10,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  explanation: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
