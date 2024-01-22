import { Trace } from '../shared/submodules/tatorscout-calculations/trace.ts';
import { generateTrace } from '../shared/dummy-data.ts';

const trace = generateTrace();

const compressed = Trace.encode(trace);
const decompressed = Trace.decode(compressed);

console.log('trace', trace);
console.log('compressed', compressed);
console.log('decompressed', decompressed);
console.log(Trace.compare(trace, decompressed));
