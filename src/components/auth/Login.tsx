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
      // =============================================================================
      // TEMPORARY STORAGE: Authenticating user with backend
      // =============================================================================
      // WHAT THIS DOES:
      // Verifies the user's email and password with the backend authentication
      // service and creates a login session if credentials are correct.
      //
      // WHY AUTHENTICATE BEFORE REDUX:
      // We must verify credentials with the backend FIRST before trusting them.
      // Only after successful authentication do we store user data in Redux.
      //
      // DATA FLOW:
      // 1. User submits login form → Verify with temporary storage (or real auth service)
      // 2. Backend returns user data and session token
      // 3. If successful → Dispatch to Redux (user is now authenticated)
      // 4. Navigate to room selection
      // =============================================================================
      // TODO: Replace this with real DB / Supabase / API call
      const { data, error: signInError } = await authRepository.signIn(email, password);

      // ERROR HANDLING:
      // If authentication fails (wrong password, user doesn't exist, etc.),
      // throw error and skip Redux update. User stays on login page.
      if (signInError) throw signInError;

      if (data.user) {
        // SUCCESS: User authenticated successfully!
        // NOW we dispatch to Redux to store the authenticated user.
        //
        // WHY DISPATCH TO REDUX NOW:
        // Authentication succeeded, so we trust this user data. Redux becomes the
        // source of truth for the current user session throughout the app.
        //
        // DATA FLOW:
        // Backend auth (verify credentials) → Redux (store user session) → UI (show authenticated state)
        dispatch(setUser(data.user as any));
        navigate('/room-selection');
      }
    } catch (err: any) {
      // ERROR HANDLING:
      // If login fails, show error message but don't dispatch to Redux.
      // User remains unauthenticated and stays on login page.
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
