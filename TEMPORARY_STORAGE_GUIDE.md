# Temporary Storage Guide

This project is currently using localStorage as a temporary storage solution instead of Supabase. This allows the app to work without database configuration.

## Files Using Temporary Storage

All temporary storage logic is marked with comments starting with `// TEMPORARY:` followed by a TODO comment explaining what needs to be replaced.

### Main Temporary Storage File
- **`src/lib/tempStorage.ts`** - Contains all temporary storage functions
  - Replace this entire file with actual Supabase calls once configured

### Files Using Temporary Storage

1. **`src/lib/supabase.ts`**
   - Currently uses placeholder values when env variables are missing
   - Exports `isSupabaseConfigured` flag to check if real Supabase is available

2. **`src/components/auth/Login.tsx`**
   - Uses `tempAuth.signIn()` instead of `supabase.auth.signInWithPassword()`
   - Search for: `// TEMPORARY:` comments

3. **`src/components/auth/Signup.tsx`**
   - Uses `tempAuth.signUp()` instead of `supabase.auth.signUp()`
   - Search for: `// TEMPORARY:` comments

4. **`src/components/auth/AuthProvider.tsx`**
   - Uses `tempAuth.getSession()` and `tempAuth.onAuthStateChange()`
   - Search for: `// TEMPORARY:` comments

5. **`src/components/RoomSelection.tsx`**
   - Uses temporary storage for rooms, participants, and session preferences
   - Search for: `// TEMPORARY:` comments

6. **`src/components/PreferencesForm.tsx`**
   - Uses `tempPreferences.save()` instead of Supabase table operations
   - Search for: `// TEMPORARY:` comments

7. **`src/components/CreateRoomForm.tsx`**
   - Uses temporary storage for creating rooms and managing participants
   - Search for: `// TEMPORARY:` comments

## How to Integrate Real Supabase Database

### Step 1: Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 2: Run Database Migrations
The migration file already exists at `supabase/migrations/20260124080712_create_initial_schema.sql`

Run it in your Supabase project to create the necessary tables.

### Step 3: Replace Temporary Storage Calls
Search for all instances of `// TEMPORARY:` in the codebase and replace them:

1. **Authentication**
   - Replace `tempAuth.signIn()` with `supabase.auth.signInWithPassword()`
   - Replace `tempAuth.signUp()` with `supabase.auth.signUp()`
   - Replace `tempAuth.signOut()` with `supabase.auth.signOut()`
   - Replace `tempAuth.getSession()` with `supabase.auth.getSession()`
   - Replace `tempAuth.onAuthStateChange()` with `supabase.auth.onAuthStateChange()`

2. **User Preferences**
   - Replace `tempPreferences.save()` with:
     ```typescript
     await supabase
       .from('user_preferences')
       .upsert(preferences, { onConflict: 'user_id' })
     ```
   - Replace `tempPreferences.get()` with:
     ```typescript
     await supabase
       .from('user_preferences')
       .select('*')
       .eq('user_id', userId)
       .maybeSingle()
     ```

3. **Rooms**
   - Replace `tempRooms.create()` with:
     ```typescript
     await supabase
       .from('rooms')
       .insert(roomData)
       .select()
       .single()
     ```
   - Replace `tempRooms.getByCode()` with:
     ```typescript
     await supabase
       .from('rooms')
       .select('*')
       .eq('room_code', code)
       .maybeSingle()
     ```

4. **Participants**
   - Replace `tempParticipants.add()` with:
     ```typescript
     await supabase
       .from('room_participants')
       .insert({ room_id, user_id, is_online: true })
     ```
   - Replace `tempParticipants.get()` with:
     ```typescript
     await supabase
       .from('room_participants')
       .select('*')
       .eq('room_id', roomId)
     ```

5. **Session Preferences**
   - Replace `tempSessionPreferences.save()` with:
     ```typescript
     await supabase
       .from('session_preferences')
       .insert(preferences)
     ```

### Step 4: Remove Temporary Storage File
Once all replacements are complete:
1. Delete `src/lib/tempStorage.ts`
2. Remove all imports of temp storage functions
3. Test the app thoroughly with real Supabase

### Step 5: Update imports
Remove temporary storage imports:
```typescript
// Remove this:
import { tempAuth, tempRooms, etc } from '../lib/tempStorage';

// Keep this:
import { supabase } from '../lib/supabase';
```

## Current Storage Locations (localStorage)

Data is currently stored in browser localStorage:
- `temp_users` - User accounts
- `temp_session` - Current user session
- `preferences_{userId}` - User preferences
- `temp_rooms` - All rooms
- `participants_{roomId}` - Room participants
- `session_prefs_{roomId}_{userId}` - Session preferences

To clear all temporary data, open browser console and run:
```javascript
localStorage.clear()
```

## Notes
- Temporary storage is NOT shared between users or devices
- Data is lost when localStorage is cleared
- This is only for development/testing without database setup
- Real Supabase integration is required for production use
