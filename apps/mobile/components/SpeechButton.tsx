import { useState } from "react";
import {
  Pressable,
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSpeechSettings } from "../lib/SpeechContext";

interface Props {
  isSpeaking: boolean;
  onPress: () => void;
}

const SPEED_PRESETS = [
  { label: "0.5x", value: 0.5 },
  { label: "0.75x", value: 0.75 },
  { label: "1x", value: 0.9 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2.0 },
];

const PITCH_PRESETS = [
  { label: "Low", value: 0.75 },
  { label: "Normal", value: 1.0 },
  { label: "High", value: 1.25 },
];

export function SpeechButton({ isSpeaking, onPress }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const { settings, setRate, setPitch, setVoice, voices } =
    useSpeechSettings();

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.playButton, isSpeaking && styles.playButtonActive]}
        onPress={onPress}
      >
        <Ionicons
          name={isSpeaking ? "stop" : "play"}
          size={16}
          color="#FFFFFF"
        />
      </Pressable>

      <Pressable
        style={styles.gearButton}
        onPress={() => setShowSettings(true)}
      >
        <Ionicons name="settings-outline" size={14} color="#6B7280" />
      </Pressable>

      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.card} onStartShouldSetResponder={() => true}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Speech Settings</Text>
              <Pressable onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={styles.sectionLabel}>Speed</Text>
            <View style={styles.chipRow}>
              {SPEED_PRESETS.map((p) => (
                <Pressable
                  key={p.label}
                  style={[
                    styles.chip,
                    settings.rate === p.value && styles.chipSelected,
                  ]}
                  onPress={() => setRate(p.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      settings.rate === p.value && styles.chipTextSelected,
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Pitch</Text>
            <View style={styles.chipRow}>
              {PITCH_PRESETS.map((p) => (
                <Pressable
                  key={p.label}
                  style={[
                    styles.chip,
                    settings.pitch === p.value && styles.chipSelected,
                  ]}
                  onPress={() => setPitch(p.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      settings.pitch === p.value && styles.chipTextSelected,
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Voice</Text>
            <ScrollView style={styles.voiceList}>
              <Pressable
                style={[
                  styles.voiceItem,
                  settings.voiceIdentifier === null && styles.voiceItemSelected,
                ]}
                onPress={() => setVoice(null)}
              >
                <Text
                  style={[
                    styles.voiceText,
                    settings.voiceIdentifier === null &&
                      styles.voiceTextSelected,
                  ]}
                >
                  Default
                </Text>
              </Pressable>
              {voices.map((v) => (
                <Pressable
                  key={v.identifier}
                  style={[
                    styles.voiceItem,
                    settings.voiceIdentifier === v.identifier &&
                      styles.voiceItemSelected,
                  ]}
                  onPress={() => setVoice(v.identifier)}
                >
                  <Text
                    style={[
                      styles.voiceText,
                      settings.voiceIdentifier === v.identifier &&
                        styles.voiceTextSelected,
                    ]}
                  >
                    {v.name}
                  </Text>
                  {v.quality === "Enhanced" && (
                    <View style={styles.qualityBadge}>
                      <Text style={styles.qualityText}>Enhanced</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonActive: {
    backgroundColor: "#EF4444",
  },
  gearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
  },
  chipSelected: {
    backgroundColor: "#10B981",
  },
  chipText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  voiceList: {
    maxHeight: 200,
  },
  voiceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  voiceItemSelected: {
    backgroundColor: "#ECFDF5",
  },
  voiceText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  voiceTextSelected: {
    color: "#059669",
    fontWeight: "600",
  },
  qualityBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  qualityText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
});
