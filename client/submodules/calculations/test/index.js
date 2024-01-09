define("calculus", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.integral = exports.derivative = void 0;
    function derivative(fn, sigFigs = 4) {
        const accuracy = Math.pow(10, -sigFigs);
        return (x) => (fn(x + accuracy) - fn(x)) / accuracy;
    }
    exports.derivative = derivative;
    function integral(fn, sigFigs = 4) {
        const accuracy = Math.pow(10, -sigFigs);
        return (x) => {
            let sum = 0;
            for (let i = 0; i < x; i += accuracy) {
                sum += fn(i) * accuracy;
            }
            return sum;
        };
    }
    exports.integral = integral;
});
define("linear-algebra/point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    class Point {
        static random() {
            return new Point(Math.random(), Math.random(), Math.random());
        }
        constructor(x, y, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        get array() {
            return [this.x, this.y, this.z];
        }
        add(point) {
            return new Point(this.x + point.x, this.y + point.y, this.z + point.z);
        }
        scale(scale) {
            return new Point(this.x * scale, this.y * scale, this.z * scale);
        }
        distance(point) {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) + Math.pow(this.z - point.z, 2));
        }
    }
    exports.Point = Point;
});
define("linear-algebra/spline", ["require", "exports", "linear-algebra/point"], function (require, exports, point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Spline = void 0;
    class Spline {
        constructor(...points) {
            this.points = points;
        }
        /**
         * Returns the point on the spline at t
         * @param t
         * @returns
         */
        ft(t) {
            const i = Math.floor(t);
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            const p3 = this.points[i + 2];
            const p4 = this.points[i + 3];
            const t2 = t - i;
            const t3 = t2 * t;
            const t4 = t3 * t;
            const m1 = -t4 + 2 * t3 - t2;
            const m2 = 3 * t4 - 5 * t3 + 2;
            const m3 = -3 * t4 + 4 * t3 + t2;
            const m4 = t4 - t3;
            const x = (p1.x * m1 + p2.x * m2 + p3.x * m3 + p4.x * m4) / 2;
            const y = (p1.y * m1 + p2.y * m2 + p3.y * m3 + p4.y * m4) / 2;
            const z = (p1.z * m1 + p2.z * m2 + p3.z * m3 + p4.z * m4) / 2;
            return new point_1.Point(x, y, z);
        }
    }
    exports.Spline = Spline;
});
define("test", ["require", "exports", "linear-algebra/point", "linear-algebra/spline"], function (require, exports, point_2, spline_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log('Success!');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    if (!ctx) {
        throw new Error('2d context not supported');
    }
    const points = new Array(10).fill('').map(point_2.Point.random);
    const spline = new spline_1.Spline(...points);
    const steps = 100;
    function draw() {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(0, canvas.height);
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const point = spline.ft(t);
            ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(point.x * canvas.width, (1 - point.y) * canvas.height);
        }
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
});
define("linear-algebra/plane", ["require", "exports", "linear-algebra/point", "linear-algebra/vector"], function (require, exports, point_3, vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Plane = void 0;
    class Plane {
        static from(p1, p2, p3) {
            const v1 = new vector_1.Vector(p1, p2);
            const v2 = new vector_1.Vector(p1, p3);
            const normal = v1.cross(v2);
            return new Plane(normal);
        }
        constructor(normal) {
            this.normal = normal;
        }
        intersect(v) {
            const t = (this.normal.dot(new vector_1.Vector(this.normal.point, v.point))) / this.normal.dot(v);
            if (t < 0)
                return null;
            const x = v.ft('x')(t);
            const y = v.ft('y')(t);
            const z = v.ft('z')(t);
            return x === v.rate.x && y === v.rate.y && z === v.rate.z ? new point_3.Point(x, y, z) : null;
        }
    }
    exports.Plane = Plane;
});
define("linear-algebra/vector", ["require", "exports", "linear-algebra/plane", "linear-algebra/point"], function (require, exports, plane_1, point_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector = void 0;
    class Vector {
        constructor(point, rate) {
            this.point = point;
            this.rate = rate;
        }
        get magnitude() {
            return new point_4.Point(0, 0, 0).distance(this.rate);
        }
        /**
         * Returns a function of t that returns the position of the vector at time t
         * @param param
         * @returns
         */
        ft(param) {
            return (t) => this.point[param] + this.rate[param] * t;
        }
        ;
        /**
         * Magnitude of the vector projection of this vector onto v
         * @param v
         * @returns
         */
        dot(v) {
            return this.rate.x * v.rate.x + this.rate.y * v.rate.y + this.rate.z * v.rate.z;
        }
        ;
        /**
         * Returns the angle between the two vectors in radians
         */
        angle(v) {
            return Math.acos(this.dot(v) / (this.magnitude * v.magnitude));
        }
        /**
         * Area/Volume of the parallelogram formed by the two vectors
         * Vector is perpendicular to the plane formed by the two vectors
         * The return vector starts at the origin
         * @param v
         */
        cross(v) {
            return new Vector(new point_4.Point(0, 0, 0), new point_4.Point(this.rate.y * v.rate.z - this.rate.z * v.rate.y, this.rate.z * v.rate.x - this.rate.x * v.rate.z, this.rate.x * v.rate.y - this.rate.y * v.rate.x));
        }
        /**
         * Moves the vector to the given point (mutates "this" vector) and returns it
         * @param point
         * @returns
         */
        move(point) {
            this.point = point;
            return this;
        }
        /**
         * Returns the determinant of the two vectors (area/volume of the parallelogram formed by the two vectors)
         * @param v
         * @returns
         */
        determinant(v) {
            return this.cross(v).magnitude;
        }
        /**
         * Scales the vector by the given magnitude (mutates "this" vector) and returns it
         * @param magnitude
         * @returns
         */
        scale(magnitude) {
            this.rate = this.rate.scale(magnitude);
            return this;
        }
        /**
         * Adds the given vector to "this" vector (mutates "this" vector) and returns it
         * @param v
         * @returns
         */
        add(v) {
            this.rate = this.rate.add(v.rate);
            return this;
        }
        get plane() {
            return new plane_1.Plane(this);
        }
    }
    exports.Vector = Vector;
});
define("linear-algebra/matrix-calculations", ["require", "exports", "linear-algebra/point", "linear-algebra/vector"], function (require, exports, point_5, vector_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.perspective = exports.rotate3D = exports.rotate2D = exports.scale = exports.translate = exports.transform = exports.multiplyMatricies = void 0;
    function multiplyMatricies(a, b) {
        // ensure that the matricies are compatible
        if (a[0].length !== b.length) {
            throw new Error('Matricies are not compatible, ' + 'A: ' + a.length + 'x' + a[0].length + ' B: ' + b.length + 'x' + b[0].length + '');
        }
        // create the new matrix
        const c = [];
        // for each row in a
        for (let i = 0; i < a.length; i++) {
            // create a new row
            c[i] = [];
            // for each column in b
            for (let j = 0; j < b[0].length; j++) {
                // create a new column
                c[i][j] = 0;
                // for each element in the column
                for (let k = 0; k < b.length; k++) {
                    // add the product of the elements
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return c;
    }
    exports.multiplyMatricies = multiplyMatricies;
    function transform(point, matrix) {
        const [x, y, z] = point;
        const [[a], [b], [c]] = multiplyMatricies(matrix, [[x], [y], [z]]);
        return [a, b, c];
    }
    exports.transform = transform;
    function translate([x, y, z], [dx, dy, dz]) {
        return [x + dx, y + dy, z + dz];
    }
    exports.translate = translate;
    function scale([x, y, z], [dx, dy, dz]) {
        return [x * dx, y * dy, z * dz];
    }
    exports.scale = scale;
    function rotate2D([x, y], r) {
        return [
            x * Math.cos(r) - y * Math.sin(r),
            x * Math.sin(r) + y * Math.cos(r)
        ];
    }
    exports.rotate2D = rotate2D;
    function rotate3D(point, about, angle) {
        let [x, y, z] = point;
        const [ax, ay, az] = about;
        const [rx, ry, rz] = angle;
        [x, y, z] = translate([x, y, z], [-ax, -ay, -az]);
        [y, z] = rotate2D([y, z], rx);
        [x, z] = rotate2D([x, z], ry);
        [x, y] = rotate2D([x, y], rz);
        [x, y, z] = translate([x, y, z], [ax, ay, az]);
        return [x, y, z];
    }
    exports.rotate3D = rotate3D;
    function perspective(point, cameraDistance, viewPlane, viewAngle) {
        var _a;
        const cameraPoint = new point_5.Point(0, 0, -1 * cameraDistance);
        const cameraVector = new vector_2.Vector(cameraPoint, new point_5.Point(...point));
        if (cameraVector.angle(viewPlane) > viewAngle / 2)
            return;
        const result = (_a = viewPlane.plane.intersect(cameraVector)) === null || _a === void 0 ? void 0 : _a.array;
        if (!result)
            return;
        const [x, y] = result;
        return [x, y];
    }
    exports.perspective = perspective;
});
