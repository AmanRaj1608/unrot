import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFeed } from "../../hooks/useFeed";
import { FeedCard } from "../../components/FeedCard";
import { FilterBar } from "../../components/FilterBar";
import { FeedSkeleton } from "../../components/FeedSkeleton";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { items, loading, refreshing, error, refresh, filter, setFilter } =
    useFeed();

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
      <FilterBar selected={filter} onSelect={setFilter} />
      {loading && <FeedSkeleton />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={loading ? [] : items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard item={item} />}
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
  hero: { paddingHorizontal: 20, marginBottom: 20 },
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
