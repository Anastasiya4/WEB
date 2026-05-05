const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

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

app.get('/api/current', (req, res) => {
  res.json(generateData());
});

app.listen(3000, () => {
  console.log('REST API: http://localhost:3000');
});