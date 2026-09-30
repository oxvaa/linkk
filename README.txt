LINK V · 5.0.1 — BUILD 501
============================

HOTFIX
- Fixed Snack startup error:
  Identifier 'activeThreadKey' has already been declared.
- Removed the duplicated block-scoped declaration in LinkApp.
- Preserved the original activeThreadKey used by:
  - activeBackendChatId
  - active message list
  - direct/group chat routing
  - chat theme and preferences
  - silent-chat state

VALIDATION
- App.js and App.snack.js are byte-identical.
- JSX/TypeScript transpile syntax check passed.
- TypeScript checkJs duplicate-variable scan reports no TS2451 redeclarations.
- activeThreadKey declaration count is exactly 1.
- Shared Test Session workflow is unchanged.
- No expo-notifications / expo-constants dependency in Snack.

Launcher cache: 501
