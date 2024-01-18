import '../../utilities/imports.ts';
import { generateTrace } from "../../../shared/dummy-data.ts"
import { Trace, P } from '../../../shared/submodules/tatorscout-calculations/trace.ts';
import { Canvas } from '../../models/canvas/canvas.ts';
import { Circle } from '../../models/canvas/circle.ts';


const shotCanvas = document.createElement('canvas');
const ctx = shotCanvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');
const c = new Canvas(ctx)

c.clear();
c.add(...generateTrace().filter(Trace.filterAction('spk')).map((p) => new Circle([p[1], p[2]], .05)));
c.draw();