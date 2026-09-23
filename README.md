# LINK 1.2.1 — Glass Messaging

Snack/GitHub build for LINK Production.

## What changed
- Floating Liquid Glass navigation without a solid background strip behind the bar.
- Refreshed Home / People / Chats / Profile icons.
- Unread message badge now lives on **Chats** in the bottom navigation.
- Message arrivals no longer create Notification Center items.
- Unread state uses local `seenBy`, independent from outward-facing read receipts.
- Added server-side `mark_chat_read` RPC for reliable read state.
- Chat marks new messages as seen while the conversation is already open.
- Typing indicator moved into the message list footer so it no longer covers bubbles.
- Keyboard opening automatically keeps the conversation scrolled to the newest message.

## GitHub → Snack
Upload the files to the repository root, commit to `main`, open GitHub Pages and press **Vytvořit nový Snack**.
The launcher resolves the current commit SHA before opening Snack, avoiding stale `main` CDN cache.

Supabase schema changes for this build are already deployed to LINK Production.
