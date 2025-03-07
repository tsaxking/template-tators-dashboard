import { FIRSTWhiteboard } from '../../models/FIRST/whiteboard';
import { globalize } from '../../utilities/global';
import '../../utilities/imports';
import App from '../../views/components/whiteboard/Whiteboard.svelte';

const wb = new FIRSTWhiteboard({
    id: '1',
    name: 'Test',
    strategyId: '1',
    archived: false,
    board: '[]'
});

new App({
    target: document.body,
    props: {
        whiteboard: wb,
        year: 2025
    }
});

globalize(wb, 'wb');
