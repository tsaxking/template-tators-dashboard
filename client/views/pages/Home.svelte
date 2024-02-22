<script lang="ts">
import { type BootstrapColor } from '../../submodules/colors/color';
const links: {
    link: string;
    name: string;
    description: string;
    image?: string;
    color: BootstrapColor;
    textColor: BootstrapColor;
    linkColor: BootstrapColor;
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
        linkColor: 'light'
    },
    {
        link: '/dashboard/admin',
        name: 'Admin',
        description: 'Admin dashboard for the Team Tators Scouting Dashboard.',
        color: 'danger',
        textColor: 'light',
        linkColor: 'light'
    },
    {
        link: '/dashboard/developer',
        name: 'Developer',
        description:
            'Tools for developers to manage the Team Tators Scouting Dashboard.',
        color: 'warning',
        textColor: 'dark',
        linkColor: 'dark'
    }
];
</script>

<main>
    <h1 class="text-center pt-2">Home</h1>
    <hr />
    <div class="container">
        <div class="row">
            {#each links as link}
                <div class="col-md-6 col-lg-4">
                    <div
                        class="d-flex position-relative hover hover-fast hover-grow-sm hover-grow shadow rounded p-3 m-2 bg-{link.color} text-{link.textColor}"
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
            {/each}
        </div>
    </div>
</main>
