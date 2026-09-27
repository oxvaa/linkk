LINK 4.3 · Artists & Celebrities — Build 430
==============================================

ARTIST / CELEBRITY ACCOUNTS
- New profile account_type: standard | artist
- New verification_style: green
- Green badge uses #4AB45A with a white check, matching the supplied Artist badge reference.
- Artist accounts otherwise use the normal LINK profile, posts, Moments, chat and multi-account system.

LINK RELATIONSHIP RULE
- Standard accounts cannot send LINK requests to Artist accounts.
- Artist accounts can initiate LINK requests to standard accounts.
- Once connected, chat and normal LINK features work as usual.
- Rule is enforced on both client and Production backend.
- QR scan of an Artist account opens its profile instead of attempting a forbidden request.

DISCOVER
- New Artists & Celebrities horizontal section.
- Artist profiles remain searchable by name / @username.
- Green verification is shown everywhere through the shared VerificationBadge renderer.

PRE-APPROVED ARTIST REGISTRY
- Yzomandias / @yzomandias / jakubvlcek@link.app
- Nik Tendo / @goldcigo / goldcigo@link.app
- 🔇 / @nobodylisten / nobody@link.app
- WUNNA / @gunna / gunna@link.app

Those four emails are pre-approved in app_private.artist_account_allowlist.
When an Auth account is created for one of those emails, LINK automatically assigns:
- official display name
- official @username
- account_type=artist
- verified=true
- verification_style=green
- profile_visibility=everyone

BACKEND
- link_430_artist_celebrity_accounts
- link_430_artist_allowlist

Launcher cache build: 430
