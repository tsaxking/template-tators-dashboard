import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { FIRSTTeam } from './team';
import { attemptAsync, resolveAll, Result } from '../../../shared/check';
import { Alliance, FIRSTAlliance } from './alliance';
import { CustomMatches as CM_Obj } from '../../../server/utilities/tables';
import { ServerRequest } from '../../utilities/requests';
import { MatchInterface } from './interfaces/match';
import { Whiteboard } from '../whiteboard/whiteboard';
import { Strategy } from './strategy';

type CustomMatchEventData = {
    update: CustomMatch;
};

type Updates = {
    select: CustomMatch;
};

export class CustomMatch
    extends Cache<CustomMatchEventData>
    implements MatchInterface
{
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        CustomMatch.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: any) => void
    ): void {
        CustomMatch.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: any): void {
        CustomMatch.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        CustomMatch.$emitter.once(event, callback);
    }

    public static new(data: Omit<CM_Obj, 'id' | 'archive' | 'created'>) {
        return ServerRequest.post('/api/custom-matcesh/new', data);
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const cm = (
                await ServerRequest.post<CM_Obj>(
                    '/api/custom-matches/from-id',
                    { id }
                )
            ).unwrap();
            return CustomMatch.retrieve(cm);
        });
    }

    public static retrieve(data: CM_Obj) {
        if (CustomMatch.cache.has(data.id))
            return CustomMatch.cache.get(data.id) as CustomMatch;
        return new CustomMatch(data);
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

    public readonly id: string;
    public readonly eventKey: string;
    public readonly matchNumber: number;
    public readonly compLevel: string;
    public red1: number;
    public red2: number;
    public red3: number;
    public red4: number | undefined;
    public blue1: number;
    public blue2: number;
    public blue3: number;
    public blue4: number | undefined;
    public readonly created: number;
    public name: string;
    public archive: 0 | 1;

    constructor(data: CM_Obj) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;
        this.red1 = data.red1;
        this.red2 = data.red2;
        this.red3 = data.red3;
        this.red4 = data.red4;
        this.blue1 = data.blue1;
        this.blue2 = data.blue2;
        this.blue3 = data.blue3;
        this.blue4 = data.blue4;
        this.created = data.created;
        this.name = data.name;
        this.archive = data.archive;

        if (!CustomMatch.cache.has(data.id)) {
            CustomMatch.cache.get(data.id)?.destroy();
        }
        CustomMatch.cache.set(data.id, this);
    }

    getTeams() {
        return attemptAsync(async () => {
            return resolveAll(
                await Promise.all(
                    [
                        this.red1,
                        this.red2,
                        this.red3,
                        this.red4, // can be null
                        this.blue1,
                        this.blue2,
                        this.blue3,
                        this.blue4 // can be null
                    ].map(t => {
                        return attemptAsync(async () => {
                            if (!t) return null; // 0, undefined, etc.
                            // team can be 0 if it's a practice match
                            return (
                                await FIRSTTeam.from(t, this.eventKey)
                            ).unwrap();
                        });
                    })
                )
            ).unwrap() as [...Alliance, ...Alliance];
        });
    }

    update(data: Partial<Omit<CM_Obj, 'id' | 'created'>>) {
        return ServerRequest.post('/api/custom-matches/update', {
            ...this,
            ...data
        });
    }

    getAlliances() {
        return attemptAsync(async () => {
            const teams = (await this.getTeams()).unwrap();
            return {
                red: new FIRSTAlliance(teams.slice(0, 3) as Alliance),
                blue: new FIRSTAlliance(teams.slice(4, 7) as Alliance)
            };
        });
    }

    getStrategies() {
        return Strategy.fromMatch(
            this.eventKey,
            this.matchNumber,
            this.compLevel
        );
    }

    hasTeam(number: number): boolean {
        return [
            this.red1,
            this.red2,
            this.red3,
            this.red4,
            this.blue1,
            this.blue2,
            this.blue3,
            this.blue4
        ].includes(number);
    }
}
