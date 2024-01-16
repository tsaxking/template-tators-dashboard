type Task = {
    description: string;
    time: number;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    max?: number;
    condition?: (tick: Tick) => boolean;
};

class Tick {}

class Game {
    static readonly tasks = {
        'Speaker Short': {
            description: 'Shoot into the speaker from the subwoofer',
            time: 2,
            difficulty: 'easy',
            points: 2,
        },
        'Speaker Long': {
            description: 'Shoot into the speaker from the stage',
            time: 2,
            difficulty: 'medium',
            points: 2,
        },
        Amp: {
            description: 'Place the note into the amp',
            time: 3,
            difficulty: 'medium',
            points: 1,
        },
        Climb: {
            description: 'Climb onto the chain',
            time: 3,
            difficulty: 'easy',
            points: 5,
        },
        Trap: {
            description: 'Trap the note in the trap',
            time: 8,
            difficulty: 'hard',
            points: 5,
            max: 3,
        },
    };
}

class Team {
    constructor(
        public readonly name: string,
        public readonly skill: number,
        public readonly tasks: Task[],
        public readonly speed: number,
    ) {}

    get instability(): number {
        return (
            this.tasks.reduce(
                (acc, task) =>
                    ['easy', 'medium', 'hard'].indexOf(task.difficulty) + 1,
                0,
            ) / this.skill
        );
    }
}

class Alliance {
    constructor(public readonly teams: [Team, Team, Team]) {}
}
