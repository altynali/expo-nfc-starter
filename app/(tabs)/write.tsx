import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NfcSupportCard } from '@/components/nfc-support-card';
import { NfcButton, NfcOutput, NfcScreen, NfcSection } from '@/components/nfc-ui';
import { ThemedText } from '@/components/themed-text';
import { formatNfcError, writeNdef, type NdefRecord, type NdefTag } from '@/src/nfc';

const testRecord: NdefRecord = {
  recordType: 'text',
  data: 'Hello from Expo NFC starter',
  lang: 'en',
};

function formatResult(tag: NdefTag | null): string {
  if (!tag) {
    return JSON.stringify([testRecord], null, 2);
  }

  return JSON.stringify(
    {
      platform: tag.platform,
      isWritable: tag.isWritable,
      records: tag.records,
    },
    null,
    2,
  );
}

export default function WriteScreen() {
  const [tag, setTag] = useState<NdefTag | null>(null);
  const [message, setMessage] = useState('Ready to write a test text record.');
  const [isWriting, setIsWriting] = useState(false);

  const handleWrite = async () => {
    setIsWriting(true);
    setMessage('Hold a writable NDEF tag near the device...');

    try {
      setTag(await writeNdef([testRecord]));
      setMessage('Test NDEF record written.');
    } catch (error) {
      setMessage(formatNfcError(error));
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <NfcScreen>
      <View style={styles.header}>
        <ThemedText type="title">Write NDEF</ThemedText>
        <ThemedText style={styles.subtitle}>
          Writes one plain text NDEF record to a writable real tag.
        </ThemedText>
      </View>

      <NfcSupportCard />

      <NfcSection>
        <ThemedText type="subtitle">Writer</ThemedText>
        <ThemedText>{message}</ThemedText>
        <NfcButton disabled={isWriting} onPress={handleWrite}>
          Write Test NDEF
        </NfcButton>
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Payload</ThemedText>
        <NfcOutput>{formatResult(tag)}</NfcOutput>
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
