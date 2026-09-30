LINK V · 5.0 — BUILD 500
==========================

DESIGN
- New compact visual system inspired by ChatGPT iOS, Apple and modern Instagram/TikTok messaging.
- Neutral OpenAI-like white/black surfaces with iOS blue as functional accent.
- Smaller navigation, tighter cards, smaller settings rows and less visual chrome.
- Feed header is now LINK V.
- Chats tab is now Inbox / Messages.
- Chat bubbles, metadata, composer and top bar are substantially more compact.
- Shared Test Session workflow is preserved: testers use their own Expo Go accounts.

CHAT STABILITY
- Global Realtime no longer triggers a full application snapshot for every message, reaction or receipt.
- Active chat gets its own filtered message Realtime channel.
- Active chat also runs a lightweight link_v_chat_sync_cursor watchdog every 3.5 seconds.
- Missed Realtime events, receipt updates and reactions are recovered without relying only on the socket event.
- Full app inbox watchdog relaxed to 12 seconds.
- Bootstrap only downloads receipts/reactions belonging to the recent 40 messages per chat.
- Message sends use the newest dataRef state instead of a potentially stale render closure.
- Existing client_nonce dedupe, offline queue, retries, inbox projection, delivery/read receipts and encryption remain.

CHAT SMOOTHNESS
- Chat list no longer blindly scrolls to bottom on every content-size change.
- It tracks whether the user is already near the bottom.
- New messages auto-scroll only when appropriate.
- Loading older content no longer forcibly jumps the conversation.
- FlatList rendering is bounded with smaller window/batch sizes.
- iOS keyboard uses interactive dismissal.

BACKEND
- Migration deployed: link_500_chat_core
- Added recent_message_receipts_for_my_chats()
- Added recent_message_reactions_for_my_chats()
- Added link_v_chat_sync_cursor()
- Added supporting message receipt/reaction indexes.

SHARED TESTING
1. Open index.html from GitHub Pages.
2. Tap New Shared Test Session.
3. Leave the Snack UNSAVED.
4. Open My Device.
5. Share only the QR.
6. Testers use their own Expo Go accounts.

Launcher cache: 500
