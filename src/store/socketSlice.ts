// ============================================================================
// SOCKET SLICE - WEBSOCKET CONNECTION STATE
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages the WebSocket connection status, which enables real-time
// features (live voting, participant updates, instant notifications). It's in
// Redux because connection status needs to be visible throughout the app.
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - Connection status affects multiple components (header, status bar, alerts)
// - Need to show connection indicators in multiple places
// - Errors need to be displayed app-wide
// - Reconnection logic needs global state
//
// WHEN TO USE THIS SLICE:
// - Showing connection status badge (connected/disconnected)
// - Displaying "reconnecting..." spinners
// - Monitoring connection health
// - Handling connection errors
// - Debugging real-time features
//
// HOW IT CAUSES UI UPDATES:
// 1. WebSocket connects → dispatch(socketConnected())
// 2. socketSlice reducer updates state.socket.status to 'connected'
// 3. Header shows green "Connected" badge
// 4. Real-time features become active
// 5. Connection drops → dispatch(socketDisconnected())
// 6. UI shows "Disconnected" warning and reconnect button
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// STATE SHAPE
// ============================================================================
interface SocketState {
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting'; // Current connection state
  error: string | null;        // Any connection error message
  lastHeartbeat: number | null; // Timestamp of last successful ping (for monitoring)
}

const initialState: SocketState = {
  status: 'disconnected',
  error: null,
  lastHeartbeat: null,
};

// ============================================================================
// SOCKET SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // ========================================================================
    // socketConnecting - CONNECTING TO WEBSOCKET
    // ========================================================================
    // WHAT IT DOES:
    // Sets status to 'connecting' when initiating WebSocket connection
    //
    // WHEN TO CALL IT:
    // - When calling socketService.connect()
    // - When attempting initial connection
    //
    // HOW TO USE:
    // dispatch(socketConnecting());
    // socketService.connect(roomId);
    //
    // WHAT HAPPENS:
    // UI shows "Connecting..." spinner or badge
    // ========================================================================
    // TODO: Dispatch this from WebSocket service when initiating connection
    socketConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },

    // ========================================================================
    // socketConnected - CONNECTION ESTABLISHED
    // ========================================================================
    // WHAT IT DOES:
    // Sets status to 'connected' when WebSocket connection succeeds
    //
    // WHEN TO CALL IT:
    // - When WebSocket 'open' event fires
    // - When connection is successfully established
    //
    // HOW TO USE:
    // // In WebSocket service:
    // socket.on('open', () => {
    //   dispatch(socketConnected());
    // });
    //
    // WHAT HAPPENS:
    // 1. Redux updates status to 'connected'
    // 2. UI shows green "Connected" badge
    // 3. Real-time features activate
    // 4. Vote updates flow in real-time
    // 5. Participant status updates appear instantly
    // ========================================================================
    // TODO: Dispatch this from WebSocket service when connection is established
    socketConnected: (state) => {
      state.status = 'connected';
      state.error = null;
      state.lastHeartbeat = Date.now(); // Record connection time
    },

    // ========================================================================
    // socketDisconnected - CONNECTION LOST
    // ========================================================================
    // WHAT IT DOES:
    // Sets status to 'disconnected' when WebSocket connection closes
    //
    // WHEN TO CALL IT:
    // - When WebSocket 'close' event fires
    // - When connection drops unexpectedly
    // - When user leaves room and disconnects
    //
    // HOW TO USE:
    // // In WebSocket service:
    // socket.on('close', () => {
    //   dispatch(socketDisconnected());
    // });
    //
    // WHAT HAPPENS:
    // 1. Redux updates status to 'disconnected'
    // 2. UI shows red "Disconnected" warning
    // 3. Real-time updates stop
    // 4. UI may show "Reconnect" button
    // ========================================================================
    // TODO: Dispatch this from WebSocket service when connection closes
    socketDisconnected: (state) => {
      state.status = 'disconnected';
      state.lastHeartbeat = null; // Clear heartbeat on disconnect
    },

    // ========================================================================
    // socketReconnecting - ATTEMPTING TO RECONNECT
    // ========================================================================
    // WHAT IT DOES:
    // Sets status to 'reconnecting' when attempting to restore connection
    //
    // WHEN TO CALL IT:
    // - After disconnect, when starting automatic reconnection
    // - When user clicks "Reconnect" button
    //
    // HOW TO USE:
    // dispatch(socketReconnecting());
    // attemptReconnect();
    //
    // WHAT HAPPENS:
    // UI shows "Reconnecting..." spinner with retry indication
    // ========================================================================
    // TODO: Dispatch this from WebSocket service when attempting to reconnect
    socketReconnecting: (state) => {
      state.status = 'reconnecting';
    },

    // ========================================================================
    // socketError - CONNECTION ERROR OCCURRED
    // ========================================================================
    // WHAT IT DOES:
    // Stores error message when WebSocket encounters a problem
    //
    // WHEN TO CALL IT:
    // - When WebSocket 'error' event fires
    // - When connection fails due to network issues
    // - When authentication fails
    //
    // HOW TO USE:
    // // In WebSocket service:
    // socket.on('error', (error) => {
    //   dispatch(socketError(error.message));
    // });
    //
    // WHAT HAPPENS:
    // 1. Redux stores error message
    // 2. UI displays error alert or toast
    // 3. Status set to 'disconnected'
    // 4. User can see what went wrong
    // ========================================================================
    // TODO: Dispatch this from WebSocket service when connection error occurs
    socketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'disconnected';
    },

    // ========================================================================
    // socketHeartbeat - UPDATE CONNECTION HEALTH TIMESTAMP
    // ========================================================================
    // WHAT IT DOES:
    // Records timestamp when receiving a heartbeat/ping response
    //
    // WHEN TO CALL IT:
    // - When WebSocket receives 'pong' response to 'ping'
    // - Periodically to monitor connection health
    //
    // HOW TO USE:
    // // In WebSocket service (every 30 seconds):
    // socket.emit('ping');
    // socket.on('pong', () => {
    //   dispatch(socketHeartbeat());
    // });
    //
    // WHAT HAPPENS:
    // 1. Redux updates lastHeartbeat timestamp
    // 2. Can calculate time since last successful communication
    // 3. Can detect stale connections
    // 4. Can trigger reconnection if heartbeat too old
    //
    // WHY THIS MATTERS:
    // Sometimes connections appear "open" but are actually dead. Heartbeats
    // help detect these zombie connections and trigger reconnection.
    // ========================================================================
    // TODO: Dispatch this from WebSocket service on ping/pong events
    socketHeartbeat: (state) => {
      state.lastHeartbeat = Date.now();
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
export const {
  socketConnecting,
  socketConnected,
  socketDisconnected,
  socketReconnecting,
  socketError,
  socketHeartbeat,
} = socketSlice.actions;

export default socketSlice.reducer;
