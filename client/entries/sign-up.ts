import '../utilities/imports';
import SignUp from '../views/components/SignIn.svelte';


const app = new SignUp({
    target: document.body,
    props: {
        title: 'Team Tators'
    }
});