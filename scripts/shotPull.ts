import {generateTrace} from '../shared/dummy-data.ts'
import {P, Action} from '../shared/submodules/tatorscout-calculations/trace.ts';
const testTrace = generateTrace();

// const filterShots = (trace: P[]) => {
//     const filteredTrace = []
//     for(let i = 0; i < trace.length; i++) {
//         if(trace[i][3] === 'spk'){
//             filteredTrace.push(trace[i]);
//         }
//     }
//     return filteredTrace;
// }

const filterAction = (trace: P[], action: (string | number)) => {
    const filteredTrace = []
    for(let i = 0; i < trace.length; i++) {
        if(trace[i][3] === action){
            filteredTrace.push(trace[i]);
        }
    }
    return filteredTrace;
}

const filter = (action: Action) => (trace: P[]) => trace.Action === action