-- LINK 1.2.2 Realtime Stability
-- Applied to LINK Production. Prevents repeated no-op receipt updates from emitting realtime WAL events.

create or replace function public.mark_chat_delivered(p_chat_id uuid)
returns void language plpgsql security invoker set search_path='' as $$
begin
  if not app_private.is_chat_member(p_chat_id,auth.uid()) then raise exception 'Not a chat member'; end if;
  insert into public.message_receipts(message_id,user_id,delivered_at)
  select m.id,auth.uid(),now() from public.messages m
  where m.chat_id=p_chat_id and m.sender_id<>auth.uid() and m.deleted_at is null
    and (m.expires_at is null or m.expires_at>now())
  on conflict(message_id,user_id) do update set delivered_at=excluded.delivered_at
  where public.message_receipts.delivered_at is null;
end; $$;

create or replace function public.mark_chat_read(p_chat_id uuid, p_send_read_receipt boolean default true)
returns void language plpgsql security invoker set search_path='' as $$
begin
  if not app_private.is_chat_member(p_chat_id,auth.uid()) then raise exception 'Not a chat member'; end if;
  insert into public.message_receipts(message_id,user_id,delivered_at,seen_at,read_at)
  select m.id,auth.uid(),now(),now(),case when coalesce(p_send_read_receipt,true) then now() else null end
  from public.messages m
  where m.chat_id=p_chat_id and m.sender_id<>auth.uid() and m.deleted_at is null
    and (m.expires_at is null or m.expires_at>now())
  on conflict(message_id,user_id) do update set
    delivered_at=coalesce(public.message_receipts.delivered_at,excluded.delivered_at),
    seen_at=coalesce(public.message_receipts.seen_at,excluded.seen_at),
    read_at=case when coalesce(p_send_read_receipt,true) then coalesce(public.message_receipts.read_at,excluded.read_at) else public.message_receipts.read_at end
  where public.message_receipts.delivered_at is null
     or public.message_receipts.seen_at is null
     or (coalesce(p_send_read_receipt,true) and public.message_receipts.read_at is null);
end; $$;
