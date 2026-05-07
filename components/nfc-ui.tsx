import { type PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function NfcScreen({ children }: PropsWithChildren) {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </ThemedView>
  );
}

export function NfcSection({
  children,
  style,
}: PropsWithChildren<{
  style?: ViewStyle;
}>) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return <View style={[styles.section, { borderColor: theme.icon }, style]}>{children}</View>;
}

export function NfcButton({
  children,
  disabled,
  onPress,
  variant = 'primary',
}: PropsWithChildren<{
  disabled?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}>) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: theme.tint }
          : { backgroundColor: 'transparent', borderColor: theme.tint, borderWidth: 1 },
        (disabled || pressed) && styles.buttonPressed,
      ]}>
      <ThemedText
        lightColor={isPrimary ? '#fff' : theme.tint}
        darkColor={isPrimary ? '#11181C' : theme.tint}
        style={styles.buttonText}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function NfcOutput({ children }: PropsWithChildren) {
  return <ThemedText style={styles.output}>{children}</ThemedText>;
}

export function NfcBulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <ThemedText style={styles.bulletMark}>{'\u2022'}</ThemedText>
          <ThemedText style={styles.bulletText}>{item}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingTop: 72,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 16,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.48,
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  output: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  bullets: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletMark: {
    fontWeight: '700',
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
});

export const nfcUiStyles = styles;
