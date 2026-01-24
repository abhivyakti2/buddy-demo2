import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  room_code: string;
  creator_id: string;
  occasion: string;
  mood_atmosphere: string[];
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  is_online: boolean;
  joined_at: string;
  last_seen: string;
  user_email?: string;
}

export interface SessionPreferences {
  id?: string;
  room_id: string;
  user_id: string;
  budget: string;
  distance_km: number | null;
  location: string;
  outdoor_indoor: string;
  activities: string[];
  food_preferences: {
    categories: string[];
    restrictions: string;
  };
}

interface RoomsState {
  currentRoom: Room | null;
  participants: Participant[];
  sessionPreferences: SessionPreferences | null;
  websocketStatus: 'connected' | 'disconnected' | 'connecting';
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

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateRoomStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentRoom) {
        state.currentRoom.is_active = action.payload;
      }
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      const exists = state.participants.find(p => p.user_id === action.payload.user_id);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },
    updateParticipantStatus: (state, action: PayloadAction<{ user_id: string; is_online: boolean }>) => {
      const participant = state.participants.find(p => p.user_id === action.payload.user_id);
      if (participant) {
        participant.is_online = action.payload.is_online;
        participant.last_seen = new Date().toISOString();
      }
    },
    setSessionPreferences: (state, action: PayloadAction<SessionPreferences>) => {
      state.sessionPreferences = action.payload;
    },
    setWebsocketStatus: (state, action: PayloadAction<'connected' | 'disconnected' | 'connecting'>) => {
      state.websocketStatus = action.payload;
    },
    clearRoom: (state) => {
      state.currentRoom = null;
      state.participants = [];
      state.sessionPreferences = null;
      state.websocketStatus = 'disconnected';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

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
