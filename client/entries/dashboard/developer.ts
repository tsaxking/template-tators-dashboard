import '../../utilities/imports';

import '../../utilities/imports';

import Dashboard from '../../views/dashboards/Developer.svelte';
import '../../models/FIRST/model-builder';
import { FIRSTYear } from '../../models/FIRST/year';
FIRSTYear.select(new Date().getFullYear());

new Dashboard({
    target: document.body
});
