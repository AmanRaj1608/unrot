import { ScrollView, StyleSheet } from "react-native";
import { BooksSection } from "../../components/BooksSection";
import { NewsSection } from "../../components/NewsSection";
import { MathSection } from "../../components/MathSection";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <BooksSection />
      <NewsSection />
      <MathSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { paddingTop: 16, paddingBottom: 40 },
});
