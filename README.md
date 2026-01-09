# CheFu Academy — Mobile Client

A feature-rich learning app built with Expo + React Native. This repository contains the mobile client for CheFu Academy (Android, iOS and Web via Expo). It integrates Firebase, Ads, payments, and rich media playback.

**Quick summary**
- **Tech:** Expo, React Native, TypeScript, Firebase, Sentry
- **Targets:** Android, iOS, web
- **Structure:** UI components under `component/`, screens under `app/`, native android config under `android/`.

**Key features**
- Content browsing: courses, chapters, videos, quizzes
- Offline downloads and playback
- Authentication (Firebase + Google Sign-In)
- Push notifications and background handlers
- Subscriptions and billing flows
- In-app sharing and deep links

**Repository layout (high level)**
- `app/`: Expo Router application entry and screens
- `component/`: reusable UI components
- `assets/`: images, fonts, animations
- `android/`: native Android project and Gradle settings
- `api/`, `services/`, `helpers/`: backend integration and utilities
- `config/` and `constant/`: app configuration and constants

Getting started
---------------

Prerequisites
- Node.js (16+ recommended)
- Yarn or npm
- Expo CLI: `npm install -g expo-cli` (optional; project uses `npx expo`)
- Android Studio (for `expo run:android`) or Xcode for iOS builds

Environment & configuration
- Add or verify the following files are present and configured for your environment:
  - `google-services.json` (Android Firebase config)
  - `key.json` (service keys used by the app)
  - `config/firebaseConfig.ts` or `config/firebaseConfig.js` (client Firebase config)
- Sensitive files should be kept out of source control. See `.gitignore` and your secret manager.

Install dependencies
--------------------
Run from the project root:

```bash
npm install
# or
yarn install
```

Available scripts
-----------------
- Start development client: `npm run start` (runs `npx expo --dev-client`)
- Run on Android: `npm run android` (runs `expo run:android`)
- Run on iOS: `npm run ios` (runs `expo run:ios`)
- Run web: `npm run web` (runs `expo start --web`)
- Reset project (custom): `npm run reset-project`
- Lint: `npm run lint` (runs `expo lint`)

Development notes
-----------------
- The project uses the Expo Development Client for native modules (`npx expo --dev-client`).
- Native dependencies (Firebase modules, Google mobile ads, notifee, etc.) require a native build. Use `npm run android` / `npm run ios` for proper native linking.
- If adding native packages, update `android/` and rebuild the dev client.

Android-specific
----------------
- Place `google-services.json` in `android/app/` (already present in repo for convenience).
- Check `android/gradle.properties` and `android/build.gradle` for `Sentry` and build configs.

Building release
----------------
Use Expo's build services or native tooling:

```bash
# For managed/expo-updates flows, follow Expo docs for building EAS builds
npx eas build --platform android
npx eas build --platform ios

# Or build locally with native tools after generating a release bundle
npm run android
# then build signed APK/AAB via Android Studio
```

Testing & linting
-----------------
- Lint: `npm run lint`
- There are no automated tests included in the repository; add unit/e2e tests as needed.

Useful files
------------
- App entry & routes: [app/index.tsx](app/index.tsx)
- Main config: [package.json](package.json)
- Android native config: [android/](android/)
- Firebase config: [config/firebaseConfig.ts](config/firebaseConfig.ts)

Troubleshooting
---------------
- If native modules fail to load in the dev client, rebuild the dev client after adding the module:

```bash
npx expo run:android
```
- If you hit Metro cache problems, clear caches and reinstall:

```bash
rm -rf node_modules && npm install
npx expo start -c
```

Contributing
------------
- Fork, create a branch, and open a pull request with a clear description.
- Keep changes focused and add or update documentation for any public API or behavior change.

Contact & support
-----------------
For questions about the codebase or architecture, open an issue or contact the maintainers listed in the repository settings.

License
-------
This repository does not include a license file; add one (e.g., MIT) if you plan to open-source the project.

---
Generated README for developer onboarding and quick reference.
