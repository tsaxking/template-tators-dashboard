import { Cache, Updates } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';

type PitScoutingEvents = {
    update: PitScouting;
};

export class PitScouting extends Cache<PitScoutingEvents> {
    private static readonly $emitter: EventEmitter<Updates> = new EventEmitter<
        Updates
    >();

    public static on<K extends Updates>(
        event: K,
        callback: (data: any) => void,
    ): void {
        PitScouting.$emitter.on(event, callback);
    }

    public static off<K extends Updates>(
        event: K,
        callback?: (data: any) => void,
    ): void {
        PitScouting.$emitter.off(event, callback);
    }

    public static emit<K extends Updates>(event: K, data: any): void {
        PitScouting.$emitter.emit(event, data);
    }
    /**
     * Cache for all {@link FIRSTYear} objects
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTYear>}
     */
    public static readonly cache: Map<string, PitScouting> = new Map<
        string,
        PitScouting
    >();

    constructor() {
        super();
    }
}
