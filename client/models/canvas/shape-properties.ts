import { Drawable } from './canvas';

export type LineProperties = {
    width: number;
    color: string;
    drawCondition: () => boolean;
};

export type FillProperties = {
    color: string;
    drawCondition: () => boolean;
};

export type ShapeProperties<T = unknown> = Partial<{
    line: Partial<LineProperties>;
    fill: Partial<FillProperties>;
    drawCondition: (element: T) => boolean;
}>;
