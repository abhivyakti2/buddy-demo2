import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
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
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
            ✨ VoteSpace ✨
          </h1>
          <p className="text-lg text-white/80">
            Where dreams meet decisions 💫
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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
          <p className="text-sm">New to magic? ✨ Just dive in! ✨</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;