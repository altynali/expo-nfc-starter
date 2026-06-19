---
name: expo-nfc-dev-builds
description: Build, copy, or debug NDEF-only NFC flows in Expo development builds and custom dev clients. Use when working on Expo NFC apps, react-native-nfc-manager setup, getSupport/scanNdef/writeNdef/cancelScan APIs, Android/iOS/Web NFC platform behavior, Expo Go failure modes, rebuild troubleshooting, or moving this starter's NFC layer into another Expo app.
---

# Expo NFC Dev Builds

## Overview

Use this skill to keep Expo NFC work focused on the supported path: Expo development builds or custom dev clients, `react-native-nfc-manager` for native Android/iOS, and NDEF-only scan/write flows. Prefer small, explicit APIs and typed graceful failures over broad abstractions.

## Project Stance

- Treat Expo Go as unsupported for native NFC. If native NFC is missing, guide the user toward rebuilding a development client.
- Keep v0 NDEF-only. Do not add MIFARE, ISO15693, FeliCa, ISO7816, background NFC, or a custom native Expo module unless the user explicitly changes the project scope.
- Use `react-native-nfc-manager` on Android and iOS. Use Web NFC only as a limited browser fallback through `NDEFReader`.
- Preserve explicit public types for support, capabilities, tags, records, errors, operations, and unsupported reasons.
- Fail gracefully on unsupported platforms with typed reasons instead of opaque exceptions.
- Prefer clear platform checks over clever cross-platform hiding.

## Implementation Workflow

1. Inspect the current app structure before editing. The expected NFC layer is under `src/nfc`.
2. Confirm the requested change fits the starter scope: `getSupport()`, `scanNdef()`, `writeNdef()`, `cancelScan()`, typed support reasons, docs, or the example UI.
3. Update native and web behavior separately when platform behavior differs. Do not mask real Android/iOS/web limitations behind generic messages.
4. Keep UI examples basic and practical: check support first, scan/write only after support is known, and surface formatted errors to the user.
5. Update docs when behavior, setup, supported platforms, commands, or troubleshooting changes.

## Public API Expectations

The public API should stay small:

- `getSupport(): Promise<NfcSupport>`
- `scanNdef(): Promise<NdefTag>`
- `writeNdef(records: NdefRecord[]): Promise<NdefTag>`
- `cancelScan(): Promise<void>`

Expose and maintain explicit types for `NfcPlatform`, `NfcUnavailableReason`, `NfcCapabilities`, `NfcSupport`, `NdefRecord`, and `NdefTag`. Unsupported states should include a reason such as `requires-dev-build`, `unsupported-browser`, `requires-https`, `requires-user-gesture`, `disabled`, `missing-permission`, or `unsupported-device`.

## Platform Notes

Android:

- Require a real NFC-capable Android device with NFC enabled.
- Use the config plugin and rebuild the development client after native dependency or config changes.
- Treat emulator behavior as insufficient for validating physical NFC.

iOS:

- Require a real NFC-capable iPhone.
- Keep entitlement and permission limitations visible in docs and support results.
- Avoid promising parity with Android when iOS NFC behavior differs.

Web:

- Use Web NFC only when `NDEFReader` is available.
- Remember HTTPS is required except for localhost.
- Require user gestures for browser NFC operations.

## Copying Into Another App

When adapting the starter into another Expo app:

1. Install `react-native-nfc-manager`.
2. Add the `react-native-nfc-manager` config plugin.
3. Copy the `src/nfc` files.
4. Import from the NFC layer instead of calling native/Web NFC APIs directly from screens.
5. Rebuild the development client before testing.
6. Test on real NFC-capable devices and simple writable NDEF tags.

## Validation

Run static checks when available, usually `npm run lint`, `bun run lint`, or the repo's configured equivalent. For real NFC behavior, provide manual test steps because scan/write cannot be fully validated in simulators, emulators, or CI.
