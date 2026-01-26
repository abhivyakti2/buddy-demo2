// ============================================================================
// ROOM SELECTION PAGE - CHOOSE TO CREATE OR JOIN A ROOM
// ============================================================================
//
// WHAT THIS PAGE DOES IN THE USER JOURNEY:
// This is the third page users see after signing up and completing preferences.
// Users can either:
// 1. Create a new voting room with custom settings
// 2. Join an existing room using a room code shared by a friend
//
// APP FLOW:
// 1. User logs in → Preferences page (one-time setup)
// 2. User completes preferences → THIS PAGE (room selection)
// 3. User creates/joins room → Room page (waiting area)
// 4. Host starts voting → Voting page (voting on recommendations)
//
// REDUX STATE THIS PAGE READS:
// - state.auth.user: The logged-in user object (needed to join/create rooms)
// - state.preferences.userPreferences: User's saved preferences (used when joining rooms)
//
// WHY WE READ FROM REDUX:
// The user object and preferences need to be accessed from multiple pages,
// so they live in Redux. We read them here to associate rooms/participants
// with the correct user and pre-fill session preferences.
//
// LOCAL UI STATE (useState) - NOT IN REDUX:
// This page uses useState for several pieces of UI state that do NOT belong in Redux:
//
// 1. roomCode (string)
//    WHY LOCAL: Temporary input being typed. Only needed until "Join Room" is clicked.
//    Think: "Draft text message" (local) vs "Sent message" (saved in Redux/database).
//
// 2. showJoinForm (boolean)
//    WHY LOCAL: UI toggle for showing/hiding the join form. No other component needs
//    to know if this form is visible. Pure UI state that resets on page leave.
//
// 3. loading (boolean)
//    WHY LOCAL: Temporary loading spinner state during async operations. Once the
//    operation completes, loading resets. Not data that needs to be shared or persisted.
//
// 4. error (string)
//    WHY LOCAL: Temporary error message shown only on this page. Once user navigates
//    away or retries, the error is no longer relevant. Not global application state.
//
// REDUX VS LOCAL STATE RULE OF THUMB:
// - LOCAL STATE (useState): Temporary, UI-only, single-component, form drafts
// - REDUX STATE: Permanent, shared across components, saved to database, global
//
// HOW THIS PAGE AFFECTS OTHER PAGES:
// When this page joins/creates a room and dispatches setCurrentRoom(room),
// Redux stores the room globally. This means:
// - Room page can display room details without fetching again
// - Voting page knows which room's recommendations to load
// - Header can show room code
// All without re-fetching from the database every time.
//
// TODO: In future, room joins may trigger real-time notifications to other participants via WebSocket
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Sparkles, Heart, Star, Loader2, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentRoom, setSessionPreferences } from '../store/roomsSlice';
import { logout } from '../store/authSlice';
import { authRepository, roomsRepository, participantsRepository, sessionPreferencesRepository } from '../lib/repositories';

const RoomSelection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ========================================================================
  // REDUX STATE READ: Getting the logged-in user
  // ========================================================================
  // We read the user from Redux because it's set globally when the user logs in.
  // We need the user.id to join rooms and create participant records.
  // ========================================================================
  const { user } = useAppSelector((state) => state.auth);

  // ========================================================================
  // REDUX STATE READ: Getting user's saved preferences
  // ========================================================================
  // We read preferences from Redux so we can pre-fill session preferences
  // when joining a room. These were loaded on the preferences page.
  // ========================================================================
  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);

  // ========================================================================
  // LOCAL UI STATE: Room code input (temporary draft data)
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // This is temporary text being typed into an input field. It's a "draft"
  // that only becomes meaningful when the user clicks "Join Room".
  //
  // ANALOGY: Like typing a text message before sending. While typing, it's
  // just local draft text. Only after clicking "Send" does it become data
  // worth storing/sharing.
  //
  // If we put every keystroke into Redux:
  // 1. Performance would suffer (Redux updates trigger re-renders)
  // 2. We'd be storing temporary/incomplete data in global state
  // 3. We'd need to clean it up when user navigates away
  // ========================================================================
  const [roomCode, setRoomCode] = useState('');

  // ========================================================================
  // LOCAL UI STATE: Toggle for showing/hiding join form
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // This controls whether the join room form is visible. It's pure UI state
  // that only matters for this component's visual appearance.
  //
  // No other component needs to know if this form is open. When user navigates
  // away, this state naturally disappears (which is what we want).
  //
  // ANALOGY: Like a dropdown menu being open/closed. The open/closed state
  // doesn't need to be saved or shared with other components.
  // ========================================================================
  const [showJoinForm, setShowJoinForm] = useState(false);

  // ========================================================================
  // LOCAL UI STATE: Loading spinner state
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // Loading spinners are temporary UI feedback shown during async operations.
  // Once the operation completes (success or failure), loading resets to false.
  //
  // This is component-specific feedback that doesn't need to be shared globally.
  // Other components have their own loading states for their own operations.
  //
  // ANALOGY: Like a "Sending..." indicator on a button. It's temporary visual
  // feedback that disappears when the action completes.
  // ========================================================================
  const [loading, setLoading] = useState(false);

  // ========================================================================
  // LOCAL UI STATE: Error message feedback
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // Error messages are temporary feedback shown only on this page. Once the
  // user navigates away or retries the action, the error is no longer relevant.
  //
  // If we stored errors in Redux, we'd need to manually clear them on every
  // page change, and we'd be polluting global state with temporary messages.
  //
  // ANALOGY: Like a toast notification that disappears after being shown.
  // It's temporary feedback, not permanent application data.
  // ========================================================================
  const [error, setError] = useState('');

  // ========================================================================
  // NAVIGATION: Navigate to create room page
  // ========================================================================
  // This is a simple navigation - no Redux dispatch needed here because we're
  // just moving to another page. The create room form will handle saving data.
  // ========================================================================
  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  // ========================================================================
  // JOIN ROOM FLOW: Search for room, add participant, save preferences
  // ========================================================================
  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !user) return;

    // Set loading to show spinner (local UI feedback)
    setLoading(true);
    setError('');

    try {
      // =============================================================================
      // TEMPORARY STORAGE: Finding room by code in backend
      // =============================================================================
      // WHAT THIS DOES:
      // Searches the backend for a room matching the entered room code so the user
      // can join an existing room created by someone else.
      //
      // WHY FETCH BEFORE REDUX:
      // We need to verify the room exists and get its full details (ID, creator, etc.)
      // before we can add the user as a participant or update Redux.
      //
      // DATA FLOW:
      // 1. User enters room code → Search temporary storage (or real database)
      // 2. If found → Add user as participant
      // 3. Dispatch room data to Redux → Navigate to room page
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      // TODO: In future, joining may trigger WebSocket event to notify other participants
      const { data: room, error: roomError } = await roomsRepository.getByCode(roomCode.trim().toUpperCase());

      // ERROR HANDLING:
      // If the fetch fails, throw error and skip all remaining operations.
      if (roomError) throw roomError;

      // VALIDATION:
      // If no room found with this code, show user-friendly error and stop.
      // Don't dispatch to Redux since there's no valid room data.
      if (!room) {
        setError('Room not found. Please check the room code.');
        setLoading(false);
        return;
      }

      // =============================================================================
      // TEMPORARY STORAGE: Adding user as participant to the room
      // =============================================================================
      // WHAT THIS DOES:
      // Registers this user as a participant in the room so they appear in the
      // participants list and can vote on recommendations.
      //
      // WHY SAVE BEFORE REDUX:
      // We must persist the participant record to storage before proceeding.
      // This creates a permanent record of room membership.
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      // TODO: In future, this may emit WebSocket event for real-time participant list updates
      const { error: participantError } = await participantsRepository.add(room.id, user.id);

      // ERROR HANDLING:
      // If adding participant fails, throw error and skip remaining operations.
      if (participantError) throw participantError;

      // Prepare session preferences using user's general preferences as defaults
      const sessionPrefs = {
        room_id: room.id,
        user_id: user.id,
        budget: '',
        distance_km: null,
        location: userPreferences?.home_address || '',
        outdoor_indoor: 'both',
        activities: (userPreferences?.activities as string[]) || [],
        food_preferences: userPreferences?.food_preferences || { categories: [], restrictions: '' },
      };

      // =============================================================================
      // TEMPORARY STORAGE: Saving default session preferences for joined room
      // =============================================================================
      // WHAT THIS DOES:
      // Creates initial session preferences using the user's general preferences.
      // These can be customized later for this specific room/outing.
      //
      // WHY SAVE BEFORE REDUX:
      // We need to persist these preferences to storage so they're available
      // when generating recommendations and calculating best matches.
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);

      // ERROR HANDLING:
      // If saving preferences fails, throw error and skip Redux/navigation.
      if (prefsError) throw prefsError;

      // =============================================================================
      // REDUX DISPATCH: Update global state after successful join
      // =============================================================================
      // SUCCESS: All backend operations completed successfully!
      // NOW we dispatch to Redux to update the in-memory state.
      //
      // WHY DISPATCH TO REDUX NOW:
      // User successfully joined the room and all data is stored in backend.
      // Redux becomes the source of truth for this session.
      //
      // WHAT HAPPENS AFTER DISPATCH:
      // 1. Redux stores room data in state.rooms.currentRoom
      // 2. Redux stores session preferences in state.rooms.sessionPreferences
      // 3. ALL components reading these Redux values automatically re-render
      // 4. Room page will display room details without fetching again
      // 5. Voting page will know which room's recommendations to load
      //
      // DATA FLOW:
      // Backend storage (permanent) → Redux (session memory) → UI components (render)
      //
      // HOW REDUX UPDATES TRIGGER UI CHANGES:
      // Any component using useAppSelector(state => state.rooms.currentRoom) will
      // automatically re-render when we dispatch these actions. For example:
      // - Room page header will show the room code
      // - Participant list will update to include this user
      // - Room settings will display the session preferences
      // =============================================================================
      // TODO: In future, this join event may be broadcasted via WebSocket to all room participants
      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));

      // =============================================================================
      // NAVIGATION: Navigate only after Redux state is updated
      // =============================================================================
      // WHY NAVIGATE LAST:
      // We navigate to the room page AFTER confirming that:
      // 1. Data is saved to database (permanent storage)
      // 2. Redux is updated (in-memory cache)
      //
      // If we navigated BEFORE saving, the user would move to the room page but
      // their participation wouldn't be recorded - terrible user experience!
      //
      // If we navigated BEFORE Redux update, the room page might try to read
      // room data from Redux but find nothing, causing errors or loading states.
      //
      // CORRECT ORDER: Save → Update Redux → Navigate
      //
      // This ensures the next page has all the data it needs already in Redux.
      // =============================================================================
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      // If anything failed, show error message (local UI state)
      // Redux is NOT updated, database is unchanged, user can fix and retry
      setError(err.message || 'Failed to join room');
    } finally {
      // Always hide loading spinner when done (success or failure)
      setLoading(false);
    }
  };

  // ========================================================================
  // LOGOUT FLOW: Clear session from backend and Redux
  // ========================================================================
  const handleLogout = async () => {
    // =============================================================================
    // TEMPORARY STORAGE: Clearing user session on logout
    // =============================================================================
    // WHAT THIS DOES:
    // Removes the user's authentication session from storage, effectively logging
    // them out of the application.
    //
    // WHY CLEAR BACKEND FIRST:
    // We must clear the session in storage BEFORE clearing Redux. This ensures
    // if the app reloads, the user won't be automatically logged back in.
    //
    // DATA FLOW:
    // 1. User clicks logout → Clear session from temporary storage (or real auth service)
    // 2. Dispatch logout to Redux → Clears all user data from memory
    // 3. Navigate to login page
    // =============================================================================
    // TODO: Replace this with real DB / Supabase / API call
    await authRepository.signOut();

    // =============================================================================
    // REDUX DISPATCH: Clear all user data from Redux after backend logout
    // =============================================================================
    // WHY DISPATCH LOGOUT:
    // This clears all user-related data from Redux (user object, session, etc.).
    // After this dispatch, all components reading auth state will re-render and
    // see that no user is logged in, triggering redirects to login page.
    //
    // HOW REDUX UPDATES TRIGGER UI CHANGES:
    // Components using useAppSelector(state => state.auth.user) will see user
    // become null, causing:
    // - Protected routes to redirect to login
    // - Navigation bar to hide user-specific options
    // - Auth-dependent components to unmount
    // =============================================================================
    dispatch(logout());

    // Navigate to login page after clearing all state
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="absolute top-4 right-4 magical-button-secondary px-4 py-2 flex items-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-lg p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold magical-text mb-4">
            Choose Your Adventure
          </h1>
          <p className="text-white/80">Create magic or join the sparkles</p>
        </motion.div>

        {/* ================================================================
            ERROR MESSAGE DISPLAY
            Shows temporary error feedback from local state
            This is NOT in Redux because it's temporary UI feedback
            ================================================================ */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* ============================================================
              CREATE ROOM BUTTON
              Navigates to create room page without Redux dispatch
              ============================================================ */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom}
            className="magical-room-button w-full p-6 group"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="sparkle-icon"
            >
              <Plus size={32} />
            </motion.div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Create New Room</h3>
              <p className="text-sm text-white/70">Start a magical voting experience</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="floating-hearts"
            >
              <Heart className="heart-1" size={16} />
              <Star className="heart-2" size={16} />
              <Sparkles className="heart-3" size={16} />
            </motion.div>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* ========================================================
                JOIN ROOM BUTTON
                Toggles the join form visibility (local UI state)
                ======================================================== */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJoinForm(!showJoinForm)}
              className="magical-room-button w-full p-6 group"
            >
              <motion.div
                animate={{ bounce: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="sparkle-icon"
              >
                <Users size={32} />
              </motion.div>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Join Existing Room</h3>
                <p className="text-sm text-white/70">Enter a room code to join the magic</p>
              </div>
            </motion.button>

            {/* ========================================================
                JOIN ROOM FORM
                Shown/hidden based on showJoinForm (local UI state)
                Contains room code input (local draft data)
                ======================================================== */}
            {showJoinForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {/* ====================================================
                    ROOM CODE INPUT
                    Updates local state (roomCode) as user types
                    This is draft data that only matters when user clicks "Join"
                    ==================================================== */}
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="magical-input text-center text-lg font-mono"
                    maxLength={8}
                    disabled={loading}
                  />
                </div>
                {/* ====================================================
                    JOIN ROOM BUTTON
                    Triggers backend save → Redux dispatch → Navigation
                    Shows loading spinner from local state during operation
                    ==================================================== */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim() || loading}
                  className="magical-button w-full py-3 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Join the Magic
                        <Heart size={20} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-white/60"
        >
          <p className="text-sm">Where friends become magic makers</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoomSelection;
