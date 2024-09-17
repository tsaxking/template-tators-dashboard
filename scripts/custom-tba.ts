import { TBA } from "../server/utilities/tba/tba";


const main = async () => {
    const match = (await TBA.get('/match/2021brd_qm7')).unwrap();

    console.log(JSON.stringify(match, null, 2));

    process.exit(0);
};


main();