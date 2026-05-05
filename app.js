import { getCurrentData, connectWebSocket } from './api.js';
import { createLineChart, createPieChart } from './charts.js';

const lineChart = createLineChart(document.getElementById('lineChart'));
const pieChart = createPieChart(document.getElementById('pieChart'));

let hourlyData = new Array(24).fill(0);
let history = [];

function generateData() {
  return {
    timestamp: Date.now(),
    power: 500 + Math.random() * 500,
    daily: 3000 + Math.random() * 1000,
    monthly: 100000 + Math.random() * 20000,
    efficiency: 70 + Math.random() * 20,
    irradiance: 700 + Math.random() * 300,
    temperature: 25 + Math.random() * 20
  };
}

function updateLegend() {
  const container = document.getElementById('pieLegend');
  container.innerHTML = '';

  pieChart.data.labels.forEach((label, i) => {
    const value = hourlyData[i];
    if (value === 0) return;

    const item = document.createElement('div');
    item.className = 'legend-item';

    item.innerHTML = `
      <div class="legend-color" style="background:${pieChart.data.datasets[0].backgroundColor[i]}"></div>
      ${label}
    `;

    container.appendChild(item);
  });
}

function updateUI(data) {
  document.getElementById('power').innerText = data.power.toFixed(1);
  document.getElementById('daily').innerText = data.daily.toFixed(1);
  document.getElementById('monthly').innerText = data.monthly.toFixed(1);
  document.getElementById('eff').innerText = data.efficiency.toFixed(1) + '%';
  document.getElementById('irr').innerText = data.irradiance.toFixed(1);
  document.getElementById('temp').innerText = data.temperature.toFixed(1);

  const time = new Date(data.timestamp);
  const hour = time.getHours();

  // LINE
  lineChart.data.labels.push(time.toLocaleTimeString());
  lineChart.data.datasets[0].data.push(data.power);

  if (lineChart.data.labels.length > 24) {
    lineChart.data.labels.shift();
    lineChart.data.datasets[0].data.shift();
  }

  lineChart.update();

  // PIE
  hourlyData[hour] += data.power;
  pieChart.data.datasets[0].data = hourlyData;
  pieChart.update();

  updateLegend();

  // TABLE
  history.unshift(data);
  if (history.length > 10) history.pop();

  let html = '<table class="table"><tr><th>Час</th><th>Потужність</th></tr>';
  history.forEach(d => {
    html += `<tr><td>${new Date(d.timestamp).toLocaleTimeString()}</td><td>${d.power.toFixed(1)}</td></tr>`;
  });
  html += '</table>';

  document.getElementById('table').innerHTML = html;

  // HEATMAP
  const heatmap = document.getElementById('heatmap');
  heatmap.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const val = 60 + Math.random() * 40;
    const div = document.createElement('div');
    div.className = 'cell';
    div.style.background = val > 85 ? 'green' : val > 70 ? 'yellow' : 'red';
    heatmap.appendChild(div);
  }
}

setInterval(() => {
  updateUI(generateData());
}, 2000);