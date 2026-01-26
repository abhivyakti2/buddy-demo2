// ============================================================================
// PREFERENCES FORM - USER ONBOARDING & PREFERENCE SETUP
// ============================================================================
//
// WHAT THIS PAGE DOES IN THE APP FLOW:
// This is the second page users see after signing up. It collects their general
// preferences (activities, food, transport) that will be used as defaults when
// creating rooms. Think of it as a "set up your profile" step that happens once
// after registration, but preferences can be customized per room later.
//
// APP FLOW:
// 1. User signs up → Login page
// 2. User logs in → THIS PAGE (one-time setup)
// 3. User completes preferences → Room Selection page
// 4. User can create/join rooms using these preferences as defaults
//
// REDUX STATE THIS PAGE READS:
// - state.auth.user: The logged-in user object (needed to save preferences with user_id)
//
// WHY WE READ FROM REDUX:
// The user object needs to be accessed from multiple pages (header, profile, etc.),
// so it lives in Redux. We read it here to associate preferences with the correct user.
//
// LOCAL UI STATE (useState) - NOT IN REDUX:
// This page uses useState for several pieces of UI state that do NOT belong in Redux:
//
// 1. formData (activities, foodCategories, transport, etc.)
//    WHY LOCAL: These are temporary form inputs being edited. They're not "saved"
//    until the user clicks Complete. Redux should only store finalized, saved data.
//    Think: "Draft email" (local) vs "Sent email" (saved in Redux/database).
//
// 2. currentStep (1, 2, or 3)
//    WHY LOCAL: Step navigation is pure UI state. No other component needs to know
//    which step the user is on. This is like "which tab is open" - temporary UI state.
//
// 3. loading (true/false during save)
//    WHY LOCAL: Loading spinners are temporary UI feedback. They don't need to be
//    shared across components or persisted. When save completes, loading resets anyway.
//
// 4. error (error message string)
//    WHY LOCAL: Error messages are temporary UI feedback shown only on this page.
//    Once the user navigates away or retries, the error is no longer relevant.
//
// REDUX VS LOCAL STATE RULE OF THUMB:
// - LOCAL STATE (useState): Temporary, UI-only, single-component, form drafts
// - REDUX STATE: Permanent, shared across components, saved to database, global
//
// HOW THIS PAGE AFFECTS OTHER PAGES:
// When this page saves preferences and dispatches setUserPreferences(preferences),
// Redux stores them globally. This means:
// - CreateRoomForm can pre-fill form fields with these preferences
// - Room settings pages can show default preferences
// - Recommendation algorithms can use these preferences
// All without re-fetching from the database every time.
//
// TODO: In future, preference changes may trigger real-time recommendation updates
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUserPreferences } from '../store/preferencesSlice';
import { preferencesRepository } from '../lib/repositories';

const PreferencesForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ========================================================================
  // REDUX STATE READ: Getting the logged-in user
  // ========================================================================
  // We read the user from Redux because it's set globally when the user logs in.
  // We need the user.id to save preferences associated with this specific user.
  // ========================================================================
  const { user } = useAppSelector((state) => state.auth);

  // ========================================================================
  // LOCAL UI STATE: Step navigation in the multi-step form
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // The current step (1, 2, or 3) is purely for UI navigation. No other
  // component in the app needs to know which step this form is on. It's
  // temporary state that resets every time the user visits this page.
  //
  // If we put this in Redux, we'd be polluting global state with information
  // that's only relevant to this single component's internal UI logic.
  //
  // ANALOGY: It's like "which page of a book you're reading" - temporary position
  // that only matters while you're reading, not stored in a library database.
  // ========================================================================
  const [currentStep, setCurrentStep] = useState(1);

  // ========================================================================
  // LOCAL UI STATE: Loading and error feedback
  // ========================================================================
  // WHY useState INSTEAD OF REDUX:
  // Loading spinners and error messages are temporary UI feedback shown only
  // on this page. They're not data that needs to be shared with other components.
  //
  // When the save operation completes (success or failure), these values are
  // used to show immediate feedback, then they reset or the user navigates away.
  //
  // ANALOGY: Like a "processing" indicator on a credit card machine - temporary
  // status feedback that doesn't need to be stored or shared globally.
  // ========================================================================
  const [loading, setLoading] = useState(false);
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
  // ========================================================================
  const [formData, setFormData] = useState({
    activities: [] as string[],
    customActivity: '',
    foodCategories: [] as string[],
    foodRestrictions: '',
    transport: [] as string[],
    homeAddress: '',
  });

  const totalSteps = 3;

  // Multi-step form configuration: titles and options for each step
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
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  ];

  const transportOptions = [
    { value: 'metro', label: 'Metro', emoji: '🚇' },
    { value: 'bus', label: 'Bus', emoji: '🚌' },
    { value: 'auto', label: 'Auto', emoji: '🛺' },
    { value: 'taxi', label: 'Taxi', emoji: '🚕' },
    { value: 'bike', label: 'Bike', emoji: '🚲' },
    { value: 'walk', label: 'Walk', emoji: '🚶' },
    { value: 'car', label: 'Car', emoji: '🚗' },
  ];

  const steps = [
    {
      title: 'Activities of Interest',
      description: 'What do you enjoy doing?',
    },
    {
      title: 'Food Preferences',
      description: 'What cuisines do you like?',
    },
    {
      title: 'Transport & Location',
      description: 'How do you prefer to travel?',
    },
  ];

  // ========================================================================
  // LOCAL STATE UPDATE: Toggle activity selection
  // ========================================================================
  // This updates the local formData state (the draft). Notice we're NOT
  // dispatching to Redux here because these are unsaved selections.
  // ========================================================================
  const handleActivityToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(value)
        ? prev.activities.filter((a) => a !== value)
        : [...prev.activities, value],
    }));
  };

  // ========================================================================
  // LOCAL STATE UPDATE: Toggle food category selection
  // ========================================================================
  // Same pattern as activities - updating draft data, not Redux.
  // ========================================================================
  const handleFoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(value)
        ? prev.foodCategories.filter((f) => f !== value)
        : [...prev.foodCategories, value],
    }));
  };

  // ========================================================================
  // LOCAL STATE UPDATE: Toggle transport option selection
  // ========================================================================
  // Same pattern - local draft updates only.
  // ========================================================================
  const handleTransportToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      transport: prev.transport.includes(value)
        ? prev.transport.filter((t) => t !== value)
        : [...prev.transport, value],
    }));
  };

  // ========================================================================
  // VALIDATION: Check if current step is complete
  // ========================================================================
  // This validates the draft data (local state) before allowing user to proceed.
  // We're checking local state, not Redux, because we're validating unsaved data.
  // ========================================================================
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.activities.length > 0;
      case 2:
        return formData.foodCategories.length > 0;
      case 3:
        return formData.transport.length > 0;
      default:
        return false;
    }
  };

  // ========================================================================
  // NAVIGATION: Move to next step or submit form
  // ========================================================================
  // This only updates local UI state (currentStep) - no Redux involved.
  // Navigation between steps is internal UI logic.
  // ========================================================================
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
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
  // FORM SUBMISSION: Save preferences to database and update Redux
  // ========================================================================
  const handleSubmit = async () => {
    if (!user) return;

    // Set loading state to show spinner (local UI feedback)
    setLoading(true);
    setError('');

    try {
      // Prepare the final preferences object from the draft form data
      const allActivities = formData.customActivity.trim()
        ? [...formData.activities, formData.customActivity.trim()]
        : formData.activities;

      const preferences = {
        user_id: user.id,
        activities: allActivities,
        food_preferences: {
          categories: formData.foodCategories,
          restrictions: formData.foodRestrictions,
        },
        transport_preferences: formData.transport,
        home_address: formData.homeAddress,
      };

      // =============================================================================
      // STEP 1: SAVE TO DATABASE FIRST
      // =============================================================================
      // CRITICAL: We save to the database BEFORE updating Redux. Here's why:
      //
      // WRONG APPROACH (Don't do this):
      // 1. Dispatch to Redux immediately
      // 2. Try to save to database
      // 3. If save fails, Redux already has the data (INCONSISTENT STATE!)
      //
      // CORRECT APPROACH (What we do here):
      // 1. Save to database first
      // 2. If save succeeds → Update Redux → Navigate away
      // 3. If save fails → Show error, Redux unchanged, user can retry
      //
      // This ensures Redux always reflects what's actually saved in the database.
      // Redux acts as a "cache" of the database, not a separate source of truth.
      //
      // TODO: In future, this will be replaced with real Supabase database call
      // =============================================================================
      const { error: upsertError } = await preferencesRepository.save(user.id, preferences);

      // If database save failed, stop here and show error
      if (upsertError) throw upsertError;

      // =============================================================================
      // STEP 2: UPDATE REDUX AFTER SUCCESSFUL SAVE
      // =============================================================================
      // WHY WE DISPATCH TO REDUX NOW:
      // The preferences are now safely stored in the database. We update Redux
      // so that other pages in the app can access these preferences without
      // making additional database queries.
      //
      // HOW THIS AFFECTS OTHER PAGES:
      // After this dispatch, the following pages will immediately have access
      // to these preferences via useAppSelector:
      //
      // - CreateRoomForm: Will pre-fill form fields with these preferences
      //   Example: If user selected "Italian" food here, CreateRoomForm will
      //   show "Italian" as pre-selected when creating a room.
      //
      // - Room recommendation algorithm: Can use these preferences to generate
      //   personalized suggestions without fetching from database every time.
      //
      // REDUX BENEFIT: One database fetch → Multiple pages can read the data
      // Without Redux: Every page would need to fetch from database separately
      //
      // TODO: In future, preference updates may trigger real-time
      // recommendation recalculations across active rooms
      // =============================================================================
      dispatch(setUserPreferences(preferences));

      // =============================================================================
      // STEP 3: NAVIGATE ONLY AFTER SAVE AND REDUX UPDATE
      // =============================================================================
      // WHY NAVIGATE LAST:
      // We only navigate away from this page after confirming that:
      // 1. Data is saved to database (permanent storage)
      // 2. Redux is updated (in-memory cache)
      //
      // If we navigated BEFORE saving, the user would move to the next page but
      // their preferences wouldn't be saved - terrible user experience!
      //
      // If we navigated BEFORE Redux update, the next page might try to read
      // preferences from Redux but find nothing, causing errors.
      //
      // CORRECT ORDER: Save → Update Redux → Navigate
      //
      // NAVIGATION FLOW:
      // User completes preferences → THIS PAGE → Room Selection page
      // (where they can create or join rooms using these saved preferences)
      // =============================================================================
      navigate('/room-selection');

    } catch (err: any) {
      // If anything failed, show error message (local UI state)
      // Redux is NOT updated, database is unchanged, user can fix and retry
      setError(err.message || 'Failed to save preferences');
    } finally {
      // Always hide loading spinner when done (success or failure)
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-8"
      >
        {/* ================================================================
            STEP PROGRESS INDICATOR
            Shows which step the user is on (1, 2, or 3)
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
            ================================================================ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold magical-text text-center mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-white/70 text-center mb-12">
              {steps[currentStep - 1].description}
            </p>

            {/* ============================================================
                STEP 1: ACTIVITIES
                User selects preferred activity types
                Updates local formData state with each selection
                ============================================================ */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
            )}

            {/* ============================================================
                STEP 2: FOOD PREFERENCES
                User selects preferred food categories and restrictions
                Updates local formData state
                ============================================================ */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                    placeholder="Dietary restrictions or preferences (e.g., gluten-free, no nuts)"
                    value={formData.foodRestrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, foodRestrictions: e.target.value })
                    }
                    className="magical-input min-h-24 resize-none"
                  />
                </div>
              </div>
            )}

            {/* ============================================================
                STEP 3: TRANSPORT & LOCATION
                User selects transport preferences and enters home address
                Updates local formData state
                ============================================================ */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {transportOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTransportToggle(option.value)}
                      className={`option-card ${
                        formData.transport.includes(option.value) ? 'selected' : ''
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.emoji}</span>
                      <span className="font-semibold text-sm">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Home address input - updates local state */}
                <div className="input-group">
                  <textarea
                    placeholder="Home address (helps us recommend nearby places)"
                    value={formData.homeAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, homeAddress: e.target.value })
                    }
                    className="magical-input min-h-24 resize-none"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ================================================================
            NAVIGATION BUTTONS
            Previous/Next buttons for step navigation
            Complete button on final step triggers save and Redux update
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
              NEXT/COMPLETE BUTTON
              - On steps 1-2: Moves to next step (local state update)
              - On step 3: Triggers handleSubmit which:
                1. Saves to database
                2. Updates Redux
                3. Navigates to next page

              WHY DISABLED DURING LOADING:
              Prevents double-submission while save is in progress
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
                Saving...
              </>
            ) : currentStep === totalSteps ? (
              'Complete'
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

export default PreferencesForm;
