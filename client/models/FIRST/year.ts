import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba';
import { TBA } from '../../utilities/tba';
import { EventEmitter } from '../../../shared/event-emitter';
import { Cache } from '../cache';
import { attemptAsync, Result } from '../../../shared/attempt';

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
    'select': FIRSTYear;
    'update-events': TBAEvent[];
}

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
    private static readonly $emitter = new EventEmitter<
        keyof Updates
    >();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        FIRSTYear.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        FIRSTYear.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: Updates[K]): void {
        FIRSTYear.$emitter.emit(event, data);
    }

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
            if (this.$cache.has('events')) {
                return this.$cache.get('events') as TBAEvent[];
            }
            const res = await TBA.get<TBAEvent[]>(
                `/team/frc2122/events/${this.year}`,
            );
    
            if (res.isOk()) {
                this.$cache.set('events', res.value.data);
    
                res.value.onUpdate(
                    (data) => {
                        this.$cache.set('events', data);
                        this.$emitter.emit('update-events', data);
                    },
                    1000 * 60 * 60 * 24 * 7,
                ); // 1 week
        
                return res.value.data;
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
