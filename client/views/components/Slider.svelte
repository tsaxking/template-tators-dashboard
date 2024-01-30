<script lang='ts'>
    import 'jquery-ui';
    import { Container } from '../../models/canvas/container';
    import { Trace } from '../../../shared/submodules/tatorscout-calculations/trace';
    //import {trace} from '../components/TraceView.svelte'
    export let trace: Trace
    let container = new Container(trace)
    const filter = (from: number, to: number) => container.filter((_, i) => i >= from && i <= to);
    const sliderDiv = $(create('div', {
        style: {
            height: '10px',
        },
    })).slider({
        range: true,
        min: 0,
        max: 600,
        values: [0, 600],
        slide: function (event, ui) {
            if (!ui?.values) return;
            const [from, to] = ui.values;
            filter(from, to);
        }
    });
</script>