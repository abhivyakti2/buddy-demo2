// ============================================================================
// AUTH SLICE - USER AUTHENTICATION STATE
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages all authentication-related state (logged-in user, session,
// login status). It's in Redux because authentication status needs to be
// accessed by many components throughout the app (navigation, protected routes,
// user profile, etc.).
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - Multiple unrelated components need to know if user is logged in
// - User data persists across page navigation
// - Many features depend on authentication state
// - If user logs out, the entire app needs to know immediately
//
// WHEN TO USE THIS SLICE:
// - Checking if a user is logged in (for showing/hiding UI elements)
// - Displaying user information (name, email, avatar)
// - Protecting routes that require authentication
// - Managing login/logout flows
//
// HOW IT CAUSES UI UPDATES:
// 1. User logs in → dispatch(setUser(userData))
// 2. authSlice reducer updates state.auth.user
// 3. All components using useAppSelector(state => state.auth.user) re-render
// 4. Navigation bar shows user name, protected routes become accessible
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

// ============================================================================
// STATE SHAPE
// ============================================================================
// This defines what data the auth slice stores
interface AuthState {
  user: User | null;       // The logged-in user object (or null if not logged in)
  session: any | null;     // The authentication session from Supabase
  loading: boolean;        // Whether we're checking authentication status
  error: string | null;    // Any authentication error messages
}

// Initial state when the app first loads
// loading is true because we need to check if user is already logged in
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

// ============================================================================
// AUTH SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
// createSlice is a Redux Toolkit helper that generates:
// 1. Action creators (functions that create actions)
// 2. A reducer (function that updates state based on actions)
//
// Think of actions as "events" that describe what happened
// Think of reducers as "event handlers" that update state based on those events
// ============================================================================
const authSlice = createSlice({
  name: 'auth', // This becomes the prefix for action types: 'auth/setUser', 'auth/logout', etc.
  initialState,
  reducers: {
    // ========================================================================
    // setUser - STORE THE LOGGED-IN USER
    // ========================================================================
    // WHAT IT DOES:
    // Sets the authenticated user in Redux state after successful login/signup
    //
    // WHEN TO CALL IT:
    // - After successful Supabase auth.signIn()
    // - After successful Supabase auth.signUp()
    // - When auth.onAuthStateChange fires with a user
    //
    // HOW TO USE:
    // dispatch(setUser(userData));
    //
    // WHAT HAPPENS:
    // 1. Redux updates state.auth.user with the new user data
    // 2. All components reading state.auth.user re-render
    // 3. Navigation might redirect to protected routes
    // 4. UI shows user information (name, avatar, etc.)
    // ========================================================================
    // TODO: Dispatch this after successful Supabase auth.signIn/signUp
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // setSession - STORE THE AUTHENTICATION SESSION
    // ========================================================================
    // WHAT IT DOES:
    // Stores the Supabase session object which contains tokens and metadata
    //
    // WHEN TO CALL IT:
    // - When Supabase auth.onAuthStateChange fires
    // - After successful authentication
    //
    // HOW TO USE:
    // dispatch(setSession(sessionData));
    // ========================================================================
    // TODO: Dispatch this when Supabase auth.onAuthStateChange fires
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },

    // ========================================================================
    // setLoading - UPDATE LOADING STATE
    // ========================================================================
    // WHAT IT DOES:
    // Controls the loading spinner shown during authentication operations
    //
    // WHEN TO CALL IT:
    // - Set to true when starting login/signup
    // - Set to false when authentication completes (success or failure)
    //
    // HOW TO USE:
    // dispatch(setLoading(true));  // Show loading spinner
    // dispatch(setLoading(false)); // Hide loading spinner
    //
    // WHAT HAPPENS:
    // Components reading state.auth.loading show/hide loading indicators
    // ========================================================================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ========================================================================
    // setError - STORE AUTHENTICATION ERRORS
    // ========================================================================
    // WHAT IT DOES:
    // Stores error messages when authentication fails
    //
    // WHEN TO CALL IT:
    // - When login fails (wrong password, user doesn't exist)
    // - When signup fails (email already taken, weak password)
    // - When any auth operation fails
    //
    // HOW TO USE:
    // dispatch(setError('Invalid email or password'));
    //
    // WHAT HAPPENS:
    // Error messages appear in the login/signup form
    // ========================================================================
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ========================================================================
    // logout - CLEAR USER DATA ON LOGOUT
    // ========================================================================
    // WHAT IT DOES:
    // Clears all authentication data when user logs out
    //
    // WHEN TO CALL IT:
    // - After calling Supabase auth.signOut()
    // - When user clicks logout button
    //
    // HOW TO USE:
    // await supabase.auth.signOut();  // First clear Supabase session
    // dispatch(logout());              // Then clear Redux state
    //
    // WHAT HAPPENS:
    // 1. Redux clears user and session data
    // 2. All components reading auth state re-render
    // 3. User gets redirected to login page
    // 4. Protected routes become inaccessible
    // ========================================================================
    // TODO: Call Supabase auth.signOut() before dispatching this
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
// Export action creators so components can dispatch these actions
// These are automatically generated by createSlice
export const { setUser, setSession, setLoading, setError, logout } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
