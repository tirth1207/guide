import { Pressable, StyleSheet, Text } from 'react-native';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.base, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D9D9DE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  selected: { backgroundColor: '#111', borderColor: '#111' },
  text: { color: '#333', fontWeight: '600' },
  selectedText: { color: '#fff' },
});
