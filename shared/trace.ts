export type Point = [number, number, number]; // x, y, time (normalized to 0-1)

export type Action = {
    name: string;
    point: Point;
};

export type Trace = (Point | Action)[];