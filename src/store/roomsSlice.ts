// ============================================================================
// ROOMS SLICE - CURRENT ROOM AND PARTICIPANT STATE
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages everything related to the current voting room: room details,
// participants list, session preferences, and WebSocket status. It's in Redux
// because multiple components need this data (room page, voting page, participant
// list, header navigation).
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - Room data is shared across multiple pages (room page, voting page)
// - Participants list needs real-time updates visible everywhere
// - Session preferences affect multiple features (voting, recommendations)
// - WebSocket status needs to be monitored by multiple components
//
// WHEN TO USE THIS SLICE:
// - Displaying current room information (occasion, time, mood)
// - Showing list of participants who joined
// - Checking if voting is active (is_active status)
// - Managing session-specific preferences (different from user preferences)
// - Monitoring real-time connection status
//
// HOW IT CAUSES UI UPDATES:
// 1. User joins room → dispatch(setCurrentRoom(roomData))
// 2. roomsSlice reducer updates state.rooms.currentRoom
// 3. Room page and voting page read this and display room info
// 4. Participant joins → WebSocket event → dispatch(addParticipant(user))
// 5. Participant list component re-renders showing new participant
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// STATE SHAPE
// ============================================================================
export interface Room {
  id: string;
  room_code: string;                // The shareable room code (e.g., "ABC123")
  creator_id: string;               // User ID of the room creator (host)
  occasion: string;                 // What's the occasion (birthday, date night, etc.)
  mood_atmosphere: string[];        // Desired mood (casual, celebratory, romantic, etc.)
  start_time: string | null;        // When the outing starts
  end_time: string | null;          // When the outing ends
  duration_minutes: number | null;  // Expected duration
  is_active: boolean;               // Whether voting is currently active
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  is_online: boolean;               // Whether participant is currently connected
  joined_at: string;                // When they joined the room
  last_seen: string;                // Last activity timestamp
  user_email?: string;              // Participant's email for display
}

export interface SessionPreferences {
  id?: string;
  room_id: string;
  user_id: string;
  budget: string;                   // Budget for this specific outing
  distance_km: number | null;       // Maximum distance to travel
  location: string;                 // Starting location for this outing
  outdoor_indoor: string;           // Outdoor/indoor preference for this outing
  activities: string[];             // Activities for this outing (can differ from user prefs)
  food_preferences: {
    categories: string[];           // Food preferences for this outing
    restrictions: string;
  };
}

interface RoomsState {
  currentRoom: Room | null;                        // The room user is currently in
  participants: Participant[];                     // All participants in current room
  sessionPreferences: SessionPreferences | null;   // User's preferences for this specific session
  websocketStatus: 'connected' | 'disconnected' | 'connecting'; // Real-time connection status
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  currentRoom: null,
  participants: [],
  sessionPreferences: null,
  websocketStatus: 'disconnected',
  loading: false,
  error: null,
};

// ============================================================================
// ROOMS SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // ========================================================================
    // setCurrentRoom - SET THE ACTIVE ROOM
    // ========================================================================
    // WHAT IT DOES:
    // Stores the room data when user joins or creates a room
    //
    // WHEN TO CALL IT:
    // - After creating a new room
    // - After joining an existing room
    // - After fetching room data from database
    //
    // HOW TO USE:
    // const { data: room } = await supabase.from('rooms').select('*');
    // dispatch(setCurrentRoom(room));
    //
    // WHAT HAPPENS:
    // 1. Redux stores the room data
    // 2. Room page displays room code, occasion, mood
    // 3. Voting page can check if voting is active
    // 4. Header can show room code
    // ========================================================================
    // TODO: Dispatch this after fetching room from Supabase rooms table
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // updateRoomStatus - TOGGLE VOTING ON/OFF
    // ========================================================================
    // WHAT IT DOES:
    // Updates whether voting is currently active in the room
    //
    // WHEN TO CALL IT:
    // - When host clicks "Start Voting" button
    // - When host clicks "End Voting" button
    // - When WebSocket receives voting status change from server
    //
    // HOW TO USE:
    // dispatch(updateRoomStatus(true));  // Start voting
    // dispatch(updateRoomStatus(false)); // End voting
    //
    // WHAT HAPPENS:
    // 1. Redux updates is_active flag
    // 2. Room page shows "Voting Active" indicator
    // 3. Voting page becomes accessible
    // 4. All participants see the change via WebSocket
    // ========================================================================
    // TODO: Persist to Supabase rooms table after dispatching this action
    // TODO: Emit WebSocket event for real-time updates to all participants
    updateRoomStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentRoom) {
        state.currentRoom.is_active = action.payload;
      }
    },

    // ========================================================================
    // setParticipants - LOAD ALL PARTICIPANTS
    // ========================================================================
    // WHAT IT DOES:
    // Sets the complete list of participants in the room
    //
    // WHEN TO CALL IT:
    // - After joining a room (load existing participants)
    // - After fetching participants from database
    //
    // HOW TO USE:
    // const { data } = await supabase.from('room_participants').select('*');
    // dispatch(setParticipants(data));
    //
    // WHAT HAPPENS:
    // Participant list component displays all participants
    // ========================================================================
    // TODO: Dispatch this after fetching participants from Supabase room_participants table
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },

    // ========================================================================
    // addParticipant - ADD NEW PARTICIPANT TO ROOM
    // ========================================================================
    // WHAT IT DOES:
    // Adds a single participant when they join the room
    //
    // WHEN TO CALL IT:
    // - When WebSocket receives "participant-joined" event
    // - When a friend joins the room in real-time
    //
    // HOW TO USE:
    // // In WebSocket event handler:
    // socket.on('participant-joined', (participant) => {
    //   dispatch(addParticipant(participant));
    // });
    //
    // WHAT HAPPENS:
    // 1. Redux adds participant to the list
    // 2. Participant list component re-renders
    // 3. New participant appears in the sidebar
    // 4. Participant count updates
    // ========================================================================
    // TODO: Dispatch this when WebSocket receives participant-joined event
    addParticipant: (state, action: PayloadAction<Participant>) => {
      const exists = state.participants.find(p => p.user_id === action.payload.user_id);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },

    // ========================================================================
    // updateParticipantStatus - UPDATE ONLINE/OFFLINE STATUS
    // ========================================================================
    // WHAT IT DOES:
    // Updates whether a participant is currently online/offline
    //
    // WHEN TO CALL IT:
    // - When WebSocket receives participant status change
    // - When participant disconnects or reconnects
    //
    // HOW TO USE:
    // dispatch(updateParticipantStatus({
    //   user_id: 'user123',
    //   is_online: false
    // }));
    //
    // WHAT HAPPENS:
    // Participant list shows online/offline indicators (green dot/gray)
    // ========================================================================
    // TODO: Dispatch this when WebSocket receives participant status change event
    updateParticipantStatus: (state, action: PayloadAction<{ user_id: string; is_online: boolean }>) => {
      const participant = state.participants.find(p => p.user_id === action.payload.user_id);
      if (participant) {
        participant.is_online = action.payload.is_online;
        participant.last_seen = new Date().toISOString();
      }
    },

    // ========================================================================
    // setSessionPreferences - STORE SESSION-SPECIFIC PREFERENCES
    // ========================================================================
    // WHAT IT DOES:
    // Stores preferences specific to this room/session (can differ from user's
    // default preferences). For example, user might usually prefer outdoor
    // activities, but for this specific birthday party they want indoor.
    //
    // WHEN TO CALL IT:
    // - After creating a room with customized preferences
    // - After fetching session preferences from database
    //
    // HOW TO USE:
    // dispatch(setSessionPreferences(sessionPrefs));
    //
    // WHAT HAPPENS:
    // Recommendation algorithm uses these session-specific preferences
    // ========================================================================
    // TODO: Dispatch this after fetching from Supabase session_preferences table
    setSessionPreferences: (state, action: PayloadAction<SessionPreferences>) => {
      state.sessionPreferences = action.payload;
    },

    // ========================================================================
    // setWebsocketStatus - UPDATE REAL-TIME CONNECTION STATUS
    // ========================================================================
    // WHAT IT DOES:
    // Tracks whether WebSocket connection is active, connecting, or disconnected
    //
    // WHEN TO CALL IT:
    // - When WebSocket connection opens: dispatch(setWebsocketStatus('connected'))
    // - When trying to connect: dispatch(setWebsocketStatus('connecting'))
    // - When connection closes: dispatch(setWebsocketStatus('disconnected'))
    //
    // HOW TO USE:
    // dispatch(setWebsocketStatus('connected'));
    //
    // WHAT HAPPENS:
    // UI can show connection indicators (e.g., "Connected" badge, reconnecting spinner)
    // ========================================================================
    // TODO: Dispatch this from WebSocket service based on connection state
    setWebsocketStatus: (state, action: PayloadAction<'connected' | 'disconnected' | 'connecting'>) => {
      state.websocketStatus = action.payload;
    },

    // ========================================================================
    // clearRoom - RESET ALL ROOM DATA
    // ========================================================================
    // WHAT IT DOES:
    // Clears all room-related data when leaving a room
    //
    // WHEN TO CALL IT:
    // - When user navigates away from room
    // - When user explicitly leaves/exits room
    //
    // HOW TO USE:
    // dispatch(clearRoom());
    // navigate('/room-selection');
    //
    // WHAT HAPPENS:
    // All room data is cleared, WebSocket disconnects, ready for next room
    // ========================================================================
    clearRoom: (state) => {
      state.currentRoom = null;
      state.participants = [];
      state.sessionPreferences = null;
      state.websocketStatus = 'disconnected';
    },

    // ========================================================================
    // setLoading - UPDATE LOADING STATE
    // ========================================================================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ========================================================================
    // setError - STORE ERROR MESSAGE
    // ========================================================================
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
export const {
  setCurrentRoom,
  updateRoomStatus,
  setParticipants,
  addParticipant,
  updateParticipantStatus,
  setSessionPreferences,
  setWebsocketStatus,
  clearRoom,
  setLoading,
  setError,
} = roomsSlice.actions;

export default roomsSlice.reducer;
