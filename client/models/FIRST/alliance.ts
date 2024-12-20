import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { FIRSTTeam } from './team';

type FIRSTAllianceEventData = {
    '': '';
};

type Updates = {
    select: FIRSTAlliance;
};

export type Alliance = [FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam | null];

export class FIRSTAlliance extends Cache<FIRSTAllianceEventData> {
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = FIRSTAlliance.emitter.on.bind(FIRSTAlliance.emitter);
    public static off = FIRSTAlliance.emitter.off.bind(FIRSTAlliance.emitter);
    public static emit = FIRSTAlliance.emitter.emit.bind(FIRSTAlliance.emitter);
    public static once = FIRSTAlliance.emitter.once.bind(FIRSTAlliance.emitter);

    constructor(public readonly teams: Alliance) {
        super();
    }

    hasTeam(team: number) {
        return this.teams.some(t => t?.number === team);
    }
}
