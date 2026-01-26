# Quick Reference - Redux Refactoring

## What Changed?

### Core Principle
**Shared state in Redux, UI state stays local**

### Before & After

#### Voting State
```typescript
// BEFORE (Wrong)
const [votes, setVotes] = useState({});

// AFTER (Correct)
const votes = useAppSelector(state => state.recommendations.votes);
dispatch(addVote(vote));
```

#### Room State
```typescript
// BEFORE (Wrong)
const [isVoting, setIsVoting] = useState(false);
const [participants] = useState([...]);

// AFTER (Correct)
const currentRoom = useAppSelector(state => state.rooms.currentRoom);
const participants = useAppSelector(state => state.rooms.participants);
const isVoting = currentRoom?.is_active;
dispatch(updateRoomStatus(true));
```

## New Files Created

1. **`src/store/socketSlice.ts`** - WebSocket connection state
2. **`src/lib/socket.ts`** - WebSocket service layer (not implemented yet)
3. **`src/lib/repositories.ts`** - Optional DB abstraction layer
4. **`REDUX_REFACTORING_SUMMARY.md`** - Full documentation

## Redux Store Structure

```typescript
{
  auth: {
    user, session, loading, error
  },
  preferences: {
    userPreferences, loading, error
  },
  rooms: {
    currentRoom, participants, sessionPreferences, websocketStatus
  },
  recommendations: {
    recommendations, votes, savedRecommendations, currentRecommendationIndex
  },
  socket: {
    status, error, lastHeartbeat
  }
}
```

## When to Use Redux vs Local State

### Redux (Global State)
- User authentication
- Current room data
- Participants list
- Recommendations
- Votes
- WebSocket status

### Local State (UI Only)
- Form inputs
- Step navigation
- Animation states
- Image carousel index
- Modal visibility

## Next Steps (When Ready)

### Database Integration
Search for: `// TODO: Replace temp storage`
Replace: `tempRooms.create()` → `supabase.from('rooms').insert()`

### WebSocket Integration
Search for: `// TODO: Replace with real WebSocket`
File: `src/lib/socket.ts`

### Testing
All temporary storage still works - app is fully functional!

## Build Status
Build passes with no errors.

## Key Files to Review

1. `src/components/VotingPage.tsx` - Voting with Redux
2. `src/components/RoomPage.tsx` - Room management with Redux
3. `src/lib/socket.ts` - WebSocket architecture
4. `REDUX_REFACTORING_SUMMARY.md` - Full details
