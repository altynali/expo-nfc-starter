# EAS Development Builds

Use EAS when local Android/iOS builds are painful or when teammates need installable development builds.

This repo includes `eas.json` with development profiles.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Android EAS build | `bun run eas:android` | `npm run eas:android` | `yarn eas:android` | `pnpm eas:android` |
| iOS EAS build | `bun run eas:ios` | `npm run eas:ios` | `yarn eas:ios` | `pnpm eas:ios` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## Android

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun run eas:android` | `npm run eas:android` | `yarn eas:android` | `pnpm eas:android` |

This uses the `development:android` profile and builds an internal APK development client.

## iOS

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun run eas:ios` | `npm run eas:ios` | `yarn eas:ios` | `pnpm eas:ios` |

This uses the `development:ios` profile. You still need normal Apple signing setup for physical-device testing.

## Start Metro After Installing

After installing the EAS development build on a device:

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

Open the installed app, not Expo Go.

## Rebuild Reminder

Create a new development build after changing:

- `react-native-nfc-manager` version.
- Config plugin list or options.
- Android permissions.
- iOS Info.plist values.
- iOS entitlements.
- Any native dependency.

Metro can reload JavaScript, but it cannot add a missing native NFC module to an already-installed app.
