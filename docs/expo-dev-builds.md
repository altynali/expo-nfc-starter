# Expo Development Builds

This starter requires an Expo development build or custom dev client. It does not work in Expo Go.

Expo Go cannot load arbitrary native modules from your project. Native Android/iOS NFC in this starter comes from `react-native-nfc-manager`, so the native app must be built with that dependency included.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Build Android dev client | `bun run android` | `npm run android` | `yarn android` | `pnpm android` |
| Build iOS dev client | `bun run ios` | `npm run ios` | `yarn ios` | `pnpm ios` |
| Start Metro | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## The Common Trap

The common NFC failure in Expo is not the tag. It is the build.

If you open this project in Expo Go, JavaScript can load, but the native NFC module is not inside the Expo Go app. A development build is your own app binary with the NFC dependency compiled in.

That is why this starter is useful: it gives you the right build shape first, then lets you test the tag flow.

## Setup

1. Install dependencies:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun install` | `npm install` | `yarn install` | `pnpm install` |

2. Verify the config plugin in `app.json`:

   ```json
   {
     "expo": {
       "plugins": ["react-native-nfc-manager"]
     }
   }
   ```

   This repo already includes it. Keep it there unless you are removing native NFC.

3. Build a development client.

   Local Android:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run android` | `npm run android` | `yarn android` | `pnpm android` |

   Local iOS:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run ios` | `npm run ios` | `yarn ios` | `pnpm ios` |

   EAS development build:

   ```bash
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

4. Start Metro for the installed development build:

   | Bun | npm | Yarn | pnpm |
   | --- | --- | --- | --- |
   | `bun run start` | `npm run start` | `yarn start` | `pnpm start` |

## When To Rebuild

Rebuild the development client after changing:

- `app.json` native config.
- The `plugins` list.
- iOS entitlements.
- Android permissions.
- Native dependencies.
- Any config plugin options.

Restarting Metro only reloads JavaScript. It does not apply native config changes.

## Practical Check

If the app reports `requires-dev-build`, you are probably running Expo Go or an old development build that does not include the NFC native module. Rebuild and reinstall the development client.
