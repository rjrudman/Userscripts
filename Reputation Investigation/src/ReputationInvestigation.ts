import { AddStyleText } from 'Tools';
import { GetCurrentReputationPage, GetNextReputationPage } from 'ReputationApi';
import { ApiResponse } from 'Types/ApiResponse';
import { ProcessEvents } from 'EventProcessor';
import { IsReversableType } from 'EventTypes';

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
    border-top: 1px solid black;
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

.reversal-type {
    cursor: default;
}

.rep-change {
    font-size: 12px;
    font-weight: bold;
}
.rep-change-positive {
    color: green;
}
.rep-change-negative {
    color: red;
}
#detailed_reputation_body > tr.reversal {
    background-color: rgb(239, 145, 125);
}
tr.reversal > td.post-col > a,
tr.reversal > td.post-col > a:hover {
    color: #12009e
}
`;

function getBucketColour(index: number, numBuckets: number) {
    // If the index is even, we shift it halfway through the bucket count
    // This way, colours will be more contrasted
    if (index % 2 === 0) {
        index += numBuckets / 2;
    }
    const colourNum = ((360 / numBuckets) * index % 360);
    const cssHSL = 'hsla(' + colourNum + ', 80%, 50%, 0.3)';
    return cssHSL;
}

const getNameFromNumber = (num: number): string => {
    const NUM_LETTERS = 26;
    const ASCII_START = 65;
    if (num >= NUM_LETTERS) {
        const remaining = num % NUM_LETTERS;
        return getNameFromNumber((num / NUM_LETTERS) - 1) + String.fromCharCode(remaining + ASCII_START);
    }
    return String.fromCharCode(num + ASCII_START);
};

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

                RenderDetailedReputation(45, 3);

                const linkToXref = $(`<a style="margin-left: 10px" href="https://stackoverflow.com/admin/xref-user-ips/${userId}" target="_blank">xref</a>`);
                const linkToVotes = $(`<a style="margin-left: 10px" href="https://stackoverflow.com/admin/show-user-votes/${userId}" target="_blank">votes</a>`);
                if (StackExchange.options.user.isModerator) {
                    $('#stats').prepend(linkToXref);
                    $('#stats').prepend(linkToVotes);
                }

                const bucketSizeInput = $('<input type="number" value="3" />');
                $('#stats').prepend(bucketSizeInput);
                $('#stats').prepend('<label style="margin-right: 15px; margin-left: 15px;">Minimum number of votes</label>');

                const numSecondsInput = $('<input type="number" value="45" />');
                $('#stats').prepend(numSecondsInput);
                $('#stats').prepend('<label style="margin-right: 15px;">Number of seconds between votes</label>');

                const onChange = () => {
                    const numSeconds = parseInt(numSecondsInput.val(), 10);
                    const bucketSize = parseInt(bucketSizeInput.val(), 10);
                    RenderDetailedReputation(numSeconds, bucketSize);
                };

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

        function RenderDetailedReputation(secondsGap: number, bucketSize: number) {
            const repPageContainer = $('#rep-page-container');
            repPageContainer.empty();

            const repPageSummary = $('#rep-page-summary');
            repPageSummary.empty();

            const footerContainer = $('.user-tab-footer');
            footerContainer.empty();

            const apiData = GetCurrentReputationPage(userId);

            let highlightedRows: JQuery[] = [];
            const rowsById: JQuery[][] = [];

            const unsetHighlightedRows = () => {
                highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                highlightedRows = [];
            };

            const setHighlightedRows = (postId: number) => {
                highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                highlightedRows = rowsById[postId];
                highlightedRows.forEach(r => r.addClass('detailed_reputation_table_highlighted'));
            };

            apiData.then(data => {
                if (data.hasMore) {
                    const loadMoreData = $('<a href="javascript:void(0);">Load more</a>');
                    loadMoreData.click(() => {
                        loadMoreData.hide();
                        GetNextReputationPage(userId).then(() => RenderDetailedReputation(secondsGap, bucketSize));
                    });
                    footerContainer.append(loadMoreData);
                }

                const copiedData = JSON.parse(JSON.stringify(data)) as ApiResponse;
                const events = ProcessEvents(copiedData.items, bucketSize, secondsGap);
                events.sort((left, right) => right.creation_date - left.creation_date);
                const newTable = $(`
                    <table class="detailed_reputation_table">
                        <tbody id="detailed_reputation_body">
                        </tbody>
                    </table>
                    `);

                const reversalTypes = ['user_deleted', 'vote_fraud_reversal'];
                const tableBody = newTable.find('#detailed_reputation_body');
                const seenBuckets: boolean[] = [];
                const numBuckets = Math.max(...events.map(e => e.BucketIndex)) + 1;
                for (const event of events) {
                    let repChangeClass;
                    if (event.Cancelled || event.reputation_change === 0) {
                        repChangeClass = 'rep-change-neutral';
                    } else if (event.reputation_change > 0) {
                        repChangeClass = 'rep-change-positive';
                    } else {
                        repChangeClass = 'rep-change-negative';
                    }
                    const htmlRow = $(`
                    <tr>
                        <td>${moment.unix(event.creation_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${event.reputation_history_type}</td>
                        <td id="rep-change" class="rep-change ${repChangeClass}">${event.reputation_change >= 0 ? '+' : ''}${event.reputation_change}</td>
                        <td class="post-col"><a href="/q/${event.post_id}">${event.title || (event.post_id + ' (deleted)')}</a><a class="post-matcher" href="javascript:void(0);">📌</a></td>
                        <td class="reversal-type"></td>
                    </tr>
                    `);

                    if (event.reputation_history_type === 'association_bonus') {
                        htmlRow.find('.post-col').empty();
                    }
                    if (event.Cancelled) {
                        htmlRow.css('text-decoration', 'line-through');
                    }

                    const postMatcher = htmlRow.find('.post-matcher');
                    let setOnHover = false;
                    postMatcher
                        .click(() => {
                            if (!setOnHover && htmlRow.hasClass('detailed_reputation_table_highlighted')) {
                                unsetHighlightedRows();
                            } else {
                                setHighlightedRows(event.post_id);
                                setOnHover = false;
                            }
                        });

                    const postCol = htmlRow.find('.post-col');
                    postCol.mouseenter(() => {
                        if (!highlightedRows.length) {
                            setOnHover = true;
                            setHighlightedRows(event.post_id);
                        }
                    });
                    postCol.mouseleave(() => {
                        if (setOnHover) {
                            unsetHighlightedRows();
                            setOnHover = false;
                        }
                    });

                    if (event.BucketIndex >= 0) {
                        let isReversal = false;
                        const bucketColour = getBucketColour(event.BucketIndex, numBuckets);
                        if (seenBuckets[event.BucketIndex] === undefined) {
                            const allEventCount = event.Bucket.length;
                            const nonCancelledEventCount = event.Bucket.filter(b => !b.Cancelled).length;
                            const bucketName = getNameFromNumber(numBuckets - event.BucketIndex - 1);
                            const eventCountMessage =
                                allEventCount === nonCancelledEventCount
                                    ? `${allEventCount} events`
                                    : `${nonCancelledEventCount} events (${allEventCount} total)`;

                            const reputationMessage = `${event.Bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation`;
                            let groupDescription = `Group ${bucketName}. ${eventCountMessage}. ${reputationMessage}`;

                            const reversalMessage =
                                reversalTypes.indexOf(event.reputation_history_type) >= 0
                                    ? event.reputation_history_type === 'vote_fraud_reversal'
                                        ? 'Reversal'
                                        : 'User deleted'
                                    : '';
                            if (reversalMessage !== '') {
                                groupDescription += ` - ${reversalMessage} 🔥`;
                                isReversal = true;
                                seenBuckets[event.BucketIndex] = true;
                            } else {
                                seenBuckets[event.BucketIndex] = false;
                            }

                            const bucketHeader = $(`
                        <tr  class="detailed_reputation_table_header">
                            <td colspan="7">
                                ${groupDescription}
                            </td>
                        </tr>
                        `);
                            if (isReversal) {
                                bucketHeader.addClass('reversal');
                            } else {
                                bucketHeader.css('background-color', bucketColour);
                            }

                            tableBody.append(bucketHeader);
                        } else {
                            if (seenBuckets[event.BucketIndex]) {
                                isReversal = true;
                            }
                        }

                        if (isReversal) {
                            htmlRow.addClass('reversal');
                        } else {
                            htmlRow.css('background-color', bucketColour);
                        }
                        let actualReputationChange = event.reputation_change;
                        if (actualReputationChange === 0) { // They rep capped. Let's see if we can find the actual number elsewhere
                            const matchedElsewhere = copiedData.items.find(i =>
                                i.post_id === event.post_id
                                && i.reputation_history_type === event.reputation_history_type
                                && i.reputation_change > 0);
                            if (matchedElsewhere) {
                                actualReputationChange = matchedElsewhere.reputation_change;
                                htmlRow.find('#rep-change').text(
                                    htmlRow.find('#rep-change').text() + ' (' + actualReputationChange + ')'
                                );
                            }
                        }

                        if (!event.Cancelled && IsReversableType(event.reputation_history_type)) {
                            let reversalMessage;
                            let reversalTooltip;
                            if (event.ReversedBy.length > event.Pairs) {
                                reversalMessage = '✅';
                                reversalTooltip = 'Vote was reversed';
                            } else if (event.ReversedBy.length === 0) {
                                reversalMessage = '❌';
                                reversalTooltip = 'Vote was not reversed';
                            } else {
                                reversalMessage = `⚠️ ${event.ReversedBy.length}/${event.Pairs + 1}`;
                                reversalTooltip = 'Vote may not have been reversed';
                            }
                            const reversalType = htmlRow.find('.reversal-type');
                            reversalType.text(reversalMessage);
                            reversalType.attr('title', reversalTooltip);
                        }
                    }

                    tableBody.append(htmlRow);
                    if (!rowsById[event.post_id]) {
                        rowsById[event.post_id] = [];
                    }
                    rowsById[event.post_id].push(htmlRow);
                }

                repPageContainer.append(newTable);
                const votesNotFullyReversed =
                    events.filter(e =>
                        !e.Cancelled
                        && e.IsBucketed
                        && IsReversableType(e.reputation_history_type)
                        && e.ReversedBy.length <= e.Pairs)
                        .map(e => ({
                            VoteSlice: 1 - (e.ReversedBy.length / (e.Pairs + 1)),
                            Reputation: e.reputation_change * (1 - (e.ReversedBy.length / (e.Pairs + 1)))
                        }));
                if (votesNotFullyReversed.length) {
                    const voteCount = votesNotFullyReversed.map(v => v.VoteSlice).reduce((left, right) => left + right, 0);
                    const reputationCount = votesNotFullyReversed.map(v => v.Reputation).reduce((left, right) => left + right, 0);
                    repPageSummary.append(`
                            <hr style="margin-bottom: 0px;" />
                            <table class="summary-table">
                                <tr>
                                    <td><p>Total votes</p>: ${events.filter(e => e.IsBucketed && IsReversableType(e.reputation_history_type)).length}</td>
                                    <td><p>Votes not reversed</p>: ${Math.round(voteCount)}</td>
                                    <td><p>Reputation not reversed</p>: ${Math.round(reputationCount)}</td>
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
            });
        }
    });
});
