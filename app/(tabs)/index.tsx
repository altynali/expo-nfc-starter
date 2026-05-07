import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NfcSupportCard } from '@/components/nfc-support-card';
import { NfcBulletList, NfcScreen, NfcSection } from '@/components/nfc-ui';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <NfcScreen>
      <View style={styles.header}>
        <ThemedText type="title">Expo NFC Starter</ThemedText>
        <ThemedText style={styles.subtitle}>
          A practical path through the Expo NFC confusion: dev builds, real tags, no Expo Go.
        </ThemedText>
      </View>

      <NfcSection>
        <ThemedText type="subtitle">The pain</ThemedText>
        <ThemedText>
          NFC looks like it should be a quick Expo feature, then Expo Go gets in the way.
          Native NFC needs a custom build, platform-specific config, physical devices, and real
          tags.
        </ThemedText>
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">The solution</ThemedText>
        <ThemedText>
          This starter uses Expo development builds with `react-native-nfc-manager`, keeps the
          public NFC API small, and makes the unsupported paths explicit instead of pretending every
          platform behaves the same.
        </ThemedText>
      </NfcSection>

      <NfcSupportCard />

      <NfcSection>
        <ThemedText type="subtitle">Start here</ThemedText>
        <View style={styles.links}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/scan')}>
            <ThemedText style={[styles.link, { color: theme.tint }]}>Scan an NDEF tag</ThemedText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/preflight' as never)}>
            <ThemedText style={[styles.link, { color: theme.tint }]}>Run preflight checks</ThemedText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/write')}>
            <ThemedText style={[styles.link, { color: theme.tint }]}>Write a test NDEF tag</ThemedText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/troubleshooting')}>
            <ThemedText style={[styles.link, { color: theme.tint }]}>Open troubleshooting</ThemedText>
          </Pressable>
        </View>
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Why it helps</ThemedText>
        <NfcBulletList
          items={[
            'It starts from development builds, which is the correct Expo path for native NFC.',
            'It says no to Expo Go up front.',
            'It proves NDEF scan/write before you add business logic.',
            'It gives Android, iOS, and web separate expectations.',
            'It keeps rebuild rules visible so native config changes are not missed.',
          ]}
        />
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Setup flow</ThemedText>
        <NfcBulletList
          items={[
            'Install dependencies with Bun.',
            'Keep the react-native-nfc-manager config plugin in app.json.',
            'Build an Expo development client after native config changes.',
            'Run on a real Android device or NFC-capable iPhone.',
            'Test with real NDEF tags.',
          ]}
        />
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Platform limits</ThemedText>
        <NfcBulletList
          items={[
            'Android and iOS use native NFC through react-native-nfc-manager.',
            'Web only works where the browser exposes NDEFReader.',
            'Web NFC requires HTTPS except localhost and a direct user gesture.',
            'This starter is NDEF-only; advanced tag technologies are out of scope.',
          ]}
        />
      </NfcSection>
    </NfcScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  subtitle: {
    opacity: 0.78,
  },
  links: {
    gap: 12,
  },
  link: {
    fontWeight: '700',
    minHeight: 32,
    textAlignVertical: 'center',
  },
});
