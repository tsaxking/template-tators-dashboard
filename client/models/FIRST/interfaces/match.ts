import { Result } from "../../../../shared/check";
import { FIRSTAlliance, Alliance as TeamArray } from "../alliance";
import { Whiteboard } from "../../whiteboard/whiteboard";
import { Strategy } from "../strategy";

export interface MatchInterface {
    getWhiteboard(): Promise<Result<Whiteboard>>;
    getTeams(): Promise<Result<[...TeamArray, ...TeamArray]>>;
    getAlliances(): Promise<Result<{ red: FIRSTAlliance; blue: FIRSTAlliance }>>;
    hasTeam(number: number): boolean;
    getStrategies(): Promise<Result<Strategy[]>>;
}