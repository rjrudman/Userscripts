// ==UserScript==
// @name         Reputation Investigation
// @namespace    https://github.com/rjrudman/Userscripts/ReputationInvestigation
// @version      2.0.3
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
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AllVoteTypes = [
        'asker_accepts_answer',
        'asker_unaccept_answer',
        'answer_accepted',
        'answer_unaccepted',
        'voter_downvotes',
        'voter_undownvotes',
        'post_downvoted',
        'post_undownvoted',
        'post_upvoted',
        'post_unupvoted',
        'suggested_edit_approval_received',
        'post_flagged_as_spam',
        'post_flagged_as_offensive',
        'bounty_given',
        'bounty_earned',
        'bounty_cancelled',
        'post_deleted',
        'post_undeleted',
        'association_bonus',
        'arbitrary_reputation_change',
        'vote_fraud_reversal',
        'post_migrated',
        'user_deleted',
        'example_upvoted',
        'example_unupvoted',
        'proposed_change_approved',
        'doc_link_upvoted',
        'doc_link_unupvoted',
        'doc_source_removed',
        'suggested_edit_approval_overridden'
    ];
    exports.ReversalTypes = [
        'asker_unaccept_answer',
        'answer_unaccepted',
        'user_deleted',
        'vote_fraud_reversal'
    ];
    exports.ReversableTypes = [
        'asker_accepts_answer',
        'answer_accepted',
        'post_downvoted',
        'post_upvoted'
    ];
    exports.OppositePairs = [
        'asker_accepts_answer',
        'asker_unaccept_answer',
        'answer_accepted',
        'answer_unaccepted',
        'voter_downvotes',
        'voter_undownvotes',
        'post_downvoted',
        'post_undownvoted',
        'post_upvoted',
        'post_unupvoted',
        'post_deleted',
        'post_undeleted'
    ];
    // For cases where a user changed their mind, not for events caused by the system or someone else
    exports.VoteOppositePairs = {
        asker_accepts_answer: 'asker_unaccept_answer',
        asker_unaccept_answer: 'asker_accepts_answer',
        answer_accepted: 'answer_unaccepted',
        answer_unaccepted: 'answer_accepted',
        voter_downvotes: 'voter_undownvotes',
        voter_undownvotes: 'voter_downvotes',
        post_downvoted: 'post_undownvoted',
        post_undownvoted: 'post_downvoted',
        post_upvoted: 'post_unupvoted',
        post_unupvoted: 'post_upvoted',
        post_deleted: 'post_undeleted',
        post_undeleted: 'post_deleted',
    };
    exports.VoteReversalPairs = {
        asker_accepts_answer: ['asker_unaccept_answer'],
        answer_accepted: ['answer_unaccepted'],
        post_downvoted: ['user_deleted', 'vote_fraud_reversal'],
        post_upvoted: ['user_deleted', 'vote_fraud_reversal'],
        suggested_edit_approval_received: ['vote_fraud_reversal']
    };
    function IsReversableType(eventType) {
        return !!exports.ReversableTypes.find(function (rt) { return rt === eventType; });
    }
    exports.IsReversableType = IsReversableType;
    function IsReversalType(eventType) {
        return !!exports.ReversalTypes.find(function (rt) { return rt === eventType; });
    }
    exports.IsReversalType = IsReversalType;
    function HasOppositePair(eventType) {
        return !!exports.OppositePairs.find(function (vop) { return vop === eventType; });
    }
    exports.HasOppositePair = HasOppositePair;
    function GetReversalTypes(eventType) {
        return Tools_1.UnionOfArraysToArrayOfUnions(exports.VoteReversalPairs[eventType]);
    }
    exports.GetReversalTypes = GetReversalTypes;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AddStyleText(text) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = text;
        }
        else {
            style.appendChild(document.createTextNode(text));
        }
        head.appendChild(style);
    }
    exports.AddStyleText = AddStyleText;
    function GroupBy(xs, keySelector) {
        return xs.reduce(function (currentSet, currentItem) {
            var key = keySelector(currentItem);
            (currentSet[key] = currentSet[key] || []).push(currentItem);
            return currentSet;
        }, {});
    }
    exports.GroupBy = GroupBy;
    // https://stackoverflow.com/questions/1960473
    function Distinct(array) {
        return array.filter(function (value, index, self) { return self.indexOf(value) === index; });
    }
    exports.Distinct = Distinct;
    function UnionOfArraysToArrayOfUnions(arr) { return arr; }
    exports.UnionOfArraysToArrayOfUnions = UnionOfArraysToArrayOfUnions;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(4), __webpack_require__(5), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1, Tools_1, ReputationApi_1, EventProcessor_1, EventTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var css = "\n.detailed_reputation_table {\n    width: 100%;\n    font-size: 10px;\n}\n\n.detailed_reputation_table td {\n    padding: 5px;\n}\n\n.detailed_reputation_table tr:nth-child(even) {\n    background-color: #f2f2f2;\n}\n\n.detailed_reputation_table_header {\n    font-size: 12px;\n    border-top: 1px solid black;\n}\n\n.post-matcher {\n    opacity: 0;\n    padding-left: 5px;\n}\n\n.detailed_reputation_table tr > td.post-col:hover .post-matcher,\n.detailed_reputation_table_highlighted .post-matcher {\n    opacity: 1;\n}\n\n.user-details-div {\n    display: inline;\n    margin-left: 15px;\n}\n.user-details-div a {\n    margin-left: 5px;\n}\n\n.summary-table {\n    width: 100%;\n    margin: 5px;\n    font-size: 15px;\n}\n\n.summary-table p {\n    color: red;\n    display: inline;\n}\n\n.reversal-type {\n    cursor: default;\n}\n\n.rep-change {\n    font-size: 12px;\n    font-weight: bold;\n}\n.rep-change-positive {\n    color: green;\n}\n.rep-change-negative {\n    color: red;\n}\n#detailed_reputation_body > tr.reversal {\n    background-color: rgb(239, 145, 125);\n}\ntr.reversal > td.post-col > a,\ntr.reversal > td.post-col > a:hover {\n    color: #12009e\n}\n";
    function getBucketColour(index, numBuckets) {
        // If the index is even, we shift it halfway through the bucket count
        // This way, colours will be more contrasted
        if (index % 2 === 0) {
            index += numBuckets / 2;
        }
        var colourNum = ((360 / numBuckets) * index % 360);
        var cssHSL = 'hsla(' + colourNum + ', 80%, 50%, 0.3)';
        return cssHSL;
    }
    var getNameFromNumber = function (num) {
        var NUM_LETTERS = 26;
        var ASCII_START = 65;
        if (num >= NUM_LETTERS) {
            var remaining = num % NUM_LETTERS;
            return getNameFromNumber((num / NUM_LETTERS) - 1) + String.fromCharCode(remaining + ASCII_START);
        }
        return String.fromCharCode(num + ASCII_START);
    };
    $(function () {
        Tools_1.AddStyleText(css);
        // https://stackoverflow.com/a/10172676
        $.event.special.destroyed = {
            remove: function (o) {
                if (o.handler) {
                    o.handler();
                }
            }
        };
        StackExchange.initialized.then(function () {
            var userId = StackExchange.user.options.userId;
            var tabSelectedRegex = /&sort=detailed/;
            function addUiItems() {
                var detailedLink = $("<a href=\"/users/" + userId + "?tab=reputation&amp;sort=detailed\">detailed</a>");
                if (window.location.href.match(tabSelectedRegex)) {
                    $('.user-tab-sorts a').removeClass('youarehere');
                    $(detailedLink).addClass('youarehere');
                    $('#stats').prepend('<div id="rep-page-summary">');
                    RenderDetailedReputation(45, 3);
                    var linkToXref = $("<a style=\"margin-left: 10px\" href=\"https://stackoverflow.com/admin/xref-user-ips/" + userId + "\" target=\"_blank\">xref</a>");
                    var linkToVotes = $("<a style=\"margin-left: 10px\" href=\"https://stackoverflow.com/admin/show-user-votes/" + userId + "\" target=\"_blank\">votes</a>");
                    if (StackExchange.options.user.isModerator) {
                        $('#stats').prepend(linkToXref);
                        $('#stats').prepend(linkToVotes);
                    }
                    var bucketSizeInput_1 = $('<input type="number" value="3" />');
                    $('#stats').prepend(bucketSizeInput_1);
                    $('#stats').prepend('<label style="margin-right: 15px; margin-left: 15px;">Minimum number of votes</label>');
                    var numSecondsInput_1 = $('<input type="number" value="45" />');
                    $('#stats').prepend(numSecondsInput_1);
                    $('#stats').prepend('<label style="margin-right: 15px;">Number of seconds between votes</label>');
                    var onChange = function () {
                        var numSeconds = parseInt(numSecondsInput_1.val(), 10);
                        var bucketSize = parseInt(bucketSizeInput_1.val(), 10);
                        RenderDetailedReputation(numSeconds, bucketSize);
                    };
                    numSecondsInput_1.change(onChange);
                    bucketSizeInput_1.change(onChange);
                }
                // SE destroys the tab when swapping. Watch for that, and add back our UI items.
                detailedLink.bind('destroyed', function () {
                    setTimeout(function () { addUiItems(); });
                });
                $('.user-tab-sorts').append(detailedLink);
            }
            addUiItems();
            function RenderDetailedReputation(secondsGap, bucketSize) {
                var repPageContainer = $('#rep-page-container');
                repPageContainer.empty();
                var repPageSummary = $('#rep-page-summary');
                repPageSummary.empty();
                var footerContainer = $('.user-tab-footer');
                footerContainer.empty();
                var apiData = ReputationApi_1.GetCurrentReputationPage(userId);
                var highlightedRows = [];
                var rowsById = [];
                var unsetHighlightedRows = function () {
                    highlightedRows.forEach(function (r) { return r.removeClass('detailed_reputation_table_highlighted'); });
                    highlightedRows = [];
                };
                var setHighlightedRows = function (postId) {
                    highlightedRows.forEach(function (r) { return r.removeClass('detailed_reputation_table_highlighted'); });
                    highlightedRows = rowsById[postId];
                    highlightedRows.forEach(function (r) { return r.addClass('detailed_reputation_table_highlighted'); });
                };
                apiData.then(function (data) {
                    var e_1, _a;
                    if (data.hasMore) {
                        var loadMoreData_1 = $('<a href="javascript:void(0);">Load more</a>');
                        loadMoreData_1.click(function () {
                            loadMoreData_1.hide();
                            ReputationApi_1.GetNextReputationPage(userId).then(function () { return RenderDetailedReputation(secondsGap, bucketSize); });
                        });
                        footerContainer.append(loadMoreData_1);
                    }
                    var copiedData = JSON.parse(JSON.stringify(data));
                    var events = EventProcessor_1.ProcessEvents(copiedData.items, bucketSize, secondsGap);
                    events.sort(function (left, right) { return right.creation_date - left.creation_date; });
                    var newTable = $("\n                    <table class=\"detailed_reputation_table\">\n                        <tbody id=\"detailed_reputation_body\">\n                        </tbody>\n                    </table>\n                    ");
                    var reversalTypes = ['user_deleted', 'vote_fraud_reversal'];
                    var tableBody = newTable.find('#detailed_reputation_body');
                    var seenBuckets = [];
                    var numBuckets = Math.max.apply(Math, tslib_1.__spread(events.map(function (e) { return e.BucketIndex; }))) + 1;
                    var _loop_1 = function (event_1) {
                        var repChangeClass = void 0;
                        if (event_1.Cancelled || event_1.reputation_change === 0) {
                            repChangeClass = 'rep-change-neutral';
                        }
                        else if (event_1.reputation_change > 0) {
                            repChangeClass = 'rep-change-positive';
                        }
                        else {
                            repChangeClass = 'rep-change-negative';
                        }
                        var htmlRow = $("\n                    <tr>\n                        <td>" + moment.unix(event_1.creation_date).format('YYYY-MM-DD HH:mm:ss') + "</td>\n                        <td>" + event_1.reputation_history_type + "</td>\n                        <td id=\"rep-change\" class=\"rep-change " + repChangeClass + "\">" + (event_1.reputation_change >= 0 ? '+' : '') + event_1.reputation_change + "</td>\n                        <td class=\"post-col\"><a href=\"/q/" + event_1.post_id + "\">" + (event_1.title || (event_1.post_id + ' (deleted)')) + "</a><a class=\"post-matcher\" href=\"javascript:void(0);\">\uD83D\uDCCC</a></td>\n                        <td class=\"reversal-type\"></td>\n                    </tr>\n                    ");
                        if (event_1.reputation_history_type === 'association_bonus') {
                            htmlRow.find('.post-col').empty();
                        }
                        if (event_1.Cancelled) {
                            htmlRow.css('text-decoration', 'line-through');
                        }
                        var postMatcher = htmlRow.find('.post-matcher');
                        var setOnHover = false;
                        postMatcher
                            .click(function () {
                            if (!setOnHover && htmlRow.hasClass('detailed_reputation_table_highlighted')) {
                                unsetHighlightedRows();
                            }
                            else {
                                setHighlightedRows(event_1.post_id);
                                setOnHover = false;
                            }
                        });
                        var postCol = htmlRow.find('.post-col');
                        postCol.mouseenter(function () {
                            if (!highlightedRows.length) {
                                setOnHover = true;
                                setHighlightedRows(event_1.post_id);
                            }
                        });
                        postCol.mouseleave(function () {
                            if (setOnHover) {
                                unsetHighlightedRows();
                                setOnHover = false;
                            }
                        });
                        if (event_1.BucketIndex >= 0) {
                            var isReversal = false;
                            var bucketColour = getBucketColour(event_1.BucketIndex, numBuckets);
                            if (seenBuckets[event_1.BucketIndex] === undefined) {
                                var allEventCount = event_1.Bucket.length;
                                var nonCancelledEventCount = event_1.Bucket.filter(function (b) { return !b.Cancelled; }).length;
                                var bucketName = getNameFromNumber(numBuckets - event_1.BucketIndex - 1);
                                var eventCountMessage = allEventCount === nonCancelledEventCount
                                    ? allEventCount + " events"
                                    : nonCancelledEventCount + " events (" + allEventCount + " total)";
                                var reputationMessage = event_1.Bucket.reduce(function (p, c) { return p + c.reputation_change; }, 0) + " reputation";
                                var groupDescription = "Group " + bucketName + ". " + eventCountMessage + ". " + reputationMessage;
                                var reversalMessage = reversalTypes.indexOf(event_1.reputation_history_type) >= 0
                                    ? event_1.reputation_history_type === 'vote_fraud_reversal'
                                        ? 'Reversal'
                                        : 'User deleted'
                                    : '';
                                if (reversalMessage !== '') {
                                    groupDescription += " - " + reversalMessage + " \uD83D\uDD25";
                                    isReversal = true;
                                    seenBuckets[event_1.BucketIndex] = true;
                                }
                                else {
                                    seenBuckets[event_1.BucketIndex] = false;
                                }
                                var bucketHeader = $("\n                        <tr  class=\"detailed_reputation_table_header\">\n                            <td colspan=\"7\">\n                                " + groupDescription + "\n                            </td>\n                        </tr>\n                        ");
                                if (isReversal) {
                                    bucketHeader.addClass('reversal');
                                }
                                else {
                                    bucketHeader.css('background-color', bucketColour);
                                }
                                tableBody.append(bucketHeader);
                            }
                            else {
                                if (seenBuckets[event_1.BucketIndex]) {
                                    isReversal = true;
                                }
                            }
                            if (isReversal) {
                                htmlRow.addClass('reversal');
                            }
                            else {
                                htmlRow.css('background-color', bucketColour);
                            }
                            var actualReputationChange = event_1.reputation_change;
                            if (actualReputationChange === 0) { // They rep capped. Let's see if we can find the actual number elsewhere
                                var matchedElsewhere = copiedData.items.find(function (i) {
                                    return i.post_id === event_1.post_id
                                        && i.reputation_history_type === event_1.reputation_history_type
                                        && i.reputation_change > 0;
                                });
                                if (matchedElsewhere) {
                                    actualReputationChange = matchedElsewhere.reputation_change;
                                    htmlRow.find('#rep-change').text(htmlRow.find('#rep-change').text() + ' (' + actualReputationChange + ')');
                                }
                            }
                            if (!event_1.Cancelled && EventTypes_1.IsReversableType(event_1.reputation_history_type)) {
                                var reversalMessage = void 0;
                                var reversalTooltip = void 0;
                                if (event_1.ReversedBy.length > event_1.Pairs) {
                                    reversalMessage = '✅';
                                    reversalTooltip = 'Vote was reversed';
                                }
                                else if (event_1.ReversedBy.length === 0) {
                                    reversalMessage = '❌';
                                    reversalTooltip = 'Vote was not reversed';
                                }
                                else {
                                    reversalMessage = "\u26A0\uFE0F " + event_1.ReversedBy.length + "/" + (event_1.Pairs + 1);
                                    reversalTooltip = 'Vote may not have been reversed';
                                }
                                var reversalType = htmlRow.find('.reversal-type');
                                reversalType.text(reversalMessage);
                                reversalType.attr('title', reversalTooltip);
                            }
                        }
                        tableBody.append(htmlRow);
                        if (!rowsById[event_1.post_id]) {
                            rowsById[event_1.post_id] = [];
                        }
                        rowsById[event_1.post_id].push(htmlRow);
                    };
                    try {
                        for (var events_1 = tslib_1.__values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                            var event_1 = events_1_1.value;
                            _loop_1(event_1);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    repPageContainer.append(newTable);
                    var votesNotFullyReversed = events.filter(function (e) {
                        return !e.Cancelled
                            && e.IsBucketed
                            && EventTypes_1.IsReversableType(e.reputation_history_type)
                            && e.ReversedBy.length <= e.Pairs;
                    })
                        .map(function (e) { return ({
                        VoteSlice: 1 - (e.ReversedBy.length / (e.Pairs + 1)),
                        Reputation: e.reputation_change * (1 - (e.ReversedBy.length / (e.Pairs + 1)))
                    }); });
                    if (votesNotFullyReversed.length) {
                        var voteCount = votesNotFullyReversed.map(function (v) { return v.VoteSlice; }).reduce(function (left, right) { return left + right; }, 0);
                        var reputationCount = votesNotFullyReversed.map(function (v) { return v.Reputation; }).reduce(function (left, right) { return left + right; }, 0);
                        repPageSummary.append("\n                            <hr style=\"margin-bottom: 0px;\" />\n                            <table class=\"summary-table\">\n                                <tr>\n                                    <td><p>Total suspicious votes</p>: " + events.filter(function (e) { return e.IsBucketed && EventTypes_1.IsReversableType(e.reputation_history_type); }).length + "</td>\n                                    <td><p>Votes not reversed</p>: " + Math.round(voteCount) + "</td>\n                                    <td><p>Reputation not reversed</p>: " + Math.round(reputationCount) + "</td>\n                                </tr>\n                            </table>\n                            <hr style=\"margin-bottom: 0px;\" />\n                        ");
                    }
                    else {
                        if (events.filter(function (e) { return e.IsBucketed; }).length === 0) {
                            repPageSummary.append("\n                        <hr style=\"margin-bottom: 0px;\" />\n                        <p style=\"margin-top: 5px; margin-bottom: 5px; margin-left: 5px;\">No suspicious votes detected</p>\n                        <hr style=\"margin-bottom: 0px;\" />\n                    ");
                        }
                        else {
                            repPageSummary.append("\n                        <hr style=\"margin-bottom: 0px;\" />\n                        <p style=\"margin-top: 5px; margin-bottom: 5px; margin-left: 5px;\">All suspicious votes reversed</p>\n                        <hr style=\"margin-bottom: 0px;\" />\n                    ");
                        }
                    }
                });
            }
        });
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var APP_KEY = 'ESZ7eo2s9qErse9jq5qFxg((';
    var page = 0;
    var data = null;
    function GetCurrentReputationPage(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prom;
            return tslib_1.__generator(this, function (_a) {
                prom = new Promise(function (resolve, reject) {
                    if (!data) {
                        GetNextReputationPage(userId)
                            .then(function (_) {
                            if (data) {
                                resolve(data);
                            }
                            else {
                                reject();
                            }
                        });
                    }
                    else {
                        resolve(data);
                    }
                });
                return [2 /*return*/, prom];
            });
        });
    }
    exports.GetCurrentReputationPage = GetCurrentReputationPage;
    function GetNextReputationPage(userId) {
        page++;
        var siteName = location.hostname.replace('.com', '');
        var reputationEndpoint = "https://api.stackexchange.com/2.2/users/" + userId + "/reputation-history?key=" + APP_KEY + "&pagesize=100&page=" + page + "&site=" + siteName;
        var getQuestionEndpoint = function (questionIds) {
            var questionIdStr = questionIds.filter(function (q) { return !!q; }).join(';');
            return "https://api.stackexchange.com/2.2/posts/" + questionIdStr + "?key=" + APP_KEY + "&pagesize=100&site=" + siteName + "&filter=!)qFc_2zhzdy0KDoW*IEu";
        };
        return fetch(reputationEndpoint)
            .then(function (r) { return r.json(); })
            .then(function (r) {
            var items = r.items;
            var questionIds = items.map(function (i) { return i.post_id; });
            var questionEndpoint = getQuestionEndpoint(questionIds);
            return fetch(questionEndpoint)
                .then(function (q) { return q.json(); })
                .then(function (questionResult) {
                var e_1, _a, e_2, _b;
                var qLookup = {};
                try {
                    for (var _c = tslib_1.__values(questionResult.items), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var question = _d.value;
                        qLookup[question.post_id + ''] = question.title;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                        var item = items_1_1.value;
                        item.title = qLookup[item.post_id + ''];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (items_1_1 && !items_1_1.done && (_b = items_1.return)) _b.call(items_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (data) {
                    data = {
                        items: data.items.concat(items),
                        hasMore: r.has_more
                    };
                }
                else {
                    data = {
                        items: items,
                        hasMore: r.has_more
                    };
                }
            });
        });
    }
    exports.GetNextReputationPage = GetNextReputationPage;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1, EventGrouper_1, EventReversalPairer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ProcessEvents(events, minBucketSize, duration) {
        if (minBucketSize === void 0) { minBucketSize = 3; }
        if (duration === void 0) { duration = 30000; }
        var groupedEvents = EventGrouper_1.ProcessBuckets(events, duration, minBucketSize);
        var pairedEvents = EventReversalPairer_1.FindEventReversals(groupedEvents.filter(function (ge) { return ge.BucketSize >= minBucketSize; }));
        var unpaired = groupedEvents.filter(function (ge) { return ge.BucketSize < minBucketSize; });
        var entireSet = pairedEvents.concat(unpaired
            .map(function (e) { return (tslib_1.__assign({}, e, { Reversed: [], ReversedBy: [], Pairs: 0, OriginalEvent: e.OriginalEvent || e })); }));
        entireSet.sort(function (left, right) { return left.creation_date - right.creation_date; });
        return entireSet;
    }
    exports.ProcessEvents = ProcessEvents;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1, EventTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NetChange(events) {
        return events.reduce(function (l, r) { return l + r.reputation_change; }, 0);
    }
    function BucketStart(events) {
        return Math.min.apply(Math, tslib_1.__spread(events.map(function (e) { return e.creation_date; })));
    }
    function BucketEnd(events) {
        return Math.max.apply(Math, tslib_1.__spread(events.map(function (e) { return e.creation_date; })));
    }
    function ProcessBuckets(payload, voteGapSeconds, minBucketSize) {
        var buckets = payload.map(function (p) { return [tslib_1.__assign({}, p, { IsBucketed: false, BucketIndex: 0, BucketSize: 0, Bucket: [], Cancelled: false, OriginalEvent: p })]; });
        expandBuckets(buckets, voteGapSeconds);
        var runningBucketIndex = 0;
        buckets.sort(function (left, right) { return BucketStart(left) - BucketStart(right); });
        var flattenedItems = buckets
            .map(function (b) {
            var e_1, _a;
            var isBucketed = b.filter(function (bb) { return !bb.Cancelled; }).length >= minBucketSize;
            var bucketSize = b.filter(function (bb) { return !bb.Cancelled; }).length;
            var bucketIndex = isBucketed ? runningBucketIndex++ : -1;
            var bucketItems = b.map(function (e) { return (tslib_1.__assign({}, e, { IsBucketed: isBucketed, BucketIndex: bucketIndex, BucketSize: bucketSize })); });
            try {
                for (var bucketItems_1 = tslib_1.__values(bucketItems), bucketItems_1_1 = bucketItems_1.next(); !bucketItems_1_1.done; bucketItems_1_1 = bucketItems_1.next()) {
                    var bucketItem = bucketItems_1_1.value;
                    bucketItem.Bucket = bucketItems;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (bucketItems_1_1 && !bucketItems_1_1.done && (_a = bucketItems_1.return)) _a.call(bucketItems_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return bucketItems;
        })
            .reduce(function (left, right) { return left.concat(right); }, []);
        flattenedItems.sort(function (left, right) { return left.creation_date - right.creation_date; });
        return flattenedItems;
    }
    exports.ProcessBuckets = ProcessBuckets;
    function expandBuckets(buckets, voteGapSeconds) {
        var e_2, _a;
        var hasChange = false;
        var _loop_1 = function (bucket) {
            var e_3, _a, e_4, _b;
            var bucketsAfter = buckets.filter(function (b) {
                return b !== bucket
                    &&
                        ((BucketStart(b) >= BucketStart(bucket) && BucketStart(b) - BucketEnd(bucket) < voteGapSeconds)
                            || (BucketStart(bucket) >= BucketStart(b) && BucketStart(bucket) - BucketEnd(b) < voteGapSeconds));
            });
            bucketsAfter.sort(function (left, right) { return BucketStart(left) - BucketStart(right); });
            try {
                for (var bucketsAfter_1 = tslib_1.__values(bucketsAfter), bucketsAfter_1_1 = bucketsAfter_1.next(); !bucketsAfter_1_1.done; bucketsAfter_1_1 = bucketsAfter_1.next()) {
                    var bucketAfter = bucketsAfter_1_1.value;
                    try {
                        for (var bucketAfter_1 = tslib_1.__values(bucketAfter), bucketAfter_1_1 = bucketAfter_1.next(); !bucketAfter_1_1.done; bucketAfter_1_1 = bucketAfter_1.next()) {
                            var event_1 = bucketAfter_1_1.value;
                            if (CanMergeToBucket(bucket, bucketAfter, event_1)) {
                                MergeToBucket(bucket, bucketAfter, event_1);
                                hasChange = true;
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (bucketAfter_1_1 && !bucketAfter_1_1.done && (_b = bucketAfter_1.return)) _b.call(bucketAfter_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (bucketsAfter_1_1 && !bucketsAfter_1_1.done && (_a = bucketsAfter_1.return)) _a.call(bucketsAfter_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        try {
            for (var buckets_1 = tslib_1.__values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
                var bucket = buckets_1_1.value;
                _loop_1(bucket);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (buckets_1_1 && !buckets_1_1.done && (_a = buckets_1.return)) _a.call(buckets_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (hasChange) {
            expandBuckets(buckets, voteGapSeconds);
            return;
        }
    }
    function CanMergeToBucket(targetBucket, sourceBucket, event) {
        if (!EventTypes_1.IsReversableType(event.reputation_history_type)
            && !EventTypes_1.IsReversalType(event.reputation_history_type)
            && !EventTypes_1.HasOppositePair(event.reputation_history_type)) {
            return false;
        }
        if (EventTypes_1.HasOppositePair(event.reputation_history_type)) {
            var oppositeVote_1 = EventTypes_1.VoteOppositePairs[event.reputation_history_type];
            if (targetBucket.some(function (e) {
                return oppositeVote_1 === e.reputation_history_type
                    && event.post_id === e.post_id
                    && !e.Cancelled;
            })) {
                return true;
            }
        }
        // Two votes on the same post can't be from the same account
        if (targetBucket.some(function (e) {
            return e.post_id === event.post_id
                && e.reputation_history_type === event.reputation_history_type
                && !e.Cancelled;
        })) {
            return false;
        }
        var targetNetChange = NetChange(targetBucket);
        if (event.reputation_change >= 0 && targetNetChange < 0) {
            return false;
        }
        if (event.reputation_change < 0 && targetNetChange >= 0) {
            return false;
        }
        if (targetBucket.length < sourceBucket.length) {
            return false;
        }
        return true;
    }
    function MergeToBucket(targetBucket, sourceBucket, event) {
        if (EventTypes_1.HasOppositePair(event.reputation_history_type)) {
            var oppositeVote_2 = EventTypes_1.VoteOppositePairs[event.reputation_history_type];
            var matchedEvents = targetBucket.filter(function (e) {
                return oppositeVote_2 === e.reputation_history_type
                    && event.post_id === e.post_id
                    && !e.Cancelled;
            });
            if (matchedEvents.length) {
                matchedEvents[0].Cancelled = true;
                event.Cancelled = true;
            }
        }
        targetBucket.unshift(event);
        sourceBucket.splice(sourceBucket.indexOf(event), 1);
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1, EventTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function FindEventReversals(events) {
        var processedPairs = ProcessEventPairing(events);
        ReducePairs(processedPairs);
        UpdatePairCount(processedPairs);
        return processedPairs;
    }
    exports.FindEventReversals = FindEventReversals;
    function UpdatePairCount(events) {
        var e_1, _a, e_2, _b;
        var reversals = events.filter(function (e) { return EventTypes_1.IsReversalType(e.reputation_history_type); });
        try {
            for (var reversals_1 = tslib_1.__values(reversals), reversals_1_1 = reversals_1.next(); !reversals_1_1.done; reversals_1_1 = reversals_1.next()) {
                var reversal = reversals_1_1.value;
                try {
                    for (var _c = tslib_1.__values(reversal.Reversed), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var reversedEvent = _d.value;
                        reversedEvent.Pairs = reversal.Reversed.length - 1;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                reversal.Pairs = 0;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (reversals_1_1 && !reversals_1_1.done && (_a = reversals_1.return)) _a.call(reversals_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function ReducePairs(events) {
        var e_3, _a;
        var hasChange = false;
        var reversals = events.filter(function (e) { return EventTypes_1.IsReversalType(e.reputation_history_type); });
        var _loop_1 = function (reversal) {
            var e_4, _a;
            if (reversal.Reversed.length === 1) {
                // It only reversed one single event.
                // Therefore, we can get that event and remove it from other reversals
                var reversedEvent_1 = reversal.Reversed[0];
                var otherReversals = reversals.filter(function (r) { return r !== reversal && r.Reversed.indexOf(reversedEvent_1) >= 0; });
                // It only reversed this event
                reversedEvent_1.ReversedBy = [reversal];
                try {
                    for (var otherReversals_1 = tslib_1.__values(otherReversals), otherReversals_1_1 = otherReversals_1.next(); !otherReversals_1_1.done; otherReversals_1_1 = otherReversals_1.next()) {
                        var otherReversal = otherReversals_1_1.value;
                        otherReversal.Reversed.splice(otherReversal.Reversed.indexOf(reversedEvent_1), 1);
                        hasChange = true;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (otherReversals_1_1 && !otherReversals_1_1.done && (_a = otherReversals_1.return)) _a.call(otherReversals_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        };
        try {
            for (var reversals_2 = tslib_1.__values(reversals), reversals_2_1 = reversals_2.next(); !reversals_2_1.done; reversals_2_1 = reversals_2.next()) {
                var reversal = reversals_2_1.value;
                _loop_1(reversal);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (reversals_2_1 && !reversals_2_1.done && (_a = reversals_2.return)) _a.call(reversals_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (hasChange) {
            ReducePairs(events);
        }
    }
    function ProcessEventPairing(events) {
        var e_5, _a;
        var eventsWithMetaData = events.map(function (e) { return (tslib_1.__assign({}, e, { Reversed: [], ReversedBy: [], Pairs: 0, OriginalEvent: e.OriginalEvent || e, Cancelled: e.Cancelled || false })); });
        var eventsByPostId = function (postId) { return eventsWithMetaData.filter(function (f) { return f.post_id === postId; }); };
        var _loop_2 = function (event_1) {
            var e_6, _a;
            var otherEventsForPost = eventsByPostId(event_1.post_id).filter(function (e) { return e !== event_1; });
            var matchingFutureEvents = otherEventsForPost.filter(function (e) { return e.creation_date > event_1.creation_date; });
            if (EventTypes_1.IsReversableType(event_1.reputation_history_type)) {
                if (!event_1.Cancelled) {
                    var reversalTypes_1 = EventTypes_1.GetReversalTypes(event_1.reputation_history_type);
                    var reversals = matchingFutureEvents.filter(function (m) {
                        return !!reversalTypes_1.find(function (reversalType) { return reversalType === m.reputation_history_type; })
                            &&
                                (m.reputation_change === -1 * event_1.reputation_change
                                    || m.reputation_change === 0
                                    || event_1.reputation_change === 0);
                    });
                    try {
                        for (var reversals_3 = tslib_1.__values(reversals), reversals_3_1 = reversals_3.next(); !reversals_3_1.done; reversals_3_1 = reversals_3.next()) {
                            var reversal = reversals_3_1.value;
                            if (!reversal.ReversedBy) {
                                reversal.ReversedBy = [];
                            }
                            reversal.Reversed.push(event_1);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (reversals_3_1 && !reversals_3_1.done && (_a = reversals_3.return)) _a.call(reversals_3);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    event_1.ReversedBy = reversals;
                }
            }
        };
        try {
            for (var eventsWithMetaData_1 = tslib_1.__values(eventsWithMetaData), eventsWithMetaData_1_1 = eventsWithMetaData_1.next(); !eventsWithMetaData_1_1.done; eventsWithMetaData_1_1 = eventsWithMetaData_1.next()) {
                var event_1 = eventsWithMetaData_1_1.value;
                _loop_2(event_1);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (eventsWithMetaData_1_1 && !eventsWithMetaData_1_1.done && (_a = eventsWithMetaData_1.return)) _a.call(eventsWithMetaData_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return eventsWithMetaData;
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);