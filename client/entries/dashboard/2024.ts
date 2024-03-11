import '../../utilities/imports';

import Dashboard from '../../views/dashboards/2024.svelte';
import { FIRSTYear } from '../../models/FIRST/year';
import '../../models/FIRST/model-builder';

new Dashboard({
    target: document.body
});

FIRSTYear.select(2024);
