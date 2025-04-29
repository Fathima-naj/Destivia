import WebSocket from "ws";
const socket = new WebSocket('ws://localhost:5001/');

socket.on('open', () => {
  console.log('Connected to WebSocket server');
  socket.send('Hello from client');
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

socket.on('close', () => {
  console.log('WebSocket connection closed');
});
