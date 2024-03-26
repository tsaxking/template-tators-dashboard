<script lang="ts">
import { type BootstrapColor } from '../../submodules/colors/color';
import { type Permission } from '../../../shared/permissions';
import { Account } from '../../models/account';

let permissions: Permission[] = [];

const links: {
    link: string;
    name: string;
    description: string;
    image?: string;
    color: BootstrapColor;
    textColor: BootstrapColor;
    linkColor: BootstrapColor;
    requiredPermission?: Permission;
}[] = [
    {
        link: '/dashboard/2024',
        name: '2024 Tator Scout Dashboard',
        description: 'Scout data for the 2024 Tator team.',
        color: 'primary',
        textColor: 'light',
        linkColor: 'light'
    },
    {
        link: '/dashboard/mentor',
        name: 'Mentor',
        description:
            'Tools for mentors to manage the Team Tators Scouting Dashboard.',
        color: 'success',
        textColor: 'light',
        linkColor: 'light',
        requiredPermission: 'mentor'
    },
    {
        link: '/dashboard/admin',
        name: 'Admin',
        description: 'Admin dashboard for the Team Tators Scouting Dashboard.',
        color: 'danger',
        textColor: 'light',
        linkColor: 'light',
        requiredPermission: 'admin'
    },
    {
        link: '/dashboard/developer',
        name: 'Developer',
        description:
            'Tools for developers to manage the Team Tators Scouting Dashboard.',
        color: 'warning',
        textColor: 'dark',
        linkColor: 'dark',
        requiredPermission: 'developer'
    },
    {
        link: '/dashboard/2023',
        name: '2023 Tator Scout Dashboard',
        description: 'Scout data for the 2023 Tator team. (for developers)',
        color: 'info',
        textColor: 'light',
        linkColor: 'light',
        requiredPermission: 'developer'
    }
];

Account.getAccount().then(async a => {
    if (!a) return;
    const perms = await a.getPermissions();
    console.log(perms);
    if (perms.isOk())
        permissions = perms.value.map(p => p.permission as Permission);
    else console.error(perms.error);
});
</script>

<main>
    <h1 class="text-center pt-2">Home</h1>
    <hr />
    <div class="container">
        <div class="row">
            {#each links as link}
                {#if (link.requiredPermission && permissions.includes(link.requiredPermission)) || !link.requiredPermission}
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div
                            class="d-flex position-relative hover hover-fast hover-grow-sm hover-grow shadow rounded p-3 m-2 bg-{link.color} text-{link.textColor} home-card"
                        >
                            {#if link.image}
                                <img
                                    src="{link.image}"
                                    alt="{link.name}"
                                    class="mr-3"
                                    style="width: 100px; height: 100px;"
                                />
                            {/if}
                            <div>
                                <h5 class="mt-0">{link.name}</h5>
                                <p>{link.description}</p>
                                <a
                                    href="{link.link}"
                                    class="stretched-link link-{link.linkColor}"
                                    >Go to {link.name}</a
                                >
                            </div>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
<footer>
    <a href=https://github.com/tsaxking/template-tators-dashboard target=_blank>Git Hub Page</a>
</footer>
</main>

<style>
.home-card {
    cursor: pointer;
    height: 100% !important;
}
</style>
