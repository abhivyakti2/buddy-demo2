# Redux Refactoring Summary

This document outlines all architectural changes made to align with Redux best practices and prepare for WebSocket integration.

## What Was Changed

### 1. Redux Store Structure

#### New Redux Slices Added
- **socketSlice** (`src/store/socketSlice.ts`) - Manages WebSocket connection state
  - Connection status (connected/disconnected/connecting/reconnecting)
  - Error handling
  - Heartbeat tracking

#### Existing Slices (Already Correct)
- **authSlice** - User authentication state
- **preferencesSlice** - User preferences
- **roomsSlice** - Current room, participants, session preferences
- **recommendationsSlice** - Recommendations and votes

### 2. State Management Refactoring

#### VotingPage.tsx - CRITICAL CHANGES
**BEFORE (Wrong):**
```typescript
const [votes, setVotes] = useState<{[key: number]: boolean}>({});
const [currentRecommendation, setCurrentRecommendation] = useState(0);
```

**AFTER (Correct):**
```typescript
// UI state - stays in local state
const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
const [currentImageIndex, setCurrentImageIndex] = useState(0);

// Shared state - moved to Redux
const recommendations = useAppSelector((state) => state.recommendations.recommendations);
const votes = useAppSelector((state) => state.recommendations.votes);
```

**Key Changes:**
- ALL voting data now lives in Redux
- Votes are dispatched as Redux actions: `dispatch(addVote(vote))`
- Components select vote data from Redux store
- UI-only state (image carousel, navigation) remains local
- TODO comments added for backend integration

#### RoomPage.tsx - CRITICAL CHANGES
**BEFORE (Wrong):**
```typescript
const [isVoting, setIsVoting] = useState(false);
const [participants] = useState([...mock data...]);
```

**AFTER (Correct):**
```typescript
// UI state - stays in local state
const [showParticipants, setShowParticipants] = useState(true);

// Shared state - moved to Redux
const currentRoom = useAppSelector((state) => state.rooms.currentRoom);
const participants = useAppSelector((state) => state.rooms.participants);
const isVoting = currentRoom?.is_active || false;
```

**Key Changes:**
- Voting status read from Redux: `currentRoom.is_active`
- Start/End voting dispatch Redux actions: `dispatch(updateRoomStatus(true))`
- Participants loaded from Redux store
- Socket events called for real-time updates (TODO comments added)
- TODO comments added for backend integration

### 3. WebSocket Architecture (Prepared, Not Implemented)

#### New File: `src/lib/socket.ts`
- Provides WebSocket service interface
- All socket interactions go through this layer
- Components NEVER talk to sockets directly
- Socket events dispatch Redux actions

**Architecture:**
```
WebSocket Event → socketService → Redux Action → Redux Store → Components Re-render
```

**Example Flow:**
```typescript
// When vote is cast through socket
socketService.on('vote-cast', (data) => {
  dispatch(addVote(data));
});
```

**TODO Comments:**
- All WebSocket functions marked with `// TODO: Replace with real WebSocket connection`
- Clear examples of what needs to be implemented
- Ready for Socket.io, Supabase Realtime, or any WebSocket library

### 4. Repository Abstraction Layer (Optional)

#### New File: `src/lib/repositories.ts`
- Clean abstraction over data storage
- Single point of change when switching from temp storage to real DB
- Type-safe database operations
- All functions marked with TODO comments

**Benefits:**
- Easier to swap temp storage for real database
- Easier to mock for testing
- Clear interface for each data domain

**Repositories:**
- `authRepository` - Authentication operations
- `preferencesRepository` - User preferences
- `roomsRepository` - Room management
- `participantsRepository` - Participant management
- `sessionPreferencesRepository` - Session preferences
- `recommendationsRepository` - Recommendations
- `votesRepository` - Voting operations

### 5. Temporary Storage (Unchanged, But Documented)

**File: `src/lib/tempStorage.ts`**
- Still uses localStorage
- Added prominent warning header
- All functions already had TODO comments
- Will be replaced by real database later

**Usage in Components:**
- Components still use temporary storage for backend operations
- Each call has TODO comment explaining replacement
- Architecture ready for easy swap to real database

## State Management Rules (Enforced)

### Redux State (Global, Shared, Long-lived)
✅ Use Redux for:
- Authenticated user
- Current room
- Participants in room
- Recommendations list
- Votes per recommendation
- Voting status (active/ended)
- Saved suggestions
- WebSocket connection status

### Local State (UI-only, Temporary)
✅ Use local state for:
- Form inputs
- Step navigation in multi-step forms
- UI animations
- Image carousel index
- Modal visibility
- Dropdown open/closed

## Voting Flow (Now Correct)

```
User clicks vote button
  ↓
Component dispatches Redux action: dispatch(addVote(vote))
  ↓
Redux reducer updates votes state
  ↓
Socket event sent: socketEvents.castVote(...)  [TODO: implement real socket]
  ↓
All components listening to votes automatically re-render
```

## Files Changed

### New Files
1. `src/store/socketSlice.ts` - WebSocket state management
2. `src/lib/socket.ts` - WebSocket service layer
3. `src/lib/repositories.ts` - Optional repository abstraction
4. `REDUX_REFACTORING_SUMMARY.md` - This document

### Modified Files
1. `src/store/store.ts` - Added socketSlice to store
2. `src/components/VotingPage.tsx` - Refactored to use Redux for votes
3. `src/components/RoomPage.tsx` - Refactored to use Redux for room state
4. `src/lib/tempStorage.ts` - Added prominent warning header

### Files NOT Changed (As Required)
- UI components styling (no design changes)
- Temporary storage implementation (still works)
- Multi-step forms (kept form UI state local)
- Preferences flow (only final preferences in Redux)

## TODO Comments Added

All integration points clearly marked with TODO comments:

### Backend/Database Integration
- `// TODO: Replace with actual data fetch from backend`
- `// TODO: Replace temp storage with Supabase`
- `// TODO: Update room status in backend/database`

### WebSocket Integration
- `// TODO: Replace with real WebSocket connection`
- `// TODO: Send vote through WebSocket for real-time updates`
- `// TODO: Setup WebSocket listener for participant updates`

### Repository Layer
- `// TODO: Replace with Supabase: supabase.from('table').insert(...)`
- Each repository function has exact Supabase code example

## Validation Checklist

✅ No voting state exists in component useState
✅ All shared room data comes from Redux
✅ Components only dispatch actions and select state
✅ Temporary storage still works
✅ TODO comments clearly mark DB/WebSocket integration points
✅ UI state (animations, form steps) remains local
✅ Socket architecture prepared but not implemented
✅ Build succeeds without errors
✅ No UI/styling changes made

## Next Steps (NOT Done, As Requested)

### When Ready to Integrate Database:
1. Configure Supabase credentials in `.env`
2. Run database migrations (already exists)
3. Search codebase for `// TODO:` comments
4. Replace temp storage calls with Supabase calls
5. Use repository layer for cleaner replacement

### When Ready to Integrate WebSockets:
1. Choose WebSocket library (Socket.io, Supabase Realtime, etc.)
2. Implement real connections in `src/lib/socket.ts`
3. Setup event listeners to dispatch Redux actions
4. Test real-time updates across multiple clients

### When Ready for RTK Query (Optional):
1. Install `@reduxjs/toolkit` with RTK Query
2. Create API slices for each data domain
3. Replace repository calls with RTK Query hooks
4. Enable automatic caching and refetching

## Architecture Benefits

1. **Predictable State** - All shared state in Redux, single source of truth
2. **Real-time Ready** - WebSocket events directly update Redux store
3. **Easy Testing** - Components only dispatch/select, easy to mock
4. **Scalable** - Clear separation of concerns
5. **Type-safe** - Full TypeScript support
6. **Maintainable** - TODO comments guide future development

## Important Notes

- **NO database integration yet** - Still using temporary storage
- **NO WebSocket implementation yet** - Architecture prepared only
- **NO UI changes** - Only state management refactored
- **Build passes** - All TypeScript errors resolved
- **Temporary storage works** - App still functional with localStorage
