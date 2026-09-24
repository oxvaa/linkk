# LINK 2.0.6 · Verified Badge

Major beta build for Expo Snack / Expo Go backed by LINK Production (Supabase).

## 2.0.5 highlights
- server-authorized Admin Console access for designated LINK staff accounts
- verified staff identity support
- Admin Staff Badge: switch between standard LINK PRO and a custom badge
- custom badge text, icon and accent color
- staff badge settings sync through LINK Production
- server-side protection for role, verification and custom badge fields
- ordinary user accounts cannot unlock Admin Console or staff badge tools
- previous LINK 2.0 features remain included: Profile Layouts, Smooth Send, gesture polish, Groups 2.0, Moments 2.0 and Czech/English support

## Security
Staff authorization is stored in LINK Production and is not hard-coded into the public app source. The downloadable project intentionally contains no staff email address or secret admin token.

Admin/CEO-only controls are enforced both in the UI and by Supabase RLS/RPC checks. A normal account cannot become admin by editing local state or calling the custom badge RPC directly.

## Verified badge
The build uses LINK's existing vector VerifiedBadge component. If a different exact badge artwork is required, replace the visual asset/component without changing the server-side `verified` flag.

## Push note
System remote push is intentionally not faked inside Expo Go. The backend/in-app notification layer is ready; device push should be completed in an Expo development/production build.

## Netflix note
The current Pro benefit is a prototype reservation. A real Netflix partnership/redemption integration is required before this can activate a real Netflix subscription.


## 2.0.6 Verified Badge
- Replaced generated verified mark with the supplied official-style LINK verified asset.
- Added `assets/verified-badge.webp` and `assets/verified-badge.png`.
- Snack single-file build embeds a compact PNG data URI fallback for reliable Expo Go rendering.
