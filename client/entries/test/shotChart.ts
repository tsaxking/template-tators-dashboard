import '../../utilities/imports';
import { generateTrace } from '../../../shared/dummy-data';
import { Trace } from '../../../shared/submodules/tatorscout-calculations/trace';
import { Canvas } from '../../models/canvas/canvas';
import { Circle } from '../../models/canvas/circle';

const shotCanvas = document.createElement('canvas');
const ctx = shotCanvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');
const c = new Canvas(ctx);

c.clear();
c.add(
    ...generateTrace()
        .filter(Trace.filterAction('spk'))
        .map((p) => new Circle([p[1], p[2]], 0.05)),
);
c.draw();
