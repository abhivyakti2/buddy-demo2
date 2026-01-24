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

export interface Vote {
  id: string;
  room_id: string;
  recommendation_id: string;
  user_id: string;
  vote_type: 'yes' | 'no' | 'maybe';
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
  votes: Record<string, Vote[]>;
  savedRecommendations: SavedRecommendation[];
  currentRecommendationIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendations: [],
  votes: {},
  savedRecommendations: [],
  currentRecommendationIndex: 0,
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addRecommendation: (state, action: PayloadAction<Recommendation>) => {
      state.recommendations.push(action.payload);
    },
    setVotes: (state, action: PayloadAction<{ recommendationId: string; votes: Vote[] }>) => {
      state.votes[action.payload.recommendationId] = action.payload.votes;
    },
    addVote: (state, action: PayloadAction<Vote>) => {
      const { recommendation_id } = action.payload;
      if (!state.votes[recommendation_id]) {
        state.votes[recommendation_id] = [];
      }
      const existingVoteIndex = state.votes[recommendation_id].findIndex(
        v => v.user_id === action.payload.user_id
      );
      if (existingVoteIndex >= 0) {
        state.votes[recommendation_id][existingVoteIndex] = action.payload;
      } else {
        state.votes[recommendation_id].push(action.payload);
      }
    },
    removeVote: (state, action: PayloadAction<{ recommendationId: string; userId: string }>) => {
      const { recommendationId, userId } = action.payload;
      if (state.votes[recommendationId]) {
        state.votes[recommendationId] = state.votes[recommendationId].filter(
          v => v.user_id !== userId
        );
      }
    },
    setSavedRecommendations: (state, action: PayloadAction<SavedRecommendation[]>) => {
      state.savedRecommendations = action.payload;
    },
    addSavedRecommendation: (state, action: PayloadAction<SavedRecommendation>) => {
      const exists = state.savedRecommendations.find(
        sr => sr.recommendation_id === action.payload.recommendation_id
      );
      if (!exists) {
        state.savedRecommendations.push(action.payload);
      }
    },
    removeSavedRecommendation: (state, action: PayloadAction<string>) => {
      state.savedRecommendations = state.savedRecommendations.filter(
        sr => sr.recommendation_id !== action.payload
      );
    },
    setCurrentRecommendationIndex: (state, action: PayloadAction<number>) => {
      state.currentRecommendationIndex = action.payload;
    },
    nextRecommendation: (state) => {
      if (state.currentRecommendationIndex < state.recommendations.length - 1) {
        state.currentRecommendationIndex += 1;
      }
    },
    previousRecommendation: (state) => {
      if (state.currentRecommendationIndex > 0) {
        state.currentRecommendationIndex -= 1;
      }
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.votes = {};
      state.currentRecommendationIndex = 0;
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
  setRecommendations,
  addRecommendation,
  setVotes,
  addVote,
  removeVote,
  setSavedRecommendations,
  addSavedRecommendation,
  removeSavedRecommendation,
  setCurrentRecommendationIndex,
  nextRecommendation,
  previousRecommendation,
  clearRecommendations,
  setLoading,
  setError,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
