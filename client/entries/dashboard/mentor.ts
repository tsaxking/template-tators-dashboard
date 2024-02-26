import '../../utilities/imports';
import App from '../../views/dashboards/Mentor.svelte';
import '../../models/FIRST/model-builder';
import { FIRSTYear } from '../../models/FIRST/year';

const myApp = new App({ target: document.body });
FIRSTYear.select(new Date().getFullYear());
