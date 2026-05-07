# Validation Checklist

Use this page to track what has been proven locally and what still needs real devices.

Choose the package manager your project uses. This repo includes `bun.lock`, but the setup works with npm, Yarn, or pnpm too.

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Build dev client | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |
| EAS dev build | `bun run eas:android` / `bun run eas:ios` | `npm run eas:android` / `npm run eas:ios` | `yarn eas:android` / `yarn eas:ios` | `pnpm eas:android` / `pnpm eas:ios` |

## Current Validation Status

- TypeScript check has been run with `tsc --noEmit`.
- ESLint has been run.
- EAS builds have not been run for this starter yet.
- The Preflight tab has not been visually tested in a browser/device session yet.
- Native NFC scan/write has not been confirmed in this repo without physical devices and real tags.

## Known Limitations

- Preflight can identify setup and build problems, but it cannot prove a specific tag is writable.
- Real NFC testing requires physical NFC-capable devices and real NFC tags.
- Expo Go is unsupported.
- Web NFC only works where the browser supports `NDEFReader`.
- Simulators and emulators are not enough for NFC validation.

## Manual Test Steps

1. Install dependencies:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun install` | `npm install` | `yarn install` | `pnpm install` |

2. Build and install a development client:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |

3. Open the installed development build, not Expo Go.
4. Open the `Check` tab and fix any `FIX` rows.
5. Test `Scan` with a known NDEF tag.
6. Test `Write` with a writable NTAG213, NTAG215, or NTAG216 tag.
7. For EAS builds, try:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run eas:android` / `bun run eas:ios` | `npm run eas:android` / `npm run eas:ios` | `yarn eas:android` / `yarn eas:ios` | `pnpm eas:android` / `pnpm eas:ios` |

8. After writing, scan the same tag again to confirm the payload changed.

## When To Update This Page

Update this page after:

- A successful Android real-device NFC test.
- A successful iOS real-device NFC test.
- A successful Web NFC fallback test.
- A successful EAS development build.
- Any change to native config, plugin setup, or NFC behavior.
