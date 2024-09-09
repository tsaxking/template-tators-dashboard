<script lang="ts">
    import Main from '../components/main/Main.svelte';
    import Page from '../components/main/Page.svelte';
    import WebhookTesting from '../pages/WebhookTesting.svelte';

    const groups = [
        {
            name: 'Tests',
            pages: [
                {
                    name: 'webhooks',
                    icon: 'webhook'
                }
            ]
        }
    ];

    let active: string = 'webhooks';
    const domain = '';

    const openPage = ({ detail }) => {
        active = detail;
    };

    const navItems = [];

    const accountLinks = [
    // 'account',
    // 'contact',
    // null
    ];
</script>

<Main
    {accountLinks}
    {active}
    {groups}
    {navItems}
    title="Team Tators"
    on:openPage="{openPage}"
>
    <Page
        {active}
        {domain}
        title="webhooks"><WebhookTesting /></Page>
</Main>
