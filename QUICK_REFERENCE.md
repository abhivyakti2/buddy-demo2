# Quick Reference - Architecture Finalized

## What Changed?

### Core Principles
1. **Shared state in Redux, UI state stays local**
2. **All backend calls go through repositories**
3. **No mock data in components**
4. **Clear TODO comments for integration**

### Before & After

#### Voting State
```typescript
// BEFORE (Wrong)
const [votes, setVotes] = useState({});
const mockData = [{ id: 1, ... }];

// AFTER (Correct)
const votes = useAppSelector(state => state.recommendations.votes);
const recommendations = useAppSelector(state => state.recommendations.recommendations);
const { data } = await recommendationsRepository.getByRoom(roomId);
dispatch(addVote(vote));
await votesRepository.cast(vote);
```

#### Room State
```typescript
// BEFORE (Wrong)
const [isVoting, setIsVoting] = useState(false);
const mockParticipants = [...];

// AFTER (Correct)
const currentRoom = useAppSelector(state => state.rooms.currentRoom);
const participants = useAppSelector(state => state.rooms.participants);
const { data } = await participantsRepository.get(roomId);
const isVoting = currentRoom?.is_active;
dispatch(updateRoomStatus(true));
await roomsRepository.update(roomId, { is_active: true });
```

## Key Files

1. **`src/lib/tempStorage.ts`** - Temporary mock data (delete when ready)
2. **`src/lib/repositories.ts`** - DB abstraction layer (keep, update implementations)
3. **`src/lib/socket.ts`** - WebSocket service layer (implement when ready)
4. **`src/store/socketSlice.ts`** - WebSocket connection state
5. **`ARCHITECTURE_FINALIZED.md`** - Complete documentation

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
- User preferences (after initial load)
- Session preferences

### Local State (UI Only)
- Form inputs (before submission)
- Step navigation
- Animation states
- Image carousel index
- Modal visibility
- Show/hide panels

## Repository Pattern

### All Components Use Repositories
```typescript
// Components never call tempStorage directly
import { recommendationsRepository } from '../lib/repositories';

// In component
const { data } = await recommendationsRepository.getByRoom(roomId);
```

### Repository Layer Structure
```
Component
  ↓
Repository (repositories.ts)
  ↓
Temp Storage (tempStorage.ts) ← Replace with Supabase
```

## TODO Comments Guide

### Database Integration
```typescript
// TODO: Replace temp repository with Supabase:
// await supabase.from('recommendations').select('*').eq('room_id', roomId)
```

### WebSocket Integration
```typescript
// TODO: Emit vote cast event via WebSocket for real-time updates
socketEvents.castVote(roomId, recommendationId, user.id, 'yes');

// TODO: Setup WebSocket listener for participant updates
// socketService.connect(dispatch, roomId);
```

### Preferences Optimization
```typescript
// TODO: Skip backend fetch if preferences already exist in Redux (single source of truth)
if (userPreferences) {
  // Use Redux
  return;
}
```

## Data Flow Examples

### Vote Cast Flow
```
User clicks vote
  ↓
dispatch(addVote(vote))          // Redux
  ↓
votesRepository.cast(vote)       // Persist
  ↓
socketEvents.castVote(...)       // Real-time (TODO)
```

### Room Status Flow
```
Host starts voting
  ↓
dispatch(updateRoomStatus(true))           // Redux
  ↓
roomsRepository.update(roomId, {...})      // Persist
  ↓
socketEvents.startVoting(roomId)           // Real-time (TODO)
```

### Load Data Flow
```
Component mounts
  ↓
recommendationsRepository.getByRoom(roomId)  // Fetch
  ↓
dispatch(setRecommendations(recs))           // Redux
  ↓
Component renders
```

## Next Steps (When Ready)

### Database Integration
1. Configure Supabase in `.env`
2. Search: `// TODO: Replace temp repository`
3. Update repository implementations with Supabase calls
4. Components work unchanged

### WebSocket Integration
1. Search: `// TODO: Emit` and `// TODO: Setup WebSocket`
2. Implement in `src/lib/socket.ts`
3. Setup Redux action dispatching
4. Test real-time updates

### Remove Temp Storage
1. Delete `tempStorage.ts`
2. Verify all TODOs resolved
3. Update imports

## Build Status
Build passes with no errors.

## Testing
All temporary storage still works - app is fully functional!

## Key Files to Review

1. `src/lib/repositories.ts` - Repository abstraction layer
2. `src/lib/tempStorage.ts` - Temporary mock data
3. `src/lib/socket.ts` - WebSocket service (not implemented)
4. `src/components/VotingPage.tsx` - Voting with repositories
5. `src/components/RoomPage.tsx` - Room management with repositories
6. `ARCHITECTURE_FINALIZED.md` - Complete documentation
