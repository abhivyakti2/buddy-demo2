// ============================================================================
// CREATE ROOM FORM - MULTI-STEP ROOM CREATION WITH PREFERENCES
// ============================================================================
//
// WHAT THIS PAGE DOES IN THE USER JOURNEY:
// This is a 4-step form where users create a new voting room and configure
// preferences specific to this outing. Unlike general user preferences (set
// once during onboarding), these are session-specific preferences that only
// apply to this particular room/event.
//
// APP FLOW:
// 1. User clicks "Create Room" on room selection page → THIS PAGE (4-step form)
// 2. User completes form → Room created → Room page (waiting for participants)
// 3. Host starts voting → Voting page (participants vote on recommendations)
//
// THE 4 STEPS:
// Step 1: Outing details (occasion, mood, time)
// Step 2: Budget and location preferences
// Step 3: Activities for this specific outing
// Step 4: Food preferences for this specific outing
//
// REDUX STATE THIS PAGE READS:
// - state.auth.user: The logged-in user object (needed to create room as creator)
// - state.preferences.userPreferences: User's general preferences (used to pre-fill form)
//
// WHY WE READ FROM REDUX:
// The user object needs to be associated with the room as the creator.
// User preferences are read to pre-fill the form with sensible defaults, but
// users can customize them for this specific outing.
//
// LOCAL UI STATE (useState) - NOT IN REDUX:
// This page uses useState extensively for UI state that does NOT belong in Redux:
//
// 1. currentStep (number: 1-4)
//    WHY LOCAL: Step navigation is pure UI state. No other component needs to know
//    which step the user is on. It resets to 1 every time the form is opened.
//    Think: "Which page of a wizard am I on?" - temporary navigation state.
//
// 2. loading (boolean)
//    WHY LOCAL: Temporary loading spinner state during form submission. Once the
//    room is created, loading resets. Not data that needs to be shared or persisted.
//
// 3. error (string)
//    WHY LOCAL: Temporary error message shown only on this page. Once user navigates
//    away or retries, the error is no longer relevant. Not global application state.
//
// 4. formData (object with all form fields)
//    WHY LOCAL: These are DRAFT INPUTS being edited. They're like writing an email
//    before clicking send. Only after clicking "Create Room" do they become data
//    worth storing in Redux/database.
//
//    Fields include:
//    - occasion: What's the event (birthday, date night, etc.)
//    - mood: Array of mood choices (casual, celebratory, romantic, etc.)
//    - startTime, endTime, duration: Time preferences
//    - budget, distance, location: Budget and location constraints
//    - outdoorIndoor: Outdoor/indoor preference
//    - activities: Array of activity types for this outing
//    - customActivity: User's custom activity text
//    - foodCategories: Array of food types for this outing
//    - foodRestrictions: Dietary restrictions for this outing
//
//    WHY ALL FORM DATA IS LOCAL STATE:
//    If we put form inputs in Redux:
//    1. Every keystroke would trigger global state updates (performance hit)
//    2. Half-filled forms would pollute global state with incomplete data
//    3. We'd need cleanup logic when user cancels or navigates away
//    4. Multiple forms couldn't be edited independently
//
//    BEST PRACTICE: Keep form inputs in local state until submission, then
//    dispatch the final values to Redux only after successful save to database.
//
// REDUX VS LOCAL STATE RULE OF THUMB:
// - LOCAL STATE (useState): Form drafts, step navigation, temporary UI feedback
// - REDUX STATE: Finalized data saved to database, shared across components
//
// HOW THIS PAGE AFFECTS OTHER PAGES:
// When this page creates a room and dispatches setCurrentRoom(room), Redux
// stores the room globally. This means:
// - Room page can display room details without fetching again
// - Voting page knows which room's recommendations to load
// - All participants can see room details through Redux
// All without re-fetching from the database every time.
//
// DIFFERENCE BETWEEN USER PREFERENCES AND SESSION PREFERENCES:
// - User Preferences: "I usually like Italian food" (set once, used as defaults)
// - Session Preferences: "For THIS birthday party, let's do Chinese" (per-room override)
//
// This form creates session preferences that can differ from user's general preferences.
//
// TODO: In future, room creation may trigger WebSocket event to notify potential participants
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentRoom, setSessionPreferences } from '../store/roomsSlice';
import { setUserPreferences } from '../store/preferencesSlice';
import { roomsRepository, participantsRepository, sessionPreferencesRepository, preferencesRepository } from '../lib/repositories';

const CreateRoomForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ========================================================================
  // REDUX STATE READ: Getting the logged-in user
  // ========================================================================
  // We read the user from Redux because it's set globally when the user logs in.
  // We need the user.id to create the room and set them as the creator.
  // ========================================================================
  const { user } = useAppSelector((state) => state.auth);

  // ========================================================================
  // REDUX STATE READ: Getting user's saved preferences
  // ========================================================================
  // We read preferences from Redux so we can pre-fill the form with the user's
  // general preferences. Users can then customize these for this specific outing.
  // ========================================================================
  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);

  // ========================================================================
  // LOCAL UI STATE: Step navigation in the multi-step form
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // The current step (1, 2, 3, or 4) is purely for UI navigation. No other
  // component in the app needs to know which step this form is on. It's
  // temporary state that resets every time the user visits this page.
  //
  // If we put this in Redux, we'd be polluting global state with information
  // that's only relevant to this single component's internal UI logic.
  //
  // ANALOGY: Like "which page of a multi-page form you're on" - temporary
  // navigation state that doesn't need to be stored or shared.
  // ========================================================================
  const [currentStep, setCurrentStep] = useState(1);

  // ========================================================================
  // LOCAL UI STATE: Loading and error feedback
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // Loading spinners and error messages are temporary UI feedback shown only
  // on this page. They're not data that needs to be shared with other components.
  //
  // When the form submission completes (success or failure), these values are
  // used to show immediate feedback, then they reset or the user navigates away.
  //
  // ANALOGY: Like a "processing" indicator on a submit button - temporary
  // status feedback that doesn't need to be stored or shared globally.
  // ========================================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ========================================================================
  // LOCAL UI STATE: Form input values (the "draft" data)
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // These are the user's in-progress form selections. They're like a "draft"
  // that hasn't been saved yet. Redux should only store finalized, committed data.
  //
  // Imagine editing a document:
  // - While typing: Local state (unsaved draft)
  // - After clicking Save: Redux state (finalized document)
  //
  // If we put every keystroke and every checkbox click into Redux:
  // 1. Performance would suffer (Redux updates trigger re-renders)
  // 2. We'd have no distinction between "draft" and "saved" data
  // 3. If user clicks Cancel/Back, we'd have to "undo" all Redux changes
  // 4. Redux would be cluttered with half-completed form data
  //
  // BEST PRACTICE: Keep form inputs in local state until submission, then
  // dispatch the final values to Redux only after successful save to database.
  //
  // FORM FIELDS:
  // - occasion: String input (e.g., "Birthday Party", "Date Night")
  // - mood: Array of selected mood tags (e.g., ['casual', 'celebratory'])
  // - startTime, endTime, duration: Time preferences for the outing
  // - budget: Selected budget level (budget, moderate, premium, luxury)
  // - distance: Maximum distance willing to travel (in km)
  // - location: Starting location (defaults to user's home address)
  // - outdoorIndoor: Outdoor/indoor preference (outdoor, indoor, both)
  // - activities: Array of selected activity types
  // - customActivity: User's custom activity text input
  // - foodCategories: Array of selected cuisine types
  // - foodRestrictions: Dietary restrictions text input
  // ========================================================================
  const [formData, setFormData] = useState({
    occasion: '',
    mood: [] as string[],
    startTime: '',
    endTime: '',
    duration: '',
    budget: '',
    distance: '',
    location: '',
    outdoorIndoor: '',
    activities: [] as string[],
    customActivity: '',
    foodCategories: [] as string[],
    foodRestrictions: '',
  });

  const totalSteps = 4;

  // Multi-step form configuration: option arrays for each step
  const moodOptions = [
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'celebratory', label: 'Celebratory', emoji: '🎉' },
    { value: 'romantic', label: 'Romantic', emoji: '💕' },
    { value: 'adventurous', label: 'Adventurous', emoji: '🌟' },
    { value: 'relaxed', label: 'Relaxed', emoji: '🧘' },
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'formal', label: 'Formal', emoji: '👔' },
    { value: 'cozy', label: 'Cozy', emoji: '🕯️' },
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget-friendly', emoji: '💰' },
    { value: 'moderate', label: 'Moderate', emoji: '💳' },
    { value: 'premium', label: 'Premium', emoji: '💎' },
    { value: 'luxury', label: 'Luxury', emoji: '👑' },
  ];

  const outdoorIndoorOptions = [
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'indoor', label: 'Indoor', emoji: '🏠' },
    { value: 'both', label: 'Both', emoji: '🌈' },
  ];

  const activityOptions = [
    { value: 'restaurants', label: 'Dining', emoji: '🍽️' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'culture', label: 'Culture', emoji: '🎨' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
  ];

  const foodOptions = [
    { value: 'italian', label: 'Italian', emoji: '🍝' },
    { value: 'chinese', label: 'Chinese', emoji: '🥡' },
    { value: 'indian', label: 'Indian', emoji: '🍛' },
    { value: 'mexican', label: 'Mexican', emoji: '🌮' },
    { value: 'japanese', label: 'Japanese', emoji: '🍱' },
    { value: 'american', label: 'American', emoji: '🍔' },
    { value: 'mediterranean', label: 'Mediterranean', emoji: '🥙' },
    { value: 'thai', label: 'Thai', emoji: '🍜' },
  ];

  // ========================================================================
  // LOAD USER PREFERENCES TO PRE-FILL FORM
  // ========================================================================
  // This effect runs once when the component mounts to load the user's general
  // preferences and pre-fill some form fields with sensible defaults.
  // ========================================================================
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      // TODO: Skip backend fetch if preferences already exist in Redux (single source of truth)
      if (userPreferences) {
        // ====================================================================
        // OPTIMIZATION: Use existing Redux preferences without re-fetching
        // ====================================================================
        // If preferences are already in Redux (loaded on preferences page),
        // we can skip the database fetch and just use the Redux data.
        // This is faster and avoids unnecessary API calls.
        //
        // We update LOCAL form state with these preferences as defaults.
        // Users can then customize them for this specific outing.
        // ====================================================================
        setFormData((prev) => ({
          ...prev,
          activities: (userPreferences.activities as string[]) || [],
          foodCategories: ((userPreferences.food_preferences as any)?.categories as string[]) || [],
          foodRestrictions: ((userPreferences.food_preferences as any)?.restrictions as string) || '',
          location: userPreferences.home_address || '',
        }));
        setLoading(false);
        return;
      }

      try {
        // =============================================================================
        // TEMPORARY STORAGE: Fetching user preferences from backend
        // =============================================================================
        // WHAT THIS DOES:
        // Retrieves the user's saved preferences (food choices, activities, transport)
        // from persistent storage so we can pre-fill the room creation form.
        //
        // WHY FETCH BEFORE REDUX:
        // Redux stores current in-memory state, but the backend stores permanent data.
        // We need to fetch the latest saved preferences from storage FIRST, then put
        // them into Redux so all components can access them.
        //
        // DATA FLOW:
        // 1. Component loads → Fetch from temporary storage (or real database)
        // 2. If successful → Dispatch to Redux (becomes source of truth)
        // 3. Redux updates → Component re-renders with fetched data
        // 4. Form fields pre-populate with user's saved preferences
        // =============================================================================
        // TODO: Replace this with real DB / Supabase / API call
        const { data, error } = await preferencesRepository.get(user.id);

        // ERROR HANDLING:
        // If the fetch fails (error exists), we throw and skip Redux update.
        // This prevents corrupted or incomplete data from reaching Redux and the UI.
        if (error) throw error;

        if (data) {
          // =================================================================
          // REDUX DISPATCH: Store fetched preferences in Redux
          // =================================================================
          // SUCCESS: Data fetched successfully, now update Redux
          // WHY DISPATCH TO REDUX:
          // Redux becomes the single source of truth for this session.
          // Other components can now read preferences from Redux without refetching.
          //
          // HOW REDUX UPDATES TRIGGER UI CHANGES:
          // After this dispatch, any component using
          // useAppSelector(state => state.preferences.userPreferences)
          // will automatically have access to this data without fetching again.
          // =================================================================
          dispatch(setUserPreferences(data));

          // Update LOCAL form state with the fetched preferences
          // These serve as defaults that users can customize for this room
          setFormData((prev) => ({
            ...prev,
            activities: (data.activities as string[]) || [],
            foodCategories: ((data.food_preferences as any)?.categories as string[]) || [],
            foodRestrictions: ((data.food_preferences as any)?.restrictions as string) || '',
            location: data.home_address || '',
          }));
        }
      } catch (err) {
        // ERROR HANDLING:
        // If fetch fails, we log the error but don't dispatch to Redux.
        // Form remains empty rather than showing incorrect/stale data.
        console.error('Error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, dispatch, userPreferences]);

  // ========================================================================
  // LOCAL STATE UPDATE HANDLERS: Update form draft data
  // ========================================================================
  // These handlers update the local formData state as users interact with the form.
  // Notice we're NOT dispatching to Redux here because these are unsaved drafts.
  // ========================================================================

  // Toggle mood selection (can select multiple)
  const handleMoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mood: prev.mood.includes(value)
        ? prev.mood.filter((m) => m !== value)
        : [...prev.mood, value],
    }));
  };

  // Toggle activity selection (can select multiple)
  const handleActivityToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(value)
        ? prev.activities.filter((a) => a !== value)
        : [...prev.activities, value],
    }));
  };

  // Toggle food category selection (can select multiple)
  const handleFoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(value)
        ? prev.foodCategories.filter((f) => f !== value)
        : [...prev.foodCategories, value],
    }));
  };

  // ========================================================================
  // STEP VALIDATION: Check if current step is complete
  // ========================================================================
  // This validates the local draft data before allowing user to proceed.
  // We're checking local state, not Redux, because we're validating unsaved data.
  // ========================================================================
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.occasion.trim() !== '' && formData.mood.length > 0;
      case 2:
        return (
          formData.budget !== '' &&
          formData.outdoorIndoor !== '' &&
          formData.distance !== ''
        );
      case 3:
        return formData.activities.length > 0;
      case 4:
        return formData.foodCategories.length > 0;
      default:
        return false;
    }
  };

  // Generate a random room code for the new room
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // ========================================================================
  // NAVIGATION: Move to next step or submit form
  // ========================================================================
  // This only updates local UI state (currentStep) - no Redux involved.
  // Navigation between steps is internal UI logic.
  // ========================================================================
  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Move to next step (local UI state update)
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: submit the form
      handleSubmit();
    }
  };

  // ========================================================================
  // NAVIGATION: Move to previous step
  // ========================================================================
  // Again, pure UI navigation using local state.
  // ========================================================================
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ========================================================================
  // FORM SUBMISSION: Save room, participant, and preferences to database
  // ========================================================================
  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const roomCode = generateRoomCode();

      // Prepare room data from the form inputs (local state)
      const roomData = {
        room_code: roomCode,
        creator_id: user.id,
        occasion: formData.occasion,
        mood_atmosphere: formData.mood,
        start_time: formData.startTime || null,
        end_time: formData.endTime || null,
        duration_minutes: formData.duration ? parseInt(formData.duration) : null,
        is_active: false,
      };

      // =============================================================================
      // TEMPORARY STORAGE: Creating a new room in the backend
      // =============================================================================
      // WHAT THIS DOES:
      // Saves the new room to persistent storage so it exists beyond this session.
      // Creates a permanent record that other users can join via the room code.
      //
      // WHY SAVE BEFORE REDUX:
      // The backend generates important data (like the room ID) that we need before
      // we can dispatch to Redux. We must wait for the save to complete successfully.
      //
      // DATA FLOW:
      // 1. User submits form → Save room to temporary storage (or real database)
      // 2. Backend returns created room with generated ID
      // 3. Dispatch room to Redux (discussed below after all saves complete)
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      // TODO: In future, room creation may emit WebSocket event to notify users
      const { data: room, error: roomError } = await roomsRepository.create(roomData);

      // ERROR HANDLING:
      // If room creation fails, throw error and skip all remaining operations.
      // This prevents adding participants or preferences to a non-existent room.
      if (roomError) throw roomError;

      // =============================================================================
      // TEMPORARY STORAGE: Adding creator as first participant
      // =============================================================================
      // WHAT THIS DOES:
      // Adds the room creator to the participants list so they appear in the room.
      //
      // WHY SAVE BEFORE REDUX:
      // We need to ensure the creator is registered as a participant in storage
      // before moving forward. This creates a permanent record of room membership.
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      const { error: participantError } = await participantsRepository.add(room.id, user.id);

      // ERROR HANDLING:
      // If adding participant fails, throw error and skip remaining operations.
      if (participantError) throw participantError;

      // Prepare session preferences from form data
      const allActivities = formData.customActivity.trim()
        ? [...formData.activities, formData.customActivity.trim()]
        : formData.activities;

      const sessionPrefs = {
        room_id: room.id,
        user_id: user.id,
        budget: formData.budget,
        distance_km: parseInt(formData.distance) || null,
        location: formData.location,
        outdoor_indoor: formData.outdoorIndoor,
        activities: allActivities,
        food_preferences: {
          categories: formData.foodCategories,
          restrictions: formData.foodRestrictions,
        },
      };

      // =============================================================================
      // TEMPORARY STORAGE: Saving session-specific preferences
      // =============================================================================
      // WHAT THIS DOES:
      // Saves preferences for THIS specific room/outing. These are different from
      // general user preferences (e.g., "For this birthday party, I want Italian food"
      // even though I normally prefer Chinese).
      //
      // WHY SAVE BEFORE REDUX:
      // We need to ensure preferences are persisted to storage before continuing.
      // This creates a permanent record tied to this specific room session.
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);

      // ERROR HANDLING:
      // If saving preferences fails, throw error and skip Redux/navigation.
      if (prefsError) throw prefsError;

      // =============================================================================
      // REDUX DISPATCH: Update global state after successful room creation
      // =============================================================================
      // SUCCESS: All backend saves completed successfully!
      // NOW we dispatch to Redux to update the in-memory state.
      //
      // WHY DISPATCH TO REDUX NOW:
      // All data is safely stored in the backend. Redux becomes the source of truth
      // for this session, allowing all components to access room/preference data
      // without re-fetching from storage.
      //
      // WHAT HAPPENS AFTER DISPATCH:
      // 1. Redux stores room data in state.rooms.currentRoom
      // 2. Redux stores session preferences in state.rooms.sessionPreferences
      // 3. ALL components reading these Redux values automatically re-render
      // 4. Room page will display room details without fetching again
      // 5. Other participants who join will see this room data
      //
      // DATA FLOW:
      // Backend storage (permanent) → Redux (session memory) → UI components (render)
      //
      // HOW REDUX UPDATES TRIGGER UI CHANGES:
      // Any component using useAppSelector(state => state.rooms.currentRoom) will
      // automatically re-render when we dispatch these actions. For example:
      // - Room page header will show the room code
      // - Room settings will display the occasion and mood
      // - Voting page will use session preferences for recommendations
      // =============================================================================
      // TODO: In future, room creation may trigger WebSocket broadcast to online users
      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));

      // =============================================================================
      // NAVIGATION: Navigate only after all saves and Redux updates complete
      // =============================================================================
      // WHY NAVIGATE LAST:
      // We navigate to the room page AFTER confirming that:
      // 1. Room is saved to database (permanent storage)
      // 2. Participant record is saved (creator is registered)
      // 3. Session preferences are saved (for recommendation algorithm)
      // 4. Redux is updated (in-memory cache)
      //
      // If we navigated BEFORE saving, the room wouldn't exist in the database,
      // causing errors when other users try to join or when generating recommendations.
      //
      // If we navigated BEFORE Redux update, the room page might try to read
      // room data from Redux but find nothing, causing errors or blank screens.
      //
      // CORRECT ORDER: Save all data → Update Redux → Navigate
      //
      // This ensures the next page has all the data it needs already in Redux.
      // =============================================================================
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      // If anything failed, show error message (local UI state)
      // Redux is NOT updated, database may have partial data, user should retry
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching user preferences on initial load
  if (loading && currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-pink-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-3xl p-8"
      >
        {/* ================================================================
            STEP PROGRESS INDICATOR
            Shows which step the user is on (1, 2, 3, or 4)
            This reads from local state (currentStep), not Redux
            ================================================================ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {index + 1 <= currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="step-sparkle"
                  >
                    <Sparkles size={16} />
                  </motion.div>
                )}
                <span>{index + 1}</span>
              </motion.div>
            ))}
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

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

        {/* ================================================================
            MULTI-STEP FORM CONTENT
            Each step shows different form fields
            All inputs update local state (formData), not Redux
            This is DRAFT data that only goes to Redux after successful save
            ================================================================ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* ============================================================
                STEP 1: OUTING DETAILS
                Collects occasion, mood, and time preferences
                All inputs update local formData state
                ============================================================ */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Outing Details
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Tell us about this magical gathering
                </p>

                <div className="space-y-6">
                  {/* Text input for occasion - updates local state */}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Occasion (e.g., Birthday, Date Night, Team Outing)"
                      value={formData.occasion}
                      onChange={(e) =>
                        setFormData({ ...formData, occasion: e.target.value })
                      }
                      className="magical-input"
                    />
                  </div>

                  {/* Multi-select mood options - updates local state array */}
                  <div>
                    <label className="block text-white/80 mb-3">Mood & Atmosphere</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {moodOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMoodToggle(option.value)}
                          className={`option-card ${
                            formData.mood.includes(option.value) ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Time inputs - updates local state */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="120"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                STEP 2: BUDGET & LOCATION
                Collects budget, outdoor/indoor preference, distance, and location
                All inputs update local formData state
                ============================================================ */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Budget & Location
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Set your preferences for this outing
                </p>

                <div className="space-y-6">
                  {/* Budget selection - updates local state */}
                  <div>
                    <label className="block text-white/80 mb-3">Budget</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {budgetOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, budget: option.value })}
                          className={`option-card ${
                            formData.budget === option.value ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Outdoor/Indoor selection - updates local state */}
                  <div>
                    <label className="block text-white/80 mb-3">Outdoor vs Indoor</label>
                    <div className="grid grid-cols-3 gap-4">
                      {outdoorIndoorOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setFormData({ ...formData, outdoorIndoor: option.value })
                          }
                          className={`option-card ${
                            formData.outdoorIndoor === option.value ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Distance input - updates local state */}
                  <div className="input-group">
                    <label className="block text-white/60 text-sm mb-2">
                      Maximum Distance (km)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      className="magical-input"
                    />
                  </div>

                  {/* Location input - updates local state, pre-filled from user preferences */}
                  <div className="input-group">
                    <label className="block text-white/60 text-sm mb-2">
                      Location (leave blank to use home address)
                    </label>
                    <textarea
                      placeholder={userPreferences?.home_address || 'Enter location'}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="magical-input min-h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                STEP 3: ACTIVITIES
                Collects activity preferences for this outing
                Multi-select + custom input, all updates local formData state
                ============================================================ */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Activities
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize activities for this outing
                </p>

                <div className="space-y-6">
                  {/* Multi-select activities - updates local state array */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activityOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleActivityToggle(option.value)}
                        className={`option-card ${
                          formData.activities.includes(option.value) ? 'selected' : ''
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.emoji}</span>
                        <span className="font-semibold text-sm">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom activity input - updates local state */}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Add custom activity"
                      value={formData.customActivity}
                      onChange={(e) =>
                        setFormData({ ...formData, customActivity: e.target.value })
                      }
                      className="magical-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                STEP 4: FOOD PREFERENCES
                Collects food preferences for this outing
                Multi-select + restrictions input, all updates local formData state
                ============================================================ */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Food Preferences
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize food preferences for this outing
                </p>

                <div className="space-y-6">
                  {/* Multi-select food categories - updates local state array */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {foodOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFoodToggle(option.value)}
                        className={`option-card ${
                          formData.foodCategories.includes(option.value) ? 'selected' : ''
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.emoji}</span>
                        <span className="font-semibold text-sm">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Dietary restrictions input - updates local state */}
                  <div className="input-group">
                    <textarea
                      placeholder="Dietary restrictions for this outing"
                      value={formData.foodRestrictions}
                      onChange={(e) =>
                        setFormData({ ...formData, foodRestrictions: e.target.value })
                      }
                      className="magical-input min-h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ================================================================
            NAVIGATION BUTTONS
            Previous/Next buttons for step navigation
            Create Room button on final step triggers save and Redux update
            All navigation uses local state (currentStep)
            ================================================================ */}
        <div className="flex justify-between items-center mt-8">
          {/* Previous button - updates local currentStep state */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            className="magical-button-secondary disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          {/* Step counter - displays local state */}
          <span className="text-white/60">
            {currentStep}/{totalSteps}
          </span>

          {/* ============================================================
              NEXT/CREATE BUTTON
              - On steps 1-3: Moves to next step (local state update)
              - On step 4: Triggers handleSubmit which:
                1. Saves room to database
                2. Adds creator as participant
                3. Saves session preferences
                4. Updates Redux with room and preferences
                5. Navigates to room page

              WHY DISABLED DURING LOADING:
              Prevents double-submission while save is in progress

              WHY VALIDATION (isStepComplete):
              Ensures user fills required fields before proceeding
              ============================================================ */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!isStepComplete() || loading}
            className="magical-button disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : currentStep === totalSteps ? (
              'Create Room'
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
