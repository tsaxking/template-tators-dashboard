<script lang="ts">
import { onMount } from 'svelte';
import { Account } from '../../models/account';
import type { Permission as P } from '../../../shared/permissions';
import { confirm, select } from '../../utilities/notifications';
import { Role } from '../../models/roles';
import RoleBadge from '../components/accounts/RoleBadge.svelte';
import { prompt } from '../../utilities/notifications';

let accounts: Account[] = [];

let accountObjs: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    verified: 0 | 1;
    created: number;
    phoneNumber: string;
    picture?: string;
    roles: Role[];
    permissions: P[];
}[] = [];

const setAccounts = async (newAccounts: Account[]) => {
    accountObjs = (
        await Promise.all(
            newAccounts.map(async a => {
                const [roles, permissions] = await Promise.all([
                    a.getRoles(true).then(r => {
                        if (r.isOk()) {
                            return r.value;
                        }
                        // console.error('Failed to get roles: ', r.error);
                        return [];
                    }),
                    a.getPermissions(true).then(p => {
                        if (p.isOk()) {
                            return p.value;
                        }
                        // console.error('Failed to get permissions: ', p.error);
                        return [];
                    })
                ]);

                return {
                    id: a.id,
                    username: a.username,
                    firstName: a.firstName,
                    lastName: a.lastName,
                    email: a.email,
                    verified: a.verified,
                    created: a.created,
                    phoneNumber: a.phoneNumber,
                    picture: a.picture,
                    roles,
                    permissions: permissions.map(p => p.permission) as P[]
                };
            })
        )
    ).filter(a => a.username !== 'guest');
};

let div: HTMLDivElement;

const set = async () => {
    const res = await Account.all();

    if (res.isOk()) {
        accounts = res.value;
    } else {
        console.error('Failed to get accounts: ', res.error);
    }

    document
        .querySelectorAll('.tooltip.bs-tooltip-auto')
        .forEach(e => e.remove());

    jQuery(div.querySelectorAll('[data-toggle="tooltip"]')).tooltip();
    // jQuery(div).dataTable();
};

onMount(set);

$: setAccounts(accounts);
$: console.log(accountObjs);

Account.on('new', set);
Account.on('update', set);
Account.on('delete', set);
</script>

<div class="table-responsive">
    <table bind:this="{div}" class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Roles</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each accountObjs as account (account.id)}
                <tr>
                    <td>
                        {account.firstName}
                        {account.lastName}
                    </td>
                    <td>
                        {account.username}
                        {#if account.verified}
                            <span
                                class="text-success cursor-help"
                                data-placement="top"
                                data-toggle="tooltip"
                                title="Verified"
                            >
                                <i class="material-icons">verified</i>
                            </span>
                        {:else}
                            <span
                                class="text-warning cursor-help"
                                data-placement="top"
                                data-toggle="tooltip"
                                title="Not Verified"
                            >
                                <i class="material-icons">dangerous</i>
                            </span>
                        {/if}
                    </td>
                    <td>{account.email}</td>
                    <td>
                        {#each account.roles as role (role.id)}
                            <RoleBadge
                                account="{accounts.find(
                                    a => a.id === account.id
                                )}"
                                deletable="{true}"
                                {role}
                            />
                        {/each}
                    </td>
                    <td>
                        <div class="btn-group">
                            <button
                                class="btn btn-primary"
                                data-placement="top"
                                data-toggle="tooltip"
                                data-tooltip="Add Role"
                                type="button"
                                on:click="{async () => {
                                    const res = await Role.all();
                                    if (res.isOk()) {
                                        const roles = res.value;
                                        const selected = await select(
                                            'Select a role to add',
                                            [
                                                ...roles
                                                    .filter(
                                                        r =>
                                                            !account.roles.some(
                                                                ar =>
                                                                    ar.id ===
                                                                    r.id
                                                            )
                                                    )
                                                    .map(r => r.name),
                                                'Create New Role'
                                            ]
                                        );

                                        if (selected === roles.length) {
                                            // Create New Role
                                            const name = await prompt(
                                                'Enter the name of the new role'
                                            );
                                            if (name) {
                                                const description =
                                                    await prompt(
                                                        'Enter the description of the new role'
                                                    );
                                                if (description) {
                                                    const r = await Role.new({
                                                        name,
                                                        description
                                                    });
                                                    if (r.isOk()) {
                                                        const a = accounts.find(
                                                            a =>
                                                                a.id ===
                                                                account.id
                                                        );
                                                        a?.addRole(r.value);
                                                    } else {
                                                        return console.error(
                                                            'Failed to create role: ',
                                                            r.error
                                                        );
                                                    }
                                                } else {
                                                    return console.error(
                                                        'Description not provided'
                                                    );
                                                }
                                            } else {
                                                return console.error(
                                                    'Name not provided'
                                                );
                                            }
                                        }

                                        const role = roles[selected];

                                        if (role) {
                                            const a = accounts.find(
                                                a => a.id === account.id
                                            );
                                            a?.addRole(role);
                                        }
                                    }
                                }}"
                            >
                                <i class="material-icons">add</i>
                            </button>
                            {#if account.verified}
                                <button
                                    class="btn btn-warning"
                                    data-placement="top"
                                    data-toggle="tooltip"
                                    data-tooltip="Unverify Account"
                                    type="button"
                                    on:click="{async () => {
                                        const res = await confirm(
                                            'Are you sure you want to unverify this account?'
                                        );
                                        if (res) {
                                            const a = accounts.find(
                                                a => a.id === account.id
                                            );
                                            a?.unverify();
                                        }
                                    }}"
                                >
                                    <i class="material-icons">block</i>
                                </button>
                            {:else}
                                <button
                                    class="btn btn-success"
                                    data-placement="top"
                                    data-toggle="tooltip"
                                    data-tooltip="Verify Account"
                                    type="button"
                                    on:click="{async () => {
                                        const res = await confirm(
                                            'Are you sure you want to verify this account?'
                                        );
                                        if (res) {
                                            const a = accounts.find(
                                                a => a.id === account.id
                                            );
                                            a?.verify();
                                        }
                                    }}"
                                >
                                    <i class="material-icons">verified</i>
                                </button>
                            {/if}
                            <button
                                class="btn btn-danger"
                                data-placement="top"
                                data-toggle="tooltip"
                                data-tooltip="Delete Account"
                                type="button"
                                on:click="{async () => {
                                    const res = await confirm(
                                        'Are you sure you want to delete this account?'
                                    );
                                    if (res) {
                                        const a = accounts.find(
                                            a => a.id === account.id
                                        );
                                        a?.delete();
                                    }
                                }}"
                            >
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
