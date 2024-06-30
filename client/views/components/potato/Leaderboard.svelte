<script lang="ts">
import { onMount } from 'svelte';
import { Potato } from '../../../models/potato/game';
import { Account } from '../../../models/account';
import { prompt } from '../../../utilities/notifications';

let potatoes: Potato[] = [];
let actions = false;
const getLeaderboard = async () => {
    const res = await Potato.getLeaderboard();
    if (res.isErr()) return console.error(res.error);
    potatoes = res.value;
};

const isAdmin = async () => {
    const account = await Account.getAccount();
    if (!account) return;
    const permissions = (await account.getPermissions()).unwrap();
    actions = !!permissions.find(p => p.permission === 'mentor');
};

onMount(() => {
    getLeaderboard();
    isAdmin();
    return () => {
        potatoes = [];
        actions = false;
    };
});
</script>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Potato Name</th>
                <th>Potato Chips</th>
                <th>Phase</th>
                {#if actions}
                    <th>Actions</th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each potatoes as potato, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>{potato.username}</td>
                    <td>{potato.name || 'Unnamed'}</td>
                    <td>{potato.potatoChips}</td>
                    <td>{potato.phase}</td>
                    {#if actions}
                        <td>
                            <div
                                class="btn-group"
                                role="group"
                                aria-label="Actions"
                            >
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    on:click="{async () => {
                                        const chips = await prompt(
                                            'How many potato chips would you like to add?'
                                        );
                                        if (!chips) return;
                                        const num = parseInt(chips);
                                        if (isNaN(num))
                                            return alert(
                                                'Please enter a valid number'
                                            );
                                        if (num > 100)
                                            return alert(
                                                'You can only add up to 100 chips at a time'
                                            );
                                        potato.give(num);
                                    }}"
                                >
                                    <i class="fas fa-plus"></i> /
                                    <i class="fas fa-minus"></i> Chips
                                </button>
                            </div>
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
