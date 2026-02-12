import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
  isSpeaking: boolean;
  onPress: () => void;
}

export function SpeechButton({ isSpeaking, onPress }: Props) {
  return (
    <Pressable
      style={[styles.button, isSpeaking && styles.buttonActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, isSpeaking && styles.textActive]}>
        {isSpeaking ? "Stop" : "Listen"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#2563eb",
  },
  buttonActive: {
    backgroundColor: "#dc2626",
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  textActive: {
    color: "#ffffff",
  },
});
