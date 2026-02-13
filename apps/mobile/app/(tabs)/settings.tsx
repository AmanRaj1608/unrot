import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRepos } from "../../lib/RepoContext";
import { useUser } from "../../lib/UserContext";
import { api } from "../../lib/api";

const USERS = ["aman", "another"] as const;

export default function SettingsScreen() {
  const { repos, addRepo, removeRepo } = useRepos();
  const { userId, setUserId } = useUser();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim().replace(/^https?:\/\/github\.com\//, "");
    const parts = trimmed.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      Alert.alert("Invalid format", "Enter as owner/repo (e.g. facebook/react)");
      return;
    }
    addRepo(parts[0], parts[1]);
    api.feed.repos.add(parts[0], parts[1]).catch(() => {});
    setInput("");
  };

  const handleRemove = (owner: string, repo: string) => {
    removeRepo(owner, repo);
    api.feed.repos.remove(owner, repo).catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandSection}>
        <Text style={styles.emoji}>🧠</Text>
        <Text style={styles.appName}>unrot</Text>
        <Text style={styles.tagline}>Feed your brain.</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={20} color="#111827" />
          <Text style={styles.sectionTitle}>User</Text>
        </View>
        <Text style={styles.sectionHint}>
          Select your profile to track viewed items.
        </Text>

        {USERS.map((id) => (
          <Pressable
            key={id}
            style={styles.radioRow}
            onPress={() => setUserId(id)}
          >
            <Ionicons
              name={userId === id ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={userId === id ? "#10B981" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.radioText,
                userId === id && styles.radioTextSelected,
              ]}
            >
              {id}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.section, { marginTop: 24 }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="logo-github" size={20} color="#111827" />
          <Text style={styles.sectionTitle}>GitHub Repos</Text>
        </View>
        <Text style={styles.sectionHint}>
          Track pull requests from repos you follow.
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="owner/repo"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <Pressable style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {repos.map((r) => (
          <View key={`${r.owner}/${r.repo}`} style={styles.repoRow}>
            <Ionicons name="git-branch-outline" size={16} color="#6B7280" />
            <Text style={styles.repoText}>{r.owner}/{r.repo}</Text>
            <Pressable onPress={() => handleRemove(r.owner, r.repo)}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        ))}

        {repos.length === 0 && (
          <Text style={styles.emptyText}>No repos configured yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { paddingBottom: 40 },
  brandSection: {
    alignItems: "center",
    paddingVertical: 32,
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
  section: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  repoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  repoText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  radioText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  radioTextSelected: {
    color: "#111827",
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 12,
  },
});
