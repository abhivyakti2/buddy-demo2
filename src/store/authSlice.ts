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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
  },
});

export const { setUser, setSession, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
