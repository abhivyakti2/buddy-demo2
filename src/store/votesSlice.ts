import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vote {
  id: string;
  room_id: string;
  recommendation_id: string;
  user_id: string;
  vote_type: 'yes' | 'no' | 'maybe';
  created_at: string;
}

interface VotesState {
  // Votes organized by recommendation_id
  votesByRecommendation: Record<string, Vote[]>;
  loading: boolean;
  error: string | null;
}

const initialState: VotesState = {
  votesByRecommendation: {},
  loading: false,
  error: null,
};

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    // Set all votes for a specific recommendation
    setVotesForRecommendation: (
      state,
      action: PayloadAction<{ recommendationId: string; votes: Vote[] }>
    ) => {
      state.votesByRecommendation[action.payload.recommendationId] = action.payload.votes;
      state.loading = false;
      state.error = null;
    },
    // Add or update a single vote
    // TODO: When integrating Supabase, dispatch this action after successful DB insert
    addVote: (state, action: PayloadAction<Vote>) => {
      const { recommendation_id, user_id } = action.payload;

      if (!state.votesByRecommendation[recommendation_id]) {
        state.votesByRecommendation[recommendation_id] = [];
      }

      // Check if user already voted on this recommendation
      const existingVoteIndex = state.votesByRecommendation[recommendation_id].findIndex(
        (v) => v.user_id === user_id
      );

      if (existingVoteIndex >= 0) {
        // Update existing vote
        state.votesByRecommendation[recommendation_id][existingVoteIndex] = action.payload;
      } else {
        // Add new vote
        state.votesByRecommendation[recommendation_id].push(action.payload);
      }

      state.error = null;
    },
    // Remove a vote
    // TODO: When integrating Supabase, dispatch this action after successful DB delete
    removeVote: (
      state,
      action: PayloadAction<{ recommendationId: string; userId: string }>
    ) => {
      const { recommendationId, userId } = action.payload;

      if (state.votesByRecommendation[recommendationId]) {
        state.votesByRecommendation[recommendationId] = state.votesByRecommendation[
          recommendationId
        ].filter((v) => v.user_id !== userId);
      }

      state.error = null;
    },
    // Load all votes for a room
    // TODO: When integrating Supabase, dispatch this action after fetching votes from DB
    setAllVotes: (state, action: PayloadAction<Record<string, Vote[]>>) => {
      state.votesByRecommendation = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Clear all votes (e.g., when leaving a room)
    clearVotes: (state) => {
      state.votesByRecommendation = {};
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
  setVotesForRecommendation,
  addVote,
  removeVote,
  setAllVotes,
  clearVotes,
  setLoading,
  setError,
} = votesSlice.actions;

export default votesSlice.reducer;
