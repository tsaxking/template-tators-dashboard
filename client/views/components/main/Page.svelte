<script lang="ts">
import { Random } from '../../../../shared/math';
import { capitalize, fromSnakeCase } from '../../../../shared/text';
export let title: string;
let year: number = new Date().getFullYear();
export let domain: string;
export let active: string;

const mainClasses = 'container-fluid p-3';

const quotes = [
    'Blankets are like hugs you can wear.',
    "No ship has sailed too far if you'e a really fast swimmer.",
    'The best way to predict the future is to create it.',
    'Just as the prophecy foretold...',
    'if (itWorks) { celebrate(); }',
    'Good enough is good enough',
    'Expectations lead to misery',
    "The c in code stands for carbs because it's spaghetti code",
    "It's a valley not just because there's a steep ascent on one side, but because a rise follows. Hang in there.",
    'Octopi > Squid',
    'Fun fact: the word "fun" is in "funeral"',
    'Beauty fades. That is why it is beautiful.',
    "Taylor wrote 98% of this code so it's probably his fault",
    'You keep getting signed out because of cosmic rays',
    "If “don't” means “do not”, then “don't you dare” means “do not you dare.”",
    "Sometimes contractions are appropriate and sometimes they aren't. It's a silly quirk of this language we've. ",
    'Both c\'s in the word "circle" should be pronounced like an s.',
    'The word "queue" is just a "q" followed by four silent letters.',
    'The word "bed" looks like a bed.',
    'The word "bookkeeper" is the only unhyphenated English word with three consecutive double letters.',
    'The Japanese word for "origami" is "origami".',
    "If anyone wants to talk to Keyton about linguistics, he's very lonely.",
    'Programming is like trying to untangle a bowl of spaghetti with a pair of chopsticks.',
    "We write lasagna, not spaghetti. It's not a mess until you look closely."
];

let quote: string = Random.choose(quotes);
</script>

<div class="{active === title ? mainClasses : 'd-none ' + mainClasses}">
    <h1 class="no-select p-5">{capitalize(fromSnakeCase(title, '-'))}</h1>
    <hr class="dropdown-divider" />
    <slot />
    <p class="text-muted text-center">
        &copy; {year}
        {domain} | All Rights Reserved
        <br />
        {quote}
    </p>
</div>
