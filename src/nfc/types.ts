export type NfcPlatform = 'android' | 'ios' | 'web' | 'unsupported';

export type NfcUnavailableReason =
  | 'unsupported-device'
  | 'disabled'
  | 'unsupported-browser'
  | 'requires-dev-build'
  | 'requires-https'
  | 'requires-user-gesture'
  | 'missing-permission'
  | 'unknown';

export type NfcCapabilities = {
  ndef: boolean;
  scan: boolean;
  write: boolean;
  cancelScan: boolean;
  requiresDevBuild: boolean;
  requiresHttps: boolean;
  requiresUserGesture: boolean;
};

export type NfcSupport = {
  platform: NfcPlatform;
  isSupported: boolean;
  reason?: NfcUnavailableReason;
  capabilities: NfcCapabilities;
};

export type NdefRecord = {
  recordType: 'text' | 'url' | 'mime' | 'empty' | 'unknown';
  data?: string | number[];
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
};

export type NdefTag = {
  platform: NfcPlatform;
  id?: string;
  records: NdefRecord[];
  maxSize?: number;
  isWritable?: boolean;
  raw?: unknown;
};
