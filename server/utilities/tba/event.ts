// import { TBAEvent } from "../../../shared/tba.ts";
// import { TBA } from "./tba.ts";
// import { TBATeam } from "../../../shared/tba.ts";


// export class TBA_Event {
//     constructor(public readonly data: TBAEvent) {};



//     async getTeams() {
//         const { key } = this.data;

//         const teams = await TBA.get<TBATeam[]>(`event/${key}/teams/simple`);

//         if (!teams) return null;

//         // return teams.map(team => new TBATeam(team));
//     }
// };