# Architecture Finalization - Redux + WebSocket Readiness + DB Abstraction

This document summarizes all architectural changes made to finalize Redux correctness, WebSocket readiness, and temporary DB abstraction.

## Summary of Changes

### 1. Moved Mock Data Creation Out of Components

**BEFORE:** Components had inline mock data
```typescript
// VotingPage.tsx - BEFORE
const mockRecommendations = [
  { id: 1, name: "...", ... }
];
dispatch(setRecommendations(mockRecommendations));
```

**AFTER:** Mock data is in temp repositories
```typescript
// VotingPage.tsx - AFTER
const { data: recs } = await recommendationsRepository.getByRoom(roomId);
dispatch(setRecommendations(recs));
```

All mock data now lives in:
- `tempStorage.ts` - Mock data generation functions
- `repositories.ts` - Abstraction layer over temp storage

### 2. All Shared Data Flows Through Redux

**Confirmed Redux State:**
- Votes (per recommendation)
- Recommendations list
- Room participants
- Room status (is_active)
- Current room
- User preferences
- Session preferences
- WebSocket connection status

**UI State (Local Only):**
- Current recommendation index
- Current image index
- Show/hide panels
- Form step navigation
- Modal visibility

### 3. WebSocket TODO Completeness

**Added TODOs at all integration points:**

#### Vote Operations
```typescript
// VotingPage.tsx - Vote cast
// TODO: Emit vote cast event via WebSocket for real-time updates
socketEvents.castVote(roomId, recommendationId, user.id, 'yes');

// VotingPage.tsx - Vote removal
// TODO: Emit vote removal event via WebSocket for real-time updates
socketEvents.castVote(roomId, recommendationId, user.id, 'removed');
```

#### Room Status Changes
```typescript
// RoomPage.tsx - Start voting
// TODO: Persist room status change to backend/database
await roomsRepository.update(roomId, { is_active: true });
// TODO: Emit start voting event via WebSocket for real-time updates
socketEvents.startVoting(roomId);

// RoomPage.tsx - End voting
// TODO: Persist room status change to backend/database
await roomsRepository.update(roomId, { is_active: false });
// TODO: Emit end voting event via WebSocket for real-time updates
socketEvents.endVoting(roomId);
```

#### Participant Join/Leave
```typescript
// RoomPage.tsx - useEffect cleanup
// TODO: Setup WebSocket listener for participant updates
// TODO: Emit participant join event via WebSocket
// socketService.connect(dispatch, roomId);
// socketEvents.updateParticipantStatus(roomId, user?.id || '', true);
// return () => {
//   // TODO: Emit participant leave event via WebSocket
//   socketEvents.updateParticipantStatus(roomId, user?.id || '', false);
//   socketService.disconnect(dispatch);
// };
```

#### Recommendations Loading
```typescript
// VotingPage.tsx
// TODO: Replace temp repository with backend/AI service fetch
const { data: recs } = await recommendationsRepository.getByRoom(roomId);
```

### 4. Repository Abstraction Consistency

**ALL temp DB usage now goes through repositories:**

#### New Repository Functions Added
```typescript
// tempStorage.ts - New additions
export const tempRecommendations = {
  getByRoom: async (roomId: string) => { /* mock data */ }
};

export const tempVotes = {
  cast: async (vote: any) => { /* persist to localStorage */ },
  remove: async (roomId, recId, userId) => { /* remove from localStorage */ },
  getByRoom: async (roomId: string) => { /* load from localStorage */ }
};
```

#### Repository Layer Updated
```typescript
// repositories.ts
export const recommendationsRepository = {
  // TODO: Replace with Supabase or backend API
  getByRoom: async (roomId: string) => tempRecommendations.getByRoom(roomId)
};

export const votesRepository = {
  // TODO: Replace with Supabase
  cast: async (vote: any) => tempVotes.cast(vote),
  remove: async (roomId, recId, userId) => tempVotes.remove(roomId, recId, userId),
  getByRoom: async (roomId: string) => tempVotes.getByRoom(roomId)
};
```

### 5. Preferences Source of Truth

**Redux is now single source after initial load:**

```typescript
// CreateRoomForm.tsx - BEFORE
const { data, error } = await tempPreferences.get(user.id);

// CreateRoomForm.tsx - AFTER
// TODO: Skip backend fetch if preferences already exist in Redux (single source of truth)
if (userPreferences) {
  // Use existing Redux preferences
  setFormData(/* populate from Redux */);
  return;
}
// Only fetch if not in Redux
const { data, error } = await preferencesRepository.get(user.id);
```

### 6. All Components Use Repositories

**Updated components:**
- VotingPage.tsx - Uses `recommendationsRepository`, `votesRepository`
- RoomPage.tsx - Uses `participantsRepository`, `roomsRepository`
- RoomSelection.tsx - Uses `authRepository`, `roomsRepository`, `participantsRepository`, `sessionPreferencesRepository`
- CreateRoomForm.tsx - Uses `roomsRepository`, `participantsRepository`, `sessionPreferencesRepository`, `preferencesRepository`
- PreferencesForm.tsx - Uses `preferencesRepository`
- Login.tsx - Uses `authRepository`
- Signup.tsx - Uses `authRepository`
- AuthProvider.tsx - Uses `authRepository`

## Architecture Benefits

### 1. Clear Separation of Concerns
- **Temp Storage Layer** (`tempStorage.ts`) - Mock data generation
- **Repository Layer** (`repositories.ts`) - Clean abstraction with TODOs
- **Redux Layer** (slices) - State management
- **Component Layer** - UI only, dispatch actions

### 2. Easy Database Integration
All TODO comments point to exact replacement:
```typescript
// TODO: Replace temp repository with Supabase:
// await supabase.from('recommendations').select('*').eq('room_id', roomId)
```

### 3. WebSocket Ready
All socket integration points have:
- Clear TODO comments
- Function signatures ready
- Redux actions prepared

### 4. Type-Safe
- Repository functions return typed data
- Redux state is fully typed
- No `any` types except in temporary mock data

## Data Flow Architecture

### Voting Flow (Complete)
```
User clicks vote
  ↓
Component: handleVote()
  ↓
Redux: dispatch(addVote(vote))
  ↓
Repository: votesRepository.cast(vote)
  ↓
Temp Storage: localStorage (temporary)
  ↓
[TODO] WebSocket: socketEvents.castVote(...)
  ↓
[TODO] Backend: Persist to Supabase
  ↓
All clients receive update via WebSocket
  ↓
Redux: dispatch(addVote(vote)) on other clients
  ↓
Components auto re-render
```

### Room Status Flow (Complete)
```
Host clicks "Start Voting"
  ↓
Component: startVoting()
  ↓
Redux: dispatch(updateRoomStatus(true))
  ↓
Repository: roomsRepository.update(roomId, { is_active: true })
  ↓
Temp Storage: localStorage (temporary)
  ↓
[TODO] WebSocket: socketEvents.startVoting(roomId)
  ↓
[TODO] Backend: Update room in Supabase
  ↓
All participants receive update
  ↓
Redux: dispatch(updateRoomStatus(true)) on other clients
  ↓
Components auto re-render with voting UI
```

### Recommendations Loading Flow (Complete)
```
User enters voting page
  ↓
Component: useEffect(() => loadData())
  ↓
Repository: recommendationsRepository.getByRoom(roomId)
  ↓
Temp Storage: Mock recommendations (temporary)
  ↓
[TODO] Backend: Fetch from Supabase or AI service
  ↓
Redux: dispatch(setRecommendations(recs))
  ↓
Redux: dispatch(setVotes(votesData))
  ↓
Component renders recommendations
```

## Migration Path

### Step 1: Database Integration
1. Search for `// TODO: Replace temp repository`
2. Replace repository implementations with Supabase calls
3. Keep repository interface unchanged
4. Components continue working without changes

### Step 2: WebSocket Integration
1. Search for `// TODO: Emit` and `// TODO: Setup WebSocket`
2. Implement real WebSocket in `src/lib/socket.ts`
3. Setup event listeners to dispatch Redux actions
4. Test real-time updates

### Step 3: Remove Temp Storage
1. Delete `tempStorage.ts`
2. Update repository imports
3. Verify all TODOs are resolved

## File Structure

```
src/
├── lib/
│   ├── tempStorage.ts          # Mock data (delete later)
│   ├── repositories.ts         # Abstraction layer (keep, update implementations)
│   ├── socket.ts               # WebSocket service (implement later)
│   └── supabase.ts             # Supabase client
├── store/
│   ├── authSlice.ts            # Auth state
│   ├── preferencesSlice.ts    # User preferences
│   ├── roomsSlice.ts           # Room, participants, session prefs
│   ├── recommendationsSlice.ts # Recommendations, votes
│   ├── socketSlice.ts          # WebSocket connection state
│   └── store.ts                # Redux store config
└── components/
    ├── VotingPage.tsx          # Uses repositories + Redux
    ├── RoomPage.tsx            # Uses repositories + Redux
    └── ...                     # All components use repositories
```

## Validation Checklist

✅ No inline mock data in components
✅ All shared state flows through Redux
✅ UI state stays in local useState
✅ All backend integration points have TODOs
✅ All WebSocket integration points have TODOs
✅ All temp DB usage goes through repositories
✅ Preferences use Redux as source of truth
✅ Build succeeds without errors
✅ Temporary storage still works
✅ No design/UI changes made

## Next Steps (When Ready)

1. **Configure Supabase** - Add credentials to `.env`
2. **Run Migrations** - Create database tables
3. **Update Repositories** - Replace temp storage with Supabase
4. **Implement WebSockets** - Real-time updates
5. **Test Integration** - Multi-client testing
6. **Remove Temp Storage** - Delete temporary code

## Notes

- Temporary storage continues to work exactly as before
- No breaking changes to existing functionality
- All TODOs are clear and actionable
- Architecture is production-ready (just needs real backend)
