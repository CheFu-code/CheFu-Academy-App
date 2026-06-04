# CheFu Academy Mobile SSO Migration

This app now uses the CheFu OAuth/OIDC provider in `chefu-inc-backend` for mobile sign-in. Firebase Auth is no longer used for login, session persistence, password reset, or social login.

## Architecture

1. The app opens the CheFu OAuth authorize endpoint with Authorization Code + PKCE through `expo-auth-session`.
2. CheFu Account authenticates the user in the browser session.
3. The backend redirects to `chefu-academy://auth/sso` with an authorization code.
4. The app exchanges the code at `/oauth/token`.
5. Access, refresh, and ID tokens are stored in `expo-secure-store`.
6. `AuthProvider` loads `/oauth/userinfo`, merges the existing Academy Firestore profile when available, and exposes global auth state.
7. `chefuApiClient` attaches the access token to API calls and refreshes once on `401`.

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

## API Usage

Use `chefuApiClient` for backend calls:

```ts
import { chefuApiClient } from '@/services/chefuApiClient';

const response = await chefuApiClient.get('/academy/courses');
```

For fetch-based calls:

```ts
import { chefuFetch } from '@/services/chefuApiClient';

const response = await chefuFetch('/academy/courses');
```

## Cleanup Status

Removed from auth:

- Firebase email/password sign-in and sign-up screens.
- Firebase password reset and password change flows.
- Google/GitHub mobile auth routes.
- Firebase Auth package dependency.
- Firebase Auth observer and token persistence.

Still intentionally kept:

- Firestore, Storage, Messaging, and Dynamic Links packages.
- Existing direct Firestore/Storage data paths.

Final cleanup after backend API migration:

1. Move direct Firestore reads/writes to backend endpoints protected by CheFu OAuth access tokens.
2. Move Storage mutations behind backend-issued upload/delete endpoints or signed URLs.
3. Remove any remaining client assumptions that Firestore rules identify a Firebase Auth user.
4. Keep only Firebase Messaging/Dynamic Links if still required by product features.

## Platform Caveats

- iOS: URL scheme must be registered in native config after prebuild/EAS.
- Android: the scheme must be present in `intentFilters`; custom schemes are app-private, so keep backend redirect allowlists exact.
- Refresh tokens are sensitive; keep them only in SecureStore.
- If `OAUTH_ENABLE_REFRESH_TOKENS` is disabled, users will need to re-authenticate after access token expiry.
