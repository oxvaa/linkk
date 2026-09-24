# LINK 1.2.2 — Realtime Stability

Hotfix focused on real multi-user chat performance in Expo Go/Snack.

- Stops receipt-triggered refresh loops.
- Serializes/coalesces realtime snapshot refreshes.
- Removes full snapshot refresh after every message send/read.
- Debounces AsyncStorage persistence.
- Reloads only the latest 600 live messages per snapshot.
- Keeps LINK 1.2.1 Glass Messaging UI and chat badge/read-state fixes.

Supabase backend migration `1.2.2-realtime-stability.sql` has already been applied to LINK Production.
