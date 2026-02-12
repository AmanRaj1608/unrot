import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label.replace(/-/g, " ")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: "#10B981",
  },
  text: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  textSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
