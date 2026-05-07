# Troubleshooting

Start here when NFC does not work.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Rebuild dev client | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

NFC bugs often look like JavaScript bugs, but the root cause is usually one of these:

- The app is running in Expo Go.
- The development build was not rebuilt after a native config change.
- The test is running on a simulator/emulator.
- The device does not support NFC or has NFC disabled.
- The tag is not NDEF, not writable, locked, or too small.
- The web browser does not support `NDEFReader`.

This starter is intentionally boring so you can eliminate those causes before debugging product code.

## `requires-dev-build`

You are probably running Expo Go, or your development build does not include `react-native-nfc-manager`.

Fix:

1. Stop using Expo Go for this project.
2. Verify `react-native-nfc-manager` is installed.
3. Verify the config plugin is in `app.json`.
4. Rebuild the development client:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |

Example UI message:

```text
Native NFC is unavailable. Build and run an Expo development build or custom dev client. (requires-dev-build)
```

## Native Changes Did Not Apply

Restarting Metro is not enough for native config changes.

Rebuild after changing:

- `app.json`
- Config plugins
- Native dependencies
- Android permissions
- iOS entitlements

## `disabled`

The device supports NFC, but NFC is turned off.

Fix:

1. Open system settings.
2. Enable NFC.
3. Reopen the app and test again.

Example UI message:

```text
NFC is unavailable on android: disabled. (disabled)
```

## `unsupported-device`

The device or tag cannot complete the requested NDEF flow.

Check:

- You are using a physical NFC-capable device.
- The tag contains NDEF data for scan tests.
- The tag is writable for write tests.
- The test message fits on the tag.
- The tag is not locked or read-only.

## `unsupported-browser`

The browser does not support Web NFC or does not expose `NDEFReader`.

Fix:

1. Test native Android/iOS first.
2. For web, use a browser/device combination that supports Web NFC.

Example UI message:

```text
Web NFC is unavailable: unsupported-browser. (unsupported-browser)
```

## `requires-https`

Web NFC requires a secure context.

Fix:

- Use HTTPS.
- Or use localhost for development.

## `requires-user-gesture`

Web NFC scan/write must start from a direct user action.

Fix:

- Start scan/write by pressing the app buttons.
- Do not trigger Web NFC automatically from page load or background effects.

## `missing-permission`

The platform or browser denied NFC permission.

Fix:

1. Retry the action.
2. Accept the prompt if shown.
3. Check browser or OS permission settings.
4. Reinstall/rebuild the development client if native permissions changed.

Example UI message:

```text
Web NFC permission was denied. (missing-permission)
```

## Cancelled Scan

Cancelled scans are reported as typed `NfcOperationError` values with the `cancelled` code. They should not appear as raw native strings or unknown JavaScript errors.

Example UI message:

```text
NFC scan was cancelled.
```

## UI Error Formatting

Use `formatNfcError(error)` from `src/nfc` in screens and components:

```ts
import { formatNfcError, scanNdef } from '@/src/nfc';

try {
  await scanNdef();
} catch (error) {
  setMessage(formatNfcError(error));
}
```

The helper accepts `unknown`, normalizes it to `NfcOperationError`, and returns a short user-facing message with a typed reason when one exists.

## Real-Device Checklist

- Real Android phone or NFC-capable iPhone.
- Real NFC tags.
- Expo development build installed.
- NFC enabled on Android.
- App opened from the development build, not Expo Go.
- Metro running with `bun run start`, `npm run start`, `yarn start`, or `pnpm start`.
