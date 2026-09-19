# Footballer Quiz mobile app

This directory is the native iPhone/Android version of Footballer Quiz, built with Expo and React Native.

## Run locally

Install Node.js 22.13+ and then:

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go to test on a phone, or use `npx expo run:ios` / `npx expo run:android` for native builds.

The mobile app currently uses the same curated real-player pool as the web prototype. The next step is connecting the existing database/provider layer so the player pool can scale beyond the curated list.

Expo's current SDK reference lists SDK 57 with React Native 0.86 and Node.js 22.13.x minimum. See the official Expo documentation before production store builds.
