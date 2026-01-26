import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import preferencesReducer from './preferencesSlice';
import roomsReducer from './roomsSlice';
import votesReducer from './votesSlice';
import recommendationsReducer from './recommendationsSlice';
import socketReducer from './socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    rooms: roomsReducer,
    votes: votesReducer,
    recommendations: recommendationsReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setSession', 'auth/setUser'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
