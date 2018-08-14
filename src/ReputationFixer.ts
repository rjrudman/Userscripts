import { ReputationEvent } from 'ReptuationApiResponse';

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
                .then(d => {
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
    const endPoint = `https://api.stackexchange.com/2.2/users/${userId}/reputation-history?pagesize=100&page=${page}&site=stackoverflow`;

    return fetch(endPoint)
        .then(r => r.json())
        .then(r => {
            if (data) {
                data = {
                    items: data.items.concat(r.items),
                    hasMore: r.has_more
                };
            } else {
                data = {
                    items: r.items,
                    hasMore: r.has_more
                };
            }
        });
}
