const filterTrace = (action: string) => {
    return (trace: P[]) => {
        return trace.filter(() => {
            for(const item in trace) {
                return item[3] === action
            }
        })
    }
}

const getActions = filterTrace('spk');

const shotCanvas = document.createElement('canvas');
const ctx = shotCanvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');
const c = new Canvas(ctx)

c.clear();
c.add(...getActions(generateTrace()).map((p) => new Circle([p[1], p[2]], .05)));
c.draw();