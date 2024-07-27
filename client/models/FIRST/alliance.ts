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
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        FIRSTAlliance.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: any) => void
    ): void {
        FIRSTAlliance.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: any): void {
        FIRSTAlliance.$emitter.emit(event, data);
    }

    constructor(public readonly teams: Alliance) {
        super();
    }
}
