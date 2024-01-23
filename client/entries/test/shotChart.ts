import '../../utilities/imports';
import { generateTrace } from '../../../shared/dummy-data';
import {
    P,
    Trace,
} from '../../../shared/submodules/tatorscout-calculations/trace';
import { Canvas } from '../../models/canvas/canvas';
import { Circle } from '../../models/canvas/circle';
import 'jquery-ui';

const shotCanvas = document.createElement('canvas');
const ctx = shotCanvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');
const c = new Canvas(ctx);

document.body.append(shotCanvas);
$(document.body).append($(create('button', {label: "custom label"})));

c.clear();

c.add(
    ...generateTrace()
        .filter(Trace.filterAction('spk')).filter(Trace.filterIndex(0, 600))
        .map((p) => new Circle([p[1], p[2]], 0.05))
);

c.draw();
