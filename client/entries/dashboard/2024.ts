import '../../utilities/imports';

import Dashboard from '../../views/dashboards/2024.svelte';
import { FIRSTYear } from '../../models/FIRST/year';
import '../../models/FIRST/model-builder';
import { FIRSTEvent } from '../../models/FIRST/event';

new Dashboard({
    target: document.body,
});

FIRSTYear.select(2024);

FIRSTYear.on('select', () => {
    const query = new URLSearchParams(window.location.search);
    const evt = query.get('event');
    if (evt) {
        const event = FIRSTEvent.cache.get(evt);
        if (event) event.select();
    }
});

FIRSTEvent.on('select', async (e) => {
    const query = new URLSearchParams(window.location.search);
    const t = query.get('team');
    if (t) {
        const res = await e.getTeams();
        if (res.isOk()) {
            const team = res.value.find((t) => t.tba.team_number === Number(t));
            if (team) team.select();
        }
    }
});