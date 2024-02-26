import { CustomMatch as CustomMatchObj } from '../../../shared/db-types-extended';
import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { FIRSTTeam } from './team';
import { FIRSTEvent } from './event';

type CustomMatchEventData = {
    update: CustomMatch;
};

type Updates = {
    select: CustomMatch;
};

export class CustomMatch extends Cache<CustomMatchEventData> {
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void,
    ): void {
        CustomMatch.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: any) => void,
    ): void {
        CustomMatch.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: any): void {
        CustomMatch.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void,
    ): void {
        CustomMatch.$emitter.once(event, callback);
    }

    public static current?: CustomMatch = undefined;
    /**
     * Map of all FIRSTMatch objects
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTMatch>}
     */
    public static readonly cache: Map<string, CustomMatch> = new Map<
        string,
        CustomMatch
    >();

    constructor(public readonly data: CustomMatchObj) {
        super();
        if (!CustomMatch.cache.has(data.id)) {
            CustomMatch.cache.get(data.id)?.destroy();
        }
        CustomMatch.cache.set(data.id, this);
    }

    async getTeams(): Promise<
        [FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam]
    > {
        return new Promise((res, rej) => {
            if (!FIRSTEvent.current) return rej('No current event');

            Promise.all([
                FIRSTEvent.current.getTeam(this.data.red1),
                FIRSTEvent.current.getTeam(this.data.red2),
                FIRSTEvent.current.getTeam(this.data.red3),
                FIRSTEvent.current.getTeam(this.data.blue1),
                FIRSTEvent.current.getTeam(this.data.blue2),
                FIRSTEvent.current.getTeam(this.data.blue3),
            ])
                .then((teams) => {
                    if (teams.some((t) => !t)) return rej('Invalid team');
                    res(
                        teams as [
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                        ],
                    );
                })
                .catch(rej);
        });
    }
}
