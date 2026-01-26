import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
  error: string | null;
  lastHeartbeat: number | null;
}

const initialState: SocketState = {
  status: 'disconnected',
  error: null,
  lastHeartbeat: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // Set status to connecting
    // TODO: Dispatch this from WebSocket service when initiating connection
    socketConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    // Set status to connected
    // TODO: Dispatch this from WebSocket service when connection is established
    socketConnected: (state) => {
      state.status = 'connected';
      state.error = null;
      state.lastHeartbeat = Date.now();
    },
    // Set status to disconnected
    // TODO: Dispatch this from WebSocket service when connection closes
    socketDisconnected: (state) => {
      state.status = 'disconnected';
      state.lastHeartbeat = null;
    },
    // Set status to reconnecting
    // TODO: Dispatch this from WebSocket service when attempting to reconnect
    socketReconnecting: (state) => {
      state.status = 'reconnecting';
    },
    // Set error state
    // TODO: Dispatch this from WebSocket service when connection error occurs
    socketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'disconnected';
    },
    // Update heartbeat timestamp
    // TODO: Dispatch this from WebSocket service on ping/pong events
    socketHeartbeat: (state) => {
      state.lastHeartbeat = Date.now();
    },
  },
});

export const {
  socketConnecting,
  socketConnected,
  socketDisconnected,
  socketReconnecting,
  socketError,
  socketHeartbeat,
} = socketSlice.actions;

export default socketSlice.reducer;
