import { Result } from '../../../../shared/check';
import { CompLevel } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTAlliance, Alliance as TeamArray } from '../alliance';
import { Strategy } from '../strategy';
import { FIRSTWhiteboard } from '../whiteboard';

export interface MatchInterface {
    getTeams(): Promise<Result<[...TeamArray, ...TeamArray]>>;
    getAlliances(): Promise<
        Result<{ red: FIRSTAlliance; blue: FIRSTAlliance }>
    >;
    hasTeam(number: number): boolean;
    getStrategies(): Promise<Result<Strategy[]>>;

    getInfo(): unknown;

    number: number;
    compLevel: CompLevel;
    eventKey: string;
}
