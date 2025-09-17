import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface FormData {
  interests: string[];
  budget: string;
  location: string;
  atmosphere: string;
  groupSize: string;
}

const PreferencesForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    interests: [],
    budget: '',
    location: '',
    atmosphere: '',
    groupSize: ''
  });

  const totalSteps = 5;

  const steps = [
    {
      title: "What sparks joy? ✨",
      field: 'interests',
      options: [
        { value: 'restaurants', label: '🍽️ Dining', emoji: '🍽️' },
        { value: 'entertainment', label: '🎬 Entertainment', emoji: '🎬' },
        { value: 'outdoor', label: '🌳 Outdoor', emoji: '🌳' },
        { value: 'culture', label: '🎨 Culture', emoji: '🎨' },
        { value: 'shopping', label: '🛍️ Shopping', emoji: '🛍️' },
        { value: 'nightlife', label: '🌙 Nightlife', emoji: '🌙' }
      ],
      multiple: true
    },
    {
      title: "Budget vibes? 💰",
      field: 'budget',
      options: [
        { value: 'budget', label: '💫 Budget-friendly', emoji: '💫' },
        { value: 'moderate', label: '⭐ Moderate', emoji: '⭐' },
        { value: 'premium', label: '✨ Premium', emoji: '✨' },
        { value: 'luxury', label: '💎 Luxury', emoji: '💎' }
      ]
    },
    {
      title: "Perfect location? 📍",
      field: 'location',
      options: [
        { value: 'nearby', label: '🏠 Close to home', emoji: '🏠' },
        { value: 'downtown', label: '🏙️ Downtown', emoji: '🏙️' },
        { value: 'suburbs', label: '🌸 Suburbs', emoji: '🌸' },
        { value: 'anywhere', label: '🌍 Adventure awaits', emoji: '🌍' }
      ]
    },
    {
      title: "Dream atmosphere? 🌟",
      field: 'atmosphere',
      options: [
        { value: 'cozy', label: '🕯️ Cozy & intimate', emoji: '🕯️' },
        { value: 'lively', label: '🎉 Lively & fun', emoji: '🎉' },
        { value: 'elegant', label: '👑 Elegant & classy', emoji: '👑' },
        { value: 'casual', label: '😊 Casual & relaxed', emoji: '😊' }
      ]
    },
    {
      title: "Group size magic? 👥",
      field: 'groupSize',
      options: [
        { value: 'small', label: '💕 2-4 people', emoji: '💕' },
        { value: 'medium', label: '✨ 5-8 people', emoji: '✨' },
        { value: 'large', label: '🎊 9+ people', emoji: '🎊' },
        { value: 'flexible', label: '🌈 Flexible', emoji: '🌈' }
      ]
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleOptionSelect = (value: string) => {
    const field = currentStepData.field as keyof FormData;
    
    if (currentStepData.multiple) {
      const currentValues = formData[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setFormData({ ...formData, [field]: newValues });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const isStepComplete = () => {
    const field = currentStepData.field as keyof FormData;
    const value = formData[field];
    return currentStepData.multiple ? (value as string[]).length > 0 : !!value;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/room-selection');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-8"
      >
        {/* Progress Indicator */}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold magical-text text-center mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-white/70 text-center mb-8">
              This helps us create magical experiences just for you 💫
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentStepData.options.map((option) => {
                const field = currentStepData.field as keyof FormData;
                const isSelected = currentStepData.multiple
                  ? (formData[field] as string[]).includes(option.value)
                  : formData[field] === option.value;

                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="text-2xl mb-2 block">{option.emoji}</span>
                    <span className="font-semibold">{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="magical-button-secondary disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          <span className="text-white/60">
            {currentStep} of {totalSteps}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="magical-button disabled:opacity-50"
          >
            {currentStep === totalSteps ? 'Complete ✨' : 'Next'}
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PreferencesForm;