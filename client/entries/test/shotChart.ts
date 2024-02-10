import '../../utilities/imports';
import { generateTrace } from '../../../shared/dummy-data';
import {
    P,
    Trace,
} from '../../../shared/submodules/tatorscout-calculations/trace';
import { Canvas } from '../../models/canvas/canvas';
import { Circle } from '../../models/canvas/circle';
import { Container } from '../../models/canvas/container';
import 'jquery-ui';

const shotCanvas = document.createElement('canvas');
const ctx = shotCanvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');
const c = new Canvas(ctx);

const container = new Container(
    ...generateTrace().map((p) => {
        const isSpk = Trace.filterAction('spk')(p);
        if (isSpk) return new Circle([p[1], p[2]], 0.05);
        return null;
    }),
);

const filter = (from: number, to: number) =>
    container.filter((_, i) => i >= from && i <= to);

filter(75, 300);

document.body.append(shotCanvas);
const sliderDiv = $(
    create('div', {
        style: {
            height: '10px',
        },
    }),
).slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    slide: function (event, ui) {
        if (!ui?.values) return;
        const [from, to] = ui.values;
        filter(from, to);
    },
});

$(document.body).append(sliderDiv);

c.clear();

c.add(container);

const _stop = c.animate();

document.addEventListener('DOMContentLoaded', () => {});
