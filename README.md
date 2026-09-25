# Expo NFC Starter

NFC in Expo development builds without the confusion.

[![Expo development builds](https://img.shields.io/badge/Expo-development%20builds-000020?logo=expo&logoColor=white)](https://docs.expo.dev/develop/development-builds/introduction/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NFC](https://img.shields.io/badge/NFC-NDEF%20only-12b886)](docs/ndef-recipes.md)
[![Expo Go](https://img.shields.io/badge/Expo%20Go-not%20supported-d9480f)](#important-expo-go-note)
[![Web NFC](https://img.shields.io/badge/Web%20NFC-limited%20fallback-f59f00)](docs/web.md)
[![Android](https://img.shields.io/badge/Android-native%20NFC-3ddc84?logo=android&logoColor=white)](docs/android.md)
[![iOS](https://img.shields.io/badge/iOS-Core%20NFC-111111?logo=apple&logoColor=white)](docs/ios.md)
[![Template](https://img.shields.io/badge/Starter-template-7950f2)](#why-this-is-a-good-starting-point)

NDEF scan/write for Expo development builds using `react-native-nfc-manager`, with a limited Web NFC fallback for browsers that support `NDEFReader`.

> [!IMPORTANT]
> This starter does not work in Expo Go. Native NFC requires native code, so you must use an Expo development build or a custom dev client.

## Fast Path

For Android, start here:

```bash
bun run android
```

Then, for normal JavaScript/TypeScript iteration after the dev build is installed:

```bash
bun run start
```

Open the installed app on the phone, then use `Check`, `Scan`, and `Write`.

| Step | Goal | Command or action |
| --- | --- | --- |
| 1 | Install a native dev client | `bun run android` or `bun run ios` |
| 2 | Start Metro for that dev client | `bun run start` |
| 3 | Confirm runtime support | Open the `Check` tab |
| 4 | Read an NFC tag | Tap `Scan NDEF` |
| 5 | Write a test payload | Tap `Write Test NDEF` with a writable NDEF tag |

> [!TIP]
> The web command is intentionally optional. It is only a Web NFC fallback demo and is not the main path for this starter.

## What You Get

| Area | Status | Notes |
| --- | --- | --- |
| Expo dev client | ![Supported](https://img.shields.io/badge/supported-12b886) | The intended runtime for native NFC. |
| Android NFC | ![Supported](https://img.shields.io/badge/supported-12b886) | Requires a real NFC-capable Android device and NFC enabled in settings. |
| iOS NFC | ![Supported with limits](https://img.shields.io/badge/supported%20with%20limits-f59f00) | Requires a real iPhone with NFC support and proper entitlements. |
| Web NFC | ![Limited fallback](https://img.shields.io/badge/limited%20fallback-f59f00) | Depends on `NDEFReader`, HTTPS except localhost, hardware, and user gestures. |
| Expo Go | ![Not supported](https://img.shields.io/badge/not%20supported-d9480f) | Native NFC modules are not included in Expo Go. |
| Simulators/emulators | ![Hardware required](https://img.shields.io/badge/hardware%20required-d9480f) | Real NFC flows need real hardware and real tags. |

## Why This Exists

NFC in Expo is confusing because the first thing many developers try is Expo Go. That path cannot work for native NFC, and the error usually does not explain the real problem.

The real path is:

| Do this | Why it matters |
| --- | --- |
| Use a development build, not Expo Go | Native NFC must be compiled into the app. |
| Include `react-native-nfc-manager` in the native app | Android/iOS NFC comes from native code. |
| Rebuild when native config changes | Metro reloads JavaScript; it does not rebuild native code. |
| Test on real Android/iOS devices with real tags | Simulators cannot prove physical NFC behavior. |
| Treat Web NFC as a limited fallback | Browser NFC support is narrower than native app support. |

This starter puts that path in one small app so you can prove NDEF scan/write before mixing NFC into a larger product.

## Why This Is A Good Starting Point

- It starts from the correct Expo model: development builds.
- It keeps the API small: support, scan, write, cancel.
- It is honest about Android, iOS, and web differences.
- It avoids low-level NFC protocols in v0.
- It includes docs for the rebuild step that usually trips people up.
- It gives you a known-good place to test real tags before debugging your full app.

## What This Uses

| Layer | Choice |
| --- | --- |
| App | Expo app with TypeScript and Expo Router |
| Native NFC | `react-native-nfc-manager` for Android/iOS |
| Web fallback | Web NFC through `NDEFReader`, where available |
| NFC scope | NDEF scan/write only |

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

## Setup Flow

### 1. Install dependencies

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

### 2. Verify the config plugin

Add or verify the config plugin in `app.json`:

```json
{
  "expo": {
    "plugins": ["react-native-nfc-manager"]
  }
}
```

This starter already includes the plugin.

### 3. Build a development client

Local Android build:

```bash
bun run android
```

```bash
npm run android
```

```bash
yarn android
```

```bash
pnpm android
```

Local iOS build:

```bash
bun run ios
```

```bash
npm run ios
```

```bash
yarn ios
```

```bash
pnpm ios
```

Or prebuild first if you want to inspect native projects:

```bash
bunx expo prebuild
```

```bash
npx expo prebuild
```

```bash
yarn expo prebuild
```

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

### 4. Run the installed dev client

Enable NFC in Android settings, connect the device, then run:

```bash
bun run start
```

```bash
npm run start
```

```bash
yarn start
```

```bash
pnpm start
```

### 5. Test scan/write

Open the app in the development build, tap `Scan NDEF`, scan a real NDEF tag, then tap `Write Test NDEF` with a writable NDEF tag.

> [!NOTE]
> Tried it on a real device? Please open a [device test issue](https://github.com/altynali/expo-nfc-starter/issues/new?template=device-test-report.yml) with your phone model, OS version, and tag type. Working reports are just as useful as bug reports.

### 6. Optionally test the web fallback

```bash
bun run web
```

```bash
npm run web
```

```bash
yarn web
```

```bash
pnpm web
```

Web NFC requires a browser with `NDEFReader`, HTTPS except localhost, a physical NFC-capable device, and a user gesture.

### 7. Run the in-app preflight checklist

Open the `Check` tab before debugging NFC. It shows whether you are in Expo Go, a development build, native Android/iOS, or the limited web fallback.

## Important Expo Go Note

> [!CAUTION]
> Expo Go is the wrong runtime for this starter. If NFC reports `requires-dev-build`, build or rebuild the development client first.

## Important Rebuild Rule

> [!WARNING]
> Native config/plugin changes require rebuilding the development client. Restarting Metro is not enough after changing `app.json`, native permissions, entitlements, config plugins, or native dependencies.

If NFC suddenly reports `requires-dev-build` after you changed config, rebuild first. Do not spend an hour debugging JavaScript before proving the native build contains the NFC module.

## Docs

| Need | Start here |
| --- | --- |
| Understand Expo dev builds | [Expo development builds](docs/expo-dev-builds.md) |
| Build with EAS | [EAS development builds](docs/eas-builds.md) |
| Check your runtime | [Preflight checklist](docs/preflight.md) |
| Know when to rebuild | [Rebuild rules](docs/rebuild-rules.md) |
| Android setup | [Android](docs/android.md) |
| iOS setup | [iOS](docs/ios.md) |
| Browser fallback | [Web](docs/web.md) |
| Choose test tags | [Known good tags](docs/tags.md) |
| Read/write payload examples | [NDEF recipes](docs/ndef-recipes.md) |
| Decode failures | [Error dictionary](docs/error-dictionary.md) |
| Move code into your app | [Copy into your app](docs/copy-into-your-app.md) |
| Validate the starter | [Validation checklist](docs/validation.md) |
| Debug common problems | [Troubleshooting](docs/troubleshooting.md) |

## License

MIT

## Scope

This v0 is intentionally small:

| In scope | Out of scope |
| --- | --- |
| NDEF scan/write | Expo Go support |
| `getSupport()` | Custom native Expo Module |
| `scanNdef()` | Low-level NFC protocols |
| `writeNdef()` | MIFARE, ISO15693, FeliCa, or ISO7816 APIs |
| `cancelScan()` | Background NFC flows |
| Typed unsupported-platform reasons | npm package or monorepo extraction |
