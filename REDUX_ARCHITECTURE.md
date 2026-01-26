# Redux Architecture - Modern RTK Implementation

## Store Configuration

**File:** `src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    rooms: roomsReducer,
    votes: votesReducer,
    recommendations: recommendationsReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setSession', 'auth/setUser'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Slice Breakdown

### 1. Auth Slice

**Purpose:** User authentication and session management

**State:**
```typescript
{
  user: User | null,
  session: Session | null,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `setUser(user)` - Set authenticated user
- `setSession(session)` - Set user session
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state
- `logout()` - Clear user and session

**Integration Points:**
- Supabase auth.signIn/signUp
- Supabase auth.onAuthStateChange
- Supabase auth.signOut

---

### 2. Preferences Slice

**Purpose:** User preferences and settings

**State:**
```typescript
{
  userPreferences: {
    activities: string[],
    food_preferences: { categories: string[], restrictions: string },
    transport_preferences: string[],
    home_address: string
  } | null,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `setUserPreferences(preferences)` - Set complete preferences
- `updateActivities(activities)` - Update activities array
- `updateFoodPreferences(prefs)` - Update food preferences
- `updateTransport(transport)` - Update transport preferences
- `updateHomeAddress(address)` - Update home address
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state

**Integration Points:**
- Supabase user_preferences table
- Fetch on user login
- Persist on preference changes

---

### 3. Rooms Slice

**Purpose:** Room management, participants, and session preferences

**State:**
```typescript
{
  currentRoom: Room | null,
  participants: Participant[],
  sessionPreferences: SessionPreferences | null,
  websocketStatus: 'connected' | 'disconnected' | 'connecting',
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `setCurrentRoom(room)` - Set current room
- `updateRoomStatus(isActive)` - Update voting status
- `setParticipants(participants)` - Set all participants
- `addParticipant(participant)` - Add new participant
- `updateParticipantStatus({ userId, isOnline })` - Update participant status
- `setSessionPreferences(prefs)` - Set session preferences
- `setWebsocketStatus(status)` - Update WebSocket status
- `clearRoom()` - Clear all room data
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state

**Integration Points:**
- Supabase rooms table
- Supabase room_participants table
- Supabase session_preferences table
- WebSocket for real-time participant updates
- WebSocket for room status changes

---

### 4. Votes Slice (NEW)

**Purpose:** Voting functionality and vote tracking

**State:**
```typescript
{
  votesByRecommendation: Record<string, Vote[]>,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `setVotesForRecommendation({ recommendationId, votes })` - Set votes for one recommendation
- `addVote(vote)` - Add or update a single vote
- `removeVote({ recommendationId, userId })` - Remove a vote
- `setAllVotes(votes)` - Load all votes for a room
- `clearVotes()` - Clear all votes
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state

**Integration Points:**
- Supabase votes table
- WebSocket for real-time vote updates
- Persist votes to database
- Receive vote updates from other users

---

### 5. Recommendations Slice

**Purpose:** Recommendations and saved items management

**State:**
```typescript
{
  recommendations: Recommendation[],
  savedRecommendations: SavedRecommendation[],
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `setRecommendations(recommendations)` - Set all recommendations
- `addRecommendation(recommendation)` - Add single recommendation
- `removeRecommendation(id)` - Remove recommendation
- `setSavedRecommendations(saved)` - Set saved recommendations
- `addSavedRecommendation(saved)` - Add saved recommendation
- `removeSavedRecommendation(id)` - Remove saved recommendation
- `clearRecommendations()` - Clear all recommendations
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state

**Integration Points:**
- Supabase recommendations table
- Supabase saved_recommendations table
- AI service for generating recommendations
- WebSocket for new recommendations

---

### 6. Socket Slice

**Purpose:** WebSocket connection state management

**State:**
```typescript
{
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting',
  error: string | null,
  lastHeartbeat: number | null
}
```

**Actions:**
- `socketConnecting()` - Set status to connecting
- `socketConnected()` - Set status to connected
- `socketDisconnected()` - Set status to disconnected
- `socketReconnecting()` - Set status to reconnecting
- `socketError(error)` - Set error state
- `socketHeartbeat()` - Update heartbeat timestamp

**Integration Points:**
- WebSocket service connection lifecycle
- Supabase Realtime or Socket.io
- Ping/pong heartbeat mechanism

---

## Data Flow Patterns

### 1. Initial Data Load
```
Component Mount
  ↓
Dispatch setLoading(true)
  ↓
Fetch from Database/API
  ↓
Dispatch setData(data)
  ↓
Component Re-renders
```

### 2. User Action (e.g., Cast Vote)
```
User Clicks Vote Button
  ↓
Dispatch addVote(vote)
  ↓
Redux State Updates (Optimistic)
  ↓
Persist to Database
  ↓
Emit WebSocket Event
  ↓
Other Clients Receive Event
  ↓
Dispatch addVote(vote) on Other Clients
```

### 3. Real-time Update (e.g., Participant Joins)
```
WebSocket Receives Event
  ↓
Parse Event Data
  ↓
Dispatch addParticipant(participant)
  ↓
Redux State Updates
  ↓
All Components Re-render
```

## Type Safety

### Typed Hooks
```typescript
// src/store/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Usage in Components
```typescript
// Reading state
const votes = useAppSelector((state) => state.votes.votesByRecommendation);
const user = useAppSelector((state) => state.auth.user);

// Dispatching actions
const dispatch = useAppDispatch();
dispatch(addVote(vote));
dispatch(setUser(user));
```

## Middleware Configuration

### SerializableCheck
```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Ignore Supabase session objects (contain Date objects)
      ignoredActions: ['auth/setSession', 'auth/setUser'],
      ignoredPaths: ['auth.session', 'auth.user'],
    },
  })
```

## DevTools Integration

Redux DevTools are automatically enabled via `configureStore`:
- Time-travel debugging
- Action history
- State inspection
- Action dispatching

## Best Practices Followed

1. **Immutable Updates:** Using Immer (built into RTK)
2. **Type Safety:** Full TypeScript coverage
3. **Single Source of Truth:** All shared state in Redux
4. **Feature Separation:** Each slice handles one domain
5. **Clean Actions:** Descriptive action names
6. **Error Handling:** Consistent error states
7. **Loading States:** Track async operations
8. **No Side Effects:** Reducers are pure functions
9. **Documentation:** TODO comments for integration
10. **Scalability:** Easy to add new features

## State Initialization

All slices have clean initial states:
```typescript
const initialState: SliceState = {
  data: null,
  loading: false,
  error: null,
};
```

## Error Handling Pattern

Consistent across all slices:
```typescript
setError: (state, action: PayloadAction<string>) => {
  state.error = action.payload;
  state.loading = false;
}
```

## Loading State Pattern

Consistent across all slices:
```typescript
setLoading: (state, action: PayloadAction<boolean>) => {
  state.loading = action.payload;
}
```

## Integration Workflow

### Step 1: Database Setup
1. Configure Supabase in `.env`
2. Run migrations to create tables
3. Verify database connection

### Step 2: Replace Temp Storage
1. Find TODO comments in slices
2. Replace temp repository calls with Supabase
3. Keep Redux actions unchanged
4. Test data persistence

### Step 3: WebSocket Integration
1. Implement WebSocket service in `src/lib/socket.ts`
2. Dispatch Redux actions on socket events
3. Emit socket events on state changes
4. Test real-time updates

### Step 4: Testing
1. Test each slice independently
2. Test real-time updates across clients
3. Test error scenarios
4. Test loading states

## Summary

This Redux architecture provides:
- Clean separation of concerns
- Type-safe state management
- Easy integration with backend
- Real-time update capability
- Scalable and maintainable code
- Modern RTK best practices
- Clear migration path to production

All requirements for the RTK refactoring have been met, and the architecture is ready for backend integration.
