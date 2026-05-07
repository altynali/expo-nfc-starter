import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatNfcError, getSupport, type NfcSupport } from '@/src/nfc';

import { ThemedText } from './themed-text';

function formatSupport(support: NfcSupport | null): string {
  if (!support) {
    return 'Checking NFC support...';
  }

  if (support.isSupported) {
    return `${support.platform}: NDEF scan/write can be attempted`;
  }

  return `${support.platform}: unavailable (${support.reason ?? 'unknown'})`;
}

export function NfcSupportCard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [support, setSupport] = useState<NfcSupport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSupport = useCallback(async (isMounted: () => boolean = () => true) => {
    try {
      setError(null);
      const nextSupport = await getSupport();

      if (isMounted()) {
        setSupport(nextSupport);
      }
    } catch (nextError) {
      if (isMounted()) {
        setError(formatNfcError(nextError));
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadSupport(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadSupport]);

  const rows = useMemo(() => {
    if (!support) {
      return [];
    }

    return [
      ['Platform', support.platform],
      ['Reason', support.reason ?? 'none'],
      ['NDEF', support.capabilities.ndef ? 'yes' : 'no'],
      ['Scan', support.capabilities.scan ? 'yes' : 'no'],
      ['Write', support.capabilities.write ? 'yes' : 'no'],
      ['Dev build', support.capabilities.requiresDevBuild ? 'required' : 'not required'],
      ['HTTPS', support.capabilities.requiresHttps ? 'required' : 'not required'],
      ['User gesture', support.capabilities.requiresUserGesture ? 'required' : 'not required'],
    ];
  }, [support]);

  return (
    <View style={[styles.card, { borderColor: theme.icon }]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">NFC support</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => loadSupport()}
          style={styles.refreshButton}>
          <ThemedText style={[styles.refreshText, { color: theme.tint }]}>Refresh</ThemedText>
        </Pressable>
      </View>

      <ThemedText>{error ?? formatSupport(support)}</ThemedText>

      <View style={styles.rows}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <ThemedText style={styles.rowLabel}>{label}</ThemedText>
            <ThemedText style={styles.rowValue}>{value}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  refreshButton: {
    minHeight: 32,
    justifyContent: 'center',
  },
  refreshText: {
    fontWeight: '700',
  },
  rows: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rowLabel: {
    flex: 1,
    fontWeight: '600',
  },
  rowValue: {
    flex: 1.2,
    textAlign: 'right',
  },
});
