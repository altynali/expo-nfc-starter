# Android

Android NFC testing requires a real NFC-capable Android device and a real NFC tag.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Build Android dev client | `bun run android` | `npm run android` | `yarn android` | `pnpm android` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## Setup

1. Install dependencies:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun install` | `npm install` | `yarn install` | `pnpm install` |

2. Confirm `react-native-nfc-manager` is in `dependencies` and the config plugin is in `app.json`.

3. Build and install the development client:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run android` | `npm run android` | `yarn android` | `pnpm android` |

4. Start Metro:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

5. Open the app from the installed development build, not Expo Go.

## Device Prep

- Use a physical Android device with NFC hardware.
- Enable NFC in Android settings.
- Keep the device unlocked while testing.
- Use a known NDEF tag for scan tests.
- Use a writable NDEF tag for write tests.

## Test Scan

1. Open the starter app.
2. Check that support says `android`.
3. Tap `Scan NDEF`.
4. Hold the tag against the device NFC antenna area.
5. Confirm the screen displays tag records.

## Test Write

1. Tap `Write Test NDEF`.
2. Hold a writable NDEF tag near the antenna area.
3. Wait for the success message.
4. Tap `Scan NDEF` again and confirm the text record is present.

## Android Notes

- The native path uses `react-native-nfc-manager` and requests `NfcTech.Ndef`.
- This starter does not implement MIFARE, IsoDep, NfcA, NfcB, NfcF, or NfcV APIs.
- Some tags are read-only, locked, too small, or not formatted as NDEF.
- If support says `disabled`, enable NFC in system settings and reopen the app.
