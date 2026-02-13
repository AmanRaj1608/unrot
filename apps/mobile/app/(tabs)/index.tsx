import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNewsFeed } from "../../hooks/useNewsFeed";
import { NewsFeedCard } from "../../components/NewsFeedCard";
import { FeedSkeleton } from "../../components/FeedSkeleton";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, loading, refreshing, error, refresh, markViewed } =
    useNewsFeed();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const header = (
    <View>
      <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.brand}>unrot</Text>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      <View style={styles.catchupRow}>
        <Pressable
          style={styles.catchupButton}
          onPress={() => router.push("/catchup")}
        >
          <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          <Text style={styles.catchupText}>Today's Catchup</Text>
        </Pressable>
      </View>

      <View style={styles.refreshRow}>
        <Text style={styles.sectionLabel}>News Feed</Text>
        <Pressable onPress={refresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={18} color="#10B981" />
        </Pressable>
      </View>

      {loading && <FeedSkeleton />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={loading ? [] : items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NewsFeedCard item={item} onViewed={markViewed} />
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        !loading && !error ? (
          <Text style={styles.empty}>No items to show</Text>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor="#10B981"
          progressViewOffset={insets.top}
        />
      }
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, marginBottom: 16 },
  brand: {
    fontSize: 13,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 15,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "500",
  },
  catchupRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  catchupButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 6,
  },
  catchupText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  refreshRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
  },
  refreshButton: {
    padding: 6,
  },
  error: {
    textAlign: "center",
    color: "#EF4444",
    marginTop: 20,
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
  },
});
