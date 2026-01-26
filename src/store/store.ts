// ============================================================================
// REDUX STORE - THE CENTRAL STATE MANAGEMENT HUB
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This file creates and configures the Redux store, which is the single source
// of truth for all global application state. Think of it as a centralized
// database that lives in memory and can be accessed from anywhere in the app.
//
// WHAT IS REDUX?
// Redux is a state management library that helps manage data that needs to be
// shared across multiple components. Without Redux, you'd have to pass data
// through many component layers (prop drilling) or use complex patterns.
//
// WHEN TO USE REDUX (GLOBAL STATE):
// - Data needs to be accessed by many unrelated components
// - Data needs to persist across page navigation
// - Data changes frequently and needs to update multiple UI parts
// - You need time-travel debugging and state inspection
// Examples: user authentication, current room, participants, votes
//
// WHEN NOT TO USE REDUX (LOCAL STATE):
// - Data only used in one component (use useState instead)
// - Temporary UI state like form inputs, modals, dropdowns
// - Animation states, hover states, focus states
// Examples: current image index in carousel, form step navigation
//
// Requires: npm install @reduxjs/toolkit react-redux
// ============================================================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import preferencesReducer from './preferencesSlice';
import roomsReducer from './roomsSlice';
import votesReducer from './votesSlice';
import recommendationsReducer from './recommendationsSlice';
import socketReducer from './socketSlice';

// ============================================================================
// STORE CONFIGURATION
// ============================================================================
// We use configureStore() from Redux Toolkit (not the old createStore).
// configureStore() automatically includes:
// - Redux DevTools integration (for debugging in browser)
// - Thunk middleware (for async operations like API calls)
// - Immutability checks (prevents accidental state mutations)
// - Serialization checks (ensures state can be saved/restored)
//
// HOW IT WORKS:
// 1. Each "slice" manages a specific piece of state (auth, rooms, votes, etc.)
// 2. configureStore() combines all slices into one unified state tree
// 3. Components can read any part of this state tree using useAppSelector
// 4. Components can modify state by dispatching actions using useAppDispatch
//
// THE DATA FLOW:
// User Action → dispatch(action) → Reducer updates state → Components re-render
// ============================================================================
export const store = configureStore({
  // The reducer object combines all slices into the global state tree
  // Each key becomes a top-level property in the state
  // Access pattern: state.auth, state.preferences, state.rooms, etc.
  reducer: {
    auth: authReducer,                     // User authentication state
    preferences: preferencesReducer,       // User preferences and settings
    rooms: roomsReducer,                   // Current room and participants
    votes: votesReducer,                   // Voting data per recommendation
    recommendations: recommendationsReducer, // List of recommendations
    socket: socketReducer,                 // WebSocket connection state
  },

  // Middleware configuration
  // Middleware sits between dispatching actions and the reducer updating state
  // It can intercept, modify, or cancel actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck ensures state can be saved and restored
      // We disable it for Supabase auth objects which contain non-serializable data
      // (like Date objects and functions)
      serializableCheck: {
        ignoredActions: ['auth/setSession', 'auth/setUser'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

// ============================================================================
// TYPESCRIPT TYPES FOR TYPE-SAFE REDUX ACCESS
// ============================================================================
// These types provide autocomplete and type safety when using Redux

// RootState: The complete shape of the Redux state tree
// Use this with useAppSelector to get typed state access
// Example: const user = useAppSelector((state: RootState) => state.auth.user)
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch: The type of the dispatch function
// Use this with useAppDispatch to get typed dispatch
// Example: const dispatch = useAppDispatch(); dispatch(setUser(user))
export type AppDispatch = typeof store.dispatch;
