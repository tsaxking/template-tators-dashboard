import { attemptAsync } from "../../../shared/check";
import { EventEmitter } from "../../../shared/event-emitter";
import { ServerRequest } from "../../utilities/requests";
import { socket } from "../../utilities/socket";
import { State, Phase, Achievement, ShadowAchievement } from '../../../shared/potato-types';


type SaveResult = 'saved' | 'not allowed';

type GameEvents = {
    'init': State;
    'achievement': Achievement;
    'shadow-achievement': ShadowAchievement;
    'saved': void;
}

class Game {
    public readonly emitter = new EventEmitter<keyof GameEvents>();

    on<K extends keyof GameEvents>(event: K, fn: (data: GameEvents[K]) => void) {
        this.emitter.on(event, fn);
    }

    off<K extends keyof GameEvents>(event: K, fn: (data: GameEvents[K]) => void) {
        this.emitter.off(event, fn);
    }

    emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]) {
        this.emitter.emit(event, data);
    }


    state: State = {
        level: 0,
        achievements: {
            shadow: [],
            normal: []
        }
    }

    async init() {
        return attemptAsync(async () => {
            this.state = (await ServerRequest.post<State>('/api/potato/init')).unwrap();
        });
    }

    get phaseIndex(): number {
        const { floor, log10 } = Math;
        const { level } = this.state;

        return floor(log10(level)) - 1;
    }

    get rate(): number {
        const { shadow, normal } = this.state.achievements;
        const { phaseIndex } = this;
        return shadow.length * -0.01 + normal.length * 0.01 + phaseIndex;
    }

    get phase(): Phase {
        const phases: Phase[] = [
            'seed',
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
        return phases[
            this.phaseIndex
        ];
    }

    public win(a: Achievement) {
        this.emit('achievement', a);
    }

    public winShadow(a: ShadowAchievement) {
        this.emit('shadow-achievement', a);
    }

    public gain(levels: number) {
        return attemptAsync(async () => {
            return (await this.saveState(
                {
                    ...this.state,
                    level: this.state.level + levels
                }
            )).unwrap();
        });
    }

    private saveState(state: State) {
        return attemptAsync(async () => {
            const saved = (await ServerRequest.post<SaveResult>('/api/potato/save', state)).unwrap();
            if (saved === 'not allowed'){
                this.winShadow('hacker');
            }

            if (saved === 'saved') {
                this.emit('saved', undefined);
            }
        });
    }

    save() {
        this.saveState(this.state);
    }

    changeState(state: State) {
        const current = this.state;
        const newAchievements = state.achievements.normal.filter((a) => current.achievements.normal.includes(a));
        const shadowAchievements = state.achievements.shadow.filter((a) => current.achievements.shadow.includes(a));

        for (const a of newAchievements) this.win(a);
        for (const s of shadowAchievements) this.winShadow(s);

        this.state = state;
    }

    getRanking() {
        return attemptAsync(async () => {
            // returns the list of potato friends sorted by level
        });
    }
}

export const game = new Game();
game.init();

socket.on('game:update', (data: State) => {
    game.changeState(data);
});

document.addEventListener('close', () => {
    game.save();
});