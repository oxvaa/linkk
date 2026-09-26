LINK 3.5 · Pulse — FINAL
========================

Obsah
-----
App.snack.js  — hlavní zdroj pro Expo Snack / GitHub launcher
App.js        — stejný finální zdroj pro přímé vložení do Snacku
index.html    — GitHub Pages → Expo Snack launcher (Developer + Shared Test Session)

Co je v LINK 3.5 Pulse
----------------------
• stabilnější messaging, retry/offline outbox a realtime/pagination
• Presence 2.0 + LINK Now
• Circles a Moments 3.5 (reposts, mentions, archive, Highlights, reactions)
• Groups 3.5 (announcements, slow mode, permissions, join questions, admin notes)
• Search 2.0 + Activity Center
• Profile 3.5 + Account & Safety + Pro 3.5
• Beta Health / client diagnostics
• Verified badge v DM a group chatech
• LINK Official — serverově řízený read-only kanál se zlatým Verified badgem
• Staff Center composer pro broadcast LINK Official všem registrovaným uživatelům
• čeština + angličtina

GitHub / iPhone workflow
------------------------
1. Nahraj App.snack.js a index.html do stejného GitHub repozitáře (root).
2. Zapni GitHub Pages pro tento repozitář.
3. Otevři index.html přes GitHub Pages na iPhonu / tabletu.
4. Developer mode vytvoří čerstvý Snack se zdrojem z App.snack.js.
5. Pro testování s kamarádem použij „Testovat s kamarády“ / Shared Test Session.
   Shared session nech NEULOŽENOU a sdílej QR z My Device. Uložením Snacku se může
   session navázat na vlastníka Expo účtu a druhé zařízení může narazit na omezení.

Backend
-------
Build je napojený na existující LINK Production projekt v Supabase.
3.5 backend migrace, LINK Official tabulky, realtime, RLS, audit logy a potřebné RPC
funkce jsou už nasazené. Frontend používá pouze publishable client key.

Poznámka k Expo Go
------------------
Remote system push notifikace a skutečné přepínání ikony aplikace vyžadují nativní
Development/Production build. V Expo Go zůstává in-app Pulse/Activity vrstva.

Build: LINK 3.5 · Pulse
Launcher cache tag: 350
Expo SDK: 57
