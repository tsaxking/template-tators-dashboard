import './../../utilities/imports';

import { Chart } from 'chart.js';

import { generateTrace } from '../../../shared/dummy-data';
import { TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';
import { months } from '../../../shared/clock';
//Question: How many shots on average does a bot make per match
const traces: TraceArray[] = new Array(10).fill(0).map(generateTrace);

const canvas = create('canvas');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Could not get canvas context');

document.body.append(canvas);

const c = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: months.slice(0, 7),
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  });

  //Score Chart

  <div>
  <canvas id="myChart"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
</script>