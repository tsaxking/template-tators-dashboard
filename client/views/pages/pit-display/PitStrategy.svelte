<script lang="ts">
import GlobalTeamSelect from './../../components/main/GlobalTeamSelect.svelte';
import DashboardCard from '../../components/main/DashboardCard.svelte';
</script>

<div class="container-fluid vh-100">
    <div class="row mb-3">
        <div class="col-md-3">
            <GlobalTeamSelect />
        </div>
        <div class="col-md-9 border rounded border-light-subtle">
            <h2>General Team Stats Here</h2>
        </div>
    </div>

    <div class="d-flex mb-3 h-50 bg-black border rounded border-light-subtle">
        <p class="fs-1">Whiteboard</p>
    </div>

    <div class="row mb-3 h-25">
        <DashboardCard title="Card 1" scroll="{false}" expandable="{true}"
        ></DashboardCard>
        <DashboardCard title="Card 2" scroll="{false}" expandable="{true}"
        ></DashboardCard>
        <DashboardCard title="Card 3" scroll="{false}" expandable="{true}"
        ></DashboardCard>
    </div>
</div>
