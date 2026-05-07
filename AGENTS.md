# AGENTS.md

## Project goal

Build the fastest useful starter for NFC in Expo development builds.

This project is NOT trying to support Expo Go. The target is Expo development builds / custom dev clients.

## Product positioning

"NFC in Expo development builds without the confusion."

The first deliverable is a working starter/template, not a polished npm package.

## Tech constraints

- Expo app
- TypeScript
- Expo dev client
- react-native-nfc-manager for native Android/iOS
- Web fallback using Web NFC where available
- No fresh native module in v0
- No low-level NFC protocols in v0
- NDEF-only in v0

## MVP features

- getSupport()
- scanNdef()
- writeNdef()
- cancelScan()
- platform-specific support reasons
- basic Expo Router or simple screen example
- Android/iOS/web docs
- troubleshooting docs

## Out of scope for v0

- Expo Go support
- custom native Expo Module
- MIFARE/ISO15693/FeliCa/ISO7816 advanced APIs
- background NFC flows
- production SaaS dashboard
- monorepo package extraction

## Code style

- Keep APIs small and boring.
- Prefer clear platform checks over clever abstractions.
- Do not hide platform limitations.
- All public types should be explicit.
- Any unsupported platform should fail gracefully with a typed reason.

## Validation requirement

Every Codex task should end with:
- changed files summary
- commands run
- known limitations
- manual test steps