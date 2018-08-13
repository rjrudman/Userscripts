import { ApiResponse, ReputationEvent } from 'ReptuationApiResponse';
import { AddStyleText } from 'Tools';
import * as moment from 'moment';
import { ProcessItems, SortItems, ReputationEventDetails } from 'ReputationAnalyser';

declare var StackExchange: any;

const css = `
.detailed_reputation_table {
    width: 100%;
}

.detailed_reputation_table td {
    padding: 5px;
}

.detailed_reputation_table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.detailed_reputation_table_header {
    font-size: 20px;
}

.post-matcher {
    opacity: 0;
    padding-left: 5px;
}

.detailed_reputation_table tr > td.post-col:hover .post-matcher,
.detailed_reputation_table_highlighted .post-matcher {
    opacity: 1;
}
`;

function getBucketColour(index: number, numBuckets: number) {
    const cssHSL = 'hsla(' + (360 / numBuckets) * index + ', 80%, 50%, 0.3)';
    return cssHSL;
}

type ReputationEventWithRow = ReputationEvent & { html_row: JQuery };

let apiData: Promise<ApiResponse> | null = null;
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
                RenderDetailedReputation(45);

                const numSecondsInput = $('<input type="number" value="60" />');
                $('#stats').prepend(numSecondsInput);
                $('#stats').prepend('<label style="margin-right: 15px">Set number of seconds between votes</label>');

                numSecondsInput.change(() => {
                    const numSeconds = parseInt(numSecondsInput.val(), 10);
                    RenderDetailedReputation(numSeconds);
                });
            }

            detailedLink.bind('destroyed', () => {
                setTimeout(() => { addUiItems(); });
            });

            $('.user-tab-sorts').append(detailedLink);
        }
        addUiItems();

        function RenderDetailedReputation(secondsGap: number) {
            const repPageContainer = $('#rep-page-container');
            repPageContainer.empty();

            if (apiData == null) {
                const requestEndpoint = `https://api.stackexchange.com/2.2/users/${userId}/reputation-history?pagesize=100&site=stackoverflow`;
                apiData = fetch(requestEndpoint).then(r => r.json());
            }
            if (votesDataPromise == null) {
                const votesPage = `/admin/show-user-votes/${userId}`;
                votesDataPromise = fetch(votesPage).then(r => r.text());
            }

            let highlightedRows: JQuery[] = [];
            const rowsById: JQuery[][] = [];

            apiData.then(data => {
                const buckets = ProcessItems(data.items, secondsGap);
                const acceptableBuckets = buckets.filter(b => b.length >= 3);

                const newTable = $(`
                    <table class="detailed_reputation_table">
                        <tbody id="detailed_reputation_body">
                        </tbody>
                    </table>
                    `);

                const deletionEvents = data.items.filter(s => s.reputation_history_type === 'user_deleted');
                const automaticallyReversed = data.items.filter(s => s.reputation_history_type === 'vote_fraud_reversal');

                const tableBody = newTable.find('#detailed_reputation_body');
                data.items.forEach(row => {
                    const typedRow = row as ReputationEventDetails;
                    const bucket = typedRow.bucket;
                    const bucketIndex = acceptableBuckets.indexOf(bucket);

                    const htmlRow = $(`
                    <tr>
                        <td>${moment.unix(row.creation_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${row.reputation_history_type}</td>
                        <td>${row.reputation_change}</td>
                        <td class="post-col"><a href="/q/${row.post_id}">${row.post_id}</a><a class="post-matcher" href="javascript:void()">📌</a></td>
                        <td class="user-deleted"></td>
                        <td class="automatically-reversed"></td>
                        <td class="cm-reversed"></td>
                    </tr>
                    `);

                    if (typedRow.reputation_history_type === 'association_bonus') {
                        htmlRow.find('.post-col').empty();
                    }
                    if (typedRow.canIgnore) {
                        htmlRow.css('text-decoration', 'line-through');
                    }

                    htmlRow.find('.post-matcher')
                        .click(() => {
                            if (htmlRow.hasClass('detailed_reputation_table_highlighted')) {
                                highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                                highlightedRows = [];
                            } else {
                                highlightedRows.forEach(r => r.removeClass('detailed_reputation_table_highlighted'));
                                highlightedRows = rowsById[row.post_id];
                                highlightedRows.forEach(r => r.addClass('detailed_reputation_table_highlighted'));
                            }
                        });

                    if (bucketIndex > -1) {
                        const bucketColour = getBucketColour(bucketIndex, acceptableBuckets.length);

                        if (typedRow.firstInBucket) {
                            const bucketHeader = $(`
                            <tr class="detailed_reputation_table_header">
                                <td colspan="7">
                                    Group ${String.fromCharCode(65 + bucketIndex)}
                                    (${bucket.filter(b => !b.canIgnore).length} events (${bucket.length} total), ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation)
                                    (${bucket.reduce((p, c) => p + (deletionEvents.find(i => i.post_id === c.post_id) == null ? 0 : 1), 0)} UD)
                                    (${bucket.reduce((p, c) => p + (automaticallyReversed.find(i => i.post_id === c.post_id && (i.creation_date - typedRow.creation_date <= 60 * 60 * 24)) == null ? 0 : 1), 0)} AR)
                                </td>
                            </tr>
                            `);
                            bucketHeader.css('background-color', bucketColour);
                            tableBody.append(bucketHeader);
                        }

                        htmlRow.css('background-color', bucketColour);

                        if (deletionEvents.find(i => i.post_id === typedRow.post_id)) {
                            htmlRow.find('.user-deleted').text('UD');
                        }
                        if (automaticallyReversed.find(i => i.post_id === typedRow.post_id
                            // Automatic reversals will only apply to votes cast within the last 24 hours
                            && (i.creation_date - typedRow.creation_date <= 60 * 60 * 24))) {
                            htmlRow.find('.user-deleted').text('AR');
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
