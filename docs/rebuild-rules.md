# Rebuild Rules

Restarting Metro is not the same as rebuilding the app.

Use this table when you are unsure.

| Change | Rebuild development client? |
| --- | --- |
| Screen text or layout | No |
| JavaScript logic in `src/nfc` | No |
| Add/remove a native dependency | Yes |
| Change `app.json` native config | Yes |
| Change config plugins | Yes |
| Change Android permissions | Yes |
| Change iOS Info.plist values | Yes |
| Change iOS entitlements | Yes |
| Change app icon/splash native config | Yes |
| Change EAS build profile | Yes, for the next build |
| Change Web NFC fallback code | No for web, yes only if native config also changed |

## Good Habit

If you see `requires-dev-build`, first ask:

1. Did I open Expo Go by accident?
2. Did I install the latest development build?
3. Did I rebuild after changing native config?

Only debug JavaScript after those are true.
