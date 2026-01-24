import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/preferences`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
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
