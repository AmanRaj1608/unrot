import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Nothing here yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#94a3b8" },
});
