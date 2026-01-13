import { getStroke } from 'perfect-freehand';

interface StrokeOptions {
    size?: number;
    thinning?: number;
    smoothing?: number;
    streamline?: number;
    simulatePressure?: boolean;
}

export function getSvgPathFromStroke(stroke: number[][], options: StrokeOptions = {}) {
    // Check if stroke has real pressure data (not default 0.5 or 0)
    const hasPressure = stroke.some(point =>
        point[2] !== undefined && point[2] !== 0.5 && point[2] !== 0
    );

    const {
        size = 4,
        thinning = 0.5,
        smoothing = 0.5,
        streamline = 0.5,
        simulatePressure = !hasPressure, // Auto-detect: simulate if no real pressure
    } = options;

    const points = getStroke(stroke, {
        size,
        thinning,
        smoothing,
        streamline,
        simulatePressure,
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
