<script lang="ts">
import type { RetrievedScoutingAnswer } from '../../../../shared/db-types-extended';
import { FIRSTTeam } from '../../../models/FIRST/team';

export let team: FIRSTTeam;
let scouting: RetrievedScoutingAnswer[] = [];


const fns = {
    pullScouting: async (t: FIRSTTeam | undefined) => {
        if (!t) return;

        scouting = await t.getPitScouting();
    }
};

$: fns.pullScouting(team);
</script>


<div class="card">
    <div class="card-header">
        <h5 class="card-title">Pit Scouting</h5>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-dark table-striped">
                <tbody>
                    {#each scouting as s}
                        <tr>
                            <td>{s.questionKey}</td>
                            <td>{s.answer}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Edit</button>
    </div>
</div>