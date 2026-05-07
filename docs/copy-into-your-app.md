# Copy Into Your App

Use this when you already have an Expo development-build app and want the small NFC layer.

Choose the package manager your project uses.

## 1. Install NFC Dependency

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun add react-native-nfc-manager` | `npm install react-native-nfc-manager` | `yarn add react-native-nfc-manager` | `pnpm add react-native-nfc-manager` |

## 2. Add Config Plugin

In `app.json` or `app.config.ts`:

```json
{
  "expo": {
    "plugins": ["react-native-nfc-manager"]
  }
}
```

## 3. Copy The NFC Layer

Copy:

- `src/nfc/types.ts`
- `src/nfc/errors.ts`
- `src/nfc/index.ts`
- `src/nfc/native.ts`
- `src/nfc/web.ts`

## 4. Wire UI

Use:

```ts
import { formatNfcError, getSupport, scanNdef, writeNdef } from '@/src/nfc';
```

Start with `getSupport()` before scan/write.

## 5. Rebuild

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun run android` / `bun run ios` | `npm run android` / `npm run ios` | `yarn android` / `yarn ios` | `pnpm android` / `pnpm ios` |

Restarting Metro is not enough after adding `react-native-nfc-manager` or the config plugin.

## 6. Test On Real Devices

- Android: real NFC-capable device, NFC enabled.
- iOS: real NFC-capable iPhone.
- Tags: simple writable NDEF tags.

## RN CLI Note

If your app is React Native CLI, the abstraction can still be useful, but the Expo config plugin and development-build docs do not apply directly. Keep your manual Android/iOS native config.
