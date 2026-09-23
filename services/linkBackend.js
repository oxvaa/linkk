import { supabase } from '../lib/supabase';

const threadKey = (a, b) => [a, b].sort().join('__');
const groupThreadKey = groupId => `group__${groupId}`;
const toMs = value => value ? new Date(value).getTime() : null;
const timeLabel = value => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
const cleanUsername = value => {
  const core = String(value || '').trim().replace(/^@/, '').replace(/\s+/g, '').replace(/[^a-zA-Z0-9_.]/g, '').toLowerCase();
  return `@${core || 'linkuser'}`;
};

export async function signOutLink() {
  return supabase.auth.signOut();
}

export async function uploadAvatar(userId, uri) {
  if (!uri || /^https?:/i.test(uri)) return uri || null;
  const body = await fetch(uri).then(r => r.arrayBuffer());
  const ext = (uri.split('.').pop() || 'jpg').split('?')[0].toLowerCase();
  const safeExt = ['jpg','jpeg','png','webp'].includes(ext) ? ext : 'jpg';
  const path = `${userId}/avatar-${Date.now()}.${safeExt}`;
  const { error } = await supabase.storage.from('avatars').upload(path, body, { contentType: safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg', upsert: true });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
}

async function uploadMomentMedia(userId, uri) {
  if (!uri || /^https?:/i.test(uri)) return uri || null;
  const body = await fetch(uri).then(r => r.arrayBuffer());
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.jpg`;
  const { error } = await supabase.storage.from('moments-media').upload(path, body, { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}

async function signedMomentUrl(path) {
  if (!path) return null;
  if (/^https?:/i.test(path)) return path;
  const { data, error } = await supabase.storage.from('moments-media').createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function uploadChatMedia(chatId, uri, type = 'image') {
  if (!uri || /^https?:/i.test(uri)) return null;
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  const body = await fetch(uri).then(r => r.arrayBuffer());
  const extMap = { image: 'jpg', video: 'mp4', voice: 'm4a', file: 'bin', gif: 'gif' };
  const ext = extMap[type] || 'bin';
  const contentType = type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : type === 'voice' ? 'audio/mp4' : type === 'gif' ? 'image/gif' : 'application/octet-stream';
  const path = `${chatId}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const { error } = await supabase.storage.from('chat-media').upload(path, body, { contentType });
  if (error) throw error;
  return path;
}

async function signedChatUrl(path) {
  if (!path) return null;
  if (/^https?:/i.test(path)) return path;
  const { data, error } = await supabase.storage.from('chat-media').createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function loadLinkSnapshot(base, userId) {
  const [profilesQ, settingsQ, entitlementsQ, tiersQ, moderationQ, connectionsQ, chatsQ, membersQ, keysQ, messagesQ, reactionsQ, receiptsQ, momentsQ, notesQ, favoritesQ, notificationsQ, profileViewsQ] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('entitlements').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('profile_tiers').select('*'),
    supabase.from('moderation').select('*'),
    supabase.from('connections').select('*'),
    supabase.from('chats').select('*').order('created_at'),
    supabase.from('chat_members').select('*'),
    supabase.from('chat_keys').select('*').eq('user_id', userId),
    supabase.from('messages').select('*').or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).order('created_at'),
    supabase.from('message_reactions').select('*'),
    supabase.from('message_receipts').select('*'),
    supabase.from('moments').select('*').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }),
    supabase.from('notes').select('*').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }),
    supabase.from('favorites').select('*').eq('user_id', userId),
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(80),
    supabase.from('profile_views').select('id').eq('viewed_user_id', userId),
  ]);
  const queries = [profilesQ,settingsQ,entitlementsQ,tiersQ,moderationQ,connectionsQ,chatsQ,membersQ,keysQ,messagesQ,reactionsQ,receiptsQ,momentsQ,notesQ,favoritesQ,notificationsQ,profileViewsQ];
  const failed = queries.find(q => q.error);
  if (failed) throw failed.error;

  const profiles = {};
  for (const row of profilesQ.data || []) {
    profiles[row.id] = {
      id: row.id,
      isLocal: row.id === userId,
      isAdmin: ['admin','ceo'].includes(row.role),
      role: row.role,
      verified: !!row.verified,
      name: row.name,
      username: row.username,
      bio: row.bio || '',
      photoUri: row.avatar_url || null,
      status: row.status,
      statusIcon: row.status_icon,
      statusColor: row.status_color,
      statusGradient: row.status_gradient,
      profileEffectId: row.profile_effect_id,
      nameEffectId: row.name_effect_id,
      socials: row.socials || {},
    };
  }

  const relationships = { [userId]: [] };
  const requests = [];
  for (const row of connectionsQ.data || []) {
    const other = row.user_a === userId ? row.user_b : row.user_a;
    if (row.status === 'accepted') relationships[userId].push(other);
    if (row.status === 'pending') requests.push({ id: row.id, fromId: row.requested_by, toId: row.requested_by === row.user_a ? row.user_b : row.user_a, createdAt: timeLabel(row.created_at) });
  }
  relationships[userId] = Array.from(new Set(relationships[userId]));

  const membersByChat = {};
  for (const row of membersQ.data || []) {
    if (!membersByChat[row.chat_id]) membersByChat[row.chat_id] = [];
    membersByChat[row.chat_id].push(row);
  }

  const backendChatIds = {};
  const groups = {};
  const threadForChat = {};
  for (const chat of chatsQ.data || []) {
    const members = (membersByChat[chat.id] || []).map(x => x.user_id);
    if (chat.kind === 'direct') {
      const other = members.find(id => id !== userId);
      if (other) {
        const key = threadKey(userId, other);
        backendChatIds[key] = chat.id;
        threadForChat[chat.id] = key;
      }
    } else {
      const key = groupThreadKey(chat.id);
      backendChatIds[key] = chat.id;
      threadForChat[chat.id] = key;
      groups[chat.id] = {
        id: chat.id,
        name: chat.name || 'New Group',
        ownerId: chat.created_by,
        memberIds: members,
        everyoneCanEditName: !!chat.everyone_can_edit_name,
        createdAt: toMs(chat.created_at),
      };
    }
  }

  const chatKeys = {};
  const keyByChat = {};
  for (const row of keysQ.data || []) keyByChat[row.chat_id] = row.wrapped_key;
  for (const [chatId,key] of Object.entries(threadForChat)) if (keyByChat[chatId]) chatKeys[key] = keyByChat[chatId];

  const reactionsByMessage = {};
  for (const r of reactionsQ.data || []) {
    if (!reactionsByMessage[r.message_id]) reactionsByMessage[r.message_id] = [];
    reactionsByMessage[r.message_id].push({ userId:r.user_id, emoji:r.emoji });
  }
  const seenBy = {}, readBy = {};
  for (const r of receiptsQ.data || []) {
    if (!seenBy[r.message_id]) seenBy[r.message_id] = [];
    seenBy[r.message_id].push(r.user_id);
    if (r.read_at) {
      if (!readBy[r.message_id]) readBy[r.message_id] = [];
      readBy[r.message_id].push(r.user_id);
    }
  }

  const conversations = {};
  const mediaSigned = await Promise.all((messagesQ.data || []).map(m => signedChatUrl(m.media_url)));
  (messagesQ.data || []).forEach((m,index) => {
    const key = threadForChat[m.chat_id];
    if (!key) return;
    if (!conversations[key]) conversations[key] = [];
    conversations[key].push({
      id:m.id, senderId:m.sender_id, type:m.type, cipher:m.cipher, encrypted:!!m.cipher,
      replyTo:m.reply_to, time:timeLabel(m.created_at), readBy:readBy[m.id] || [m.sender_id], seenBy:seenBy[m.id] || [m.sender_id],
      reactions:reactionsByMessage[m.id] || [], expiresAt:toMs(m.expires_at), uri:mediaSigned[index] || null, duration:m.duration == null ? null : Number(m.duration),
      createdAt:toMs(m.created_at),
    });
  });
  for (const key of Object.values(threadForChat)) if (!conversations[key]) conversations[key] = [];

  const chatThemes = {}, chatThemeScopes = {}, silentChats = {};
  for (const chat of chatsQ.data || []) {
    const key = threadForChat[chat.id];
    if (!key) continue;
    chatThemes[key] = chat.theme_id || 'default';
    chatThemeScopes[key] = chat.theme_scope || 'messages';
    silentChats[key] = { enabled:!!chat.silent_enabled, timerSeconds:chat.silent_timer_seconds || 300 };
  }

  const signedMoments = await Promise.all((momentsQ.data || []).map(m => signedMomentUrl(m.image_url)));
  const moments = (momentsQ.data || []).map((m,i) => ({ id:m.id, ownerId:m.owner_id, imageUri:signedMoments[i], caption:m.caption || '', emoji:m.emoji, createdAt:toMs(m.created_at), expiresAt:toMs(m.expires_at) }));
  const notes = (notesQ.data || []).map(n => ({ id:n.id, ownerId:n.owner_id, text:n.text, emoji:n.emoji, audience:n.audience, createdAt:toMs(n.created_at), expiresAt:toMs(n.expires_at) }));
  const settings = settingsQ.data || {};
  const ent = entitlementsQ.data || {};
  const moderation = {};
  for (const row of moderationQ.data || []) moderation[row.user_id] = { banned:!!row.banned, mutedUntil:row.muted_until ? toMs(row.muted_until) : null, reason:row.reason || null };
  const plusUntil = toMs(ent.plus_until), proUntil = toMs(ent.pro_until), trialUntil = toMs(ent.pro_trial_until);
  const subscriptions = {}, proSubscriptions = {};
  for (const row of tiersQ.data || []) {
    const publicPlusUntil = toMs(row.plus_until);
    const publicProUntil = toMs(row.pro_until);
    if (publicPlusUntil) subscriptions[row.user_id] = { active:publicPlusUntil>Date.now(), expiresAt:publicPlusUntil, plan:'monthly' };
    if (publicProUntil) proSubscriptions[row.user_id] = { active:publicProUntil>Date.now(), expiresAt:publicProUntil, plan:'monthly' };
  }
  subscriptions[userId] = plusUntil ? {active:plusUntil>Date.now(),expiresAt:plusUntil,plan:ent.plus_plan || 'monthly'} : null;
  proSubscriptions[userId] = proUntil ? {active:proUntil>Date.now(),expiresAt:proUntil,plan:ent.pro_plan || 'monthly',trial:!!(trialUntil && trialUntil>Date.now()),trialEndsAt:trialUntil} : null;
  const notifications = (notificationsQ.data || []).map(n => ({ id:n.id, type:n.type, title:n.title, body:n.body, time:timeLabel(n.created_at), read:!!n.read, actorId:n.actor_id, chatId:n.chat_id, createdAt:toMs(n.created_at) }));

  return {
    ...base,
    version: 13,
    activeAccountId:userId,
    localAccountIds:[userId],
    profiles,
    relationships,
    requests,
    groups,
    conversations,
    backendChatIds,
    doubleTapReactions:{ [userId]:settings.double_tap_emoji || '❤️' },
    moments,
    notes,
    notifications:{ [userId]:notifications },
    favorites:{ [userId]:(favoritesQ.data || []).map(x => x.favorite_user_id) },
    privacy:{ [userId]:{ showStatus:settings.show_status ?? true, showSocials:settings.show_socials ?? true, momentsToLinks:settings.moments_to_links ?? true, ghostMode:settings.ghost_mode ?? false } },
    wallets:{ [userId]:ent.coins ?? 2200 },
    ownedEffects:{ [userId]:ent.owned_effects || [] },
    subscriptions,
    proSubscriptions,
    moderation,
    chatKeys,
    silentChats,
    chatThemes,
    chatThemeScopes,
    profileViews:{ [userId]:(profileViewsQ.data || []).length },
    themeSetting:settings.theme_setting || base.themeSetting || 'system',
  };
}

export function subscribeLink(userId, onChange) {
  let timer = null;
  const kick = () => {
    clearTimeout(timer);
    timer = setTimeout(() => onChange?.(), 120);
  };
  const channel = supabase.channel(`link-live-${userId}`)
    .on('postgres_changes',{event:'*',schema:'public',table:'connections'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'chats'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'chat_members'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'messages'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'message_reactions'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'message_receipts'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'moments'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'notes'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'moderation'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'entitlements'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'profile_tiers'},kick)
    .on('postgres_changes',{event:'*',schema:'public',table:'profile_views'},kick)
    .subscribe();
  return () => { clearTimeout(timer); supabase.removeChannel(channel); };
}


export async function recordProfileViewRemote(personId) {
  const { data: auth } = await supabase.auth.getUser();
  const viewerId = auth.user?.id;
  if (!viewerId || !personId || viewerId === personId) return;
  const { error } = await supabase.from('profile_views').insert({ viewed_user_id:personId, viewer_id:viewerId });
  if (error) throw error;
}

export async function updateProfileRemote(profile) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  let avatar = profile.photoUri || null;
  if (avatar && !/^https?:/i.test(avatar)) avatar = await uploadAvatar(userId, avatar);
  const row = {
    username:cleanUsername(profile.username), name:String(profile.name || 'LINK user').trim().slice(0,60), bio:String(profile.bio || '').slice(0,180), avatar_url:avatar,
    status:profile.status || 'Available', status_icon:profile.statusIcon || 'checkmark-circle', status_color:profile.statusColor || '#34C759', status_gradient:profile.statusGradient || null,
    profile_effect_id:profile.profileEffectId || null, name_effect_id:profile.nameEffectId || null, socials:profile.socials || {}, updated_at:new Date().toISOString(),
  };
  const { error } = await supabase.from('profiles').update(row).eq('id',userId);
  if (error) throw error;
}

export async function updateSettingsRemote(patch) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  const row = { user_id:userId, updated_at:new Date().toISOString() };
  if ('themeSetting' in patch) row.theme_setting = patch.themeSetting;
  if ('showStatus' in patch) row.show_status = !!patch.showStatus;
  if ('showSocials' in patch) row.show_socials = !!patch.showSocials;
  if ('momentsToLinks' in patch) row.moments_to_links = !!patch.momentsToLinks;
  if ('ghostMode' in patch) row.ghost_mode = !!patch.ghostMode;
  if ('doubleTapEmoji' in patch) row.double_tap_emoji = patch.doubleTapEmoji || '❤️';
  const { error } = await supabase.from('user_settings').upsert(row,{onConflict:'user_id'});
  if (error) throw error;
}

export async function requestLinkRemote(toId) {
  const { data: auth } = await supabase.auth.getUser();
  const me = auth.user?.id;
  if (!me || !toId || me===toId) return;
  const { data: existing, error:findError } = await supabase.from('connections').select('*').or(`and(user_a.eq.${me},user_b.eq.${toId}),and(user_a.eq.${toId},user_b.eq.${me})`).maybeSingle();
  if (findError) throw findError;
  if (existing?.status === 'accepted' || existing?.status === 'pending') return existing;
  if (existing) await supabase.from('connections').delete().eq('id',existing.id);
  const { data,error } = await supabase.from('connections').insert({user_a:me,user_b:toId,requested_by:me,status:'pending'}).select().single();
  if (error) throw error;
  return data;
}

export async function respondLinkRemote(requestId, action) {
  const status = action === 'accept' ? 'accepted' : 'declined';
  const { error } = await supabase.from('connections').update({status,updated_at:new Date().toISOString()}).eq('id',requestId);
  if (error) throw error;
}

export async function ensureDirectChat(otherUserId) {
  const { data,error } = await supabase.rpc('create_direct_chat',{other_user:otherUserId});
  if (error) throw error;
  return data;
}

export async function createGroupRemote(name, memberIds) {
  const { data,error } = await supabase.rpc('create_group_chat',{group_name:name,member_ids:memberIds});
  if (error) throw error;
  return data;
}

export async function renameGroupRemote(chatId, name) {
  const { error } = await supabase.rpc('rename_group_chat',{p_chat_id:chatId,next_name:name});
  if (error) throw error;
}

export async function setGroupEveryoneRemote(chatId, enabled) {
  const { error } = await supabase.rpc('set_group_everyone_can_edit',{p_chat_id:chatId,enabled:!!enabled});
  if (error) throw error;
}

export async function saveChatSettingsRemote(chatId, patch) {
  const row = { updated_at:new Date().toISOString() };
  if ('silentEnabled' in patch) row.silent_enabled=!!patch.silentEnabled;
  if ('silentTimerSeconds' in patch) row.silent_timer_seconds=patch.silentTimerSeconds;
  if ('themeId' in patch) row.theme_id=patch.themeId;
  if ('themeScope' in patch) row.theme_scope=patch.themeScope;
  const { error } = await supabase.from('chats').update(row).eq('id',chatId);
  if (error) throw error;
}

export async function sendMessageRemote(chatId, payload) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  let mediaPath = null;
  if (payload.uri) mediaPath = await uploadChatMedia(chatId,payload.uri,payload.type);
  const row = {
    chat_id:chatId, sender_id:userId, type:payload.type || 'text', cipher:payload.cipher || null, media_url:mediaPath,
    duration:payload.duration ?? null, reply_to:payload.replyTo || null, expires_at:payload.expiresAt ? new Date(payload.expiresAt).toISOString() : null,
  };
  const { data,error } = await supabase.from('messages').insert(row).select().single();
  if (error) throw error;
  await supabase.from('message_receipts').upsert({message_id:data.id,user_id:userId,seen_at:new Date().toISOString(),read_at:new Date().toISOString()},{onConflict:'message_id,user_id'});
  return data;
}

export async function reactMessageRemote(messageId, emoji) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  const { error } = await supabase.from('message_reactions').upsert({message_id:messageId,user_id:userId,emoji},{onConflict:'message_id,user_id'});
  if (error) throw error;
}

export async function deleteMessageRemote(messageId) {
  const { error } = await supabase.from('messages').delete().eq('id',messageId);
  if (error) throw error;
}

export async function markChatReadRemote(chatId, ghostMode=false) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return;
  const { data: messages,error } = await supabase.from('messages').select('id,sender_id').eq('chat_id',chatId).neq('sender_id',userId);
  if (error) throw error;
  if (!messages?.length) return;
  const now = new Date().toISOString();
  const rows = messages.map(m => ({message_id:m.id,user_id:userId,seen_at:now,read_at:ghostMode?null:now}));
  const { error:upsertError } = await supabase.from('message_receipts').upsert(rows,{onConflict:'message_id,user_id'});
  if (upsertError) throw upsertError;
}

export async function toggleFavoriteRemote(personId, isFavorite) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return;
  if (isFavorite) {
    const { error } = await supabase.from('favorites').delete().eq('user_id',userId).eq('favorite_user_id',personId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('favorites').insert({user_id:userId,favorite_user_id:personId});
    if (error) throw error;
  }
}

export async function postMomentRemote({ imageUri, caption, emoji, expiresAt }) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  const imagePath = imageUri ? await uploadMomentMedia(userId,imageUri) : null;
  const { error } = await supabase.from('moments').insert({owner_id:userId,image_url:imagePath,caption:caption || '',emoji:emoji || null,expires_at:new Date(expiresAt || Date.now()+86400000).toISOString()});
  if (error) throw error;
}

export async function saveNoteRemote({ text, emoji, audience, expiresAt }) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  await supabase.from('notes').delete().eq('owner_id',userId);
  const { error } = await supabase.from('notes').insert({owner_id:userId,text,emoji:emoji || null,audience:audience || 'links',expires_at:new Date(expiresAt).toISOString()});
  if (error) throw error;
}

export async function deleteOwnNoteRemote() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return;
  const { error } = await supabase.from('notes').delete().eq('owner_id',userId);
  if (error) throw error;
}


export async function sendWaveRemote(personId, senderName = 'Someone') {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not signed in');
  const { error } = await supabase.from('notifications').insert({
    user_id:personId, actor_id:userId, type:'wave', title:'👋 New wave', body:`${senderName} waved at you.`
  });
  if (error) throw error;
}

export async function markNotificationsReadRemote() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return;
  const { error } = await supabase.from('notifications').update({read:true}).eq('user_id',userId).eq('read',false);
  if (error) throw error;
}

export async function setModerationRemote(targetId, patch) {
  const row = { updated_at:new Date().toISOString() };
  if ('banned' in patch) row.banned=!!patch.banned;
  if ('mutedUntil' in patch) row.muted_until=patch.mutedUntil === -1 ? '9999-12-31T23:59:59Z' : patch.mutedUntil ? new Date(patch.mutedUntil).toISOString() : null;
  if ('reason' in patch) row.reason=patch.reason || null;
  const { error } = await supabase.from('moderation').update(row).eq('user_id',targetId);
  if (error) throw error;
}

export async function activatePrototypePlanRemote(tier, plan, trial=false) {
  const { error } = await supabase.rpc('activate_prototype_plan',{p_tier:tier,p_plan:plan,p_trial:!!trial});
  if (error) throw error;
}

export async function cancelPrototypePlanRemote(tier) {
  const { error } = await supabase.rpc('cancel_prototype_plan',{p_tier:tier});
  if (error) throw error;
}

export async function purchaseEffectRemote(effectId) {
  const { data,error } = await supabase.rpc('purchase_profile_effect',{p_effect_id:effectId});
  if (error) throw error;
  return data;
}
