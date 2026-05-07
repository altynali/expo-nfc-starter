# Expo NFC Starter

NFC in Expo development builds without the confusion.

NDEF scan/write for Expo development builds using `react-native-nfc-manager`, with a limited Web NFC fallback for browsers that support `NDEFReader`.

This starter does not work in Expo Go. Native NFC requires native code, so you must use an Expo development build or a custom dev client.

## Why This Exists

NFC in Expo is confusing because the first thing many developers try is Expo Go. That path cannot work for native NFC, and the error usually does not explain the real problem.

The real path is:

- Use a development build, not Expo Go.
- Include `react-native-nfc-manager` in the native app.
- Rebuild when native config changes.
- Test on real Android/iOS devices with real tags.
- Treat Web NFC as a limited fallback, not the same capability.

This starter puts that path in one small app so you can prove NDEF scan/write before mixing NFC into a larger product.

## Why This Is A Good Starting Point

- It starts from the correct Expo model: development builds.
- It keeps the API small: support, scan, write, cancel.
- It is honest about Android, iOS, and web differences.
- It avoids low-level NFC protocols in v0.
- It includes docs for the rebuild step that usually trips people up.
- It gives you a known-good place to test real tags before debugging your full app.

## What This Uses

- Expo app with TypeScript and Expo Router.
- Native Android/iOS NFC through `react-native-nfc-manager`.
- Limited web fallback through Web NFC, only where the browser exposes `NDEFReader`.
- NDEF scan/write only.

Real NFC testing requires physical NFC-capable devices and real NFC tags. Simulators, emulators, and Expo Go cannot prove the native NFC flow.

## Package Manager

This repo includes `bun.lock`, but Bun is not required. Use one package manager consistently.

GitHub does not run custom README JavaScript, so custom copy buttons are not reliable there. The setup flow below uses fenced command blocks because GitHub and most markdown viewers add a real copy button to each block.

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Build Android dev client | `bun run android` | `npm run android` | `yarn android` | `pnpm android` |
| Build iOS dev client | `bun run ios` | `npm run ios` | `yarn ios` | `pnpm ios` |
| Start dev client Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |
| Run web fallback | `bun run web` | `npm run web` | `yarn web` | `pnpm web` |

## Recommended First Run

For Android, start here:

```bash
bun run android
```

Then, for normal JavaScript/TypeScript iteration after the dev build is installed:

```bash
bun run start
```

Open the installed app on the phone, then use `Check`, `Scan`, and `Write`.

The web command is intentionally optional. It is only a Web NFC fallback demo and is not the main path for this starter.

## Setup Flow

1. Install dependencies:

   Bun:

   ```bash
   bun install
   ```

   npm:

   ```bash
   npm install
   ```

   Yarn:

   ```bash
   yarn install
   ```

   pnpm:

   ```bash
   pnpm install
   ```

2. Add or verify the config plugin in `app.json`:

   ```json
   {
     "expo": {
       "plugins": ["react-native-nfc-manager"]
     }
   }
   ```

   This starter already includes the plugin.

3. Build a development client.

   Local Android build:

   Bun:

   ```bash
   bun run android
   ```

   npm:

   ```bash
   npm run android
   ```

   Yarn:

   ```bash
   yarn android
   ```

   pnpm:

   ```bash
   pnpm android
   ```

   Local iOS build:

   Bun:

   ```bash
   bun run ios
   ```

   npm:

   ```bash
   npm run ios
   ```

   Yarn:

   ```bash
   yarn ios
   ```

   pnpm:

   ```bash
   pnpm ios
   ```

   Or prebuild first if you want to inspect native projects:

   Bun:

   ```bash
   bunx expo prebuild
   ```

   npm:

   ```bash
   npx expo prebuild
   ```

   Yarn:

   ```bash
   yarn expo prebuild
   ```

   pnpm:

   ```bash
   pnpm exec expo prebuild
   ```

   Or use EAS development builds:

   ```bash
   eas build --profile development --platform android
   ```

   ```bash
   eas build --profile development --platform ios
   ```

4. Run the app on a real Android device.

   Enable NFC in Android settings, connect the device, then run:

   Bun:

   ```bash
   bun run start
   ```

   npm:

   ```bash
   npm run start
   ```

   Yarn:

   ```bash
   yarn start
   ```

   pnpm:

   ```bash
   pnpm start
   ```

5. Test scan/write.

   Open the app in the development build, tap `Scan NDEF`, scan a real NDEF tag, then tap `Write Test NDEF` with a writable NDEF tag.

6. Optionally test the web fallback:

   Bun:

   ```bash
   bun run web
   ```

   npm:

   ```bash
   npm run web
   ```

   Yarn:

   ```bash
   yarn web
   ```

   pnpm:

   ```bash
   pnpm web
   ```

   Web NFC requires a browser with `NDEFReader`, HTTPS except localhost, a physical NFC-capable device, and a user gesture.

7. Run the in-app preflight checklist.

   Open the `Check` tab before debugging NFC. It shows whether you are in Expo Go, a development build, native Android/iOS, or the limited web fallback.

## Important Rebuild Rule

Native config/plugin changes require rebuilding the development client. Restarting Metro is not enough after changing `app.json`, native permissions, entitlements, config plugins, or native dependencies.

If NFC suddenly reports `requires-dev-build` after you changed config, rebuild first. Do not spend an hour debugging JavaScript before proving the native build contains the NFC module.

## Docs

- [Expo development builds](docs/expo-dev-builds.md)
- [EAS development builds](docs/eas-builds.md)
- [Preflight checklist](docs/preflight.md)
- [Rebuild rules](docs/rebuild-rules.md)
- [Android](docs/android.md)
- [iOS](docs/ios.md)
- [Web](docs/web.md)
- [Known good tags](docs/tags.md)
- [NDEF recipes](docs/ndef-recipes.md)
- [Error dictionary](docs/error-dictionary.md)
- [Copy into your app](docs/copy-into-your-app.md)
- [Validation checklist](docs/validation.md)
- [Troubleshooting](docs/troubleshooting.md)

## GitHub Discovery

Suggested repository description:

```text
NFC in Expo development builds without the confusion.
```

Suggested GitHub topics:

```text
expo react-native nfc ndef expo-dev-client expo-development-build react-native-nfc-manager android ios web-nfc typescript starter-template
```

## Scope

This v0 is intentionally small:

- No Expo Go support.
- No custom native Expo Module.
- No low-level NFC protocols.
- No MIFARE, ISO15693, FeliCa, or ISO7816 APIs.
- No background NFC flows.
- No npm package or monorepo extraction.
