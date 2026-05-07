import { Platform } from 'react-native';
import NfcManager, {
  Ndef,
  NdefStatus,
  NfcError,
  NfcTech,
  type NdefRecord as NativeNdefRecord,
  type TagEvent,
} from 'react-native-nfc-manager';

import { createNfcOperationError, normalizeNfcError, type NfcOperation } from './errors';
import type {
  NdefRecord,
  NdefTag,
  NfcCapabilities,
  NfcPlatform,
  NfcSupport,
} from './types';

const platform = Platform.OS as Extract<NfcPlatform, 'android' | 'ios'>;

const nativeCapabilities: NfcCapabilities = {
  ndef: true,
  scan: true,
  write: true,
  cancelScan: true,
  requiresDevBuild: true,
  requiresHttps: false,
  requiresUserGesture: false,
};

function toBytes(data: string | number[] | undefined): number[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data) {
    return [];
  }

  return Ndef.util.stringToBytes(data);
}

function normalizeNativeRecord(record: NativeNdefRecord): NdefRecord {
  const payload = record.payload ?? [];
  const payloadBytes = Uint8Array.from(payload);

  if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
    return {
      recordType: 'text',
      data: Ndef.text.decodePayload(payloadBytes),
      id: record.id ? Ndef.util.bytesToHexString(record.id) : undefined,
      lang: 'und',
    };
  }

  if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
    return {
      recordType: 'url',
      data: Ndef.uri.decodePayload(payloadBytes),
      id: record.id ? Ndef.util.bytesToHexString(record.id) : undefined,
    };
  }

  if (record.tnf === Ndef.TNF_MIME_MEDIA) {
    return {
      recordType: 'mime',
      mediaType: Array.isArray(record.type) ? Ndef.util.bytesToString(record.type) : record.type,
      data: payload,
      id: record.id ? Ndef.util.bytesToHexString(record.id) : undefined,
    };
  }

  if (record.tnf === Ndef.TNF_EMPTY) {
    return {
      recordType: 'empty',
      id: record.id ? Ndef.util.bytesToHexString(record.id) : undefined,
    };
  }

  return {
    recordType: 'unknown',
    data: payload,
    id: record.id ? Ndef.util.bytesToHexString(record.id) : undefined,
  };
}

function toNativeRecord(record: NdefRecord): NativeNdefRecord {
  if (record.recordType === 'text') {
    return Ndef.textRecord(String(record.data ?? ''), record.lang);
  }

  if (record.recordType === 'url') {
    return Ndef.uriRecord(String(record.data ?? ''));
  }

  if (record.recordType === 'mime') {
    return Ndef.record(
      Ndef.TNF_MIME_MEDIA,
      record.mediaType ?? 'application/octet-stream',
      record.id ?? [],
      toBytes(record.data),
    );
  }

  if (record.recordType === 'empty') {
    return Ndef.record(Ndef.TNF_EMPTY, '', record.id ?? [], []);
  }

  return Ndef.record(Ndef.TNF_UNKNOWN, '', record.id ?? [], toBytes(record.data));
}

function normalizeTag(tag: TagEvent | null): NdefTag {
  return {
    platform,
    id: tag?.id,
    records: tag?.ndefMessage?.map(normalizeNativeRecord) ?? [],
    maxSize: tag?.maxSize,
    raw: tag,
  };
}

async function assertSupported(): Promise<NfcSupport> {
  const support = await getSupport();

  if (!support.isSupported) {
    throw createNfcOperationError({
      code: support.reason === 'requires-dev-build' ? 'native-module-unavailable' : 'unsupported',
      message: `NFC is unavailable on ${support.platform}: ${support.reason ?? 'unknown'}.`,
      operation: 'get-support',
      reason: support.reason ?? 'unknown',
    });
  }

  return support;
}

function normalizeNativeError(error: unknown, operation: NfcOperation) {
  if (error instanceof NfcError.UserCancel) {
    return createNfcOperationError({
      code: 'cancelled',
      message: operation === 'write' ? 'NFC write was cancelled.' : 'NFC scan was cancelled.',
      operation,
      cause: error,
    });
  }

  if (error instanceof NfcError.RadioDisabled) {
    return createNfcOperationError({
      code: 'unsupported',
      message: 'NFC is disabled on this device.',
      operation,
      reason: 'disabled',
      cause: error,
    });
  }

  if (error instanceof NfcError.SecurityViolation) {
    return createNfcOperationError({
      code: 'permission-denied',
      message: 'NFC permission is missing or denied.',
      operation,
      reason: 'missing-permission',
      cause: error,
    });
  }

  if (error instanceof NfcError.UnsupportedFeature) {
    return createNfcOperationError({
      code: 'unsupported',
      message: 'This device does not support the requested NDEF operation.',
      operation,
      reason: 'unsupported-device',
      cause: error,
    });
  }

  if (error instanceof NfcError.TagNotWritable) {
    return createNfcOperationError({
      code: 'not-writable',
      message: 'The detected NDEF tag is not writable.',
      operation,
      reason: 'unsupported-device',
      cause: error,
    });
  }

  if (error instanceof NfcError.TagSizeTooSmall) {
    return createNfcOperationError({
      code: 'tag-too-small',
      message: 'The NDEF message is larger than this tag can store.',
      operation,
      reason: 'unsupported-device',
      cause: error,
    });
  }

  if (error instanceof NfcError.Timeout || error instanceof NfcError.SessionInvalidated) {
    return createNfcOperationError({
      code: 'read-failed',
      message: 'The NFC session ended before an NDEF tag was read.',
      operation,
      cause: error,
    });
  }

  return normalizeNfcError(error, {
    operation,
    code: operation === 'write' ? 'write-failed' : 'read-failed',
    message: operation === 'write' ? 'NDEF write failed.' : 'NDEF scan failed.',
    reason: 'unknown',
  });
}

function getErrorText(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name} ${error.message}`;
  }

  return String(error);
}

function isMissingNativeModuleError(error: unknown): boolean {
  const text = getErrorText(error).toLowerCase();

  return (
    text.includes('nfcmanager') &&
    (text.includes('native module') ||
      text.includes('no such native method') ||
      text.includes('null') ||
      text.includes('undefined'))
  );
}

function getSupportFailureReason(error: unknown) {
  if (isMissingNativeModuleError(error)) {
    return 'requires-dev-build';
  }

  if (error instanceof NfcError.RadioDisabled) {
    return 'disabled';
  }

  if (error instanceof NfcError.SecurityViolation) {
    return 'missing-permission';
  }

  if (error instanceof NfcError.UnsupportedFeature) {
    return 'unsupported-device';
  }

  return 'unknown';
}

async function cancelNativeSession(): Promise<void> {
  try {
    await NfcManager.cancelTechnologyRequest({ throwOnError: false });
  } catch {
    // Ignore cleanup failures so the original operation error stays visible to callers.
  }
}

export async function getSupport(): Promise<NfcSupport> {
  try {
    const isSupported = await NfcManager.isSupported();

    if (!isSupported) {
      return {
        platform,
        isSupported: false,
        reason: 'unsupported-device',
        capabilities: nativeCapabilities,
      };
    }

    await NfcManager.start();

    const isEnabled = await NfcManager.isEnabled();

    if (!isEnabled) {
      return {
        platform,
        isSupported: false,
        reason: 'disabled',
        capabilities: nativeCapabilities,
      };
    }

    return {
      platform,
      isSupported: true,
      capabilities: nativeCapabilities,
    };
  } catch (error) {
    return {
      platform,
      isSupported: false,
      reason: getSupportFailureReason(error),
      capabilities: nativeCapabilities,
    };
  }
}

export async function scanNdef(): Promise<NdefTag> {
  await assertSupported();

  try {
    // Manual real-device testing required: simulators and Expo Go cannot exercise native NFC.
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Hold your device near an NDEF tag.',
    });

    const tag = await NfcManager.getTag();

    return normalizeTag(tag);
  } catch (error) {
    throw normalizeNativeError(error, 'scan');
  } finally {
    await cancelNativeSession();
  }
}

export async function writeNdef(records: NdefRecord[]): Promise<NdefTag> {
  await assertSupported();

  try {
    // Manual real-device testing required: write behavior varies by tag capacity and lock state.
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Hold your device near a writable NDEF tag.',
    });

    const status = await NfcManager.ndefHandler.getNdefStatus();

    if (status.status !== NdefStatus.ReadWrite) {
      throw createNfcOperationError({
        code: 'not-writable',
        message: 'The detected NDEF tag is not writable.',
        operation: 'write',
        reason: 'unsupported-device',
      });
    }

    const message = Ndef.encodeMessage(records.map(toNativeRecord));

    if (status.capacity > 0 && message.length > status.capacity) {
      throw createNfcOperationError({
        code: 'tag-too-small',
        message: 'The NDEF message is larger than this tag can store.',
        operation: 'write',
        reason: 'unsupported-device',
      });
    }

    await NfcManager.ndefHandler.writeNdefMessage(message);

    const tag = await NfcManager.getTag();

    return {
      ...normalizeTag(tag),
      records,
      isWritable: true,
    };
  } catch (error) {
    throw normalizeNativeError(error, 'write');
  } finally {
    await cancelNativeSession();
  }
}

export async function cancelScan(): Promise<void> {
  try {
    await NfcManager.cancelTechnologyRequest({ throwOnError: false });
  } catch (error) {
    throw normalizeNfcError(error, {
      operation: 'cancel',
      code: 'unknown',
      message: 'Could not cancel the NFC scan.',
      reason: 'unknown',
    });
  }
}
