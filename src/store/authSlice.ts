import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set the authenticated user
    // TODO: Dispatch this after successful Supabase auth.signIn/signUp
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Set the user session
    // TODO: Dispatch this when Supabase auth.onAuthStateChange fires
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },
    // Set loading state during authentication operations
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Set error state when authentication fails
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Clear user and session on logout
    // TODO: Call Supabase auth.signOut() before dispatching this
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
  },
});

export const { setUser, setSession, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
