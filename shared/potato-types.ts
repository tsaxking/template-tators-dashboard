export type State = {
    level: number;
    achievements: {
        shadow: ShadowAchievement[],
        normal: Achievement[]
    };
}
export type Phase = 'seed' 
    | 'sprout'
    | 'plant'
    | 'flower'
    | 'mature'
    | 'sentient'
    | 'intelligent'
    | 'transcendental'
    | 'omnipotent'
    | 'omnipresent'
    | 'god';
export type Achievement = 'tator';
export type ShadowAchievement = 'hacker';

export const TICK_DURATION = 1000 * 60 * 5; // 5 minutes


// rules