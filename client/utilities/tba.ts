import { ServerRequest } from './requests';
import { TBAEvent } from '../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTEvent } from '../models/FIRST/event';
import { attemptAsync, Result } from '../../shared/check';

/**
 * Description placeholder
 * @date 1/11/2024 - 3:11:24 AM
 *
 * @export
 * @typedef {TBAResponse}
 * @template T
 */
export type TBAResponse<T> = {
    data: T;
    time: number;
    onUpdate: (callback: (data: T) => void, interval?: number) => void;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:11:24 AM
 *
 * @export
 * @class TBA
 * @typedef {TBA}
 */
export class TBA {
    /**
     * Description placeholder
     * @date 1/11/2024 - 3:11:24 AM
     *
     * @static
     * @async
     * @returns {Promise<string>}
     */
    static async getAPIKey(): Promise<Result<string>> {
        return attemptAsync(async () => {
            let item = localStorage.getItem('tba-api-key');
            if (item) return item;
            const res = await ServerRequest.post<string>('/api/tba/api-key');
            if (res.isOk()) item = res.value;
            else throw res.error;
            if (!item) throw new Error('No API key found');
            localStorage.setItem('tba-api-key', item);
            return item;
        });
    }

    /**
     * Retrieves data from The Blue Alliance API.
     * @param path
     * @param options
     * @returns
     */
    static get<T = unknown>(
        path: string,
        cached = true
    ): Promise<Result<TBAResponse<T>>> {
        return attemptAsync(async () => {
            const start = Date.now();
            let data: T | null = null;
            // if (cached) {
            //     data = TBA.retrieveCache<T>(path);
            // }

            const fetcher = async (): Promise<T | null> => {
                return fetch('https://www.thebluealliance.com/api/v3' + path, {
                    headers: {
                        'X-TBA-Auth-Key':
                            'AhMI5PBuPWNgK2X1RI66OmhclOMy31VJkwwxKhlgMHSaX30hKPub2ZdMFHmUq2kQ'
                    },
                    method: 'GET',
                    mode: 'cors'
                }).then(data => data.json()) as Promise<T>;

                // const d = await ServerRequest.get<T>(`/api/tba${path}`);

                // if (d.isErr()) return null;
                // return d.value;

                // const res = await ServerRequest.get<T>(`/api/tba${path}`);
                // if (res.isOk()) return res.value;
                // else throw res.error;
            };

            if (!data) data = await fetcher();
            if (!data) throw new Error('No data found');

            type Callback = (data: T) => void;

            class IntervalEmitter {
                interval: NodeJS.Timer;
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
                    interval: number = 1000 * 60 * 10
                ) => {
                    if (!intervals[interval]) {
                        intervals[interval] = new IntervalEmitter(interval);
                    }
                    intervals[interval].callbacks.push(callback);
                }
            };

            if (cached) TBA.storeCache(path, data);
            return response;
        });
    }

    /**
     * Description placeholder
     * @date 1/11/2024 - 3:11:24 AM
     *
     * @private
     * @static
     * @template T
     * @param {string} path
     * @param {T} data
     */
    private static storeCache<T>(path: string, data: T) {
        try {
            localStorage.setItem(path, JSON.stringify(data));
        } catch (error) {
            console.log('Cannot store cache:', error);
        }
    }

    /**
     * Description placeholder
     * @date 1/11/2024 - 3:11:23 AM
     *
     * @private
     * @static
     * @template T
     * @param {string} path
     * @returns {(T | null)}
     */
    private static retrieveCache<T>(path: string): T | null {
        const item = localStorage.getItem(path);
        if (!item) return null;
        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.log('Cannot retrieve cache:', error);
            return null;
        }
    }

    /**
     * Description placeholder
     * @date 1/11/2024 - 3:11:23 AM
     *
     * @static
     * @async
     * @param {string} eventKey
     * @param {boolean} [simple=false]
     * @returns {Promise<TBAResponse<FIRSTEvent>>}
     */
    // static async getEvent(
    //     eventKey: string,
    //     simple = false
    // ): Promise<Result<TBAResponse<FIRSTEvent>>> {
    //     return attemptAsync(async () => {
    //         const res = await TBA.get<TBAEvent>(
    //             `/event/${eventKey}${simple ? '/simple' : ''}`
    //         );

    //         if (res.isOk()) {
    //             return {
    //                 data: new FIRSTEvent(res.value.data),
    //                 time: res.value.time,
    //                 onUpdate: res.value.onUpdate.bind(res)
    //             };
    //         }

    //         throw res.error;
    //     });
    // }
}
