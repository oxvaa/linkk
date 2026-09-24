# LINK 2.0.2 · Smooth Send

Major beta build for Expo Snack / Expo Go backed by LINK Production (Supabase).

## Highlights
- app-wide left-edge back gesture on main navigation and full-screen pages
- animated swipe-right-to-reply in chat
- Groups 2.0: admins, invite codes, group avatar, remove members, leave group, ownership transfer
- @mentions with in-app notifications
- Moments 2.0: reactions + view counts
- compact LINK Pro × Netflix promo on Home using vector brand asset
- Version info → What’s new page
- foreground in-app activity alerts
- Czech/English localization preserved
- LINK 1.2.2 realtime coalescing / anti-request-storm logic preserved

## Push note
System remote push is intentionally not faked inside Expo Go. The backend/in-app notification layer is ready; device push should be completed in an Expo development/production build.

## Netflix note
The current Pro benefit is a prototype reservation. A real Netflix partnership/redemption integration is required before this can activate a real Netflix subscription.


## 2.0.1 Gesture Polish
- Smooth Instagram-style swipe-to-reply directly on the message bubble
- Removed permanent purple reply arrows beside messages
- Message swipe now wins over parent edge-back navigation
- Narrower, more deliberate global edge-back gesture
- Swipe reply focuses the composer automatically


## Launcher 403 hotfix
Launcher no longer calls GitHub API. It verifies App.snack.js directly using raw/CDN fallbacks to avoid GitHub API HTTP 403.


## 2.0.2 Smooth Send
- Outgoing messages render optimistically the instant Send is tapped
- Subtle Instagram-style fade + upward lift + micro-scale entrance animation
- Tiny `Sending…` state changes to Sent / Delivered / Read after backend confirmation
- Failed sends stay visible as `Not sent` instead of silently disappearing
- Cached Supabase auth session removes an unnecessary pre-send network round trip
- Sender receipt is completed asynchronously after the message insert
- Direct and group chats use the same stable optimistic send pipeline
- No database migration required
