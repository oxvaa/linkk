LINK 4.4 · RELIABILITY — Build 440
===================================

MESSAGE DELIVERY 2.0
- sender_id + client_nonce remains the server deduplication key.
- Network failures display Queued.
- Offline outbox stays persisted with the account cache.
- Retries now use exponential backoff (up to 30 seconds).
- Server-rejected messages still expose manual Retry.
- Sent / Delivered / Read remains driven by message_receipts.

SERVER INBOX PROJECTION
- New chat_inbox_state table.
- Per user/chat: last message, last activity and unread_count.
- New messages update chats.updated_at + inbox projection.
- Seen/read receipts clear unread_count.
- Projection is in Supabase Realtime.
- LINK unread badge prefers server unread_count when available.

PUSH
- New push_devices table with self-only RLS.
- New push_message_dispatches server-only dedupe table.
- Edge Function: link44-push-dispatch.
- Push contains no encrypted message plaintext.
- Push dispatch never blocks sending a message.
- A configured development/production build registers Expo push tokens.
- Settings shows Push notifications state.

EXPO GO LIMITATION
Remote push notifications are not supported in current Expo Go.
Snack/Expo Go therefore shows “Dev Build required”.
The server and client push infrastructure is ready for a later development/EAS build.

MULTI-ACCOUNT
- Removes old Realtime channels before Auth session replacement.
- Pauses token auto-refresh while switching sessions, then resumes it.
- LinkApp remounts for the new user, rebuilding timers/subscriptions cleanly.

BACKEND
- link_440_reliability_core
- link44-push-dispatch
- retains link_433 / link_434 / link_435 fixes

Launcher build: 440
