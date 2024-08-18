<script lang="ts">
import { prompt } from '../../utilities/notifications';
import { ServerRequest } from '../../utilities/requests';
import { capitalize, fromCamelCase } from '../../../shared/text';

let key: string = window.localStorage.getItem('webhook-key') || '';
let code: string | undefined;

const runWebhook = async (path: string) => {
    const paramRegex = /:([a-zA-Z0-9]+)/g;
    const params = path.match(paramRegex);
    if (!params) return;

    for (const param of params) {
        const data = await prompt(
            'Enter value for ' + capitalize(fromCamelCase(param.slice(1)))
        );
        if (!data) return;
        path = path.replace(param, data);
    }

    const res = await ServerRequest.post('/api/webhooks' + path, null, {
        headers: {
            'x-auth-key': key || ''
        }
    });

    if (res.isOk()) code = JSON.stringify(res.value, null, 4);
    else code = res.error.message;
};

$: window.localStorage.setItem('webhook-key', key);
</script>

<div class="container">
    <div class="row mb-3">
        <div class="form-floating">
            <input
                bind:value="{key}"
                type="password"
                name="webhook-key"
                id="webhook-key"
                class="form-control"
            />
            <label for="webhook-key">Webhook Key</label>
        </div>
    </div>
    <div class="row mb-3">
        <div class="btn-group">
            <button
                class="btn btn-primary"
                on:click="{() => runWebhook('/event/:eventKey/summary')}"
            >
                Summary
            </button>
            <button
                class="btn btn-warning"
                on:click="{() => runWebhook('/event/:eventKey/scout-groups')}"
            >
                Scout Groups
            </button>
            <button
                class="btn btn-danger"
                on:click="{() => runWebhook('/event/:eventKey/comments')}"
            >
                All Comments
            </button>
            <button
                class="btn btn-success"
                on:click="{() =>
                    runWebhook('/event/:eventKey/team/:teamNumber/comments')}"
            >
                Comments from team
            </button>
            <button
                class="btn btn-info"
                on:click="{() => runWebhook('/event/:eventKey/match-scouting')}"
            >
                All Match Scouting
            </button>
            <button
                class="btn btn-secondary"
                on:click="{() =>
                    runWebhook(
                        '/event/:eventKey/team/:teamNumber/match-scouting'
                    )}"
            >
                Match Scouting from team
            </button>
            <button
                class="btn btn-light"
                on:click="{() => runWebhook('/event/:eventKey/teams/traces')}"
            >
                Traces
            </button>
        </div>
    </div>
    <div class="row mb-3">
        {#if code}
            <pre>{code}</pre>
        {:else}
            <p>No data</p>
        {/if}
    </div>
</div>

<style>
pre {
    white-space: pre-wrap;
    background-color: #323639;
    border-radius: 5px;
    padding: 10px;
}
</style>
