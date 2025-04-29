import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001/'; 
export const socket = io(SOCKET_URL, {
  autoConnect: true, 
  reconnection: true,
  timeout: 10000, 
  transports: ['websocket', 'polling'], 
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});
