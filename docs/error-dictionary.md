# Error Dictionary

The starter converts common NFC failures into typed reasons and operation errors.

## Reasons

`requires-dev-build`

The native NFC module is missing from the current app. You are likely in Expo Go or an old development build.

`disabled`

NFC exists but is disabled, usually on Android.

`unsupported-device`

The device, platform, or detected tag cannot complete the requested NDEF operation.

`unsupported-browser`

The browser does not expose Web NFC's `NDEFReader`.

`requires-https`

Web NFC needs HTTPS, except localhost during development.

`requires-user-gesture`

Web NFC scan/write must start from a direct button press.

`missing-permission`

The OS or browser denied NFC access.

`unknown`

The app could not confidently map the failure. Check device logs and confirm the build first.

## Operation Errors

`cancelled`

The user or platform closed the scan/write session.

`native-module-unavailable`

The native NFC module is not available in this runtime.

`not-writable`

The detected NDEF tag cannot be written.

`tag-too-small`

The message is larger than the tag capacity.

`read-failed`

The scan failed after support checks passed.

`write-failed`

The write failed after support checks passed.

`permission-denied`

NFC permission was denied or missing.

`unsupported`

The platform cannot attempt the requested operation.
