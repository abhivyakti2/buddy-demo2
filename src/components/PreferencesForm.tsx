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
  const { user } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //food pref? //atmosphere? //activities?

  const [formData, setFormData] = useState({
    activities: [] as string[],
    customActivity: '',
    foodCategories: [] as string[],
    foodRestrictions: '',
    transport: [] as string[],
    homeAddress: '',
  });

  const totalSteps = 3;

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

  const handleTransportToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      transport: prev.transport.includes(value)
        ? prev.transport.filter((t) => t !== value)
        : [...prev.transport, value],
    }));
  };

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

      // TODO: Replace this with real DB / Supabase / API call
      const { error: upsertError } = await preferencesRepository.save(user.id, preferences);

      if (upsertError) throw upsertError;

      dispatch(setUserPreferences(preferences));
      navigate('/room-selection');
    } catch (err: any) {
      setError(err.message || 'Failed to save preferences');
    } finally {
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
            <h2 className="text-3xl font-bold magical-text text-center mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-white/70 text-center mb-12">
              {steps[currentStep - 1].description}
            </p>

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
