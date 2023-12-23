const sleep = (t) => new Promise(r => setTimeout(r, t));

const bc = document.querySelector('#bigCookie');

const click = async () => sleep(0).then(bc.click());

let bcClicker;


const setbcClicker = () => bcClicker = setInterval(click);
const rmbcClicker = () => clearInterval(bcClicker);

let gcClicker;

const setgcClicker = () => gcClicker = setInterval(() => {
    document.querySelectorAll('.shimmer').forEach(c => {
        // if (c.getAttribute('alt') === 'Wrath cookie') return;
        console.clear();
        c.click();
        console.log('|||||||||||||||||||||||||||||| GOLDEN COOKIE CLICKED |||||||||||||||||||||||||||||');
        setTimeout(() => console.clear(), 30 * 1000);
    });
}, 1000);

const rmgcClicker = () => clearInterval(gcClicker);


let ugClicker;

const setugClicker = () => ugClicker = setInterval(() => {
    Array.from(document.querySelectorAll('#upgrades .upgrade.crate')).reverse().forEach((e) => e.click());
}, 30 * 1000);

const rmugClicker = () => clearInterval(ugClicker);


setgcClicker();
setbcClicker();
setugClicker();