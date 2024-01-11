import { TBAEvent } from '../../../shared/tba.ts';
import { DB } from '../databases.ts';
import env from '../env.ts';
import { error, log } from '../terminal-logging.ts';
import { saveEvent } from '../../../scripts/tba-update.ts';
// import { TBAEvent } from "../../../shared/tba.ts";
// import { TBA_Event } from './event.ts';

/**
 * Imported from .env
 * @date 1/10/2024 - 9:34:20 PM
 *
 * @type {*}
 */
const { TBA_KEY } = env;

/**
 * Type definition for TBAOptions
 * @date 1/10/2024 - 9:34:20 PM
 *
 * @typedef {TBAOptions}
 */
type TBAOptions = {
    cached?: boolean; // default: true
};

/**
 * Main class for interacting with the TBA API
 * @date 1/10/2024 - 9:34:20 PM
 *
 * @export
 * @class TBA
 * @typedef {TBA}
 */
export class TBA {
    /**
     * Base URL for TBA API
     * @date 1/10/2024 - 9:34:20 PM
     *
     * @public
     * @static
     * @readonly
     * @type {"https://www.thebluealliance.com/api/v3"}
     */
    public static readonly baseURL = 'https://www.thebluealliance.com/api/v3';

    /**
     * Gets data from the TBA API, using the specified path (e.g. `/team/frc2122/events/2021/simple`)
     * @date 1/10/2024 - 9:34:20 PM
     *
     * @public
     * @static
     * @async
     * @template T
     * @param {string} path
     * @param {?TBAOptions} [options]
     * @returns {Promise<T | null>}
     */
    public static async get<T>(
        path: string,
        options?: TBAOptions,
    ): Promise<T | null> {
        if (!TBA_KEY) {
            throw new Error(
                'TBA_KEY not found in environment variables! Cannot make request to TBA API!',
            );
        }

        if (!path.startsWith('/')) path = '/' + path;

        if (options?.cached) {
            const cached = DB.get('tba/from-url', {
                url: path,
            });

            if (cached) {
                try {
                    return JSON.parse(cached.response) as T;
                } catch (e) {
                    error('Error parsing cached TBA response:', e);
                    return null;
                }
            }
        }

        try {
            const res = await fetch(`${TBA.baseURL}/${path}`, {
                method: 'GET',
                headers: {
                    'X-TBA-Auth-Key': TBA_KEY,
                    'Accept': 'application/json',
                },
            });

            const json = await res.json();

            // cache response, this will also update the cache if it already exists (using ON CONFLICT sql)
            DB.run('tba/new', {
                url: path,
                response: JSON.stringify(json),
                updated: Date.now(),
                update: options?.cached ? 1 : 0,
            });

            return json as T;
        } catch (e) {
            error('Error requesting from TBA:', e);
            return null;
        }
    }

    // static async getEvent(eventKey: string, options?: TBAOptions): Promise<TBA_Event | null> {
    //     const res = await TBA.get<TBAEvent>(`event/${eventKey}`, options);
    //     if (!res) return null;
    //     return new TBA_Event(res);
    // }
}

/**
 * Update interval for TBA
 * @date 1/10/2024 - 9:34:20 PM
 *
 * @type {(number | undefined)}
 */
let interval: number | undefined = undefined;

/**
 * Run the TBA update
 * @date 1/10/2024 - 9:34:20 PM
 */
const update = () => {
    TBA.get<TBAEvent[]>(
        `/team/frc2122/events/${new Date().getFullYear()}/simple`,
    )
        .then((events) => {
            if (!events) return;
            const now = Date.now();

            const [closest] = events.sort((a, b) => {
                const aDate = new Date(a.start_date).getTime();
                const bDate = new Date(b.start_date).getTime();

                return Math.abs(aDate - now) - Math.abs(bDate - now);
            });

            console.log('Closest event:', closest.key);

            if (interval) clearInterval(interval);

            const start = new Date(closest.start_date);
            const end = new Date(closest.end_date);
            const diff = (() => {
                const beforeStart = Math.abs(start.getTime() - now);
                const beforeEnd = Math.abs(end.getTime() - now);
                const afterStart = Math.abs(now - start.getTime());
                const afterEnd = Math.abs(now - end.getTime());

                return Math.min(beforeStart, beforeEnd, afterStart, afterEnd);
            })();

            if (diff < 1000 * 60 * 60 * 24 * 3) {
                // event is within 3 days
                interval = setInterval(() => {
                    saveEvent(closest.key);
                }, 1000 * 60 * 10); // update every 10 minutes during event
            } else {
                // update every day
                saveEvent(closest.key);
            }
        })
        .catch(error);
};

if (Deno.args.includes('--update-interval')) {
    setInterval(update, 1000 * 60 * 60 * 24);
    update();
}
