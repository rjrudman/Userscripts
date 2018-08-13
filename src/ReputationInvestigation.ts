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

                const numSecondsInput = $('<input type="number" value="45" />');
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

                const deletionTypes = ['user_deleted', 'vote_fraud_reversal'];
                const deletionEvents = data.items.filter(s => s.reputation_history_type === 'user_deleted');
                const automaticallyReversed = data.items.filter(s => {
                    const date = moment.unix(s.creation_date).utc();
                    if (s.reputation_history_type === 'vote_fraud_reversal') {
                        if (date.minute() === 0 && date.hour() === 3) {
                            return true;
                        }
                    }
                    return false;
                });
                const manuallyReversed = data.items.filter(s => {
                    const date = moment.unix(s.creation_date).utc();
                    if (s.reputation_history_type === 'vote_fraud_reversal') {
                        if (date.minute() !== 0 || date.hour() !== 3) {
                            return true;
                        }
                    }
                    return false;
                });

                if (deletionEvents.length && votesDataPromise == null) {
                    const votesPage = `/admin/show-user-votes/${userId}`;
                    votesDataPromise = fetch(votesPage).then(r => r.text());
                }

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
                        <td class="post-col"><a href="/q/${row.post_id}">${row.post_id}</a><a class="post-matcher" href="javascript:void(0);">📌</a></td>
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

                        if (typedRow.firstInBucket) {
                            if (deletionTypes.indexOf(typedRow.reputation_history_type) >= 0) {
                                const bucketHeader = $(`
                                <tr class="detailed_reputation_table_header">
                                    <td colspan="7">
                                        Group ${String.fromCharCode(65 + bucketIndex)}
                                        (${bucket.length} events, ${bucket.reduce((p, c) => p + c.reputation_change, 0)} reputation)
                                    </td>
                                </tr>
                                `);
                                bucketHeader.css('background-color', bucketColour);
                                tableBody.append(bucketHeader);

                                if (votesDataPromise) {
                                    votesDataPromise.then(votesData => {
                                        const userInfo = $('.voters.sorter:eq(2)', votesData).find('[title="2018-08-13 01:35:35Z"]').closest('tr').find('.user-info');
                                        const gravatar = userInfo.find('.gravatar-wrapper-32');
                                        const userLink = userInfo.find('.user-details > a');
                                        const cell = bucketHeader.find('td');
                                        cell.append(gravatar.css('display', 'inline-block'));
                                        cell.append(userLink);
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
                                    (${bucket.reduce((p, c) => p + (deletionEvents.find(i => i.post_id === c.post_id) == null ? 0 : 1), 0)} UD)
                                    (${bucket.reduce((p, c) => p + (automaticallyReversed.find(i => i.post_id === c.post_id && (i.creation_date - typedRow.creation_date <= 60 * 60 * 24)) == null ? 0 : 1), 0)} AR)
                                    (${bucket.reduce((p, c) => p + (manuallyReversed.find(i => i.post_id === c.post_id) == null ? 0 : 1), 0)} MR)
                                </td>
                            </tr>
                            `);
                                bucketHeader.css('background-color', bucketColour);
                                tableBody.append(bucketHeader);
                            }
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
                        if (manuallyReversed.find(i => i.post_id === typedRow.post_id)) {
                            htmlRow.find('.user-deleted').text('MR');
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
