# iOS

iOS NFC testing requires a real NFC-capable iPhone and real NFC tags.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Build iOS dev client | `bun run ios` | `npm run ios` | `yarn ios` | `pnpm ios` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## Setup

1. Install dependencies:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun install` | `npm install` | `yarn install` | `pnpm install` |

2. Confirm `react-native-nfc-manager` is in `dependencies` and the config plugin is in `app.json`.

3. Build and install a development client:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run ios` | `npm run ios` | `yarn ios` | `pnpm ios` |

   Or use EAS:

   ```bash
   eas build --profile development --platform ios
   ```

4. Start Metro:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

5. Open the installed development build, not Expo Go.

## Device Prep

- Use a physical NFC-capable iPhone.
- Keep the phone unlocked.
- Use a known NDEF tag for scan tests.
- Use a writable NDEF tag for write tests.

## Test Scan

1. Open the starter app.
2. Check that support says `ios`.
3. Tap `Scan NDEF`.
4. Follow the iOS NFC session prompt.
5. Hold the tag near the top of the iPhone.
6. Confirm the app displays tag records.

## Test Write

1. Tap `Write Test NDEF`.
2. Follow the iOS NFC session prompt.
3. Hold a writable NDEF tag near the top of the iPhone.
4. Scan the tag again to confirm the written text record.

## iOS Notes

- The native path uses `react-native-nfc-manager` and requests `NfcTech.Ndef`.
- iOS NFC support depends on device model, iOS version, entitlements, and tag type.
- Native config or entitlement changes require rebuilding the development client.
- This starter does not implement background NFC, advanced tag protocols, or custom native modules.
