import { getStroke } from 'perfect-freehand';

export function getSvgPathFromStroke(stroke: number[][], options = {}) {
    const points = getStroke(stroke, {
        size: 4,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
        ...options,
    });

    const d = points.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ['M', ...points[0], 'Q'],
    );

    d.push('Z');
    return d.join(' ');
}
