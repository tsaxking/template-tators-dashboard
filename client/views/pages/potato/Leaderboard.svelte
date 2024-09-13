<script lang="ts">
    import { onMount } from 'svelte';
    import { Potato } from '../../../models/potato/game';
    import { Account } from '../../../models/account';
    import { prompt } from '../../../utilities/notifications';
import { alert } from '../../../utilities/notifications';

export let loading: boolean;

    let potatoes: Potato[] = [];
    let self: Potato | undefined;
    let actions = false;
    const getLeaderboard = async () => {
        const res = await Potato.getLeaderboard();
        if (res.isErr()) return console.error(res.error);
        potatoes = res.value;
        const s = await Potato.getSelf();
        if (s.isErr()) return console.error(s.error);
        self = s.value;
        loading = false;
    };

    const isAdmin = async () => {
        const account = (await Account.getAccount()).unwrap();
        if (!account) return;
        const permissions = (await account.getPermissions()).unwrap();
        actions = !!permissions.find(p => p.permission === 'mentor');
    };

    onMount(() => {
        getLeaderboard();
        isAdmin();

        Potato.on('new', getLeaderboard);
        Potato.on('update', getLeaderboard);
        
        return () => {
            potatoes = [];
            actions = false;
            Potato.off('new', getLeaderboard);
            Potato.off('update', getLeaderboard);
            loading = true;
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
            {#each potatoes as potato, i (potato.accountId)}
                <tr class:table-primary={self && self.accountId === potato.accountId}
                >
                    <td>{i + 1}</td>
                    <td>{potato.username}</td>
                    <td>
                        <span>
                            {potato.name || 'Unnamed'}
                        </span>
                        {#if potato.isSelf}
                            <button 
                                class="btn badge bg-primary" 
                                type="button"
                                on:click={async () => {
                                    if (potato.potatoChips < 1000) return alert('You need at least 1000 potato chips to change your potato name');
                                    const name = await prompt('What would you like to name your potato?');
                                    if (!name) return;
                                    potato.changeName(name);
                                }}
                            >
                                Change
                            </button>
                        {/if}
                    </td>
                    <td>{potato.potatoChips}</td>
                    <td>{potato.phase}</td>
                    {#if actions}
                        <td>
                            <div
                                class="btn-group"
                                aria-label="Actions"
                                role="group"
                            >
                                <button
                                    class="btn btn-primary"
                                    type="button"
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
                                        if (num > 100 || num < -100)
                                            return alert(
                                                'You can only add up to 100 chips at a time'
                                            );
                                        potato.give(num);
                                    }}"
                                >
                                    <i class="fas fa-plus" /> /
                                    <i class="fas fa-minus" /> Chips
                                </button>
                            </div>
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
