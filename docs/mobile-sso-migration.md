# CheFu Academy Mobile SSO Migration

This app now uses the CheFu OAuth/OIDC provider in `chefu-inc-backend` for mobile sign-in. Firebase Auth is no longer used for login, session persistence, password reset, or social login.

## Architecture

1. The app opens the CheFu OAuth authorize endpoint with Authorization Code + PKCE through `expo-auth-session`.
2. CheFu Account authenticates the user in the browser session.
3. The backend redirects to `chefu-academy://auth/sso` with an authorization code.
4. The app exchanges the code at `/oauth/token`.
5. Access, refresh, and ID tokens are stored in `expo-secure-store`.
6. `AuthProvider` loads `/oauth/userinfo`, then loads the Academy profile from `/api/academy/mobile/me`.
7. `chefuApiClient` attaches the access token to API calls and refreshes once on `401`.
8. User-owned Firebase work is performed by the backend with Firebase Admin SDK.

## SSO Dashboard / Backend Setup

Register this mobile OAuth client in `chefu-inc-backend`:

- Client ID: `chefu-academy-mobile`
- App: `academy`
- Redirect URI: `chefu-academy://auth/sso`
- Flow: Authorization Code with PKCE
- Client type: public/native mobile client
- Scopes: `openid profile email courses:read videos:read keys:manage`
- Refresh tokens: enabled in production with `OAUTH_ENABLE_REFRESH_TOKENS=true`

The CheFu Account redirect policy must allow the mobile client and exact redirect URI.

## Mobile Dependencies

- `expo-auth-session`: secure OAuth/OIDC Authorization Code + PKCE flow.
- `expo-web-browser`: opens the system browser/in-app browser handoff.
- `expo-secure-store`: encrypted token persistence.
- `axios`: API client with request/response interceptors.

Do not use a WebView for the login page.

## Deep Links

The app scheme is configured in `app.json`:

```json
{
  "expo": {
    "scheme": "chefu-academy",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": { "scheme": "chefu-academy" },
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

Use the exact redirect URI `chefu-academy://auth/sso` in the backend allowlist. Android intent filters and iOS URL schemes must match the scheme exactly.

## Code Map

- `services/ssoAuth.ts`: login, token exchange, secure token storage, refresh, userinfo, logout.
- `context/AuthContext.tsx`: global auth state, profile hydration, `login`, `logout`, `refresh`, `getAccessToken`.
- `services/chefuApiClient.ts`: Axios and fetch wrappers that attach bearer tokens and refresh on `401`.
- `app/auth/sso.tsx`: mobile SSO entry screen.
- `app/_layout.tsx`: wraps the app in `AuthProvider` and protects routes from global SSO state.
- `chefu-inc-backend/src/modules/academy-mobile`: SSO-protected Academy mobile APIs for profile, settings, avatar upload, FCM token registration, notification sending, owned courses, course/video catalog reads, and video deletion.

## API Usage

Use `chefuApiClient` for backend calls:

```ts
import { chefuApiClient } from '@/services/chefuApiClient';

const response = await chefuApiClient.get('/api/academy/mobile/courses');
```

For fetch-based calls:

```ts
import { chefuFetch } from '@/services/chefuApiClient';

const response = await chefuFetch('/api/academy/mobile/courses');
```

## Backend-Owned Mobile Services

Implemented server-side through `chefu-inc-backend`:

- Profile reads/updates: `GET/PATCH /api/academy/mobile/me`
- Data export: `GET /api/academy/mobile/me/export`
- Settings and email preferences: `GET/PATCH /api/academy/mobile/settings`
- Device permissions snapshot: `PUT /api/academy/mobile/permissions`
- Presence/last seen: `POST /api/academy/mobile/presence`
- Avatar uploads to Firebase Storage: `POST /api/academy/mobile/avatar`
- FCM token registration: `POST /api/academy/mobile/notifications/fcm-token`
- Push notification sending through Firebase Admin: `POST /api/academy/mobile/notifications/send`
- Owned courses: `GET /api/academy/mobile/courses/my`
- Public courses/videos: `GET /api/academy/mobile/courses`, `GET /api/academy/mobile/videos`
- YouTube preview lookup without mobile API keys: `GET /api/academy/mobile/videos/youtube/lookup`
- Video deletion with backend ownership checks: `DELETE /api/academy/mobile/videos/:videoId`

Firebase Messaging remains on-device for permission prompts and device token generation. The token is then sent to the backend; the app no longer writes it directly to Firestore.

## Payments

Mobile payment and PayPal subscription routes have been removed permanently. Any paid-service prompt should open the web billing experience:

```ts
import { ACADEMY_WEB_BILLING_URL } from '@/constant/links';

Linking.openURL(ACADEMY_WEB_BILLING_URL);
```

## Cleanup Status

Removed from auth:

- Firebase email/password sign-in and sign-up screens.
- Firebase password reset and password change flows.
- Google/GitHub mobile auth routes.
- Firebase Auth package dependency.
- Firebase Auth observer and token persistence.

Still intentionally kept:

- Firebase Messaging for mobile notification permission/token handling.
- Firestore/Storage for product features that still need a larger backend API migration, such as sparks, reviews, local large video upload, favorites, and some catalog/community views.
- Dynamic Links while product deep-link features still use them.

Final cleanup after backend API migration:

1. Move remaining sparks, reviews, favorites, notifications, and community profile reads to backend endpoints protected by CheFu OAuth access tokens.
2. Replace large local video upload with backend-issued signed upload URLs.
3. Remove any remaining client assumptions that Firestore rules identify a Firebase Auth user.
4. Keep only Firebase Messaging/Dynamic Links if still required by product features.

## Platform Caveats

- iOS: URL scheme must be registered in native config after prebuild/EAS.
- Android: the scheme must be present in `intentFilters`; custom schemes are app-private, so keep backend redirect allowlists exact.
- Refresh tokens are sensitive; keep them only in SecureStore.
- If `OAUTH_ENABLE_REFRESH_TOKENS` is disabled, users will need to re-authenticate after access token expiry.
