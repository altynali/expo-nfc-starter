# Known Good Tags

Use simple NDEF tags while validating the starter.

## Good Starter Tags

- NTAG213: small, cheap, good for short text and URL tests.
- NTAG215: more capacity, still common.
- NTAG216: larger capacity, useful for bigger NDEF payloads.

## Avoid For First Tests

- Payment cards.
- Transit cards.
- Hotel keys.
- Locked tags.
- Tags that are not formatted as NDEF.
- Very small tags when testing writes.

## Buying Notes

Search for writable `NTAG213`, `NTAG215`, or `NTAG216` NFC stickers/cards. For this starter, you do not need MIFARE Classic, ISO15693, FeliCa, ISO7816, or low-level protocol tags.

## Testing Notes

- Scan a known tag before testing write.
- After writing, scan again to confirm the record changed.
- If write fails, try a different writable tag before changing code.
- Antenna placement matters. Move the tag slowly around the back/top of the device.
