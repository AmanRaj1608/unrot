import { View, Text, StyleSheet } from "react-native";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>News - Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, color: "#64748b" },
});
