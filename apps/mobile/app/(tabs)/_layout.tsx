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
        options={{ href: null }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: "Books",
          tabBarLabel: "Books",
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarLabel: "News",
        }}
      />
      <Tabs.Screen
        name="math"
        options={{
          title: "Math",
          tabBarLabel: "Math",
        }}
      />
    </Tabs>
  );
}
