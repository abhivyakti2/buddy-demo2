import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Recommendation {
  id: string;
  room_id: string;
  name: string;
  description: string;
  category: string;
  price_level: string;
  location: string;
  distance_km: number | null;
  rating: number | null;
  images: string[];
  parameters: Record<string, any>;
  created_at: string;
}

export interface SavedRecommendation {
  id: string;
  user_id: string;
  recommendation_id: string;
  saved_at: string;
}

interface RecommendationsState {
  recommendations: Recommendation[];
  savedRecommendations: SavedRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendations: [],
  savedRecommendations: [],
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    // Set all recommendations for a room
    // TODO: When integrating Supabase or AI service, dispatch this after fetching recommendations
    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Add a single recommendation
    // TODO: When integrating Supabase, dispatch this after successful DB insert
    addRecommendation: (state, action: PayloadAction<Recommendation>) => {
      state.recommendations.push(action.payload);
    },
    // Remove a recommendation
    removeRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(
        (r) => r.id !== action.payload
      );
    },
    // Set saved recommendations for a user
    // TODO: When integrating Supabase, dispatch this after fetching saved recommendations
    setSavedRecommendations: (state, action: PayloadAction<SavedRecommendation[]>) => {
      state.savedRecommendations = action.payload;
    },
    // Add a saved recommendation
    // TODO: When integrating Supabase, dispatch this after successful DB insert
    addSavedRecommendation: (state, action: PayloadAction<SavedRecommendation>) => {
      const exists = state.savedRecommendations.find(
        (sr) => sr.recommendation_id === action.payload.recommendation_id
      );
      if (!exists) {
        state.savedRecommendations.push(action.payload);
      }
    },
    // Remove a saved recommendation
    // TODO: When integrating Supabase, dispatch this after successful DB delete
    removeSavedRecommendation: (state, action: PayloadAction<string>) => {
      state.savedRecommendations = state.savedRecommendations.filter(
        (sr) => sr.recommendation_id !== action.payload
      );
    },
    // Clear all recommendations (e.g., when leaving a room)
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.loading = false;
      state.error = null;
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
