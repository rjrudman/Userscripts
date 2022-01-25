// ==UserScript==
// @name         Reputation Investigation
// @namespace    https://github.com/rjrudman/Userscripts/ReputationInvestigation
// @version      2.2.1
// @author       Rob
// @match        *://*.stackexchange.com/users/*/*?tab=reputation*
// @match        *://*.stackoverflow.com/users/*/*?tab=reputation*
// @match        *://*.superuser.com/users/*/*?tab=reputation*
// @match        *://*.serverfault.com/users/*/*?tab=reputation*
// @match        *://*.askubuntu.com/users/*/*?tab=reputation*
// @match        *://*.stackapps.com/users/*/*?tab=reputation*
// @match        *://*.mathoverflow.net/users/*/*?tab=reputation*

// @match        *://*.stackexchange.com/users/account-info/*
// @match        *://*.stackoverflow.com/users/account-info/*
// @match        *://*.superuser.com/users/account-info/*
// @match        *://*.serverfault.com/users/account-info/*
// @match        *://*.askubuntu.com/users/account-info/*
// @match        *://*.stackapps.com/users/account-info/*
// @match        *://*.mathoverflow.net/users/account-info/*

// @exclude      *://chat.stackexchange.com/*
// @exclude      *://chat.meta.stackexchange.com/*
// @exclude      *://chat.stackoverflow.com/*
// @exclude      *://blog.stackoverflow.com/*
// @exclude      *://*.area51.stackexchange.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==