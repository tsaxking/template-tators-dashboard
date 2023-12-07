import { FIRSTYear } from "./year";


export const years: FIRSTYear[] = (() => {
    const years: FIRSTYear[] = [];
    for (let i = 2007; i <= new Date().getFullYear(); i++) {
        years.push(new FIRSTYear(i));
    }
    return years;
})();

years[years.length - 1].select();