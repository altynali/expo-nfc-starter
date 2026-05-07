import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NfcSupportCard } from '@/components/nfc-support-card';
import { NfcButton, NfcOutput, NfcScreen, NfcSection } from '@/components/nfc-ui';
import { ThemedText } from '@/components/themed-text';
import { cancelScan, formatNfcError, scanNdef, type NdefTag } from '@/src/nfc';

function formatTag(tag: NdefTag | null): string {
  if (!tag) {
    return 'No tag scanned yet.';
  }

  return JSON.stringify(
    {
      id: tag.id,
      platform: tag.platform,
      records: tag.records,
      maxSize: tag.maxSize,
      isWritable: tag.isWritable,
    },
    null,
    2,
  );
}

export default function ScanScreen() {
  const [tag, setTag] = useState<NdefTag | null>(null);
  const [message, setMessage] = useState('Ready to scan.');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setMessage('Scanning for an NDEF tag...');

    try {
      setTag(await scanNdef());
      setMessage('Tag scanned.');
    } catch (error) {
      setMessage(formatNfcError(error));
    } finally {
      setIsScanning(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelScan();
      setMessage('Scan cancelled.');
    } catch (error) {
      setMessage(formatNfcError(error));
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <NfcScreen>
      <View style={styles.header}>
        <ThemedText type="title">Scan NDEF</ThemedText>
        <ThemedText style={styles.subtitle}>
          Hold a real NDEF tag near a physical device running a development build.
        </ThemedText>
      </View>

      <NfcSupportCard />

      <NfcSection>
        <ThemedText type="subtitle">Scanner</ThemedText>
        <ThemedText>{message}</ThemedText>
        <View style={styles.actions}>
          <NfcButton disabled={isScanning} onPress={handleScan}>
            Scan NDEF
          </NfcButton>
          <NfcButton disabled={!isScanning} onPress={handleCancel} variant="secondary">
            Cancel Scan
          </NfcButton>
        </View>
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Tag data</ThemedText>
        <NfcOutput>{formatTag(tag)}</NfcOutput>
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
  actions: {
    gap: 10,
  },
});
