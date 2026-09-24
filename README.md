# LINK 1.3.0 — Czech First

Major localization + Auth redesign release built on the stabilized 1.2.2 realtime core.

## What changed
- Full Czech/English UI layer with Czech-first support.
- `Language` setting: System / Čeština / English.
- Czech device locale resolves automatically to Czech when `System` is selected.
- Language choice syncs through Supabase `user_settings` and persists across devices.
- LINK request/accept notifications are localized on the backend.
- Czech time formatting and common Auth/Supabase errors are localized.
- Completely redesigned Auth page with premium glass UI, Czech-origin branding, login/register segmented control, richer hierarchy, password visibility, and cross-device sync status.
- Keeps LINK 1.2.2 realtime stability fixes, unread state fixes, Liquid Glass navbar and messaging features.

Supabase language migrations have already been applied to LINK Production.
