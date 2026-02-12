import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      <Ionicons
        name={isSpeaking ? "stop" : "play"}
        size={16}
        color="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#EF4444",
  },
});
