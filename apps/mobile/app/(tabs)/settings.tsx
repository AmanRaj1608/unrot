import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧠</Text>
      <Text style={styles.appName}>unrot</Text>
      <Text style={styles.tagline}>Feed your brain.</Text>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
