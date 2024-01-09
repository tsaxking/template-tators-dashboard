export const standardDeviation = (data: number[]): number => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(variance);
};

export const mean = (data: number[]): number => {
    return data.reduce((a, b) => a + b, 0) / data.length;
};

export const median = (data: number[]): number => {
    const sorted = data.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid] + sorted[mid - 1]) / 2;
    } else {
        return sorted[mid];
    }
};

export const mode = (data: number[]): number => {
    const counts = data.reduce((counts, x) => {
        counts[x] = counts[x] ? counts[x] + 1 : 1;
        return counts;
    }, {} as {[key: number]: number});

    let max = 0;
    let mode = 0;
    for (const key in counts) {
        if (counts[key] > max) {
            max = counts[key];
            mode = Number(key);
        }
    }

    return mode;
};

export const range = (data: number[]): number => {
    const sorted = data.sort((a, b) => a - b);
    return sorted[sorted.length - 1] - sorted[0];
};

export const quartiles = (data: number[]): [number, number, number] => {
    const sorted = data.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const lower = sorted.slice(0, mid);
    const upper = sorted.slice(mid + 1);

    return [
        median(lower),
        median(sorted),
        median(upper)
    ];
};

export const interquartileRange = (data: number[]): number => {
    const [lower, _, upper] = quartiles(data);
    return upper - lower;
};

export const outliers = (data: number[]): number[] => {
    const [lower, _, upper] = quartiles(data);
    const iqr = interquartileRange(data);
    return data.filter(x => x < lower - 1.5 * iqr || x > upper + 1.5 * iqr);
};

export const zScore = (data: number[], value: number): number => {
    return (value - mean(data)) / standardDeviation(data);
};

export const zScores = (data: number[]): number[] => {
    const m = mean(data);
    const sd = standardDeviation(data);
    return data.map(x => (x - m) / sd);
};

export const correlation = (data1: number[], data2: number[]): number => {
    const z1 = zScores(data1);
    const z2 = zScores(data2);

    const sum = z1.map((z, i) => z * z2[i]).reduce((a, b) => a + b, 0);
    return sum / (z1.length - 1);
}

export const movingAverage = (data: number[], windowSize: number): number[] => {
    const averages = [];
    for (let i = 0; i < data.length - windowSize; i++) {
        const window = data.slice(i, i + windowSize);
        averages.push(mean(window));
    }
    return averages;
};