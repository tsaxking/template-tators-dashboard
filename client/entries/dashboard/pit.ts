import '../../utilities/imports';

import PitDisplay from '../../views/dashboards/Pit.svelte';
import { FIRSTYear } from '../../models/FIRST/year';
import '../../models/FIRST/model-builder';

new PitDisplay({
    target: document.body
});

FIRSTYear.select(2025);
