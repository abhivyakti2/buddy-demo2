# UI Components

## `src/components/HomePage.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      navigate('/preferences');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] , rotate: 0}}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold magical-text mb-2">
            ✨ Buddies day out ✨
          </h1>
          <p className="text-base text-white/80">
            End the ‘idk where to go’ texts forever✨
          </p>
        </motion.div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div className="space-y-4">
            <div className="input-group">
              <input
                type="text"
                placeholder="👤 Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="magical-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="✉️ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="magical-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="🔒 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magical-input"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="magical-button w-full py-3 font-semibold text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <Heart size={20} />
              Enter the Magic
              <Star size={20} />
            </span>
          </motion.button>
        </form>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-white/60"
        >
          <p className="text-sm">Can’t decide where to go? Let your friends vote it out✨</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
```

## `src/components/auth/Login.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setError as setAuthError } from '../../store/authSlice';
import { authRepository } from '../../lib/repositories';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const { data, error: signInError } = await authRepository.signIn(email, password);

      if (signInError) throw signInError;

      if (data.user) {

        dispatch(setUser(data.user as any));
        navigate('/room-selection');
      }
    } catch (err: any) {

      setError(err.message || 'Failed to login');
      dispatch(setAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold magical-text mb-2">
            VoteSpace
          </h1>
          <p className="text-lg text-white/80">
            Where dreams meet decisions
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="magical-input"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magical-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            disabled={loading}
            className="magical-button w-full py-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Enter the Magic
                  <Star size={20} />
                </>
              )}
            </span>
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white/60"
        >
          <p className="text-sm">
            New to magic?{' '}
            <Link to="/signup" className="text-pink-300 hover:text-pink-200 font-semibold">
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
```

## `src/components/auth/Signup.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/authSlice';
import { authRepository } from '../../lib/repositories';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {

      const { data, error: signUpError } = await authRepository.signUp(email, password);

      if (signUpError) throw signUpError;

      if (data.user) {

        dispatch(setUser(data.user as any));
        setSuccess(true);
        setTimeout(() => {
          navigate('/preferences');
        }, 2000);
      }
    } catch (err: any) {

      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-4 -right-4 text-pink-300"
        >
          <Sparkles size={32} />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold magical-text mb-2">
            Join VoteSpace
          </h1>
          <p className="text-lg text-white/80">
            Start your magical journey
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-green-400 mb-4 flex justify-center"
              >
                <CheckCircle size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold magical-text mb-2">
                Account Created!
              </h2>
              <p className="text-white/80">
                Redirecting to preferences...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className="magical-button w-full py-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Create Magic Account
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          )}
        </AnimatePresence>

        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/60"
          >
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-pink-300 hover:text-pink-200 font-semibold">
                Login here
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
```

## `src/components/auth/AuthProvider.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setSession, setLoading } from '../../store/authSlice';
import { motion } from 'framer-motion';
import { authRepository } from '../../lib/repositories';

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {

    authRepository.getSession().then(({ data: { session } }) => {

      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
      setInitializing(false);
    });

    const {
      data: { subscription },
    } = authRepository.onAuthStateChange((_event: any, session: any) => {

      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="min-h-screen magical-bg flex items-center justify-center">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
```

## `src/components/auth/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
```

## `src/components/PreferencesForm.tsx`

```tsx
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
```

## `src/components/RoomSelection.tsx`

```tsx
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

  const { user } = useAppSelector((state) => state.auth);

  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);

  const [roomCode, setRoomCode] = useState('');

  const [showJoinForm, setShowJoinForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !user) return;

    setLoading(true);
    setError('');

    try {

      const { data: room, error: roomError } = await roomsRepository.getByCode(roomCode.trim().toUpperCase());

      if (roomError) throw roomError;

      if (!room) {
        setError('Room not found. Please check the room code.');
        setLoading(false);
        return;
      }

      const { error: participantError } = await participantsRepository.add(room.id, user.id);

      if (participantError) throw participantError;

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

      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);

      if (prefsError) throw prefsError;

      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));

      navigate(`/room/${room.id}`);
    } catch (err: any) {

      setError(err.message || 'Failed to join room');
    } finally {

      setLoading(false);
    }
  };

  const handleLogout = async () => {

    await authRepository.signOut();

    dispatch(logout());

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

            
            {showJoinForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                
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
```

## `src/components/CreateRoomForm.tsx`

```tsx
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

      if (userPreferences) {

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

        const { data, error } = await preferencesRepository.get(user.id);

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
  }, [user, dispatch, userPreferences]);

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

      const { data: room, error: roomError } = await roomsRepository.create(roomData);

      if (roomError) throw roomError;

      const { error: participantError } = await participantsRepository.add(room.id, user.id);

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

      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);

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
```

## `src/components/RoomPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Users,
  Play,
  Square,
  Eye,
  Crown,
  Heart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateRoomStatus, setParticipants } from '../store/roomsSlice';
import { socketEvents } from '../lib/socket';
import { participantsRepository, roomsRepository } from '../lib/repositories';

const RoomPage = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showParticipants, setShowParticipants] = useState(true);

  const currentRoom = useAppSelector((state) => state.rooms.currentRoom);
  const participants = useAppSelector((state) => state.rooms.participants);
  const { user } = useAppSelector((state) => state.auth);

  const isVoting = currentRoom?.is_active || false;
  const isHost = currentRoom?.creator_id === user?.id;

  useEffect(() => {
    if (!roomId) return;

    const loadParticipants = async () => {
      try {

        const { data } = await participantsRepository.get(roomId);

        if (data && data.length > 0) {

          const enrichedParticipants = data.map((p: any, index: number) => ({
            ...p,
            user_email: p.user_id === user?.id
              ? user.email
              : ['stella@example.com', 'aurora@example.com', 'iris@example.com'][index % 3]
          }));

          dispatch(setParticipants(enrichedParticipants));
        }
      } catch (error) {

        console.error('Error loading participants:', error);
      }
    };

    loadParticipants();

  }, [roomId, dispatch, user]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoom?.room_code || roomId || '');
  };

  const startVoting = async () => {
    if (!roomId || !isHost) return;

    dispatch(updateRoomStatus(true));

    await roomsRepository.update(roomId, { is_active: true });

    socketEvents.startVoting(roomId);

    navigate(`/room/${roomId}/voting`);
  };

  const endVoting = async () => {
    if (!roomId || !isHost) return;

    dispatch(updateRoomStatus(false));

    await roomsRepository.update(roomId, { is_active: false });

    socketEvents.endVoting(roomId);
  };

  return (
    <div className="min-h-screen p-4">
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="magical-header mb-8 px-4"
      >
        <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              ✨
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold magical-text">
                Magic Room
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-white/80">ID: {roomId}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyRoomId}
                  className="magical-icon-button"
                >
                  <Copy size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowParticipants(!showParticipants)}
              className="magical-button-secondary flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
            >
              <Users size={20} />
              <span className="hidden sm:inline">Participants</span> ({participants.length})
            </motion.button>

            {!isVoting ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoting}
                className="magical-button flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
              >
                <Play size={20} />
                <span className="hidden sm:inline">Start</span> Vote
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endVoting}
                className="magical-button-danger flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
              >
                <Square size={20} />
                <span className="hidden sm:inline">End</span> Vote
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="magical-button-secondary flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
            >
              <Eye size={20} />
              Results
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold magical-text mb-4">
                  Welcome to the Magic Circle! 🔮
                </h2>
                <p className="text-xl text-white/80">
                  {isVoting 
                    ? "Voting is now active! ✨" 
                    : "Waiting for the magic to begin..."
                  }
                </p>
              </motion.div>

              {!isVoting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-white/70">
                    Share the room ID with your friends to join the magic! 💫
                  </p>
                  <div className="flex items-center justify-center gap-4 text-2xl">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ⭐
                    </motion.span>
                    <span className="font-mono text-3xl magical-text">{roomId}</span>
                    <motion.span
                      animate={{ rotate: [360, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="voting-active-indicator"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🗳️
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/room/${roomId}/voting`)}
                    className="magical-button-large"
                  >
                    Go to Voting ✨
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          
          <AnimatePresence>
            {showParticipants && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-pink-300" size={24} />
                  <h3 className="text-xl font-bold magical-text">
                    Magic Makers
                  </h3>
                </div>

                <div className="space-y-3">
                  {participants.map((participant, index) => {
                    const isCreator = participant.user_id === currentRoom?.creator_id;
                    const displayName = participant.user_email?.split('@')[0] || `User ${index + 1}`;
                    const avatarEmojis = ['🌙', '⭐', '🌺', '🦋', '🌸', '💫', '✨', '🌟'];
                    const avatar = avatarEmojis[index % avatarEmojis.length];

                    return (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`participant-card ${participant.is_online ? 'online' : 'offline'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="participant-avatar">
                            <span className="text-2xl">{avatar}</span>
                            {participant.is_online && (
                              <div className="online-indicator"></div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {displayName}
                              </span>
                              {isCreator && (
                                <Crown className="text-yellow-400" size={16} />
                              )}
                            </div>
                            <span className="text-xs text-white/60">
                              {participant.is_online ? 'Online' : 'Away'}
                            </span>
                          </div>

                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5
                            }}
                          >
                            <Heart className="text-pink-300" size={16} />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-white/60">
                    ✨ More magic makers can join anytime! ✨
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
```

## `src/components/VotingPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ThumbsUp,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setRecommendations } from '../store/recommendationsSlice';
import { addVote, removeVote, setVotesForRecommendation } from '../store/votesSlice';
import { socketEvents } from '../lib/socket';
import { recommendationsRepository, votesRepository } from '../lib/repositories';

const VotingPage = () => {
  const { id: roomId } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const recommendations = useAppSelector((state) => state.recommendations.recommendations);
  const votes = useAppSelector((state) => state.votes.votesByRecommendation);

  useEffect(() => {
    if (!roomId) return;

    const loadData = async () => {
      try {

        const { data: recs } = await recommendationsRepository.getByRoom(roomId);
        if (recs && recs.length > 0) {

          dispatch(setRecommendations(recs as any));
        }

        const { data: votesData } = await votesRepository.getByRoom(roomId);
        if (votesData) {

          Object.entries(votesData).forEach(([recId, votesList]) => {
            dispatch(setVotesForRecommendation({ recommendationId: recId, votes: votesList as any }));
          });
        }
      } catch (error) {

        console.error('Error loading recommendations:', error);
      }
    };

    loadData();
  }, [dispatch, roomId]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/70">Loading recommendations...</p>
      </div>
    );
  }

  const currentRec = recommendations[currentRecommendationIndex];

  const userVote = votes[currentRec.id]?.find((vote: any) => vote.user_id === user?.id);
  const hasVoted = !!userVote;

  const totalVotes = votes[currentRec.id]?.length || 0;

  const handleVote = async (recommendationId: string) => {
    if (!user || !roomId) return;

    if (hasVoted) {

      dispatch(removeVote({ recommendationId, userId: user.id }));

      await votesRepository.remove(roomId, recommendationId, user.id);

      socketEvents.castVote(roomId, recommendationId, user.id, 'removed');
    } else {

      const vote = {
        id: `vote_${Date.now()}`,
        room_id: roomId,
        recommendation_id: recommendationId,
        user_id: user.id,
        vote_type: 'yes',
        created_at: new Date().toISOString(),
      };
      dispatch(addVote(vote as any));

      await votesRepository.cast(vote);

      socketEvents.castVote(roomId, recommendationId, user.id, 'yes');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % currentRec.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentRec.images.length - 1 : prev - 1
    );
  };

  const nextRecommendation = () => {
    setCurrentRecommendationIndex((prev) =>
      (prev + 1) % recommendations.length
    );
    setCurrentImageIndex(0);
  };

  const prevRecommendation = () => {
    setCurrentRecommendationIndex((prev) =>
      prev === 0 ? recommendations.length - 1 : prev - 1
    );
    setCurrentImageIndex(0);
  };

  return (
    <div className="min-h-screen p-4">
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="magical-header mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              🗳️
            </motion.div>
            <div>
              <h1 className="text-xl font-bold magical-text">Voting Magic</h1>
              <span className="text-white/80">Room: {roomId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/70">
              {currentRecommendationIndex + 1} of {recommendations.length}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevRecommendation}
                className="magical-icon-button"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextRecommendation}
                className="magical-icon-button"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRecommendationIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            
            <div className="relative h-64 md:h-80 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentRec.images[currentImageIndex]}
                  alt={currentRec.name}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 magical-icon-button"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 magical-icon-button"
              >
                <ChevronRight size={24} />
              </button>

              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {currentRec.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 text-2xl"
              >
                ✨
              </motion.div>
            </div>

            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold magical-text"
                >
                  {currentRec.name}
                </motion.h2>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote(currentRec.id)}
                  className={`vote-button ${hasVoted ? 'voted' : ''}`}
                >
                  <motion.div
                    animate={hasVoted ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 360, 0]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <Heart
                      size={32}
                      fill={hasVoted ? "currentColor" : "none"}
                    />
                  </motion.div>
                  <span className="ml-2 font-semibold">
                    {hasVoted ? 'Loved!' : 'Vote'}
                  </span>
                </motion.button>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentRec.parameters).map(([key, param], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="parameter-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="parameter-icon">
                        <param.icon size={20} />
                      </div>
                      <h4 className="font-semibold magical-text capitalize">
                        {key}
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-white font-medium">{param.value}</p>
                      
                      <div className="parameter-score">
                        <div className="score-bar">
                          <motion.div
                            className="score-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${param.score * 10}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          />
                        </div>
                        <span className="score-text">{param.score}/10</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={16} />
                    <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>Live</span>
                  </div>
                </div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white/60 text-sm"
                >
                  Swipe or use arrows to see more options ✨
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VotingPage;
```

