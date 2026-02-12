import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        headerStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
        }}
      />
      <Tabs.Screen name="books" options={{ href: null }} />
      <Tabs.Screen name="news" options={{ href: null }} />
      <Tabs.Screen name="math" options={{ href: null }} />
    </Tabs>
  );
}
