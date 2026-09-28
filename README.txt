LINK 4.4 · Shared Test Session — Build 443
============================================

SHARED TESTING IS RESTORED
- This build intentionally restores the anonymous / UNSAVED Snack workflow.
- Shared Test Session is the primary tester mode.
- The tester does NOT need the LINK owner's Expo account.
- Testers use their own Expo Go accounts.
- Share only the My Device QR.

HOW TO USE
1. Open build 443 index.html.
2. Tap “New Shared Test Session”.
3. Wait until Snack finishes importing LINK.
4. DO NOT press Save.
5. Open My Device.
6. Send the QR to testers.
7. Testers open/scan the QR from Expo Go on their own devices.
8. If a QR later remains on Connecting, discard that QR and create a new Shared Test Session.

SESSION HARDENING
- Every Shared Test click gets a fresh:
  - cache bust
  - random session nonce
  - Snack name
  - sourceUrl
- Old QR/session state is never intentionally reused.
- Safari back/forward restores the launcher buttons.

DEVELOPER MODE
- Separate Developer Session remains available.
- That session may be saved to your own Expo account.
- Saving is NOT required for Shared Test Session.

APP
- LINK app logic is unchanged from the fixed 4.4 Snack build.
- Message Delivery 2.0 remains.
- Backend reliability fixes remain.
- No expo-notifications dependency in Snack.
- Runtime build marker: 443.
