import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BooksSection } from "../../components/BooksSection";
import { NewsSection } from "../../components/NewsSection";
import { MathSection } from "../../components/MathSection";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>unrot</Text>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.date}>{today}</Text>
      </View>
      <BooksSection />
      <NewsSection />
      <MathSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, marginBottom: 32 },
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
});
