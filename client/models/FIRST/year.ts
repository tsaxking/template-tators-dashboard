import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba';
import { TBA } from '../../utilities/tba';
import { EventEmitter } from '../../../shared/event-emitter';
import { Cache } from '../cache';
import { attemptAsync, Result } from '../../../shared/check';
import { FIRSTEvent } from './event';

/**
 * Events that are emitted by a {@link FIRSTYear} object
 * @date 10/9/2023 - 6:59:51 PM
 *
 * @typedef {YearUpdateData}
 */
type YearUpdateData = {
    'update-events': TBAEvent[];
};

type Updates = {
    select: FIRSTYear;
    'update-events': TBAEvent[];
};

/**
 * Represents a FIRST year
 * @date 10/9/2023 - 6:59:51 PM
 *
 * @export
 * @class FIRSTYear
 * @typedef {FIRSTYear}
 * @implements {FIRST}
 */
export class FIRSTYear extends Cache<YearUpdateData> {
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = FIRSTYear.emitter.on.bind(FIRSTYear.emitter);
    public static off = FIRSTYear.emitter.off.bind(FIRSTYear.emitter);
    public static emit = FIRSTYear.emitter.emit.bind(FIRSTYear.emitter);
    public static once = FIRSTYear.emitter.once.bind(FIRSTYear.emitter);

    /**
     * The currently selected year
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @static
     * @type {FIRSTYear}
     */
    public static current?: FIRSTYear = undefined;

    public static select(year: number): FIRSTYear | undefined {
        const y = FIRSTYear.cache.get(year);
        if (y) y.select();
        else console.error('No year found:', year);
        return y;
    }

    /**
     * Cache for all {@link FIRSTYear} objects
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<number, FIRSTYear>}
     */
    public static readonly cache: Map<number, FIRSTYear> = new Map<
        number,
        FIRSTYear
    >();

    /**
     * Creates an instance of FIRSTYear.
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @constructor
     * @param {number} year
     */
    constructor(public readonly year: number) {
        super();
        if (year < 2007 || year > new Date().getFullYear()) {
            throw new Error(`Invalid year ${year}`);
        }

        if (!FIRSTYear.cache.has(year)) {
            FIRSTYear.cache.set(year, this);
        }
    }

    /**
     * Retrieves all events for team tators this year
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @async
     * @returns {Promise<TBAEvent[]>}
     */
    async getEvents(): Promise<Result<TBAEvent[]>> {
        return attemptAsync(async () => {
            // if (this.cache.has('events')) {
            //     return this.cache.get('events') as TBAEvent[];
            // }
            const res = await TBA.get<TBAEvent[]>(
                `/team/frc2122/events/${this.year}`
            );

            if (res.isOk()) {
                const today = new Date();

                // sort by closest event to today
                const events = res.value.data.sort((a, b) => {
                    const aDate = new Date(a.start_date);
                    const bDate = new Date(b.start_date);

                    const aDelta = Math.abs(today.getTime() - aDate.getTime());
                    const bDelta = Math.abs(today.getTime() - bDate.getTime());

                    return aDelta - bDelta;
                });

                res.value.onUpdate(
                    data => {
                        this.cache.set('events', data);
                        this.emit('update-events', data);
                    },
                    1000 * 60 * 60 * 24 * 7
                ); // 1 week

                return events;
            }

            throw res.error;
        });
    }

    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @public
     */
    public destroy() {
        FIRSTYear.cache.delete(this.year);
        super.destroy();
    }

    public select(): void {
        FIRSTYear.current = this;
        FIRSTYear.emit('select', this);
    }
}

Object.assign(window, { FIRSTYear });
