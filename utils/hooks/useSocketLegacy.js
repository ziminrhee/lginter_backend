import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '../utils/constants';

let socket;

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = async () => {
    // Create socket connection
    socket = io(SOCKET_CONFIG.URL, {
      path: SOCKET_CONFIG.PATH,
      transports: SOCKET_CONFIG.TRANSPORTS
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
  };

  return { socket, isConnected };
}

