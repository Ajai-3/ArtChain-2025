# Route Constants Usage Guide

This document explains how to use the centralized route constants in your application.

## Overview

All application routes are defined in `src/constants/routes.ts`. This centralized approach ensures:
- **Single source of truth** for all routes
- **Easy refactoring** - change a route in one place, it updates everywhere
- **Type safety** with TypeScript
- **Consistency** across the application

## Importing Routes

```typescript
import { ROUTES, ROUTE_PATTERNS, SETTINGS_TABS } from '@/constants/routes';
```

## Usage Examples

### 1. Static Routes

For routes that don't require parameters:

```typescript
// Navigation
navigate(ROUTES.HOME);
navigate(ROUTES.SHOP);
navigate(ROUTES.SETTINGS);
navigate(ROUTES.SETTINGS_PROFILE);

// NavLink/Link
<NavLink to={ROUTES.HOME}>Home</NavLink>
<Link to={ROUTES.SETTINGS_PASSWORD}>Password Settings</Link>
```

### 2. Dynamic Routes

For routes that require parameters (username, artname, etc.):

```typescript
// Profile routes
const username = "johndoe";
navigate(ROUTES.PROFILE(username));  // /johndoe
navigate(ROUTES.PROFILE_GALLERY(username));  // /johndoe/gallery
navigate(ROUTES.PROFILE_SHOP(username));  // /johndoe/shop

// Art page
const username = "artist";
const artname = "sunset-painting";
navigate(ROUTES.ART_PAGE(username, artname));  // /artist/art/sunset-painting

// Chat conversation
const conversationId = "abc123";
navigate(ROUTES.CHAT_CONVERSATION(conversationId));  // /chat/abc123
```

### 3. Route Patterns (for React Router)

Use `ROUTE_PATTERNS` when defining routes in React Router:

```typescript
import { ROUTE_PATTERNS } from '@/constants/routes';

<Route path={ROUTE_PATTERNS.PROFILE} element={<Profile />} />
<Route path={ROUTE_PATTERNS.ART_PAGE} element={<ArtPage />} />
```

### 4. Settings Tabs

Use `SETTINGS_TABS` for settings navigation:

```typescript
import { SETTINGS_TABS } from '@/constants/routes';

const tabs = [
  { id: SETTINGS_TABS.PROFILE, label: "Profile" },
  { id: SETTINGS_TABS.PASSWORD, label: "Password" },
  // ...
];
```

## Complete Route List

### Main Routes
- `ROUTES.HOME` → `/`
- `ROUTES.LOGIN` → `/login`
- `ROUTES.RESET_PASSWORD` → `/reset-password`
- `ROUTES.VERIFY` → `/verify`
- `ROUTES.LIORA_AI` → `/liora.ai`
- `ROUTES.NOTIFICATIONS` → `/notifications`
- `ROUTES.BIDDING` → `/bidding`
- `ROUTES.SHOP` → `/shop`
- `ROUTES.WALLET` → `/wallet`
- `ROUTES.CHAT` → `/chat`

### Settings Routes
- `ROUTES.SETTINGS` → `/settings`
- `ROUTES.SETTINGS_PROFILE` → `/settings/profile`
- `ROUTES.SETTINGS_PASSWORD` → `/settings/password`
- `ROUTES.SETTINGS_PRIVACY` → `/settings/privacy`
- `ROUTES.SETTINGS_NOTIFICATIONS` → `/settings/notifications`
- `ROUTES.SETTINGS_SUBSCRIPTIONS` → `/settings/subscriptions`
- `ROUTES.SETTINGS_PURCHASES` → `/settings/purchases`
- `ROUTES.SETTINGS_SALES` → `/settings/sales`
- `ROUTES.SETTINGS_LIKED` → `/settings/liked`
- `ROUTES.SETTINGS_BLOCKED` → `/settings/blocked`
- `ROUTES.SETTINGS_SUPPORT` → `/settings/support`

### Dynamic Routes (Functions)
- `ROUTES.PROFILE(username)` → `/${username}`
- `ROUTES.PROFILE_GALLERY(username)` → `/${username}/gallery`
- `ROUTES.PROFILE_FAVORITES(username)` → `/${username}/favorites`
- `ROUTES.PROFILE_POSTS(username)` → `/${username}/posts`
- `ROUTES.PROFILE_SHOP(username)` → `/${username}/shop`
- `ROUTES.PROFILE_ABOUT(username)` → `/${username}/about`
- `ROUTES.ART_PAGE(username, artname)` → `/${username}/art/${artname}`
- `ROUTES.CHAT_CONVERSATION(conversationId)` → `/chat/${conversationId}`

## How to Add a New Route

1. Open `src/constants/routes.ts`
2. Add your route to the `ROUTES` object:

```typescript
export const ROUTES = {
  // ... existing routes
  NEW_FEATURE: '/new-feature',
  NEW_FEATURE_DETAIL: (id: string) => `/new-feature/${id}`,
} as const;
```

3. If it's a route pattern for React Router, add it to `ROUTE_PATTERNS`:

```typescript
export const ROUTE_PATTERNS = {
  // ... existing patterns
  NEW_FEATURE_DETAIL: '/new-feature/:id',
} as const;
```

4. Use it in your components:

```typescript
import { ROUTES } from '@/constants/routes';

// Navigation
navigate(ROUTES.NEW_FEATURE);
navigate(ROUTES.NEW_FEATURE_DETAIL('123'));

// Link
<NavLink to={ROUTES.NEW_FEATURE}>New Feature</NavLink>
```

## Benefits

✅ **Centralized Management** - All routes in one place  
✅ **Type Safety** - TypeScript catches errors at compile time  
✅ **Refactoring** - Change `/shop` to `/marketplace` in one place  
✅ **Autocomplete** - IDE suggests available routes  
✅ **No Typos** - Prevents hardcoded string errors  
✅ **Easy Testing** - Import constants in tests  

## Migration Checklist

When migrating existing code to use route constants:

- [ ] Replace hardcoded strings like `"/shop"` with `ROUTES.SHOP`
- [ ] Replace template literals like `` `/${username}` `` with `ROUTES.PROFILE(username)`
- [ ] Update navigation calls: `navigate("/settings")` → `navigate(ROUTES.SETTINGS)`
- [ ] Update Link/NavLink components: `to="/shop"` → `to={ROUTES.SHOP}`
- [ ] Update route definitions: `path="/shop"` → stays the same (or use ROUTE_PATTERNS)

## Files Already Updated

The following files have been updated to use route constants:
- ✅ `src/features/user/components/sidebar/UserSettingsSideBar.tsx`
- ✅ `src/features/user/components/sidebar/UserSideBar.tsx`

## Next Steps

Continue updating other components that use navigation:
- Search for `navigate("/` in your codebase
- Search for `to="/` in NavLink/Link components
- Replace with appropriate ROUTES constants
