import { attemptAsync } from '../../../shared/check';
import { EventEmitter } from '../../../shared/event-emitter';
import { ServerRequest } from '../../utilities/requests';
import {
    Achievement,
    Phase,
    ShadowAchievement
} from '../../../shared/potato-types';
import { Potato as P } from '../../../server/utilities/tables';
import { Cache } from '../cache';

type PotatoEvents = {
    achievement: Achievement;
    'shadow-achievement': ShadowAchievement;
    saved: void;
    init: Potato;
};

type P_extended = P & {
    username: string;
};

export class Potato extends Cache<PotatoEvents> {
    public static readonly phases: Phase[] = [
        'sprout',
        'plant',
        'flower',
        'mature',
        'sentient',
        'intelligent',
        'transcendental',
        'omnipotent',
        'omnipresent',
        'god'
    ];

    public static readonly cache = new Map<string, Potato>();

    public static getSelf() {
        return attemptAsync(async () => {
            const p = (
                await ServerRequest.post<P_extended>('/api/potato/init')
            ).unwrap();
            return Potato.retrieve(p);
        });
    }

    public static getLeaderboard() {
        return attemptAsync(async () => {
            return (
                await ServerRequest.post<P_extended[]>(
                    '/api/potato/leaderboard'
                )
            )
                .unwrap()
                .map(Potato.retrieve);
        });
    }

    private static retrieve(data: P_extended): Potato {
        const exists = Potato.cache.get(data.accountId);
        if (exists) return exists;
        else return new Potato(data);
    }

    public readonly accountId: string;
    public lastAccessed: number;
    public achievements: string;
    public shadowAchievements: string;
    public potatoChips: number;
    public username: string;
    public name: string;

    constructor(data: P_extended) {
        super();
        this.accountId = data.accountId;
        this.lastAccessed = data.lastAccessed;
        this.achievements = data.achievements;
        this.shadowAchievements = data.shadowAchievements;
        this.potatoChips = data.potatoChips;
        this.username = data.username;
        this.name = data.name;

        Potato.cache.set(this.accountId, this);
    }

    get phaseIndex() {
        // each 1000 chips is a phase
        return Math.floor(this.potatoChips / 1000);
    }

    get phase() {
        return Potato.phases[this.phaseIndex];
    }

    get nextPhase() {
        return Potato.phases[this.phaseIndex + 1];
    }

    get nextPhaseChips() {
        return (this.phaseIndex + 1) * 1000;
    }

    update(data: Partial<P>) {
        if (data.accountId) throw new Error('Cannot update accountId');
        return ServerRequest.post('/api/potato/update', data);
    }

    give(chips: number) {
        return this.update({ potatoChips: this.potatoChips + chips });
    }

    award(achievement: Achievement) {
        return this.update({
            achievements: JSON.stringify([...this.achievements, achievement])
        });
    }

    shadow(achievement: ShadowAchievement) {
        return this.update({
            shadowAchievements: JSON.stringify([
                ...this.shadowAchievements,
                achievement
            ])
        });
    }

    changeName(name: string) {
        return ServerRequest.post('/api/potato/change-name', {name});
    }
}
