import { StyleSheet, View } from 'react-native';

import { NfcSupportCard } from '@/components/nfc-support-card';
import { NfcBulletList, NfcScreen, NfcSection } from '@/components/nfc-ui';
import { ThemedText } from '@/components/themed-text';

export default function TroubleshootingScreen() {
  return (
    <NfcScreen>
      <View style={styles.header}>
        <ThemedText type="title">Troubleshooting</ThemedText>
        <ThemedText style={styles.subtitle}>
          Most NFC failures are setup mismatches, not mysterious tag problems.
        </ThemedText>
      </View>

      <NfcSupportCard />

      <NfcSection>
        <ThemedText type="subtitle">Start with the boring checks</ThemedText>
        <NfcBulletList
          items={[
            'Are you in the installed development build instead of Expo Go?',
            'Did you rebuild after changing native config or plugins?',
            'Are you using a physical NFC-capable device?',
            'Are you testing with a real NDEF tag?',
            'Are you treating Web NFC as a limited fallback only?',
          ]}
        />
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Common messages</ThemedText>
        <NfcBulletList
          items={[
            'requires-dev-build: rebuild and open the custom dev client, not Expo Go.',
            'disabled: enable NFC in Android system settings.',
            'unsupported-browser: this browser does not expose NDEFReader.',
            'requires-https: Web NFC needs HTTPS except localhost.',
            'missing-permission: approve the OS or browser NFC prompt.',
          ]}
        />
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Real testing checklist</ThemedText>
        <NfcBulletList
          items={[
            'Use a physical Android device or NFC-capable iPhone.',
            'Use real NFC tags; emulators and simulators are not enough.',
            'Use known NDEF tags for scan tests.',
            'Use writable NDEF tags with enough capacity for write tests.',
            'Rebuild after native config, plugin, permission, or entitlement changes.',
          ]}
        />
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Platform limitations</ThemedText>
        <NfcBulletList
          items={[
            'Expo Go is unsupported because native NFC is not bundled there.',
            'Android and iOS flows use react-native-nfc-manager.',
            'Web NFC is limited and only available in browsers that support NDEFReader.',
            'This starter does not include low-level tag protocols or background NFC.',
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
});
