import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';

type PitScoutingEvents = {
    update: PitScouting;
};

type Updates = {
    select: PitScouting;
};

export class PitScouting extends Cache<PitScoutingEvents> {
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = PitScouting.emitter.on.bind(PitScouting.emitter);
    public static off = PitScouting.emitter.off.bind(PitScouting.emitter);
    public static emit = PitScouting.emitter.emit.bind(PitScouting.emitter);
    public static once = PitScouting.emitter.once.bind(PitScouting.emitter);

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
