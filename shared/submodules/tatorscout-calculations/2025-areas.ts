import { Point2D } from '../calculations/src/linear-algebra/point';

type AreaMap = {
    red: Point2D[];
    blue: Point2D[];
};

export const barges: AreaMap = {
    red: [
        [0.469, 0.067],
        [0.534, 0.069],
        [0.534, 0.489],
        [0.467, 0.487]
    ],
    blue: [
        [0.471, 0.515],
        [0.53, 0.519],
        [0.532, 0.928],
        [0.468, 0.926]
    ]
};

export const processors: AreaMap = {
    red: [
        [0.608, 0.067],
        [0.608, 0.006],
        [0.674, 0.006],
        [0.674, 0.066]
    ],
    blue: [
        [0.327, 0.997],
        [0.326, 0.932],
        [0.392, 0.93],
        [0.394, 0.997]
    ]
};

export const reefs: AreaMap = {
    red: [
        [0.268, 0.361],
        [0.332, 0.432],
        [0.333, 0.58],
        [0.268, 0.653],
        [0.204, 0.575],
        [0.205, 0.434]
    ],
    blue: [
        [0.736, 0.352],
        [0.798, 0.428],
        [0.798, 0.575],
        [0.735, 0.651],
        [0.671, 0.576],
        [0.669, 0.429]
    ]
};

export const zones: AreaMap = {
    blue: [
        [0.5, 0.064],
        [0.882, 0.067],
        [0.976, 0.205],
        [0.978, 0.798],
        [0.888, 0.937],
        [0.505, 0.935]
    ],
    red: [
        [0.499, 0.064],
        [0.501, 0.945],
        [0.12, 0.937],
        [0.027, 0.802],
        [0.025, 0.203],
        [0.12, 0.069]
    ]
};

export const stations: { [key: string]: Point2D[] } = {
    sta1: [
        [0.026, 0.227],
        [0.01, 0.16],
        [0.1, 0.028],
        [0.129, 0.067]
    ],
    sta2: [
        [0.869, 0.064],
        [0.9, 0.03],
        [0.99, 0.16],
        [0.975, 0.222]
    ],
    sta3: [
        [0.975, 0.776],
        [0.99, 0.846],
        [0.903, 0.969],
        [0.871, 0.937]
    ],
    sta4: [
        [0.027, 0.776],
        [0.131, 0.939],
        [0.097, 0.982],
        [0.009, 0.85]
    ]
};

export const autoZone: AreaMap = {
    red: [
        [0.435, 0.066],
        [0.565, 0.067],
        [0.567, 0.51],
        [0.437, 0.502]
    ],

    blue: [
        [0.436, 0.506],
        [0.566, 0.51],
        [0.567, 0.935],
        [0.435, 0.935]
    ]
};

export const border: Point2D[] = [
    [0.117, 0.064],
    [0.882, 0.067],
    [0.975, 0.207],
    [0.977, 0.8],
    [0.885, 0.939],
    [0.119, 0.941],
    [0.026, 0.8],
    [0.025, 0.201]
];

export const all = {
    barges,
    processors,
    reefs,
    zones,
    stations,
    autoZone,
    border
};
