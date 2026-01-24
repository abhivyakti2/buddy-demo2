import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
// TEMPORARY: Using temp storage instead of Supabase - TODO: Replace with real Supabase
import { tempRooms, tempParticipants, tempSessionPreferences, tempPreferences } from '../lib/tempStorage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentRoom, setSessionPreferences } from '../store/roomsSlice';
import { setUserPreferences } from '../store/preferencesSlice';

const CreateRoomForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        // TEMPORARY: Using tempPreferences instead of Supabase - TODO: Replace with Supabase
        const { data, error } = await tempPreferences.get(user.id);

        if (error) throw error;

        if (data) {
          dispatch(setUserPreferences(data));
          setFormData((prev) => ({
            ...prev,
            activities: (data.activities as string[]) || [],
            foodCategories: ((data.food_preferences as any)?.categories as string[]) || [],
            foodRestrictions: ((data.food_preferences as any)?.restrictions as string) || '',
            location: data.home_address || '',
          }));
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, dispatch]);

  const handleMoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mood: prev.mood.includes(value)
        ? prev.mood.filter((m) => m !== value)
        : [...prev.mood, value],
    }));
  };

  const handleActivityToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(value)
        ? prev.activities.filter((a) => a !== value)
        : [...prev.activities, value],
    }));
  };

  const handleFoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(value)
        ? prev.foodCategories.filter((f) => f !== value)
        : [...prev.foodCategories, value],
    }));
  };

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

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const roomCode = generateRoomCode();

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

      // TEMPORARY: Using tempRooms instead of Supabase - TODO: Replace with Supabase
      const { data: room, error: roomError } = await tempRooms.create(roomData);

      if (roomError) throw roomError;

      // TEMPORARY: Using tempParticipants instead of Supabase - TODO: Replace with Supabase
      const { error: participantError } = await tempParticipants.add(room.id, user.id);

      if (participantError) throw participantError;

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

      // TEMPORARY: Using tempSessionPreferences instead of Supabase - TODO: Replace with Supabase
      const { error: prefsError } = await tempSessionPreferences.save(room.id, user.id, sessionPrefs);

      if (prefsError) throw prefsError;

      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));

      navigate(`/room/${room.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Outing Details
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Tell us about this magical gathering
                </p>

                <div className="space-y-6">
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

            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Budget & Location
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Set your preferences for this outing
                </p>

                <div className="space-y-6">
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

            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Activities
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize activities for this outing
                </p>

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

            {currentStep === 4 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Food Preferences
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize food preferences for this outing
                </p>

                <div className="space-y-6">
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

        <div className="flex justify-between items-center mt-8">
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

          <span className="text-white/60">
            {currentStep}/{totalSteps}
          </span>

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
