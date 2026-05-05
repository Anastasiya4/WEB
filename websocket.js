const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

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

wss.on('connection', ws => {
  setInterval(() => {
    ws.send(JSON.stringify(generateData()));
  }, 2000);
});