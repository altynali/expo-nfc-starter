# Web

The web path is a limited fallback. It uses Web NFC only when the browser exposes `NDEFReader`.

Web NFC is not equivalent to native Android/iOS NFC. Treat it as a convenience path for supported browsers, not as full cross-platform NFC support.

Choose the package manager your project uses:

| Task | Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- | --- |
| Install | `bun install` | `npm install` | `yarn install` | `pnpm install` |
| Run web fallback | `bun run web` | `npm run web` | `yarn web` | `pnpm web` |

## Requirements

- Browser support for `window.NDEFReader`.
- HTTPS, except localhost during development.
- A physical NFC-capable device.
- Real NFC tags.
- A direct user gesture, such as tapping `Scan NDEF` or `Write Test NDEF`.

## Run

| Bun | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| `bun install` then `bun run web` | `npm install` then `npm run web` | `yarn install` then `yarn web` | `pnpm install` then `pnpm web` |

Then open the app in a browser/device combination that supports Web NFC.

## Test Scan

1. Open the web app over HTTPS or localhost.
2. Confirm support does not show `unsupported-browser` or `requires-https`.
3. Tap `Scan NDEF`.
4. Approve the browser prompt if shown.
5. Scan a real NDEF tag.

## Test Write

1. Tap `Write Test NDEF`.
2. Approve the browser prompt if shown.
3. Hold a writable NDEF tag near the device.
4. Scan the tag again to confirm the text record.

## Expected Failures

- `unsupported-browser`: the browser does not expose `NDEFReader`.
- `requires-https`: the app is not running on HTTPS or localhost.
- `requires-user-gesture`: the browser requires scan/write to start from a direct user action.
- `missing-permission`: the browser denied NFC access.

## Web Notes

- Web NFC support changes by browser, platform, and device.
- Desktop browser support is commonly not useful because the machine may not have NFC hardware.
- The starter only maps basic NDEF records.
