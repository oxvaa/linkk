LINK 4.2 · Multi-Account — Build 420
====================================

NEW
- Add another existing LINK account without signing out.
- Switch instantly between saved accounts from Account Switcher.
- Each account keeps its own real Supabase Auth session.
- Chats, requests, feed, notifications, settings and profile data change with the active account.
- No passwords are stored by LINK Multi-Account.
- Active Supabase session tokens are saved locally and refreshed by Supabase when needed.
- Session rotation updates the saved account automatically.
- Up to 8 accounts can be kept on one device.
- Long-press an inactive account to remove it from this device.
- Sign out removes only the current account; if another account is saved, LINK switches to it automatically.

UI
- New iOS-style Accounts sheet.
- Add account page sheet with email/password.
- Current account gets a checkmark.
- Admin / gold verified identity is preserved in the account picker.

No backend schema migration was required.
Launcher cache build: 420
