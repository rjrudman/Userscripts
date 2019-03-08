import { ReputationEvent } from 'Types/ReputationEvent';

const APP_KEY = 'ESZ7eo2s9qErse9jq5qFxg((';

let page = 0;
let data: ReputationData | null = null;

export interface ReputationData {
    items: ReputationEvent[];
    hasMore: boolean;
}

export async function GetCurrentReputationPage(userId: number): Promise<ReputationData> {
    const prom = new Promise<ReputationData>((resolve, reject) => {
        if (!data) {
            GetNextReputationPage(userId)
                .then(_ => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject();
                    }
                });
        } else {
            resolve(data);
        }
    });

    return prom;
}

export function GetNextReputationPage(userId: number) {
    page++;
    const siteName = location.hostname.replace('.com', '');
    const reputationEndpoint = `https://api.stackexchange.com/2.2/users/${userId}/reputation-history?key=${APP_KEY}&pagesize=100&page=${page}&site=${siteName}`;
    const getQuestionEndpoint = (questionIds: number[]) => {
        const questionIdStr = questionIds.filter(q => !!q).join(';');
        return `https://api.stackexchange.com/2.2/posts/${questionIdStr}?key=${APP_KEY}&pagesize=100&site=${siteName}&filter=!)qFc_2zhzdy0KDoW*IEu`;
    };

    return fetch(reputationEndpoint)
        .then(r => r.json())
        .then(r => {
            const items = r.items as ReputationEvent[];
            const questionIds = items.map(i => i.post_id);
            const questionEndpoint = getQuestionEndpoint(questionIds);
            return fetch(questionEndpoint)
                .then(q => q.json())
                .then(questionResult => {
                    const qLookup: any = {};
                    for (const question of questionResult.items) {
                        qLookup[question.post_id + ''] = question.title;
                    }
                    for (const item of items) {
                        item.title = qLookup[item.post_id + ''];
                    }

                    if (data) {
                        data = {
                            items: data.items.concat(items),
                            hasMore: r.has_more
                        };
                    } else {
                        data = {
                            items,
                            hasMore: r.has_more
                        };
                    }
                });
        });
}
