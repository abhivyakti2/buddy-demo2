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