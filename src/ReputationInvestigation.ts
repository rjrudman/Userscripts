import { ApiResponse, ReputationEvent } from 'ReptuationApiResponse';
import { AddStyleText } from 'Tools';
import { ProcessIntoBuckets, ReputationEventDetails } from 'ReputationAnalyser';
import { GetCurrentReputationPage, GetNextReputationPage } from 'ReputationFixer';
import { __values } from '../node_modules/tslib';

declare var StackExchange: any;

const css = `
.detailed_reputation_table {
    width: 100%;
    font-size: 10px;
}

.detailed_reputation_table td {
    padding: 5px;
}

.detailed_reputation_table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.detailed_reputation_table_header {
    font-size: 12px;
}

.post-matcher {
    opacity: 0;
    padding-left: 5px;
}

.detailed_reputation_table tr > td.post-col:hover .post-matcher,
.detailed_reputation_table_highlighted .post-matcher {
    opacity: 1;
}

.user-details-div {
    display: inline;
    margin-left: 15px;
}
.user-details-div a {
    margin-left: 5px;
}

.summary-table {
    width: 100%;
    margin: 5px;
    font-size: 15px;
}

.summary-table p {
    color: red;
    display: inline;
}
`;

function getBucketColour(index: number, numBuckets: number) {
    // Here, we multiply by 3 to try to pick contrasting colours for blocks which are close to eachother
    const colourNum = ((360 / numBuckets) * index * 3 % 360);
    const cssHSL = 'hsla(' + colourNum + ', 80%, 50%, 0.3)';
    return cssHSL;
}

let votesDataPromise: Promise<any> | null = null;

$(() => {
    AddStyleText(css);

    // https://stackoverflow.com/a/10172676
    ($ as any).event.special.destroyed = {
        remove: (o: any) => {
            if (o.handler) {
                o.handler();
            }
        }
    };

    StackExchange.initialized.then(() => {
        const userId = StackExchange.user.options.userId;
        const tabSelectedRegex = /&sort=detailed/;

        function addUiItems() {
            const detailedLink = $(`<a href="/users/${userId}?tab=reputation&amp;sort=detailed">detailed</a>`);

            if (window.location.href.match(tabSelectedRegex)) {
                $('.user-tab-sorts a').removeClass('youarehere');
                $(detailedLink).addClass('youarehere');

                $('#stats').prepend('<div id="rep-page-summary">');

                RenderDetailedReputation(45, 3, false);

                const linkToXref = $(`<a style="margin-left: 5px" href="https://stackoverflow.com/admin/xref-user-ips/${userId}" target="_blank">xref</a>`);
                const linkToVotes = $(`<a href="https://stackoverflow.com/admin/show-user-votes/${userId}" target="_blank">votes</a>`);
                const showVoters = $('<input type="checkbox" id="chkShowReversedUser">');
                const showVotersLabel = $('<label for="chkShowReversedUser" style="margin-right: 15px; margin-left: 15px;">Show reversed user</label>');

                if (StackExchange.options.user.isModerator) {
                    $('#stats').prepend(linkToXref);
                    $('#stats').prepend(linkToVotes);
                    $('#stats').prepend(showVoters);
                    $('#stats').prepend(showVotersLabel);
                }

                // https://stackoverflow.com/admin/show-user-votes/8077972
                const bucketSizeInput = $('<input type="number" value="3" />');
                $('#stats').prepend(bucketSizeInput);
                $('#stats').prepend('<label style="margin-right: 15px; margin-left: 15px;">Set minimum bucket size</label>');

                const numSecondsInput = $('<input type="number" value="45" />');
                $('#stats').prepend(numSecondsInput);
                $('#stats').prepend('<label style="margin-right: 15px;">Set number of seconds between votes</label>');

                const onChange = () => {
                    const numSeconds = parseInt(numSecondsInput.val(), 10);
                    const bucketSize = parseInt(bucketSizeInput.val(), 10);
                    const showReversedUser = !!showVoters.prop('checked');
                    RenderDetailedReputation(numSeconds, bucketSize, showReversedUser);
                };

                showVoters.change(onChange);
                numSecondsInput.change(onChange);
                bucketSizeInput.change(onChange);
            }

            // SE destroys the tab when swapping. Watch for that, and add back our UI items.
            detailedLink.bind('destroyed', () => {
                setTimeout(() => { addUiItems(); });
            });

            $('.user-tab-sorts').append(detailedLink);
        }
        addUiItems();

        function RenderDetailedReputation(secondsGap: number, bucketSize: number, showReversedUser: boolean) {
            const repPageContainer = $('#rep-page-container');
            repPageContainer.empty();

            const repPageSummary = $('#rep-page-summary');
            repPageSummary.empty();

            const footerContainer = $('.user-tab-footer');
            footerContainer.empty();

            const apiData = GetCurrentReputationPage(userId);

            let highlightedRows: JQuery[] = [];
            const rowsById: JQuery[][] = [];

            apiData.then(data => {
                if (data.hasMore) {
                    const loadMoreData = $('<a href="javascript:void(0);">Load more</a>');
                    loadMoreData.click(() => {
                        loadMoreData.hide();
                        GetNextReputationPage(userId).then(() => RenderDetailedReputation(secondsGap, bucketSize, showReversedUser));
                    });
                    footerContainer.append(loadMoreData);
                }

                const copiedData = JSON.parse(JSON.stringify(data)) as ApiResponse;
                const buckets = ProcessIntoBuckets(copiedData.items, secondsGap);
                const acceptableBuckets = buckets.filter(b => b.length >= bucketSize);

                const newTable = $(`
                    <table class="detailed_reputation_table">
                        <tbody id="detailed_reputation_body">
                        </tbody>
                    </table>
                    `);

                const reversalTypes = ['user_deleted', 'vote_fraud_reversal'];
                const deletionEvents = copiedData.items.filter(s => s.reputation_history_type === 'user_deleted');

                const automaticallyReversed = copiedData.items.filter(s => {
                    const date = moment.unix(s.creation_date).utc();
                    if (s.reputation_history_type === 'vote_fraud_reversal') {
                        if (date.minute() <= 5 && date.hour() === 3) {
                            return true;
                        }
                    }
                    return false;
                });
                const manuallyReversed = copiedData.items.filter(s => {
                    const date = moment.unix(s.creation_date).utc();
                    if (s.reputation_history_type === 'vote_fraud_reversal') {
                        if (date.minute() > 5 || date.hour() !== 3) {
                            return true;
                        }
                    }
                    return false;
                });

                if (showReversedUser && copiedData.items.find(s => reversalTypes.indexOf(s.reputation_history_type) >= 0)
                    && votesDataPromise == null && StackExchange.options.user.isModerator) {
                    const votesPage = `/admin/show-user-votes/${userId}`;
                    votesDataPromise = fetch(votesPage).then(r => r.text());
                }

                let totalVotes = 0;
                let totalVotesReversed = 0;
                let totalReptuationReversed = 0;

                const tableBody = newTable.find('#detailed_reputation_body');
                copiedData.items.forEach(row => {
                    const typedRow = row as ReputationEventDetails;
                    const bucket = typedRow.bucket;
                    const bucketIndex = acceptableBuckets.indexOf(bucket);

                    const htmlRow = $(`
                    <tr>
                        <td>${moment.unix(row.creation_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${row.reputation_history_type}</td>
                        <td id="rep-change">${row.reputation_change}</td>
                        <td class="post-col"><a href="/q/${row.post_id}">${row.post_id}</a><a class="post-matcher" href="javascript:void(0);">📌</a></td>
                        <td class="reversal-type"></td>
                    </tr>
                    `);

                    if (typedRow.reputation_history_type === 'association_bonus') {
                        htmlRow.find('.post-col').empty();
                    }
                    if (typedRow.canIgnore) {
                        htmlRow.css('text-decoration', 'line-through');
                    }

                    function unsetHighlightedRows() {
                        highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                        highlightedRows = [];
                    }
                    function setHighlightedRows(postId: number) {
                        highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                        highlightedRows = rowsById[postId];
                        highlightedRows.forEach(r => r.addClass('detailed_reputation_table_highlighted'));
                    }

                    const postMatcher = htmlRow.find('.post-matcher');
                    let setOnHover = false;
                    postMatcher
                        .click(() => {
                            if (!setOnHover && htmlRow.hasClass('detailed_reputation_table_highlighted')) {
                                unsetHighlightedRows();
                            } else {
                                setHighlightedRows(row.post_id);
                                setOnHover = false;
                            }
                        });

                    const postCol = htmlRow.find('.post-col');
                    postCol.mouseenter(() => {
                        if (!highlightedRows.length) {
                            setOnHover = true;
                            setHighlightedRows(row.post_id);
                        }
                    });
                    postCol.mouseleave(() => {
                        if (setOnHover) {
                            unsetHighlightedRows();
                            setOnHover = false;
                        }
                    });

                    if (bucketIndex > -1) {
                        const bucketColour = getBucketColour(bucketIndex, acceptableBuckets.length);

                        const postHasDeletion = (reversal: ReputationEvent, current: ReputationEvent) =>
                            reversal.post_id === current.post_id
                            && reversal.creation_date > current.creation_date;
                        const postHasAutomaticReversal = (reversal: ReputationEvent, current: ReputationEvent) =>
                            reversal.post_id === current.post_id && (reversal.creation_date - typedRow.creation_date <= 60 * 60 * 24)
                            && reversal.creation_date > current.creation_date;
                        const postHasManualReversal = (reversal: ReputationEvent, current: ReputationEvent) => reversal.post_id === current.post_id
                            && reversal.creation_date > current.creation_date;

                        if (typedRow.firstInBucket) {
                            if (reversalTypes.indexOf(typedRow.reputation_history_type) >= 0) {
                                const reversalType =
                                    automaticallyReversed.indexOf(typedRow) >= 0
                                        ? 'Automatically reversed'
                                        : typedRow.reputation_history_type === 'vote_fraud_reversal'
                                            ? 'Manually reversed'
                                            : 'User deleted';

                                const bucketHeader = $(`
                                <tr class="detailed_reputation_table_header">
                                    <td colspan="5">
                                        Group ${String.fromCharCode(65 + bucketIndex)}
                                        (${bucket.length} events, ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation) - ${reversalType}
                                    </td>
                                </tr>
                                `);
                                bucketHeader.css('background-color', bucketColour);
                                tableBody.append(bucketHeader);

                                if (votesDataPromise && showReversedUser) {
                                    votesDataPromise.then(votesData => {
                                        const dates = typedRow.bucket.map(p => p.creation_date)
                                            .filter((value, index, self) => self.indexOf(value) === index); // Makes distinct (https://stackoverflow.com/questions/1960473)

                                        const cell = bucketHeader.find('td');

                                        const userIds: number[] = [];
                                        dates.forEach(date => {
                                            const dateFormat = moment.unix(date)
                                                .utc()
                                                .format('YYYY-MM-DD HH:mm:ss') + 'Z';

                                            const userInfos = $('.voters.sorter:eq(2)', votesData).find('[title="' + dateFormat + '"]').closest('tr').find('.user-info');
                                            userInfos.each((_, userInfo) => {
                                                const jUserInfo = $(userInfo);
                                                const gravatar = jUserInfo.find('.gravatar-wrapper-32');
                                                const userLink = jUserInfo.find('.user-details > a');

                                                const userIdRegexMatch = userLink.attr('href').match(/\/users\/(\d+)\//);
                                                if (userIdRegexMatch) {
                                                    const votingUserId = parseInt(userIdRegexMatch[1], 10);
                                                    if (userIds.indexOf(votingUserId) < 0) {
                                                        const userDiv = $('<div class="user-details-div">');
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
                                bucketHeader.css('background-color', bucketColour);
                                tableBody.append(bucketHeader);
                            } else {
                                const bucketHeader = $(`
                            <tr class="detailed_reputation_table_header">
                                <td colspan="7">
                                    Group ${String.fromCharCode(65 + bucketIndex)}
                                    (${bucket.filter(b => !b.canIgnore).length} events (${bucket.length} total), ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation)
                                    (${bucket.reduce((p, c) => p + (deletionEvents.find(i => postHasDeletion(i, c)) == null ? 0 : 1), 0)} UD)
                                    (${bucket.reduce((p, c) => p + (automaticallyReversed.find(i => postHasAutomaticReversal(i, c)) == null ? 0 : 1), 0)} AR)
                                    (${bucket.reduce((p, c) => p + (manuallyReversed.find(i => postHasManualReversal(i, c)) == null ? 0 : 1), 0)} MR)
                                </td>
                            </tr>
                            `);
                                bucketHeader.css('background-color', bucketColour);
                                tableBody.append(bucketHeader);
                            }
                        }

                        htmlRow.css('background-color', bucketColour);

                        const rowReversalTypes = [];

                        let actualReputationChange = typedRow.reputation_change;
                        if (actualReputationChange === 0) { // They rep capped. Let's see if we can find the actual number elsewhere
                            const matchedElsewhere = copiedData.items.find(i =>
                                i.post_id === typedRow.post_id
                                && i.reputation_history_type === typedRow.reputation_history_type
                                && i.reputation_change > 0);
                            if (matchedElsewhere) {
                                actualReputationChange = matchedElsewhere.reputation_change;
                                htmlRow.find('#rep-change').text(
                                    htmlRow.find('#rep-change').text() + ' (' + actualReputationChange + ')'
                                );
                            }
                        }

                        if (!typedRow.canIgnore && reversalTypes.indexOf(typedRow.reputation_history_type) < 0) {
                            const allData = (Array.prototype.concat.apply([], acceptableBuckets) as ReputationEventDetails[])
                                .filter(d => reversalTypes.indexOf(d.reputation_history_type) < 0)
                                .filter(d => d.post_id === typedRow.post_id && !d.canIgnore);

                            const findAll = (src: ReputationEvent[], func: (reversal: ReputationEvent, current: ReputationEvent) => boolean) => {
                                return allData.filter(i => src.find(di => func(di, i)));
                            };
                            const countAll = (src: ReputationEvent[], func: (reversal: ReputationEvent, current: ReputationEvent) => boolean) => {
                                return findAll(src, func).length;
                            };

                            const matchingDeletions = deletionEvents.filter(i => postHasDeletion(i, typedRow)).length;
                            if (matchingDeletions > 0) {
                                const allVotes = countAll(deletionEvents, postHasDeletion);
                                rowReversalTypes.push(`UD (${matchingDeletions}/${allVotes})`);
                            }
                            const matchingAutomaticReversals = automaticallyReversed.filter(i => postHasAutomaticReversal(i, typedRow)).length;
                            if (matchingAutomaticReversals > 0) {
                                const allVotes = countAll(automaticallyReversed, postHasAutomaticReversal);
                                rowReversalTypes.push(`AR (${matchingAutomaticReversals}/${allVotes})`);
                            }
                            const matchingManualReversals = manuallyReversed.filter(i => postHasManualReversal(i, typedRow)).length;
                            if (matchingManualReversals) {
                                const allVotes = countAll(manuallyReversed, postHasManualReversal);
                                rowReversalTypes.push(`MR (${matchingManualReversals}/${allVotes})`);
                            }

                            const allOtherVotes = findAll(deletionEvents, postHasDeletion)
                                .concat(
                                    findAll(automaticallyReversed, postHasAutomaticReversal)
                                ).concat(
                                    findAll(manuallyReversed, postHasManualReversal)
                                )
                                .map(i => i.vote_id)
                                .filter((value, index, self) => self.indexOf(value) === index) // Makes distinct (https://stackoverflow.com/questions/1960473)
                                .length;

                            const partialVoteReversed =
                                allOtherVotes === 0 ?
                                    1 :
                                    1 - ((matchingDeletions + matchingAutomaticReversals + matchingManualReversals) / allOtherVotes);

                            totalVotes++;
                            totalVotesReversed += partialVoteReversed;
                            totalReptuationReversed += actualReputationChange * (partialVoteReversed);

                            if (partialVoteReversed === 1) {
                                rowReversalTypes.unshift('❌');
                            } else if (partialVoteReversed <= 0) {
                                rowReversalTypes.unshift('✅');
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

                if (totalVotes > 0) {
                    if (totalVotesReversed > 0) {
                        repPageSummary.append(`
                            <hr style="margin-bottom: 0px;" />
                            <table class="summary-table">
                                <tr>
                                    <td><p>Total votes</p>: ${totalVotes}</td>
                                    <td><p>Votes not reversed</p>: ${Math.round(totalVotesReversed)}</td>
                                    <td><p>Reputation not reversed</p>: ${Math.round(totalReptuationReversed)}</td>
                                </tr>
                            </table>
                            <hr style="margin-bottom: 0px;" />
                        `);
                    } else {
                        repPageSummary.append(`
                            <hr style="margin-bottom: 0px;" />
                            <p style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px;">All suspicious votes reversed</p>
                            <hr style="margin-bottom: 0px;" />
                        `);
                    }
                }
            });
        }
    });
});
