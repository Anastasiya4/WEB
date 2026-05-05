export function createLineChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Потужність',
        data: [],
        borderColor: 'orange'
      }]
    }
  });
}

export function createPieChart(ctx) {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Array.from({length: 24}, (_, i) => i + ":00"),
      datasets: [{
        data: new Array(24).fill(0),
        backgroundColor: [
          '#3498db','#e74c3c','#f39c12','#f1c40f','#1abc9c','#9b59b6',
          '#95a5a6','#2980b9','#ff6b81','#ff9f43','#00cec9','#6c5ce7',
          '#fd79a8','#636e72','#0984e3','#e17055','#fdcb6e','#00b894',
          '#d63031','#6c5ce7','#b2bec3','#2d3436','#fab1a0','#81ecec'
        ]
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      }
    }
  });
}