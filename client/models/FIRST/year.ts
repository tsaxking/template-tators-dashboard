import { TBAEvent } from "../../../shared/tba";
import { TBA } from "../../utilities/tba";
import { EventEmitter } from "../../../shared/event-emitter";
import { Cache } from "../cache";


/**
 * Events that are emitted by a {@link FIRSTYear} object
 * @date 10/9/2023 - 6:59:51 PM
 *
 * @typedef {YearUpdateData}
 */
type YearUpdateData = {
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
    public static readonly cache: Map<number, FIRSTYear> = new Map<number, FIRSTYear>();

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
    async getEvents(): Promise<TBAEvent[]> {
        if (this.$cache.has('events')) return this.$cache.get('events') as TBAEvent[];
        const res = await TBA.get<TBAEvent[]>(`/team/frc2122/events/${this.year}`);
        this.$cache.set('events', res.data);

        res.onUpdate((data) => {
            this.$cache.set('events', data);
            this.$emitter.emit('update-events', data);
        }, 1000 * 60 * 60 * 24 * 7); // 1 week

        return res.data;
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
};