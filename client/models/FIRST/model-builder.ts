import { FIRSTYear } from './year';

export const years: FIRSTYear[] = (() => {
    const years: FIRSTYear[] = [];
    for (let i = new Date().getFullYear(); i >= 2007; i--) {
        years.push(new FIRSTYear(i));
    }
    return years;
})();

setTimeout(() => {
    years[0].select();
});
