# LINK 1.2.0 — Messaging Upgrade

This build keeps LINK 1.1 presence/privacy and upgrades the real Supabase messaging layer.

## Added in 1.2.0
- Realtime typing indicators for DMs and groups
- Delivered / Seen message state
- Edit text messages with `Edited` marker
- Unsend for everyone
- Delete for me
- Pin / unpin messages and pinned-message viewer
- Search inside decrypted active chat history
- Media & voice gallery for shared chat items
- Forward text messages to another LINK
- Pin chat, mark unread, mute and archive controls
- Archived chat view
- Per-chat mute suppresses backend message notifications
- Forwarded message indicator
- Existing photo upload remains backed by Supabase Storage

## Backend
The Supabase project has already been migrated for 1.2.0 with:
- `typing_status`
- `message_deletions`
- `message_pins`
- `chat_user_settings`
- `messages.view_once`
- `edit_message`, `unsend_message`, `set_typing`, `mark_chat_delivered` RPCs
- Realtime enabled for the new messaging tables
- RLS enabled for all new public tables

## Security note
LINK encrypts text before storing it in Supabase, but the current beta stores shared chat keys server-side behind RLS. Do not market the current beta as full device-only end-to-end encryption.

## Not yet in this build
Real microphone recording/playback is intentionally not faked. Existing voice-message rendering remains supported, while actual recording is reserved for the next messaging patch.

## Snack
Upload this repo to GitHub, open the included GitHub Pages `index.html`, then create a new Snack. The launcher resolves the latest commit SHA first to avoid stale `raw.githubusercontent.com/main` cache.
