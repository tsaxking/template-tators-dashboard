// export type Point = [number, number, number]; // x, y, time (normalized to 0-1)

// export type Action = {
//     name: string;
//     point: Point;
// };

// export type Trace = (Point | Action)[];

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 *
 * @type {("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:\"<>?`~[]';./=\\,")}
 */
const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?`~[]\';./=\\,';

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 */
const compress = (str: string) => {
    let num = +str;
    const base = chars.length;

    let result = '';
    while (num > 0) {
        result = chars[num % base] + result;
        num = Math.floor(num / base);
    }
    return result;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 */
const decompress = (str: string) => {
    let num = 0;
    const base = chars.length;
    for (let i = 0; i < str.length; i++) {
        num = num * base + chars.indexOf(str[i]);
    }
    return num;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 */
export const encode = (trace: string[]) => trace.map(compress);
/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 */
export const decode = (trace: string[]) => trace.map(decompress);
