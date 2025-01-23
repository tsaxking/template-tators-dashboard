import '../../utilities/imports';
import App from '../../views/pages/Account.svelte';
import '../../models/FIRST/model-builder';
import { FIRSTYear } from '../../models/FIRST/year';
FIRSTYear.select(new Date().getFullYear());

const myApp = new App({ target: document.body });
