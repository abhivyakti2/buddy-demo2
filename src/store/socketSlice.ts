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
    socketConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    socketConnected: (state) => {
      state.status = 'connected';
      state.error = null;
      state.lastHeartbeat = Date.now();
    },
    socketDisconnected: (state) => {
      state.status = 'disconnected';
      state.lastHeartbeat = null;
    },
    socketReconnecting: (state) => {
      state.status = 'reconnecting';
    },
    socketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'disconnected';
    },
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
