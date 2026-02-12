import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FAFAFA" },
        headerShadowVisible: false,
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "700", color: "#111827" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]" options={{ headerTitle: "" }} />
    </Stack>
  );
}
