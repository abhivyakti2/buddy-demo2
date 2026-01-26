// ============================================================================
// VOTES SLICE - VOTING DATA AND VOTE TRACKING
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This slice manages all voting data: who voted for which recommendations,
// vote counts, and vote types. It's in Redux because votes need to be visible
// and updated in real-time across all participants in the room.
//
// WHAT KIND OF STATE THIS IS:
// GLOBAL STATE - This is the correct use of Redux because:
// - All participants need to see votes in real-time
// - Votes affect multiple components (voting page, results page, vote counts)
// - Vote data needs to sync across different users via WebSocket
// - Vote counts need to update immediately when anyone votes
//
// WHEN TO USE THIS SLICE:
// - Displaying vote counts on each recommendation
// - Showing who voted for what
// - Checking if current user has already voted
// - Calculating voting results
// - Real-time vote updates via WebSocket
//
// HOW IT CAUSES UI UPDATES:
// 1. User clicks vote button → dispatch(addVote(voteData))
// 2. votesSlice reducer updates state.votes.votesByRecommendation
// 3. Voting page re-renders showing updated vote count
// 4. WebSocket sends vote to other participants
// 5. Other participants receive vote → dispatch(addVote(voteData))
// 6. All participants see the same vote counts
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// STATE SHAPE
// ============================================================================
export interface Vote {
  id: string;
  room_id: string;
  recommendation_id: string;  // Which recommendation this vote is for
  user_id: string;            // Who cast this vote
  vote_type: 'yes' | 'no' | 'maybe';  // Type of vote
  created_at: string;
}

interface VotesState {
  // Votes organized by recommendation_id for efficient lookups
  // Structure: { "rec_123": [vote1, vote2, vote3], "rec_456": [vote4, vote5] }
  votesByRecommendation: Record<string, Vote[]>;
  loading: boolean;
  error: string | null;
}

const initialState: VotesState = {
  votesByRecommendation: {},
  loading: false,
  error: null,
};

// ============================================================================
// VOTES SLICE - CREATES ACTIONS AND REDUCER
// ============================================================================
const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    // ========================================================================
    // setVotesForRecommendation - LOAD VOTES FOR ONE RECOMMENDATION
    // ========================================================================
    // WHAT IT DOES:
    // Sets all votes for a specific recommendation
    //
    // WHEN TO CALL IT:
    // - When loading votes from database for a specific recommendation
    // - When initializing vote data after joining a room
    //
    // HOW TO USE:
    // dispatch(setVotesForRecommendation({
    //   recommendationId: 'rec_123',
    //   votes: [vote1, vote2, vote3]
    // }));
    //
    // WHAT HAPPENS:
    // Vote counts for that recommendation update immediately
    // ========================================================================
    setVotesForRecommendation: (
      state,
      action: PayloadAction<{ recommendationId: string; votes: Vote[] }>
    ) => {
      state.votesByRecommendation[action.payload.recommendationId] = action.payload.votes;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // addVote - CAST OR UPDATE A VOTE
    // ========================================================================
    // WHAT IT DOES:
    // Adds a new vote or updates an existing vote from the same user
    //
    // WHEN TO CALL IT:
    // - When user clicks vote button (yes/no/maybe)
    // - When WebSocket receives vote from another participant
    // - When user changes their vote
    //
    // HOW TO USE:
    // const vote = {
    //   id: 'vote_123',
    //   room_id: 'room_abc',
    //   recommendation_id: 'rec_456',
    //   user_id: 'user_789',
    //   vote_type: 'yes',
    //   created_at: new Date().toISOString()
    // };
    // dispatch(addVote(vote));
    //
    // WHAT HAPPENS:
    // 1. Redux checks if user already voted on this recommendation
    // 2. If yes: Updates existing vote
    // 3. If no: Adds new vote
    // 4. Voting page re-renders with updated vote count
    // 5. Heart icon fills if current user voted
    // 6. Vote count badge updates (e.g., "3 votes" → "4 votes")
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this action after successful DB insert
    addVote: (state, action: PayloadAction<Vote>) => {
      const { recommendation_id, user_id } = action.payload;

      // Initialize array if this is the first vote for this recommendation
      if (!state.votesByRecommendation[recommendation_id]) {
        state.votesByRecommendation[recommendation_id] = [];
      }

      // Check if user already voted on this recommendation
      const existingVoteIndex = state.votesByRecommendation[recommendation_id].findIndex(
        (v) => v.user_id === user_id
      );

      if (existingVoteIndex >= 0) {
        // Update existing vote (user changed their mind)
        state.votesByRecommendation[recommendation_id][existingVoteIndex] = action.payload;
      } else {
        // Add new vote
        state.votesByRecommendation[recommendation_id].push(action.payload);
      }

      state.error = null;
    },

    // ========================================================================
    // removeVote - REMOVE A VOTE
    // ========================================================================
    // WHAT IT DOES:
    // Removes a vote when user un-votes a recommendation
    //
    // WHEN TO CALL IT:
    // - When user clicks vote button again to remove their vote
    // - When WebSocket receives vote removal from another participant
    //
    // HOW TO USE:
    // dispatch(removeVote({
    //   recommendationId: 'rec_456',
    //   userId: 'user_789'
    // }));
    //
    // WHAT HAPPENS:
    // 1. Redux removes the vote from the array
    // 2. Vote count decreases
    // 3. Heart icon becomes unfilled
    // 4. Vote count badge updates
    // ========================================================================
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

    // ========================================================================
    // setAllVotes - LOAD ALL VOTES FOR A ROOM
    // ========================================================================
    // WHAT IT DOES:
    // Loads the complete voting data for all recommendations in a room
    //
    // WHEN TO CALL IT:
    // - When entering the voting page
    // - When joining a room with active voting
    //
    // HOW TO USE:
    // const { data } = await supabase.from('votes').select('*').eq('room_id', roomId);
    // // Organize votes by recommendation_id
    // const votesByRec = {};
    // data.forEach(vote => {
    //   if (!votesByRec[vote.recommendation_id]) votesByRec[vote.recommendation_id] = [];
    //   votesByRec[vote.recommendation_id].push(vote);
    // });
    // dispatch(setAllVotes(votesByRec));
    //
    // WHAT HAPPENS:
    // All recommendation cards show correct vote counts
    // ========================================================================
    // TODO: When integrating Supabase, dispatch this action after fetching votes from DB
    setAllVotes: (state, action: PayloadAction<Record<string, Vote[]>>) => {
      state.votesByRecommendation = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ========================================================================
    // clearVotes - CLEAR ALL VOTING DATA
    // ========================================================================
    // WHAT IT DOES:
    // Removes all voting data (typically when leaving a room)
    //
    // WHEN TO CALL IT:
    // - When user leaves the room
    // - When starting a new voting session
    //
    // HOW TO USE:
    // dispatch(clearVotes());
    //
    // WHAT HAPPENS:
    // All vote counts reset, ready for next room
    // ========================================================================
    clearVotes: (state) => {
      state.votesByRecommendation = {};
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
  setVotesForRecommendation,
  addVote,
  removeVote,
  setAllVotes,
  clearVotes,
  setLoading,
  setError,
} = votesSlice.actions;

export default votesSlice.reducer;
