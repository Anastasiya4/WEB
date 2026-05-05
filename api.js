export async function getCurrentData() {
  const res = await fetch('http://localhost:3000/api/current');
  return await res.json();
}

export function connectWebSocket(onData) {
  const socket = new WebSocket('ws://localhost:8080');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onData(data);
  };

  return socket;
}