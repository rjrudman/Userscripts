// ==UserScript==
// @name         Reputation Investigation
// @namespace    https://gitlab.com/rjrudman/ReputationInvestigation
// @version      0.0.0
// @author       Robert Rudman
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Tools_1, ReputationAnalyser_1, ReputationFixer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var css = "\n.detailed_reputation_table {\n    width: 100%;\n    font-size: 10px;\n}\n\n.detailed_reputation_table td {\n    padding: 5px;\n}\n\n.detailed_reputation_table tr:nth-child(even) {\n    background-color: #f2f2f2;\n}\n\n.detailed_reputation_table_header {\n    font-size: 12px;\n}\n\n.post-matcher {\n    opacity: 0;\n    padding-left: 5px;\n}\n\n.detailed_reputation_table tr > td.post-col:hover .post-matcher,\n.detailed_reputation_table_highlighted .post-matcher {\n    opacity: 1;\n}\n\n.user-details-div {\n    display: inline;\n    margin-left: 15px;\n}\n.user-details-div a {\n    margin-left: 5px;\n}\n";
    function getBucketColour(index, numBuckets) {
        var cssHSL = 'hsla(' + (360 / numBuckets) * index + ', 80%, 50%, 0.3)';
        return cssHSL;
    }
    var votesDataPromise = null;
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
                    RenderDetailedReputation(45, 3, false);
                    var linkToXref = $("<a style=\"margin-left: 5px\" href=\"https://stackoverflow.com/admin/xref-user-ips/" + userId + "\" target=\"_blank\">xref</a>");
                    var linkToVotes = $("<a href=\"https://stackoverflow.com/admin/show-user-votes/" + userId + "\" target=\"_blank\">votes</a>");
                    var showVoters_1 = $('<input type="checkbox" id="chkShowReversedUser">');
                    var showVotersLabel = $('<label for="chkShowReversedUser" style="margin-right: 15px; margin-left: 15px;">Show reversed user</label>');
                    if (StackExchange.options.user.isModerator) {
                        $('#stats').prepend(linkToXref);
                        $('#stats').prepend(linkToVotes);
                        $('#stats').prepend(showVoters_1);
                        $('#stats').prepend(showVotersLabel);
                    }
                    // https://stackoverflow.com/admin/show-user-votes/8077972
                    var bucketSizeInput_1 = $('<input type="number" value="3" />');
                    $('#stats').prepend(bucketSizeInput_1);
                    $('#stats').prepend('<label style="margin-right: 15px; margin-left: 15px;">Set minimum bucket size</label>');
                    var numSecondsInput_1 = $('<input type="number" value="45" />');
                    $('#stats').prepend(numSecondsInput_1);
                    $('#stats').prepend('<label style="margin-right: 15px;">Set number of seconds between votes</label>');
                    var onChange = function () {
                        var numSeconds = parseInt(numSecondsInput_1.val(), 10);
                        var bucketSize = parseInt(bucketSizeInput_1.val(), 10);
                        var showReversedUser = !!showVoters_1.prop('checked');
                        RenderDetailedReputation(numSeconds, bucketSize, showReversedUser);
                    };
                    showVoters_1.change(onChange);
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
            function RenderDetailedReputation(secondsGap, bucketSize, showReversedUser) {
                var repPageContainer = $('#rep-page-container');
                repPageContainer.empty();
                var footerContainer = $('.user-tab-footer');
                footerContainer.empty();
                var apiData = ReputationFixer_1.GetCurrentReputationPage(userId);
                var highlightedRows = [];
                var rowsById = [];
                apiData.then(function (data) {
                    if (data.hasMore) {
                        var loadMoreData_1 = $('<a href="javascript:void(0);">Load more</a>');
                        loadMoreData_1.click(function () {
                            loadMoreData_1.hide();
                            ReputationFixer_1.GetNextReputationPage(userId).then(function () { return RenderDetailedReputation(secondsGap, bucketSize, showReversedUser); });
                        });
                        footerContainer.append(loadMoreData_1);
                    }
                    var copiedData = JSON.parse(JSON.stringify(data));
                    var buckets = ReputationAnalyser_1.ProcessItems(copiedData.items, secondsGap);
                    var acceptableBuckets = buckets.filter(function (b) { return b.length >= bucketSize; });
                    var newTable = $("\n                    <table class=\"detailed_reputation_table\">\n                        <tbody id=\"detailed_reputation_body\">\n                        </tbody>\n                    </table>\n                    ");
                    var reversalTypes = ['user_deleted', 'vote_fraud_reversal'];
                    var deletionEvents = copiedData.items.filter(function (s) { return s.reputation_history_type === 'user_deleted'; });
                    var automaticallyReversed = copiedData.items.filter(function (s) {
                        var date = moment.unix(s.creation_date).utc();
                        if (s.reputation_history_type === 'vote_fraud_reversal') {
                            if (date.minute() <= 5 && date.hour() === 3) {
                                return true;
                            }
                        }
                        return false;
                    });
                    var manuallyReversed = copiedData.items.filter(function (s) {
                        var date = moment.unix(s.creation_date).utc();
                        if (s.reputation_history_type === 'vote_fraud_reversal') {
                            if (date.minute() > 5 || date.hour() !== 3) {
                                return true;
                            }
                        }
                        return false;
                    });
                    if (showReversedUser && copiedData.items.find(function (s) { return reversalTypes.indexOf(s.reputation_history_type) >= 0; })
                        && votesDataPromise == null && StackExchange.options.user.isModerator) {
                        var votesPage = "/admin/show-user-votes/" + userId;
                        votesDataPromise = fetch(votesPage).then(function (r) { return r.text(); });
                    }
                    var tableBody = newTable.find('#detailed_reputation_body');
                    copiedData.items.forEach(function (row) {
                        var typedRow = row;
                        var bucket = typedRow.bucket;
                        var bucketIndex = acceptableBuckets.indexOf(bucket);
                        var htmlRow = $("\n                    <tr>\n                        <td>" + moment.unix(row.creation_date).format('YYYY-MM-DD HH:mm:ss') + "</td>\n                        <td>" + row.reputation_history_type + "</td>\n                        <td>" + row.reputation_change + "</td>\n                        <td class=\"post-col\"><a href=\"/q/" + row.post_id + "\">" + row.post_id + "</a><a class=\"post-matcher\" href=\"javascript:void(0);\">\uD83D\uDCCC</a></td>\n                        <td class=\"reversal-type\"></td>\n                    </tr>\n                    ");
                        if (typedRow.reputation_history_type === 'association_bonus') {
                            htmlRow.find('.post-col').empty();
                        }
                        if (typedRow.canIgnore) {
                            htmlRow.css('text-decoration', 'line-through');
                        }
                        function unsetHighlightedRows() {
                            highlightedRows.forEach(function (r) { return r.removeClass('detailed_reputation_table_highlighted'); });
                            highlightedRows = [];
                        }
                        function setHighlightedRows(postId) {
                            highlightedRows.forEach(function (r) { return r.removeClass('detailed_reputation_table_highlighted'); });
                            highlightedRows = rowsById[postId];
                            highlightedRows.forEach(function (r) { return r.addClass('detailed_reputation_table_highlighted'); });
                        }
                        var postMatcher = htmlRow.find('.post-matcher');
                        var setOnHover = false;
                        postMatcher
                            .click(function () {
                            if (!setOnHover && htmlRow.hasClass('detailed_reputation_table_highlighted')) {
                                unsetHighlightedRows();
                            }
                            else {
                                setHighlightedRows(row.post_id);
                                setOnHover = false;
                            }
                        });
                        var postCol = htmlRow.find('.post-col');
                        postCol.mouseenter(function () {
                            if (!highlightedRows.length) {
                                setOnHover = true;
                                setHighlightedRows(row.post_id);
                            }
                        });
                        postCol.mouseleave(function () {
                            if (setOnHover) {
                                unsetHighlightedRows();
                                setOnHover = false;
                            }
                        });
                        if (bucketIndex > -1) {
                            var bucketColour = getBucketColour(bucketIndex, acceptableBuckets.length);
                            var postHasDeletion_1 = function (reversal, current) {
                                return reversal.post_id === current.post_id
                                    && reversal.creation_date > current.creation_date;
                            };
                            var postHasAutomaticReversal_1 = function (reversal, current) {
                                return reversal.post_id === current.post_id && (reversal.creation_date - typedRow.creation_date <= 60 * 60 * 24)
                                    && reversal.creation_date > current.creation_date;
                            };
                            var postHasManualReversal_1 = function (reversal, current) { return reversal.post_id === current.post_id
                                && reversal.creation_date > current.creation_date; };
                            if (typedRow.firstInBucket) {
                                if (reversalTypes.indexOf(typedRow.reputation_history_type) >= 0) {
                                    var reversalType = automaticallyReversed.indexOf(typedRow) >= 0
                                        ? 'Automatically reversed'
                                        : typedRow.reputation_history_type === 'vote_fraud_reversal'
                                            ? 'Manually reversed'
                                            : 'User deleted';
                                    var bucketHeader_1 = $("\n                                <tr class=\"detailed_reputation_table_header\">\n                                    <td colspan=\"5\">\n                                        Group " + String.fromCharCode(65 + bucketIndex) + "\n                                        (" + bucket.length + " events, " + bucket.reduce(function (p, c) { return p + c.reputation_change; }, 0) + " reputation) - " + reversalType + "\n                                    </td>\n                                </tr>\n                                ");
                                    bucketHeader_1.css('background-color', bucketColour);
                                    tableBody.append(bucketHeader_1);
                                    if (votesDataPromise && showReversedUser) {
                                        votesDataPromise.then(function (votesData) {
                                            var dates = typedRow.bucket.map(function (p) { return p.creation_date; })
                                                .filter(function (value, index, self) { return self.indexOf(value) === index; }); // Makes distinct (https://stackoverflow.com/questions/1960473)
                                            var cell = bucketHeader_1.find('td');
                                            var userIds = [];
                                            dates.forEach(function (date) {
                                                var dateFormat = moment.unix(date)
                                                    .utc()
                                                    .format('YYYY-MM-DD HH:mm:ss') + 'Z';
                                                var userInfos = $('.voters.sorter:eq(2)', votesData).find('[title="' + dateFormat + '"]').closest('tr').find('.user-info');
                                                userInfos.each(function (_, userInfo) {
                                                    var jUserInfo = $(userInfo);
                                                    var gravatar = jUserInfo.find('.gravatar-wrapper-32');
                                                    var userLink = jUserInfo.find('.user-details > a');
                                                    var userIdRegexMatch = userLink.attr('href').match(/\/users\/(\d+)\//);
                                                    if (userIdRegexMatch) {
                                                        var votingUserId = parseInt(userIdRegexMatch[1], 10);
                                                        if (userIds.indexOf(votingUserId) < 0) {
                                                            var userDiv = $('<div class="user-details-div">');
                                                            userDiv.append(gravatar.css('display', 'inline-block'));
                                                            userDiv.append(userLink);
                                                            cell.append(userDiv);
                                                            userIds.push(votingUserId);
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    }
                                    bucketHeader_1.css('background-color', bucketColour);
                                    tableBody.append(bucketHeader_1);
                                }
                                else {
                                    var bucketHeader = $("\n                            <tr class=\"detailed_reputation_table_header\">\n                                <td colspan=\"7\">\n                                    Group " + String.fromCharCode(65 + bucketIndex) + "\n                                    (" + bucket.filter(function (b) { return !b.canIgnore; }).length + " events (" + bucket.length + " total), " + bucket.reduce(function (p, c) { return p + c.reputation_change; }, 0) + " reputation)\n                                    (" + bucket.reduce(function (p, c) { return p + (deletionEvents.find(function (i) { return postHasDeletion_1(i, c); }) == null ? 0 : 1); }, 0) + " UD)\n                                    (" + bucket.reduce(function (p, c) { return p + (automaticallyReversed.find(function (i) { return postHasAutomaticReversal_1(i, c); }) == null ? 0 : 1); }, 0) + " AR)\n                                    (" + bucket.reduce(function (p, c) { return p + (manuallyReversed.find(function (i) { return postHasManualReversal_1(i, c); }) == null ? 0 : 1); }, 0) + " MR)\n                                </td>\n                            </tr>\n                            ");
                                    bucketHeader.css('background-color', bucketColour);
                                    tableBody.append(bucketHeader);
                                }
                            }
                            htmlRow.css('background-color', bucketColour);
                            var rowReversalTypes = [];
                            if (reversalTypes.indexOf(typedRow.reputation_history_type) < 0) {
                                if (deletionEvents.find(function (i) { return postHasDeletion_1(i, typedRow); })) {
                                    rowReversalTypes.push('UD');
                                }
                                if (automaticallyReversed.find(function (i) { return postHasAutomaticReversal_1(i, typedRow); })) {
                                    rowReversalTypes.push('AR');
                                }
                                if (manuallyReversed.find(function (i) { return postHasManualReversal_1(i, typedRow); })) {
                                    rowReversalTypes.push('MR');
                                }
                                htmlRow.find('.reversal-type').text(rowReversalTypes.join(' '));
                            }
                        }
                        tableBody.append(htmlRow);
                        if (!rowsById[row.post_id]) {
                            rowsById[row.post_id] = [];
                        }
                        rowsById[row.post_id].push(htmlRow);
                    });
                    repPageContainer.append(newTable);
                });
            }
        });
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var groupableEventTypes = ['post_upvoted', 'user_deleted', 'post_unupvoted', 'vote_fraud_reversal'];
    function SortItems(items) {
        items.sort(function (a, b) {
            var dateDiff = b.creation_date - a.creation_date;
            if (dateDiff !== 0) {
                return dateDiff;
            }
            var postDiff = a.post_id - b.post_id;
            if (postDiff !== 0) {
                return postDiff;
            }
            var reputationType = a.reputation_history_type.localeCompare(b.reputation_history_type);
            if (reputationType !== 0) {
                return reputationType;
            }
            return a.reputation_change - b.reputation_change;
        });
    }
    function ProcessItems(items, secondsGap) {
        var buckets = [];
        SortItems(items);
        items.forEach(function (item) {
            if (groupableEventTypes.indexOf(item.reputation_history_type) >= 0) {
                // Find which bucket to put it in
                var matchingBucket = buckets.find(function (bucket) {
                    // If we can't find any events in the bucket which are within our threshold, the bucket isn't valid
                    if (!bucket.find(function (event) { return (event.creation_date - item.creation_date) < secondsGap; })) {
                        return false;
                    }
                    if (item.reputation_history_type === 'vote_fraud_reversal') {
                        // Reversals won't affect the same post twice
                        if (bucket.find(function (event) { return event.post_id === item.post_id; })) {
                            return false;
                        }
                    }
                    if (item.reputation_history_type === 'post_upvoted') {
                        var previouslyUpvoted = bucket.filter(function (b) { return b.post_id === item.post_id && b.reputation_history_type === 'post_upvoted'; }).length;
                        var previouslyUnupvoted = bucket.filter(function (b) { return b.post_id === item.post_id && b.reputation_history_type === 'post_unupvoted'; }).length;
                        if (previouslyUpvoted - previouslyUnupvoted > 0) {
                            return false;
                        }
                    }
                    return true;
                });
                var reputationEventDetails = item;
                if (!matchingBucket) {
                    matchingBucket = [];
                    buckets.push(matchingBucket);
                    reputationEventDetails.firstInBucket = true;
                }
                // When we see an upvote, check if there's an unupvote that happened afterwards for the same post
                // If there were, we strikethrough each event.
                // Since we only check the same bucket, we won't be striking out unrelated votes (usually)
                if (item.reputation_history_type === 'post_upvoted') {
                    var unupvote = matchingBucket.find(function (b) {
                        return b.post_id === item.post_id
                            && b.reputation_history_type === 'post_unupvoted'
                            && b.creation_date >= item.creation_date
                            && !b.canIgnore;
                    });
                    if (unupvote) {
                        unupvote.canIgnore = true;
                        reputationEventDetails.canIgnore = true;
                    }
                }
                var typedBucket = matchingBucket;
                reputationEventDetails.bucket = typedBucket;
                typedBucket.push(reputationEventDetails);
            }
        });
        return buckets;
    }
    exports.ProcessItems = ProcessItems;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, tslib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var page = 0;
    var data = null;
    function GetCurrentReputationPage(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prom;
            return tslib_1.__generator(this, function (_a) {
                prom = new Promise(function (resolve, reject) {
                    if (!data) {
                        GetNextReputationPage(userId)
                            .then(function (d) {
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
        var endPoint = "https://api.stackexchange.com/2.2/users/" + userId + "/reputation-history?pagesize=100&page=" + page + "&site=stackoverflow";
        return fetch(endPoint)
            .then(function (r) { return r.json(); })
            .then(function (r) {
            if (data) {
                data = {
                    items: data.items.concat(r.items),
                    hasMore: r.has_more
                };
            }
            else {
                data = {
                    items: r.items,
                    hasMore: r.has_more
                };
            }
        });
    }
    exports.GetNextReputationPage = GetNextReputationPage;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
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

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ })
/******/ ]);