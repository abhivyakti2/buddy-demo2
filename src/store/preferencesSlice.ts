import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  activities: string[];
  food_preferences: {
    categories: string[];
    restrictions: string;
  };
  transport_preferences: string[];
  home_address: string;
}

interface PreferencesState {
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: PreferencesState = {
  userPreferences: null,
  loading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    // Set complete user preferences
    // TODO: Dispatch this after fetching preferences from Supabase user_preferences table
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Update activities array
    // TODO: Persist to Supabase after dispatching this action
    updateActivities: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.activities = action.payload;
      }
    },
    // Update food preferences
    // TODO: Persist to Supabase after dispatching this action
    updateFoodPreferences: (state, action: PayloadAction<{ categories: string[]; restrictions: string }>) => {
      if (state.userPreferences) {
        state.userPreferences.food_preferences = action.payload;
      }
    },
    // Update transport preferences
    // TODO: Persist to Supabase after dispatching this action
    updateTransport: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.transport_preferences = action.payload;
      }
    },
    // Update home address
    // TODO: Persist to Supabase after dispatching this action
    updateHomeAddress: (state, action: PayloadAction<string>) => {
      if (state.userPreferences) {
        state.userPreferences.home_address = action.payload;
      }
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setUserPreferences,
  updateActivities,
  updateFoodPreferences,
  updateTransport,
  updateHomeAddress,
  setLoading,
  setError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
