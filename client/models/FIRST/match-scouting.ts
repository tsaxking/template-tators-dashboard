import { Cache, Updates } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { MatchScouting as MatchScoutingObj } from '../../../shared/db-types-extended';

export class MatchScouting extends Cache<{}> {
    private static readonly $emitter: EventEmitter<Updates> = new EventEmitter<
        Updates
    >();

    public static on<K extends Updates>(
        event: K,
        callback: (data: any) => void,
    ): void {
        MatchScouting.$emitter.on(event, callback);
    }

    public static off<K extends Updates>(
        event: K,
        callback?: (data: any) => void,
    ): void {
        MatchScouting.$emitter.off(event, callback);
    }

    public static emit<K extends Updates>(event: K, data: any): void {
        MatchScouting.$emitter.emit(event, data);
    }
    /**
     * Cache for all {@link MatchScouting} objects
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, MatchScouting>}
     */
    public static readonly cache: Map<string, MatchScouting> = new Map<
        string,
        MatchScouting
    >();

    constructor(public readonly data: MatchScoutingObj) {
        super();
    }
}
