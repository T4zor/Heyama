'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiUrl, ObjectItem } from './api';

export function useSocket(
  onObjectCreated?: (obj: ObjectItem) => void,
  onObjectDeleted?: (data: { id: string }) => void,
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(getApiUrl(), {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket');
    });

    if (onObjectCreated) {
      socket.on('object:created', onObjectCreated);
    }

    if (onObjectDeleted) {
      socket.on('object:deleted', onObjectDeleted);
    }

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
