LINK 4.3 · Build 433 — Backend Stability
=========================================

SERVER FIX ALREADY LIVE
- Migration: link_433_fix_circle_rls_recursion
- Removed recursive RLS loop between circles and circle_members.
- Notes and LINK Now circle visibility now use non-recursive helper functions.

CLIENT FIX
- Full backend snapshots now have a hard refresh cooldown.
- Realtime event bursts are merged before refreshing.
- Backend errors use exponential backoff instead of creating a refresh loop.
- LINK does not run a full backend refresh while backgrounded.
- Realtime socket state changes no longer trigger a full 40+ query snapshot.
- Inbox / LINK-request watchdog reduced from every 3.5 s to every 8 s.
- A foreground catch-up still runs after returning to LINK.
- Requests carry x-link-client=link-ios-433 and x-link-build=433 for log diagnostics.

BACKSTAGE
- BACKSTAGE has been separated into its own standalone PWA build.
- The standalone BACKSTAGE package contains no LINK Production URL, publishable key,
  Supabase client, Auth refresh or Realtime integration.

Launcher cache build: 433
