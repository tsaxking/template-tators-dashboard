<script lang="ts">
    import { Random } from '../../../../shared/math';

    export let domain: string;

    const quotes = [
        'Blankets are like hugs you can wear.',
        'No ship has sailed too far if you\'e a really fast swimmer.',
        'The best way to predict the future is to create it.',
        'Just as the prophecy foretold...',
        'if (itWorks) { celebrate(); }',
        'Good enough is good enough',
        'Expectations lead to misery',
        'The c in code stands for carbs because it\'s spaghetti code',
        'It\'s a valley not just because there\'s a steep ascent on one side, but because a rise follows. Hang in there.',
        'Octopi > Squid',
        // 'Fun fact: the word "fun" is in "funeral"',
        'Beauty fades. That is why it is beautiful.',
        'Taylor wrote 98% of this code so it\'s probably his fault',
        'You keep getting signed out because of cosmic rays',
        'If “don\'t” means “do not”, then “don\'t you dare” means “do not you dare.”',
        'Sometimes contractions are appropriate and sometimes they aren\'t. It\'s a silly quirk of this language we\'ve. ',
        'Both c\'s in the word "circle" should be pronounced like an s.',
        'The word "queue" is just a "q" followed by four silent letters.',
        'The word "bed" looks like a bed.',
        'The word "bookkeeper" is the only unhyphenated English word with three consecutive double letters.',
        'The Japanese word for "origami" is "origami".',
        'If anyone wants to talk to Keyton about linguistics, he\'s very lonely.',
        // "Report issues you see, but don't forget, there will always be issues with this website, me, you, and everything, fixing things and going for perfection will only lead to hopeless misery... Have a Nice Day!",
    // 'If you see something, say something . . . or else',
        '"Maintain a healthy fear of what can go wrong" - Detrich R.',
        '"Not all who wander are lost, but this robot is awfully close" - '
    ];

    const quote = Random.choose(quotes);
</script>

<footer>
    <p class="text-muted text-center">
        &copy; {new Date().getFullYear()}
        {domain} | All Rights Reserved
        <br />
        If you see an issue, please report it
        <a
            href="https://github.com/tsaxking/template-tators-dashboard/issues"
            target="_blank">here</a
        >.
        <br />

        <a
            href="https://github.com/tsaxking/template-tators-dashboard"
            target="_blank"
        >
            <i class="fa-brands fa-github fa-2x link-secondary" />
        </a>
        <br />
        {quote}
    </p>
</footer>
