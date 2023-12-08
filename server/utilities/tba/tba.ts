import { DB } from "../databases.ts";
import env from "../env.ts";
import { error } from "../terminal-logging.ts";
// import { TBAEvent } from "../../../shared/tba.ts";
// import { TBA_Event } from './event.ts';

const { TBA_KEY } = env;

type TBAOptions = {
    cached?: boolean; // default: true
}

export class TBA {
    public static readonly baseURL = 'https://www.thebluealliance.com/api/v3';

    public static async get<T>(path: string, options?: TBAOptions): Promise<T | null> {
        if (!TBA_KEY) throw new Error('TBA_KEY not found in environment variables! Cannot make request to TBA API!');

        if (options?.cached) {
            const cached = DB.get('tba/from-url', {
                url: path
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
                    'Accept': 'application/json'
                }
            });
    
            const json = await res.json();
    
            // cache response, this will also update the cache if it already exists (using ON CONFLICT sql)
            DB.run('tba/new', {
                url: path,
                response: JSON.stringify(json),
                updated: Date.now(),
                update: options?.cached ? 1 : 0
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
};