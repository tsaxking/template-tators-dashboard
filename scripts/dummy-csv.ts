import { saveJSONSync } from '../server/utilities/files';
import { generateTrace } from '../shared/dummy-data';
import {
    Action2024,
    P
} from '../shared/submodules/tatorscout-calculations/trace';

saveJSONSync('dummy-trace', generateTrace());

// /**
//  * Filter by action
//  * @date 1/15/2024 - 8:40:53 PM
//  */
// const filterAction = (action: Action2024) => (point: P) => point[3] === action;

// generateTrace().filter(filterAction('spk'));
