LINK 3.5 · Pulse — Message Stability Fix (Build 356)
===================================================

Fixes the case where a recipient does not see a newly received message in the chat list
until manually opening/leaving/reopening the conversation.

Stability layer:
- Message INSERT realtime events use a faster 90 ms coalesced refresh.
- Realtime channel status is tracked (SUBSCRIBED / CHANNEL_ERROR / TIMED_OUT / CLOSED).
- A catch-up refresh runs whenever the realtime channel subscribes/re-subscribes.
- New lightweight server RPC: inbox_sync_cursor().
- Inbox Watchdog checks the latest visible server message every 3.5 seconds while LINK is active.
- A full snapshot is fetched only if the server cursor differs from the local inbox cursor.
- Returning LINK to the foreground triggers an immediate catch-up sync.
- Notifications realtime refresh moved from slow to fast path.
- Existing realtime remains primary; watchdog is only the reliability fallback.

Backend:
- public.inbox_sync_cursor() is restricted to authenticated/service_role.
- It uses auth.uid() and chat membership to return only the current user's latest visible message.

Files:
- App.js
- App.snack.js
- index.html
