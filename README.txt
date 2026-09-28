LINK 4.4 · Snack Fix — Build 441
=================================

FIX
- Removed static imports of expo-notifications and expo-constants from the Snack/Expo Go build.
- Fixes: Unable to resolve module 'expo-notifications.js'.
- LINK now bundles normally in Snack / Expo Go again.

PUSH
- Server-side push infrastructure remains deployed:
  - push_devices
  - push_message_dispatches
  - link44-push-dispatch
- Snack/Expo Go build reports "Dev Build required" for Push Notifications.
- Actual Expo push-token registration will be enabled later in a native/development build where expo-notifications is installed and configured.

ALL LINK 4.4 RELIABILITY FEATURES REMAIN
- Message Delivery 2.0
- queued/offline messages + retry backoff
- server inbox projection / unread counts
- messaging backend fixes
- multi-account Realtime cleanup
- BACKSTAGE isolation

Launcher build: 441
