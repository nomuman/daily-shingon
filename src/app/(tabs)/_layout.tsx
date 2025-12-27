import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="morning"
        options={{
          title: "Morning",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="wb-sunny" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="night"
        options={{
          title: "Night",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="nights-stay" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "365日",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-today" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
