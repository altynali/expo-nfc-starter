import { Platform } from 'react-native';

import type {
  NdefRecord,
  NdefTag,
  NfcCapabilities,
  NfcPlatform,
  NfcSupport,
} from './types';
import { createNfcOperationError, normalizeNfcError } from './errors';

export type {
  NdefRecord,
  NdefTag,
  NfcCapabilities,
  NfcPlatform,
  NfcSupport,
  NfcUnavailableReason,
} from './types';
export {
  createNfcOperationError,
  formatNfcError,
  NfcOperationError,
  normalizeNfcError,
  type NfcOperation,
  type NfcOperationErrorCode,
} from './errors';

type NfcImplementation = {
  getSupport: () => Promise<NfcSupport>;
  scanNdef: () => Promise<NdefTag>;
  writeNdef: (records: NdefRecord[]) => Promise<NdefTag>;
  cancelScan: () => Promise<void>;
};

const unsupportedCapabilities: NfcCapabilities = {
  ndef: false,
  scan: false,
  write: false,
  cancelScan: false,
  requiresDevBuild: false,
  requiresHttps: false,
  requiresUserGesture: false,
};

function getPlatform(): NfcPlatform {
  if (Platform.OS === 'android' || Platform.OS === 'ios' || Platform.OS === 'web') {
    return Platform.OS;
  }

  return 'unsupported';
}

function unsupportedImplementation(platform: NfcPlatform): NfcImplementation {
  return {
    async getSupport() {
      return {
        platform,
        isSupported: false,
        reason: 'unsupported-device',
        capabilities: unsupportedCapabilities,
      };
    },
    async scanNdef() {
      throw createNfcOperationError({
        code: 'unsupported',
        message: 'NFC is not supported on this platform.',
        operation: 'scan',
        reason: 'unsupported-device',
      });
    },
    async writeNdef() {
      throw createNfcOperationError({
        code: 'unsupported',
        message: 'NFC is not supported on this platform.',
        operation: 'write',
        reason: 'unsupported-device',
      });
    },
    async cancelScan() {
      return undefined;
    },
  };
}

function missingNativeImplementation(platform: NfcPlatform, cause?: unknown): NfcImplementation {
  const capabilities: NfcCapabilities = {
    ndef: false,
    scan: false,
    write: false,
    cancelScan: false,
    requiresDevBuild: true,
    requiresHttps: false,
    requiresUserGesture: false,
  };

  return {
    async getSupport() {
      return {
        platform,
        isSupported: false,
        reason: 'requires-dev-build',
        capabilities,
      };
    },
    async scanNdef() {
      throw createNfcOperationError({
        code: 'native-module-unavailable',
        message: 'Native NFC is unavailable. Build and run an Expo development build or custom dev client.',
        operation: 'scan',
        reason: 'requires-dev-build',
        cause,
      });
    },
    async writeNdef() {
      throw createNfcOperationError({
        code: 'native-module-unavailable',
        message: 'Native NFC is unavailable. Build and run an Expo development build or custom dev client.',
        operation: 'write',
        reason: 'requires-dev-build',
        cause,
      });
    },
    async cancelScan() {
      return undefined;
    },
  };
}

async function getImplementation(): Promise<NfcImplementation> {
  const platform = getPlatform();

  if (platform === 'web') {
    return import('./web');
  }

  if (platform === 'android' || platform === 'ios') {
    try {
      return await import('./native');
    } catch (error) {
      return missingNativeImplementation(platform, error);
    }
  }

  return unsupportedImplementation(platform);
}

export async function getSupport(): Promise<NfcSupport> {
  return (await getImplementation()).getSupport();
}

export async function scanNdef(): Promise<NdefTag> {
  try {
    return await (await getImplementation()).scanNdef();
  } catch (error) {
    throw normalizeNfcError(error, {
      operation: 'scan',
      code: 'read-failed',
      message: 'NDEF scan failed.',
      reason: 'unknown',
    });
  }
}

export async function writeNdef(records: NdefRecord[]): Promise<NdefTag> {
  try {
    return await (await getImplementation()).writeNdef(records);
  } catch (error) {
    throw normalizeNfcError(error, {
      operation: 'write',
      code: 'write-failed',
      message: 'NDEF write failed.',
      reason: 'unknown',
    });
  }
}

export async function cancelScan(): Promise<void> {
  try {
    return await (await getImplementation()).cancelScan();
  } catch (error) {
    throw normalizeNfcError(error, {
      operation: 'cancel',
      code: 'unknown',
      message: 'Could not cancel the NFC scan.',
      reason: 'unknown',
    });
  }
}
