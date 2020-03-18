// ==UserScript==
// @name         Reputation Investigation
// @namespace    https://github.com/rjrudman/Userscripts/ReputationInvestigation
// @version      2.1.5
// @author       Rob
// @match        *://*.stackexchange.com/*/*?tab=reputation*
// @match        *://*.stackoverflow.com/users/*/*?tab=reputation*
// @match        *://*.superuser.com/*/*?tab=reputation*
// @match        *://*.serverfault.com/*/*?tab=reputation*
// @match        *://*.askubuntu.com/*/*?tab=reputation*
// @match        *://*.stackapps.com/*/*?tab=reputation*
// @match        *://*.mathoverflow.net/*/*?tab=reputation*
// @exclude      *://chat.stackexchange.com/*
// @exclude      *://chat.meta.stackexchange.com/*
// @exclude      *://chat.stackoverflow.com/*
// @exclude      *://blog.stackoverflow.com/*
// @exclude      *://*.area51.stackexchange.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==