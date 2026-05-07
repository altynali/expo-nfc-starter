# Preflight Checklist

Use the `Check` tab before debugging NFC code.

The goal is to separate setup problems from tag problems. Most first NFC failures in Expo are caused by the runtime or build, not by the JavaScript scanner.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Build dev client | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## What It Checks

- Runtime: Expo Go, development build, or web fallback.
- Native build: whether native module checks apply.
- NFC module: whether the native NFC path appears available.
- Device support: whether the platform reports NFC support.
- NFC enabled: especially important on Android.
- Web requirements: `NDEFReader`, HTTPS, permission, user gesture.
- Real test setup: physical device and real NDEF tags.

## How To Use It

1. Build and install the development client:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |

2. Start Metro:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

3. Open the installed development build.
4. Open the `Check` tab.
5. Fix any `FIX` rows before testing scan/write.

## What It Cannot Prove

Preflight cannot prove a particular tag is writable. A device can support NFC while the tag is locked, too small, not NDEF, or out of antenna range.
