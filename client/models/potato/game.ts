import { attemptAsync } from "../../../shared/check";
import { ServerRequest } from "../../utilities/requests";

type State = {
    level: number;
}

class Game {
    constructor() {}


    async init() {
        return attemptAsync(async () => {
            const state = (await ServerRequest.post<State>('/api/potato/get-game-state')).unwrap();
        });
    }
}

export const game = new Game();
game.init();