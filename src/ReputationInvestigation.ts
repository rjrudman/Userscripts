import { ApiResponse, ReputationEvent } from 'ReptuationApiResponse';
import { AddStyleText } from 'Tools';
import * as moment from 'moment';

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
                RenderDetailedReputation(60);

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

            const buckets: ReputationEventWithRow[][] = [];
            apiData.then(data => {
                const sortedData = data.items.sort((a, b) => {
                    const dateDiff = a.creation_date - b.creation_date;
                    if (dateDiff !== 0) {
                        return dateDiff;
                    }
                    const postDiff = a.post_id - b.post_id;
                    if (postDiff !== 0) {
                        return postDiff;
                    }

                    const reputationType = a.reputation_history_type.localeCompare(b.reputation_history_type);
                    if (reputationType !== 0) {
                        return reputationType;
                    }

                    return a.reputation_change - b.reputation_change;
                });

                const newTable = $(`
                    <table class="detailed_reputation_table">
                        <tbody id="detailed_reputation_body">
                        </tbody>
                    </table>
                    `);
                const tableBody = newTable.find('#detailed_reputation_body');
                sortedData.forEach(row => {
                    const htmlRow = $(`
                    <tr>
                        <td>${moment.unix(row.creation_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${row.reputation_history_type}</td>
                        <td>${row.reputation_change}</td>
                        <td><a href="/q/${row.post_id}">${row.post_id}</a></td>
                        <td class="user-deleted"></td>
                        <td class="automatically-reversed"></td>
                        <td class="cm-reversed"></td>
                    </tr>
                    `);

                    tableBody.prepend(htmlRow);

                    if (
                        row.reputation_history_type === 'post_upvoted'
                        || row.reputation_history_type === 'user_deleted'
                        || row.reputation_history_type === 'post_unupvoted'
                        || row.reputation_history_type === 'vote_fraud_reversal'
                    ) {
                        const matchingBuckets = buckets.filter(b =>
                            b.find(c =>
                                (row.creation_date - c.creation_date) < secondsGap

                                && (row.reputation_history_type === 'post_unupvoted')
                                !== (
                                    b.filter(bb => bb.post_id === row.post_id && bb.reputation_history_type === 'post_upvoted').length
                                    === b.filter(bb => bb.post_id === row.post_id && bb.reputation_history_type === 'post_unupvoted').length
                                )
                            )
                        );
                        let matchedBucket: ReputationEventWithRow[];
                        if (matchingBuckets.length > 0) {
                            matchedBucket = matchingBuckets[0];
                        } else {
                            matchedBucket = [];
                            buckets.push(matchedBucket);
                        }
                        matchedBucket.push(row as ReputationEventWithRow);
                    }

                    (row as ReputationEventWithRow).html_row = htmlRow;
                });

                const deletionEvents = sortedData.filter(s => s.reputation_history_type === 'user_deleted');
                const automaticallyReversed = sortedData.filter(s => s.reputation_history_type === 'vote_fraud_reversal');

                const possibleBuckets = buckets.filter(b => b.length > 3);
                possibleBuckets.forEach((bucket, index) => {
                    const bucketColour = getBucketColour(index, possibleBuckets.length);
                    bucket.forEach((item, bucketIndex) => {
                        const htmlRow = (item as ReputationEventWithRow).html_row;
                        if (htmlRow) {
                            if (bucketIndex === bucket.length - 1) {
                                if (item.reputation_history_type === 'user_deleted') {
                                    if (votesDataPromise) {
                                        votesDataPromise.then(votesData => {
                                            const userInfo = $('.voters.sorter:eq(2)', votesData).find('[title="2018-08-13 01:35:35Z"]').closest('tr').find('.user-info');
                                            const gravatar = userInfo.find('.gravatar-wrapper-32');
                                            const userLink = userInfo.find('.user-details > a');
                                            const row = $(`
                                            <tr class="detailed_reputation_table_header">
                                                <td colspan="7">
                                                    Group ${String.fromCharCode(65 + (possibleBuckets.length - index - 1))}
                                                    (${bucket.length} events, ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation)
                                                </td>
                                            </tr>
                                            `);
                                            const cell = row.find('td');
                                            cell.append(gravatar.css('display', 'inline-block'));
                                            cell.append(userLink);
                                            row.insertBefore(htmlRow);
                                        });
                                    }
                                } else {
                                    $(`
                                    <tr class="detailed_reputation_table_header">
                                        <td colspan="7">
                                            Group ${String.fromCharCode(65 + (possibleBuckets.length - index - 1))}
                                            (${bucket.length - bucket.filter(f => f.reputation_history_type === 'post_unupvoted').length} events (${bucket.length} total), ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation)
                                            (${bucket.reduce((p, c) => p + (deletionEvents.find(i => i.post_id === c.post_id) == null ? 0 : 1), 0)} UD)
                                            (${bucket.reduce((p, c) => p + (automaticallyReversed.find(i => i.post_id === c.post_id) == null ? 0 : 1), 0)} AR)
                                        </td>
                                    </tr>
                                    `).insertBefore(htmlRow);
                                }
                            }

                            htmlRow.css('background-color', bucketColour);

                            if (deletionEvents.find(i => i.post_id === item.post_id)) {
                                htmlRow.find('.user-deleted').text('UD');
                            }
                            if (automaticallyReversed.find(i => i.post_id === item.post_id)) {
                                htmlRow.find('.user-deleted').text('AR');
                            }
                        }
                    });
                });

                console.log(buckets);
                repPageContainer.append(newTable);
            });
        }
    });
});
