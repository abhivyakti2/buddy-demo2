// ============================================================================
// PREFERENCES SLICE - USER PREFERENCES AND SETTINGS
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages user preferences (activities, food choices, transport,
// home address). It's in Redux because preferences are needed across many
// components and screens (room creation, voting, recommendations).
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - Preferences are reused in multiple screens (onboarding, room creation)
// - Once loaded, they should be available throughout the app
// - Avoids re-fetching from database on every page
// - Multiple components may display or edit preferences
//
// WHEN TO USE THIS SLICE:
// - Pre-filling forms with user's saved preferences
// - Generating personalized recommendations
// - Displaying user settings in profile
// - Creating rooms with default preferences
//
// HOW IT CAUSES UI UPDATES:
// 1. Preferences load from database → dispatch(setUserPreferences(data))
// 2. preferencesSlice reducer updates state.preferences.userPreferences
// 3. Form components read preferences and pre-fill fields
// 4. When user edits → dispatch(updateActivities(newList)) → forms update
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// STATE SHAPE
// ============================================================================
export interface UserPreferences {
  id?: string;
  user_id?: string;
  activities: string[];                    // Preferred activity types (dining, sports, etc.)
  food_preferences: {
    categories: string[];                  // Preferred cuisines (Italian, Chinese, etc.)
    restrictions: string;                  // Dietary restrictions (vegetarian, gluten-free, etc.)
  };
  transport_preferences: string[];         // Preferred transport methods (car, metro, etc.)
  home_address: string;                    // User's home address for distance calculations
}

interface PreferencesState {
  userPreferences: UserPreferences | null; // The user's saved preferences
  loading: boolean;                        // Whether we're loading preferences
  error: string | null;                    // Any error that occurred
}

const initialState: PreferencesState = {
  userPreferences: null,
  loading: false,
  error: null,
};

// ============================================================================
// PREFERENCES SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    // ========================================================================
    // setUserPreferences - LOAD COMPLETE PREFERENCES
    // ========================================================================
    // WHAT IT DOES:
    // Stores the user's complete preference settings after loading from database
    //
    // WHEN TO CALL IT:
    // - After fetching preferences from Supabase on app start
    // - After user completes the onboarding preferences form
    //
    // HOW TO USE:
    // const { data } = await supabase.from('user_preferences').select('*');
    // dispatch(setUserPreferences(data));
    //
    // WHAT HAPPENS:
    // 1. Redux stores all preferences
    // 2. Forms throughout the app can pre-fill with these values
    // 3. Recommendation algorithm uses these preferences
    // ========================================================================
    // TODO: Dispatch this after fetching preferences from Supabase user_preferences table
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // updateActivities - UPDATE ACTIVITY PREFERENCES
    // ========================================================================
    // WHAT IT DOES:
    // Updates the list of preferred activities (dining, sports, culture, etc.)
    //
    // WHEN TO CALL IT:
    // - When user selects/deselects activities in preferences form
    //
    // HOW TO USE:
    // dispatch(updateActivities(['dining', 'sports', 'culture']));
    //
    // WHAT HAPPENS:
    // 1. Redux updates the activities list
    // 2. Forms reading this state re-render with updated selections
    // 3. You should persist to database after dispatching
    // ========================================================================
    // TODO: Persist to Supabase after dispatching this action
    updateActivities: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.activities = action.payload;
      }
    },

    // ========================================================================
    // updateFoodPreferences - UPDATE FOOD PREFERENCES
    // ========================================================================
    // WHAT IT DOES:
    // Updates food categories and dietary restrictions
    //
    // WHEN TO CALL IT:
    // - When user changes cuisine preferences or dietary restrictions
    //
    // HOW TO USE:
    // dispatch(updateFoodPreferences({
    //   categories: ['Italian', 'Japanese'],
    //   restrictions: 'vegetarian, no nuts'
    // }));
    //
    // WHAT HAPPENS:
    // Food preference forms update to reflect changes
    // ========================================================================
    // TODO: Persist to Supabase after dispatching this action
    updateFoodPreferences: (state, action: PayloadAction<{ categories: string[]; restrictions: string }>) => {
      if (state.userPreferences) {
        state.userPreferences.food_preferences = action.payload;
      }
    },

    // ========================================================================
    // updateTransport - UPDATE TRANSPORT PREFERENCES
    // ========================================================================
    // WHAT IT DOES:
    // Updates preferred transportation methods
    //
    // WHEN TO CALL IT:
    // - When user selects/deselects transport options
    //
    // HOW TO USE:
    // dispatch(updateTransport(['metro', 'taxi', 'walk']));
    // ========================================================================
    // TODO: Persist to Supabase after dispatching this action
    updateTransport: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.transport_preferences = action.payload;
      }
    },

    // ========================================================================
    // updateHomeAddress - UPDATE HOME ADDRESS
    // ========================================================================
    // WHAT IT DOES:
    // Updates the user's home address (used for distance calculations)
    //
    // WHEN TO CALL IT:
    // - When user enters or changes their home address
    //
    // HOW TO USE:
    // dispatch(updateHomeAddress('123 Main St, City, Country'));
    // ========================================================================
    // TODO: Persist to Supabase after dispatching this action
    updateHomeAddress: (state, action: PayloadAction<string>) => {
      if (state.userPreferences) {
        state.userPreferences.home_address = action.payload;
      }
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
  setUserPreferences,
  updateActivities,
  updateFoodPreferences,
  updateTransport,
  updateHomeAddress,
  setLoading,
  setError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
