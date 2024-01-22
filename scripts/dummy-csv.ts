import { generateTrace } from '../shared/dummy-data.ts';
import {
    Action2024,
    P,
} from '../shared/submodules/tatorscout-calculations/trace.ts';

/**
 * Filter by action
 * @date 1/15/2024 - 8:40:53 PM
 */
const filterAction = (action: Action2024) => (point: P) => point[3] === action;

generateTrace().filter(filterAction('spk'));
