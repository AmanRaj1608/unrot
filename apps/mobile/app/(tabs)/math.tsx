import { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, type MathTopic } from "../../lib/api";
import { SpeechButton } from "../../components/SpeechButton";
import { useSpeech } from "../../hooks/useSpeech";
import {
  estimateReadMinutes,
  getCategoryTheme,
  sortTopics,
  topicPreview,
} from "../../lib/math";

function TopicCard({
  topic,
  onPress,
}: {
  topic: MathTopic;
  onPress: () => void;
}) {
  const theme = getCategoryTheme(topic.category);
  const readMinutes = estimateReadMinutes(topic.explanation);

  return (
    <Pressable style={styles.topicCard} onPress={onPress}>
      <View style={styles.topicTopRow}>
        <View style={[styles.categoryPill, { backgroundColor: theme.chip }]}>
          <Text style={styles.categoryEmoji}>{theme.emoji}</Text>
          <Text style={[styles.categoryPillText, { color: theme.accent }]}>
            {topic.category}
          </Text>
        </View>
        <Text style={styles.readMeta}>{readMinutes} min</Text>
      </View>
      <Text style={styles.topicTitle}>{topic.title}</Text>
      <Text style={styles.topicPreview} numberOfLines={3}>
        {topicPreview(topic.explanation, 160)}
      </Text>
    </Pressable>
  );
}

export default function MathScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<MathTopic[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredTopicId, setFeaturedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, toggle, stop } = useSpeech();

  const loadTopics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      stop();
      setError(null);
      const [topicsData, categoriesData] = await Promise.all([
        api.math.topics(),
        api.math.categories().catch(() => []),
      ]);

      const sortedTopics = sortTopics(topicsData);
      const uniqueCategories = Array.from(
        new Set(sortedTopics.map((topic) => topic.category))
      );
      const nextCategories = categoriesData.length
        ? ["All", ...categoriesData]
        : ["All", ...uniqueCategories];

      setTopics(sortedTopics);
      setCategories(nextCategories);
      setSelectedCategory((current) =>
        nextCategories.includes(current) ? current : "All"
      );
    } catch {
      setError("Could not load math topics right now.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stop]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const filteredTopics = useMemo(() => {
    if (selectedCategory === "All") return topics;
    return topics.filter((topic) => topic.category === selectedCategory);
  }, [topics, selectedCategory]);

  useEffect(() => {
    if (!filteredTopics.length) {
      setFeaturedTopicId(null);
      return;
    }
    setFeaturedTopicId((current) => {
      if (current && filteredTopics.some((topic) => topic.id === current)) {
        return current;
      }
      return filteredTopics[0].id;
    });
  }, [filteredTopics]);

  const featuredTopic = useMemo(() => {
    if (!filteredTopics.length) return null;
    return (
      filteredTopics.find((topic) => topic.id === featuredTopicId) ??
      filteredTopics[0]
    );
  }, [filteredTopics, featuredTopicId]);

  const featuredTheme = getCategoryTheme(featuredTopic?.category);

  const openTopic = useCallback(
    (id: string) => {
      stop();
      router.push(`/math/${id}`);
    },
    [router, stop]
  );

  const shuffleFeatured = useCallback(() => {
    if (filteredTopics.length === 0) return;
    stop();

    if (filteredTopics.length === 1) {
      setFeaturedTopicId(filteredTopics[0].id);
      return;
    }

    const pool = filteredTopics.filter((topic) => topic.id !== featuredTopicId);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setFeaturedTopicId(next.id);
  }, [filteredTopics, featuredTopicId, stop]);

  const onSelectCategory = useCallback(
    (category: string) => {
      stop();
      setSelectedCategory(category);
    },
    [stop]
  );

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.hero}>
        <View style={styles.heroOrbA} />
        <View style={styles.heroOrbB} />
        <Text style={styles.eyebrow}>Math Playground</Text>
        <Text style={styles.heroTitle}>Pick a topic and make it stick.</Text>
        <Text style={styles.heroSubtitle}>
          Browse every lesson, shuffle for surprise drills, and read in quick
          sections.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((category) => {
          const selected = selectedCategory === category;
          return (
            <Pressable
              key={category}
              style={[styles.categoryChip, selected && styles.categoryChipActive]}
              onPress={() => onSelectCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selected && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {featuredTopic && (
        <View
          style={[
            styles.featuredCard,
            {
              backgroundColor: featuredTheme.soft,
              borderColor: featuredTheme.chip,
            },
          ]}
        >
          <View style={styles.featuredTopRow}>
            <View
              style={[styles.featuredBadge, { backgroundColor: featuredTheme.chip }]}
            >
              <Text style={styles.badgeEmoji}>{featuredTheme.emoji}</Text>
              <Text
                style={[styles.featuredBadgeText, { color: featuredTheme.accent }]}
              >
                {featuredTopic.category}
              </Text>
            </View>
            <Text style={styles.featuredMeta}>
              {estimateReadMinutes(featuredTopic.explanation)} min read
            </Text>
          </View>
          <Text style={styles.featuredTitle}>{featuredTopic.title}</Text>
          <Text style={styles.featuredPreview}>
            {topicPreview(featuredTopic.explanation, 210)}
          </Text>

          <View style={styles.featuredActions}>
            <Pressable
              style={[
                styles.openButton,
                { backgroundColor: featuredTheme.accent },
              ]}
              onPress={() => openTopic(featuredTopic.id)}
            >
              <Text style={styles.openButtonText}>Open lesson</Text>
            </Pressable>
            <Pressable style={styles.shuffleButton} onPress={shuffleFeatured}>
              <Ionicons name="shuffle-outline" size={16} color="#0F172A" />
              <Text style={styles.shuffleButtonText}>Shuffle</Text>
            </Pressable>
          </View>
          {featuredTopic.explanation && (
            <View style={styles.speechRow}>
              <SpeechButton
                isSpeaking={isSpeaking}
                onPress={() =>
                  toggle(`${featuredTopic.title}. ${featuredTopic.explanation}`)
                }
              />
            </View>
          )}
        </View>
      )}
      <View style={styles.listHeadingRow}>
        <Text style={styles.listHeading}>All Topics</Text>
        <Text style={styles.listCount}>{filteredTopics.length}</Text>
      </View>
    </View>
  );

  if (loading && topics.length === 0) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loaderText}>Loading your math playground...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={filteredTopics}
      keyExtractor={(topic) => topic.id}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <TopicCard topic={item} onPress={() => openTopic(item.id)} />
      )}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No topics in this category yet</Text>
          <Text style={styles.emptyHint}>Try switching category filters.</Text>
        </View>
      }
      ListFooterComponent={error ? <Text style={styles.error}>{error}</Text> : null}
      refreshing={refreshing}
      onRefresh={() => loadTopics(true)}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingHorizontal: 16, paddingBottom: 36 },
  headerWrap: { paddingTop: 16 },
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  heroOrbA: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    top: -50,
    right: -25,
  },
  heroOrbB: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(253, 186, 116, 0.2)",
    bottom: -35,
    left: -20,
  },
  eyebrow: {
    fontSize: 12,
    color: "#A5F3FC",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#CBD5E1",
  },
  categoryRow: {
    paddingVertical: 14,
    paddingHorizontal: 2,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: "#0F172A",
  },
  categoryChipText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#F8FAFC",
  },
  featuredCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  featuredTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
  },
  badgeEmoji: { fontSize: 14 },
  featuredBadgeText: { fontSize: 12, fontWeight: "700" },
  featuredMeta: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  featuredPreview: {
    fontSize: 14,
    lineHeight: 21,
    color: "#334155",
  },
  featuredActions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  openButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  openButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  shuffleButtonText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 13,
  },
  speechRow: { marginTop: 12, alignItems: "flex-start" },
  listHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listHeading: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  listCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  topicCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topicTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  categoryEmoji: { fontSize: 13 },
  categoryPillText: { fontSize: 11, fontWeight: "700" },
  readMeta: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  topicTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  topicPreview: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    gap: 12,
  },
  loaderText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: "#64748B",
  },
  error: {
    textAlign: "center",
    color: "#B91C1C",
    marginTop: 8,
    fontSize: 14,
    paddingBottom: 8,
  },
});
