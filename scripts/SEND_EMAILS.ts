import { TBA } from "../server/utilities/tba/tba";
import { Loop } from "../shared/loop";
import { Email, EmailType } from "../server/utilities/email";

const main = async () => {
    const loop = new Loop(async () => {
        const matches = (await TBA.get<unknown[]>('/event/2024cabl/matches/simple')).unwrap();
        console.log('Matches:', matches);
        if (!matches) return;
        if (matches.length === 0) return;
        const e = new Email(
            ['taylor.reese.king@gmail.com', 'stuart.king@boiseschools.org', 'stuking65@gmail.com', 'raygenrrupe@gmail.com'],
            'Cabl Match Schedule Released',
            EmailType.text,
            {
                constructor: {
                    message: 'The match schedule for the upcoming competition has been released. Please check the schedule to see when your team is competing.',
                    title: 'CABL Match Schedule Released',
                }
            }
        );
        console.log('Sending email');
        (await e.send()).unwrap();
        process.exit(0);
    }, 5 * 60 * 1000);


    loop.start();
};

main();