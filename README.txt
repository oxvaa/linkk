LINK 4.0 · ONE — Build 400
=============================

Major social-platform update built on LINK 3.6.

CORE
- New navigation: Feed · Discover · Create · Chats · Profile
- Feed 4.0 with Following + Discover modes
- LINK Official posts integrated into the same timeline
- LINK Pulse live-status cards inside Feed
- Create Hub: Post / Moment / Note / Group / LINK Now
- Discover search across people, posts and #topics
- Trending hashtag chips

POSTS 2.0
- Replies and threaded conversations
- Reposts
- Quote posts
- Likes
- Bookmarks
- Pinned profile post
- Text + photo posts
- Admin/CEO Markdown 101 remains supported
- Activity notifications for likes, replies, reposts and quote posts

PROFILE 4.0
- Posts / Replies / Media / Likes tabs on your profile
- Posts / Replies / Media tabs on public profiles
- Pinned post area
- Existing profile privacy still controls who can read profile posts

STABILITY
- LINK 3.6 realtime message stability layer remains active
- Post, like and bookmark changes are included in Realtime refresh
- Existing chats, Moments, Groups, Circles, LINK Now, LINK Official and Staff tools remain intact

BACKEND
- Migration: link_400_one_core
- profile_posts extended with parent_id / repost_of_id / quote_of_id / pinned
- profile_post_bookmarks with RLS
- Activity notification triggers
- Realtime enabled for profile_post_bookmarks
- set_profile_post_pinned() authenticated RPC

Expo launcher cache build: 400
