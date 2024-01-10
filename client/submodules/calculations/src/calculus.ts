export function derivative(fn: (x: number) => number, sigFigs: number = 4): (x: number) => number {
    const accuracy = Math.pow(10, -sigFigs);
    return (x: number) => (fn(x + accuracy) - fn(x)) / accuracy;
}

export function integral(fn: (x: number) => number, sigFigs: number = 4): (x: number) => number {
    const accuracy = Math.pow(10, -sigFigs);
    return (x: number) => {
        let sum = 0;
        for (let i = 0; i < x; i += accuracy) {
            sum += fn(i) * accuracy;
        }
        return sum;
    }
}