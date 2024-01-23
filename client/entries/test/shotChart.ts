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
const sliderDiv = $(create('div', {
    style: {
        height: '10px',
    },
})).slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    slide: function (event, ui) {
        if (!ui?.values) return;
        $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
    },
});

$(document.body).append(sliderDiv);



c.clear();

c.add(
    ...generateTrace()
        .filter(Trace.filterAction('spk'))
        .filter(Trace.filterIndex(0, 600))
        .map((p) => new Circle([p[1], p[2]], 0.05)),
);

c.draw();
