-- LINK 1.3.0 language support (reference copy; already applied to LINK Production)
alter table public.user_settings add column if not exists language_setting text not null default 'system';
alter table public.user_settings add column if not exists language_resolved text not null default 'en';

-- Production also includes constraints, localized LINK-request notifications,
-- and new-user language metadata handling. These were applied through the managed migrations.
