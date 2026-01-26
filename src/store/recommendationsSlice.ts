// ============================================================================
// RECOMMENDATIONS SLICE - PLACE RECOMMENDATIONS AND SAVED ITEMS
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages the list of recommendations (restaurants, activities,
// places) generated for the room, and which recommendations users have saved.
// It's in Redux because recommendations need to be shared across multiple
// components and participants.
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - All participants in a room see the same recommendations
// - Recommendations are used in both voting page and results page
// - Saved recommendations need to persist across pages
// - New recommendations may be added during the session
//
// WHEN TO USE THIS SLICE:
// - Displaying the list of recommendations to vote on
// - Showing saved recommendations in user's favorites
// - Adding new recommendations from AI/backend
// - Filtering and sorting recommendations
//
// HOW IT CAUSES UI UPDATES:
// 1. Room created → AI generates recommendations → dispatch(setRecommendations(recs))
// 2. recommendationsSlice reducer updates state.recommendations.recommendations
// 3. Voting page displays recommendation cards
// 4. User saves one → dispatch(addSavedRecommendation(saved))
// 5. Saved icon updates, item appears in favorites list
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// STATE SHAPE
// ============================================================================
export interface Recommendation {
  id: string;
  room_id: string;
  name: string;              // Name of the place/activity
  description: string;       // Detailed description
  category: string;          // restaurant, activity, etc.
  price_level: string;       // $, $$, $$$, $$$$
  location: string;          // Address or area
  distance_km: number | null; // Distance from starting point
  rating: number | null;     // Rating out of 5
  images: string[];          // Array of image URLs
  parameters: Record<string, any>; // Custom parameters (ambience, timing, etc.)
  created_at: string;
}

export interface SavedRecommendation {
  id: string;
  user_id: string;           // Who saved this
  recommendation_id: string;  // Which recommendation was saved
  saved_at: string;
}

interface RecommendationsState {
  recommendations: Recommendation[];          // All recommendations for current room
  savedRecommendations: SavedRecommendation[]; // User's saved favorites
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendations: [],
  savedRecommendations: [],
  loading: false,
  error: null,
};

// ============================================================================
// RECOMMENDATIONS SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    // ========================================================================
    // setRecommendations - LOAD ALL RECOMMENDATIONS FOR ROOM
    // ========================================================================
    // WHAT IT DOES:
    // Sets the complete list of recommendations for the current room
    //
    // WHEN TO CALL IT:
    // - When AI/backend generates recommendations for a new room
    // - When loading existing recommendations after joining a room
    // - When voting session starts
    //
    // HOW TO USE:
    // const { data } = await supabase.from('recommendations').select('*');
    // dispatch(setRecommendations(data));
    //
    // WHAT HAPPENS:
    // 1. Redux stores all recommendations
    // 2. Voting page displays recommendation cards
    // 3. Users can start voting
    // 4. Carousel navigation becomes available
    // ========================================================================
    // TODO: When integrating Supabase or AI service, dispatch this after fetching recommendations
    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // addRecommendation - ADD A SINGLE NEW RECOMMENDATION
    // ========================================================================
    // WHAT IT DOES:
    // Adds one new recommendation to the existing list
    //
    // WHEN TO CALL IT:
    // - When AI generates additional recommendations during voting
    // - When manually adding a recommendation
    // - When WebSocket receives new recommendation from another user
    //
    // HOW TO USE:
    // dispatch(addRecommendation(newRecommendation));
    //
    // WHAT HAPPENS:
    // 1. Redux adds recommendation to the array
    // 2. New recommendation card appears in voting page
    // 3. Total recommendation count updates
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this after successful DB insert
    addRecommendation: (state, action: PayloadAction<Recommendation>) => {
      state.recommendations.push(action.payload);
    },

    // ========================================================================
    // removeRecommendation - REMOVE A RECOMMENDATION
    // ========================================================================
    // WHAT IT DOES:
    // Removes a recommendation from the list
    //
    // WHEN TO CALL IT:
    // - When filtering out inappropriate recommendations
    // - When recommendation is no longer available
    // - When host removes a recommendation
    //
    // HOW TO USE:
    // dispatch(removeRecommendation('rec_123'));
    //
    // WHAT HAPPENS:
    // Recommendation card disappears from voting page
    // ========================================================================
    removeRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(
        (r) => r.id !== action.payload
      );
    },

    // ========================================================================
    // setSavedRecommendations - LOAD USER'S SAVED FAVORITES
    // ========================================================================
    // WHAT IT DOES:
    // Loads the list of recommendations user has saved for later
    //
    // WHEN TO CALL IT:
    // - When loading user's profile
    // - When displaying favorites page
    // - After user logs in
    //
    // HOW TO USE:
    // const { data } = await supabase.from('saved_recommendations')
    //   .select('*').eq('user_id', userId);
    // dispatch(setSavedRecommendations(data));
    //
    // WHAT HAPPENS:
    // Saved icon appears next to saved recommendations
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this after fetching saved recommendations
    setSavedRecommendations: (state, action: PayloadAction<SavedRecommendation[]>) => {
      state.savedRecommendations = action.payload;
    },

    // ========================================================================
    // addSavedRecommendation - SAVE A RECOMMENDATION TO FAVORITES
    // ========================================================================
    // WHAT IT DOES:
    // Marks a recommendation as saved by the user
    //
    // WHEN TO CALL IT:
    // - When user clicks "save" or "favorite" button
    //
    // HOW TO USE:
    // const saved = {
    //   id: 'saved_123',
    //   user_id: 'user_456',
    //   recommendation_id: 'rec_789',
    //   saved_at: new Date().toISOString()
    // };
    // dispatch(addSavedRecommendation(saved));
    //
    // WHAT HAPPENS:
    // 1. Redux adds to saved list
    // 2. Save icon changes to "filled" state
    // 3. Recommendation appears in user's favorites
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this after successful DB insert
    addSavedRecommendation: (state, action: PayloadAction<SavedRecommendation>) => {
      const exists = state.savedRecommendations.find(
        (sr) => sr.recommendation_id === action.payload.recommendation_id
      );
      // Only add if not already saved (prevent duplicates)
      if (!exists) {
        state.savedRecommendations.push(action.payload);
      }
    },

    // ========================================================================
    // removeSavedRecommendation - UNSAVE A RECOMMENDATION
    // ========================================================================
    // WHAT IT DOES:
    // Removes a recommendation from user's saved favorites
    //
    // WHEN TO CALL IT:
    // - When user clicks "unsave" or "unfavorite" button
    //
    // HOW TO USE:
    // dispatch(removeSavedRecommendation('rec_789'));
    //
    // WHAT HAPPENS:
    // 1. Redux removes from saved list
    // 2. Save icon changes to "unfilled" state
    // 3. Recommendation disappears from favorites
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this after successful DB delete
    removeSavedRecommendation: (state, action: PayloadAction<string>) => {
      state.savedRecommendations = state.savedRecommendations.filter(
        (sr) => sr.recommendation_id !== action.payload
      );
    },

    // ========================================================================
    // clearRecommendations - CLEAR ALL RECOMMENDATIONS
    // ========================================================================
    // WHAT IT DOES:
    // Removes all recommendations (typically when leaving a room)
    //
    // WHEN TO CALL IT:
    // - When user leaves the room
    // - When starting a new voting session
    //
    // HOW TO USE:
    // dispatch(clearRecommendations());
    //
    // WHAT HAPPENS:
    // Voting page clears, ready for next room's recommendations
    // ========================================================================
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.loading = false;
      state.error = null;
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
  setRecommendations,
  addRecommendation,
  removeRecommendation,
  setSavedRecommendations,
  addSavedRecommendation,
  removeSavedRecommendation,
  clearRecommendations,
  setLoading,
  setError,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
