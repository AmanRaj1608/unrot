import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import type { FeedFilter } from "../lib/feed";

const FILTERS: { key: FeedFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "news", label: "News" },
  { key: "book", label: "Books" },
  { key: "math", label: "Math" },
  { key: "github", label: "GitHub" },
];

interface Props {
  selected: FeedFilter;
  onSelect: (filter: FeedFilter) => void;
}

export function FilterBar({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => (
        <Pressable
          key={f.key}
          style={[styles.pill, selected === f.key && styles.pillSelected]}
          onPress={() => onSelect(f.key)}
        >
          <Text style={[styles.text, selected === f.key && styles.textSelected]}>
            {f.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
  },
  pillSelected: {
    backgroundColor: "#10B981",
  },
  text: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  textSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
