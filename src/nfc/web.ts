import type {
  NdefRecord,
  NdefTag,
  NfcCapabilities,
  NfcSupport,
  NfcUnavailableReason,
} from './types';
import { createNfcOperationError, normalizeNfcError, type NfcOperation } from './errors';

type WebNdefRecord = {
  recordType: string;
  mediaType?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
  id?: string;
};

type WebNdefMessage = {
  records: WebNdefRecord[];
};

type WebNdefReadingEvent = Event & {
  serialNumber?: string;
  message: WebNdefMessage;
};

type WebNdefRecordInit = {
  recordType: string;
  data?: string | BufferSource;
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
};

type WebNdefReader = EventTarget & {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>;
  write: (
    message: string | { records: WebNdefRecordInit[] },
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
  onreading: ((event: WebNdefReadingEvent) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
};

declare global {
  interface Window {
    NDEFReader?: new () => WebNdefReader;
  }
}

let webScanController: AbortController | null = null;

const webCapabilities: NfcCapabilities = {
  ndef: true,
  scan: true,
  write: true,
  cancelScan: true,
  requiresDevBuild: false,
  requiresHttps: true,
  requiresUserGesture: true,
};

function isSecureWebContext(): boolean {
  return window.isSecureContext || window.location.hostname === 'localhost';
}

function getReaderConstructor(): (new () => WebNdefReader) | undefined {
  return window.NDEFReader;
}

function bytesFromDataView(data?: DataView): number[] | undefined {
  if (!data) {
    return undefined;
  }

  return Array.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
}

function textFromDataView(record: WebNdefRecord): string | undefined {
  if (!record.data) {
    return undefined;
  }

  const encoding = record.encoding || 'utf-8';
  return new TextDecoder(encoding).decode(record.data);
}

function normalizeWebRecord(record: WebNdefRecord): NdefRecord {
  if (record.recordType === 'text') {
    return {
      recordType: 'text',
      data: textFromDataView(record),
      id: record.id,
      encoding: record.encoding,
      lang: record.lang,
    };
  }

  if (record.recordType === 'url' || record.recordType === 'absolute-url') {
    return {
      recordType: 'url',
      data: textFromDataView(record),
      id: record.id,
    };
  }

  if (record.recordType === 'mime') {
    return {
      recordType: 'mime',
      mediaType: record.mediaType,
      data: bytesFromDataView(record.data),
      id: record.id,
    };
  }

  if (record.recordType === 'empty') {
    return {
      recordType: 'empty',
      id: record.id,
    };
  }

  return {
    recordType: 'unknown',
    data: bytesFromDataView(record.data),
    mediaType: record.mediaType,
    id: record.id,
  };
}

function toWebRecord(record: NdefRecord): WebNdefRecordInit {
  if (record.recordType === 'text') {
    return {
      recordType: 'text',
      data: String(record.data ?? ''),
      id: record.id,
      encoding: record.encoding,
      lang: record.lang,
    };
  }

  if (record.recordType === 'url') {
    return {
      recordType: 'url',
      data: String(record.data ?? ''),
      id: record.id,
    };
  }

  if (record.recordType === 'mime') {
    return {
      recordType: 'mime',
      mediaType: record.mediaType ?? 'application/octet-stream',
      data: Array.isArray(record.data) ? Uint8Array.from(record.data) : String(record.data ?? ''),
      id: record.id,
    };
  }

  return {
    recordType: record.recordType,
    data: Array.isArray(record.data) ? Uint8Array.from(record.data) : String(record.data ?? ''),
    id: record.id,
  };
}

function reasonFromWebError(error: unknown): NfcUnavailableReason {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return navigator.userActivation?.isActive ? 'missing-permission' : 'requires-user-gesture';
    }

    if (error.name === 'SecurityError') {
      return 'requires-https';
    }
  }

  return 'unknown';
}

function normalizeWebError(error: unknown, operation: NfcOperation) {
  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return createNfcOperationError({
        code: 'cancelled',
        message: 'Web NFC scan was cancelled.',
        operation,
        cause: error,
      });
    }

    if (error.name === 'NotAllowedError') {
      const reason = reasonFromWebError(error);
      return createNfcOperationError({
        code: 'permission-denied',
        message:
          reason === 'requires-user-gesture'
            ? 'Web NFC must be started from a button press.'
            : 'Web NFC permission was denied.',
        operation,
        reason,
        cause: error,
      });
    }

    if (error.name === 'SecurityError') {
      return createNfcOperationError({
        code: 'unsupported',
        message: 'Web NFC requires HTTPS, except localhost during development.',
        operation,
        reason: 'requires-https',
        cause: error,
      });
    }
  }

  return normalizeNfcError(error, {
    operation,
    code: operation === 'write' ? 'write-failed' : 'read-failed',
    message: operation === 'write' ? 'Web NFC write failed.' : 'Web NFC scan failed.',
    reason: 'unknown',
  });
}

async function assertSupported(): Promise<void> {
  const support = await getSupport();

  if (!support.isSupported) {
    throw createNfcOperationError({
      code: 'unsupported',
      message: `Web NFC is unavailable: ${support.reason ?? 'unknown'}.`,
      operation: 'get-support',
      reason: support.reason ?? 'unknown',
    });
  }
}

export async function getSupport(): Promise<NfcSupport> {
  if (!isSecureWebContext()) {
    return {
      platform: 'web',
      isSupported: false,
      reason: 'requires-https',
      capabilities: webCapabilities,
    };
  }

  if (!getReaderConstructor()) {
    return {
      platform: 'web',
      isSupported: false,
      reason: 'unsupported-browser',
      capabilities: webCapabilities,
    };
  }

  return {
    platform: 'web',
    isSupported: true,
    capabilities: webCapabilities,
  };
}

export async function scanNdef(): Promise<NdefTag> {
  await assertSupported();

  const Reader = getReaderConstructor();

  if (!Reader) {
    throw createNfcOperationError({
      code: 'unsupported',
      message: 'This browser does not expose NDEFReader.',
      operation: 'scan',
      reason: 'unsupported-browser',
    });
  }

  webScanController = new AbortController();

  return new Promise<NdefTag>((resolve, reject) => {
    const reader = new Reader();

    webScanController?.signal.addEventListener(
      'abort',
      () =>
        reject(
          createNfcOperationError({
            code: 'cancelled',
            message: 'Web NFC scan was cancelled.',
            operation: 'scan',
          }),
        ),
      { once: true },
    );

    reader.onreading = (event) => {
      resolve({
        platform: 'web',
        id: event.serialNumber,
        records: event.message.records.map(normalizeWebRecord),
        raw: event,
      });
    };

    reader.onreadingerror = () => {
      reject(
        createNfcOperationError({
          code: 'read-failed',
          message: 'The browser could not read this NDEF tag.',
          operation: 'scan',
          reason: 'unknown',
        }),
      );
    };

    // Manual real-device testing required: Web NFC currently depends on browser, HTTPS, and permissions.
    reader.scan({ signal: webScanController?.signal }).catch((error: unknown) => {
      reject(normalizeWebError(error, 'scan'));
    });
  });
}

export async function writeNdef(records: NdefRecord[]): Promise<NdefTag> {
  await assertSupported();

  const Reader = getReaderConstructor();

  if (!Reader) {
    throw createNfcOperationError({
      code: 'unsupported',
      message: 'This browser does not expose NDEFReader.',
      operation: 'write',
      reason: 'unsupported-browser',
    });
  }

  try {
    const reader = new Reader();

    // Manual real-device testing required: Web NFC write prompts must be started from a user gesture.
    await reader.write({ records: records.map(toWebRecord) });

    return {
      platform: 'web',
      records,
      isWritable: true,
    };
  } catch (error) {
    throw normalizeWebError(error, 'write');
  }
}

export async function cancelScan(): Promise<void> {
  webScanController?.abort();
  webScanController = null;
}
