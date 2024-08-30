import { Result } from "../../../../shared/check";
import { FIRSTAlliance, Alliance as TeamArray } from "../alliance";
import { Strategy } from "../strategy";
import { FIRSTWhiteboard } from "../whiteboard";

export interface MatchInterface {
    getWhiteboards(ctx: CanvasRenderingContext2D): Promise<Result<FIRSTWhiteboard>>;
    getTeams(): Promise<Result<[...TeamArray, ...TeamArray]>>;
    getAlliances(): Promise<Result<{ red: FIRSTAlliance; blue: FIRSTAlliance }>>;
    hasTeam(number: number): boolean;
    getStrategies(): Promise<Result<Strategy[]>>;
}