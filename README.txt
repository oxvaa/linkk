LINK 4.3 · Expo Session Recovery — Launcher Build 432
======================================================

WHY THIS PATCH EXISTS
- The screenshot with Expo Go stuck on "Connecting..." appears before the LINK JavaScript bundle starts.
- LINK itself is therefore not yet running at that point.
- Expo changed physical-iOS development authentication requirements in September 2026.
- Anonymous/temporary Snack sessions can also become stale; rescanning an old QR can keep pointing at a dead session.

LAUNCHER FIX
- Correct source verification marker: LINK 4.3 · Artists
- Cache build bumped to 432
- Every Shared Test click generates a new random session id + cache-busted source URL
- Old QR recovery instructions are shown directly in the launcher
- Shared mode explicitly requires testers to be signed in to Expo Go
- Developer mode is now presented as the stable mode; sign in to Snack and Save once for longer-running testing
- Browser back/forward restore resets launcher buttons and source URL
- No LINK app/backend logic changed

IF EXPO GO IS STUCK
1. Force-close Expo Go.
2. Open Expo Go and make sure you are signed in.
3. Do NOT scan the old QR again.
4. Re-open index.html and tap "Nová Shared Test Session".
5. Wait for Snack to finish loading, then open My Device and scan the new QR.
6. For your own stable session, use Developer Session and Save the Snack while logged in.

App source remains LINK 4.3 Artists + BACKSTAGE.
