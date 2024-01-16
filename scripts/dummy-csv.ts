import { generateTrace } from '../shared/dummy-data.ts';
import {
    Action,
    P,
} from '../shared/submodules/tatorscout-calculations/trace.ts';

/**
 * Filter by action
 * @date 1/15/2024 - 8:40:53 PM
 */
const filterAction = (action: Action) => (point: P) => point[3] === action;

const speakerShots = generateTrace().filter(filterAction('spk'));
