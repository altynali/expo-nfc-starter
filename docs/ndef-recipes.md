# NDEF Recipes

This starter is NDEF-only.

## Write Text

```ts
await writeNdef([
  {
    recordType: 'text',
    data: 'Hello from Expo NFC starter',
    lang: 'en',
  },
]);
```

## Write URL

```ts
await writeNdef([
  {
    recordType: 'url',
    data: 'https://expo.dev',
  },
]);
```

## Scan Records

```ts
const tag = await scanNdef();

for (const record of tag.records) {
  if (record.recordType === 'text') {
    console.log(record.data);
  }
}
```

## Cancel Scan

```ts
await cancelScan();
```

## Format Errors

```ts
try {
  await scanNdef();
} catch (error) {
  setMessage(formatNfcError(error));
}
```

## Not Included

- MIFARE Classic.
- ISO15693.
- FeliCa.
- ISO7816.
- Background NFC flows.
- Password-protected tags.
- Raw transceive commands.
