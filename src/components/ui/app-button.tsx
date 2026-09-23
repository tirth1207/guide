import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ label, variant = 'primary', style, ...props }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}>
      <Text style={variant === 'primary' ? styles.primaryText : styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  primary: { backgroundColor: Colors.light.text },
  secondary: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: '#D9D9DE',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryText: { color: Colors.light.text, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
