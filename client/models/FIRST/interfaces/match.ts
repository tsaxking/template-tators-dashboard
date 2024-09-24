import { Result } from '../../../../shared/check';
import { CompLevel } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTAlliance, Alliance as TeamArray } from '../alliance';
import { Matches } from '../../../../server/utilities/tables';
import { Strategy } from '../strategy';

export interface MatchInterface {
    getTeams(): Promise<Result<[...TeamArray, ...TeamArray]>>;
    getAlliances(): Promise<
        Result<{ red: FIRSTAlliance; blue: FIRSTAlliance }>
    >;
    hasTeam(number: number): boolean;
    getStrategies(): Promise<Result<Strategy[]>>;

    getInfo(): Promise<Result<Matches>>;

    number: number;
    compLevel: CompLevel;
    eventKey: string;

    on(event: 'new-strategy', listener: (strategy: Strategy) => void): void;
    off(event: 'new-strategy', listener: (strategy: Strategy) => void): void;
    emit(event: 'new-strategy', strategy: Strategy): void;
}
