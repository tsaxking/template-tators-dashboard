// export type Point = [number, number, number]; // x, y, time (normalized to 0-1)

// export type Action = {
//     name: string;
//     point: Point;
// };

// export type Trace = (Point | Action)[];

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?`~[]\';./=\\,';

const compress = (str: string) => {
    let num = +str;
    const base = chars.length;
    
    let result = '';
    while (num > 0) {
        result = chars[num % base] + result;
        num = Math.floor(num / base);
    }
    return result;
}

const decompress = (str: string) => {
    let num = 0;
    const base = chars.length;
    for (let i = 0; i < str.length; i++) {
        num = num * base + chars.indexOf(str[i]);
    }
    return num;
}

export const encode = (trace: string[]) => trace.map(compress);
export const decode = (trace: string[]) => trace.map(decompress);