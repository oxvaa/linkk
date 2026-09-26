LINK 3.6 — Profile Posts
========================

Major profile update built on LINK Production.

New in 3.6:
- Every user profile now has a permanent Threads/X-style post feed.
- Users can publish text-only posts or a photo with text.
- Photo posts use the private profile-posts Storage bucket.
- Post media follows the same profile_visibility rules as the profile itself.
- Users can like posts; likes update optimistically and sync through Supabase.
- Own posts can be deleted.
- Public profiles are now full-screen instead of a small popup.
- LINK Official remains the special read-only official feed.
- Admin/CEO profile posts support the existing Markdown 101 renderer; normal user posts stay plain text.
- profile_posts and profile_post_likes are Realtime-enabled.
- Build launcher cache tag: 360.

Files:
- App.js
- App.snack.js
- index.html
