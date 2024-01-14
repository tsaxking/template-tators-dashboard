import { ServerRequest } from './requests';
import { TBAEvent } from '../../shared/tba';
import { FIRSTEvent } from '../models/FIRST/event';

export type TBAResponse<T> = {
    data: T;
    time: number;
    onUpdate: (callback: (data: T) => void, interval?: number) => void;
};

export class TBA {
    static async getAPIKey(): Promise<string> {
        let item = localStorage.getItem('tba-api-key');
        if (item) return item;
        item = await ServerRequest.post<string>('/api/tba/api-key');
        if (!item) throw new Error('No API key found');
        localStorage.setItem('tba-api-key', item);
        return item;
    }

    /**
     * Retrieves data from The Blue Alliance API.
     * @param path
     * @param options
     * @returns
     */
    static get<T = any>(
        path: string,
        cached = true,
    ): Promise<TBAResponse<T>> {
        return new Promise(async (res, rej) => {
            const start = Date.now();
            let data: T | null = null;
            if (cached) {
                data = TBA.retrieveCache<T>(path);
            }

            const fetcher = async (): Promise<T | null> => {
                return fetch('https://www.thebluealliance.com/api/v3' + path, {
                    headers: {
                        'X-TBA-Auth-Key':
                            'AhMI5PBuPWNgK2X1RI66OmhclOMy31VJkwwxKhlgMHSaX30hKPub2ZdMFHmUq2kQ',
                    },
                    method: 'GET',
                }).then((data) => data.json())
                    .catch(rej);
            };

            if (!data) data = await fetcher();
            if (!data) return rej('No data found');

            type Callback = (data: T) => void;

            class IntervalEmitter {
                interval: NodeJS.Timeout;
                callbacks: Callback[] = [];

                constructor(private readonly time: number) {
                    this.interval = setInterval(async () => {
                        const newData = await fetcher();
                        if (!newData) return;
                        if (JSON.stringify(newData) === JSON.stringify(data)) {
                            return;
                        }
                        data = newData;
                        for (const callback of this.callbacks) {
                            callback(newData);
                        }
                        if (cached) TBA.storeCache(path, newData);
                    }, this.time);
                }
            }

            const intervals: {
                [key: number]: IntervalEmitter;
            } = {};

            const response = {
                data,
                time: Date.now() - start,
                onUpdate: (
                    callback: (data: T) => void,
                    interval: number = 1000 * 60 * 10,
                ) => {
                    if (!intervals[interval]) {
                        intervals[interval] = new IntervalEmitter(interval);
                    }
                    intervals[interval].callbacks.push(callback);
                },
            };

            if (cached) TBA.storeCache(path, data);
            res(response);
        });
    }

    private static storeCache<T>(path: string, data: T) {
        try {
            localStorage.setItem(path, JSON.stringify(data));
        } catch (error) {
            console.log('Cannot store cache:', error);
        }
    }

    private static retrieveCache<T>(path: string): T | null {
        const item = localStorage.getItem(path);
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch (error) {
            console.log('Cannot retrieve cache:', error);
            return null;
        }
    }

    static async getEvent(
        eventKey: string,
        simple = false,
    ): Promise<TBAResponse<FIRSTEvent>> {
        const res = await TBA.get<TBAEvent>(
            `/event/${eventKey}${simple ? '/simple' : ''}`,
        );

        return {
            data: new FIRSTEvent(res.data),
            time: res.time,
            onUpdate: res.onUpdate.bind(res),
        };
    }
}
