import type { NfcUnavailableReason } from './types';

export type NfcOperation = 'get-support' | 'scan' | 'write' | 'cancel';

export type NfcOperationErrorCode =
  | 'cancelled'
  | 'native-module-unavailable'
  | 'not-writable'
  | 'tag-too-small'
  | 'read-failed'
  | 'write-failed'
  | 'permission-denied'
  | 'unsupported'
  | 'unknown';

export class NfcOperationError extends Error {
  readonly code: NfcOperationErrorCode;
  readonly operation: NfcOperation;
  readonly reason?: NfcUnavailableReason;

  constructor({
    code,
    message,
    operation,
    reason,
    cause,
  }: {
    code: NfcOperationErrorCode;
    message: string;
    operation: NfcOperation;
    reason?: NfcUnavailableReason;
    cause?: unknown;
  }) {
    super(message);
    this.name = 'NfcOperationError';
    this.code = code;
    this.operation = operation;
    this.reason = reason;
    this.cause = cause;
  }
}

export function createNfcOperationError({
  code,
  message,
  operation,
  reason,
  cause,
}: {
  code: NfcOperationErrorCode;
  message: string;
  operation: NfcOperation;
  reason?: NfcUnavailableReason;
  cause?: unknown;
}): NfcOperationError {
  return new NfcOperationError({
    code,
    message,
    operation,
    reason,
    cause,
  });
}

export function isNfcOperationError(error: unknown): error is NfcOperationError {
  return error instanceof NfcOperationError;
}

export function normalizeNfcError(
  error: unknown,
  fallback: {
    operation: NfcOperation;
    code?: NfcOperationErrorCode;
    message?: string;
    reason?: NfcUnavailableReason;
  },
): NfcOperationError {
  if (isNfcOperationError(error)) {
    return error;
  }

  return createNfcOperationError({
    code: fallback.code ?? 'unknown',
    message: fallback.message ?? 'NFC operation failed.',
    operation: fallback.operation,
    reason: fallback.reason,
    cause: error,
  });
}

export function formatNfcError(error: unknown): string {
  const normalized = normalizeNfcError(error, {
    operation: 'scan',
    code: 'unknown',
    message: 'NFC operation failed.',
    reason: 'unknown',
  });

  const reason = normalized.reason ? ` (${normalized.reason})` : '';
  return `${normalized.message}${reason}`;
}
