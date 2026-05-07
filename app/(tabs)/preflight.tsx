import Constants from 'expo-constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { NfcSupportCard } from '@/components/nfc-support-card';
import { NfcButton, NfcOutput, NfcScreen, NfcSection } from '@/components/nfc-ui';
import { ThemedText } from '@/components/themed-text';
import { formatNfcError, getSupport, type NfcSupport } from '@/src/nfc';

type CheckStatus = 'pass' | 'warn' | 'fail' | 'checking';

type PreflightCheck = {
  label: string;
  status: CheckStatus;
  detail: string;
};

function statusLabel(status: CheckStatus): string {
  if (status === 'pass') {
    return 'OK';
  }

  if (status === 'warn') {
    return 'CHECK';
  }

  if (status === 'fail') {
    return 'FIX';
  }

  return '...';
}

function getStatusStyle(status: CheckStatus) {
  if (status === 'pass') {
    return styles.pass;
  }

  if (status === 'warn') {
    return styles.warn;
  }

  if (status === 'fail') {
    return styles.fail;
  }

  return styles.checking;
}

function buildChecks(support: NfcSupport | null): PreflightCheck[] {
  const ownership = String(Constants.appOwnership ?? 'unknown');
  const executionEnvironment = String(Constants.executionEnvironment ?? 'unknown');
  const isWeb = Platform.OS === 'web';
  const isExpoGo = ownership === 'expo';

  return [
    {
      label: 'Runtime',
      status: isExpoGo ? 'fail' : isWeb ? 'warn' : 'pass',
      detail: isExpoGo
        ? 'Expo Go detected. Native NFC will not work here.'
        : isWeb
          ? 'Web fallback detected. Web NFC only works where NDEFReader is available.'
          : `Not Expo Go. ownership=${ownership}, env=${executionEnvironment}`,
    },
    {
      label: 'Native build',
      status: isWeb ? 'warn' : isExpoGo ? 'fail' : 'pass',
      detail: isWeb
        ? 'Native module checks do not apply on web.'
        : isExpoGo
          ? 'Build and install a development client.'
          : 'This runtime can include project native modules.',
    },
    {
      label: 'NFC module',
      status: support ? (support.reason === 'requires-dev-build' ? 'fail' : 'pass') : 'checking',
      detail: support
        ? support.reason === 'requires-dev-build'
          ? 'The native NFC module is missing from this build.'
          : `Platform reported ${support.platform}.`
        : 'Checking support...',
    },
    {
      label: 'Device support',
      status: support ? (support.isSupported ? 'pass' : 'warn') : 'checking',
      detail: support
        ? support.isSupported
          ? 'NDEF operations can be attempted.'
          : `Unavailable: ${support.reason ?? 'unknown'}.`
        : 'Checking support...',
    },
    {
      label: 'NFC enabled',
      status: support?.reason === 'disabled' ? 'fail' : support?.isSupported ? 'pass' : 'warn',
      detail:
        support?.reason === 'disabled'
          ? 'Enable NFC in Android system settings.'
          : support?.isSupported
            ? 'NFC is enabled or not separately required on this platform.'
            : 'Cannot confirm until support succeeds.',
    },
    {
      label: 'Web requirements',
      status: isWeb
        ? support?.reason === 'unsupported-browser' || support?.reason === 'requires-https'
          ? 'fail'
          : 'warn'
        : 'pass',
      detail: isWeb
        ? 'Needs NDEFReader, HTTPS except localhost, permission, and a button press.'
        : 'Native Android/iOS does not use Web NFC.',
    },
    {
      label: 'Real test setup',
      status: 'warn',
      detail: 'You still need a physical NFC-capable device and real NDEF tags.',
    },
  ];
}

export default function PreflightScreen() {
  const [support, setSupport] = useState<NfcSupport | null>(null);
  const [message, setMessage] = useState('Ready to check this runtime.');

  const runPreflight = useCallback(async (isMounted: () => boolean = () => true) => {
    setMessage('Checking NFC runtime...');

    try {
      const nextSupport = await getSupport();

      if (isMounted()) {
        setSupport(nextSupport);
        setMessage('Preflight complete.');
      }
    } catch (error) {
      if (isMounted()) {
        setMessage(formatNfcError(error));
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    runPreflight(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [runPreflight]);

  const checks = useMemo(() => buildChecks(support), [support]);

  return (
    <NfcScreen>
      <View style={styles.header}>
        <ThemedText type="title">Preflight</ThemedText>
        <ThemedText style={styles.subtitle}>
          Check the build, platform, and tag-testing assumptions before debugging NFC code.
        </ThemedText>
      </View>

      <NfcSupportCard />

      <NfcSection>
        <ThemedText type="subtitle">Checklist</ThemedText>
        <ThemedText>{message}</ThemedText>
        <View style={styles.checks}>
          {checks.map((check) => (
            <View key={check.label} style={styles.checkRow}>
              <ThemedText style={[styles.badge, getStatusStyle(check.status)]}>
                {statusLabel(check.status)}
              </ThemedText>
              <View style={styles.checkText}>
                <ThemedText style={styles.checkLabel}>{check.label}</ThemedText>
                <ThemedText>{check.detail}</ThemedText>
              </View>
            </View>
          ))}
        </View>
        <NfcButton onPress={() => runPreflight()}>Run Preflight Again</NfcButton>
      </NfcSection>

      <NfcSection>
        <ThemedText type="subtitle">Current runtime</ThemedText>
        <NfcOutput>
          {JSON.stringify(
            {
              platform: Platform.OS,
              appOwnership: Constants.appOwnership ?? 'unknown',
              executionEnvironment: Constants.executionEnvironment ?? 'unknown',
              support,
            },
            null,
            2,
          )}
        </NfcOutput>
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
  checks: {
    gap: 12,
  },
  checkRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '800',
    minWidth: 54,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
  pass: {
    backgroundColor: '#d8f5df',
    color: '#126c2e',
  },
  warn: {
    backgroundColor: '#fff0c2',
    color: '#7a5200',
  },
  fail: {
    backgroundColor: '#ffe0e0',
    color: '#9b1c1c',
  },
  checking: {
    backgroundColor: '#e9eef5',
    color: '#3e4c5f',
  },
  checkText: {
    flex: 1,
    gap: 2,
  },
  checkLabel: {
    fontWeight: '700',
  },
});
