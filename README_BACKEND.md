# LINK 1.0.0 — Backend Beta

This project is based directly on LINK 0.9.3. The existing UI is retained while the local-only social data layer is connected to the live `LINK Production` Supabase project.

## Live backend

- Supabase project: `LINK Production`
- Region: `eu-central-1`
- Project ref: `sbszhchbhlvyftdrimjv`
- Client uses the project's publishable key only. No secret/service-role key is bundled in the app.

## Backend-connected features

- Email/password registration and login
- Profiles / @usernames / avatar uploads
- LINK requests + acceptance
- Direct chats and group chats
- Realtime messages
- AES-256-GCM encrypted message text with a per-chat key
- Media uploads to private chat storage
- Reactions and custom Double Tap reaction
- Seen/read receipts + Pro Ghost Mode behavior
- Group owner / Everyone rename permission
- Silent Chat timers
- Chat themes
- Moments + private media storage
- Notes
- Favorites
- Waves and in-app notifications
- Admin moderation state (ban/mute) when the signed-in profile has a server-side admin/CEO role
- LINK Coins, owned Profile Effects, and prototype Plus/Pro entitlements synced to the account
- Plus/Pro badges for other profiles via a safe public tier projection (without exposing Coins or private entitlement data)
- Pro Profile Views / Insights count stored on the backend

## Security model

All exposed application tables use Row Level Security. Admin/verified/role values are not client-writable. Secret/service-role keys are not included in the app. Supabase security advisor reports no security lints after the final migration.

Message text is encrypted before storage, but this beta must **not** be marketed as full E2EE: chat keys are currently stored server-side behind RLS to support multi-device access. True device-only E2EE key exchange is a separate production step.

## Testing

Create two accounts with different email addresses. If email confirmation is enabled in Supabase Auth, verify each email before signing in. Send a LINK request between the two accounts, accept it, and open the chat. Messages/reactions/read receipts are stored in Supabase and Realtime refreshes the other device.

## Production items not included yet

- APNs/FCM push delivery requires an Expo EAS development/production build and push credentials; this is separate from the in-app Realtime notification feed.
- App Store / Google Play billing is not connected. Plus/Pro buttons still represent prototype entitlements and charge no real money.
- Full device-only E2EE key exchange / key backup has not been implemented or audited.

## iPhone / Snack

`App.snack.js` is an all-in-one equivalent of the backend build. If the Snack editor only lets you replace `App.js`, use the contents of `App.snack.js` as `App.js`. The Snack dependencies still need to include the packages in `package.json`, especially `@supabase/supabase-js` and `react-native-url-polyfill`.
