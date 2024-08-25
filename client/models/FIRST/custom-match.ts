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
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = CustomMatch.emitter.on.bind(CustomMatch.emitter);
    public static off = CustomMatch.emitter.off.bind(CustomMatch.emitter);
    public static emit = CustomMatch.emitter.emit.bind(CustomMatch.emitter);
    public static once = CustomMatch.emitter.once.bind(CustomMatch.emitter);

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
                FIRSTEvent.current.getTeam(this.data.blue3)
            ])
                .then(teams => {
                    if (teams.some(t => !t)) return rej('Invalid team');
                    res(
                        teams as [
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam,
                            FIRSTTeam
                        ]
                    );
                })
                .catch(rej);
        });
    }
}
