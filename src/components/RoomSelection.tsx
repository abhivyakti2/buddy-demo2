import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Sparkles, Heart, Star } from 'lucide-react';

const RoomSelection = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            ✨ Choose Your Adventure ✨
          </h1>
          <p className="text-white/80">
            Create magic or join the sparkles! 🌟
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom}
            className="magical-room-button w-full p-6 group"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="sparkle-icon"
            >
              <Plus size={32} />
            </motion.div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Create New Room</h3>
              <p className="text-sm text-white/70">
                Start a magical voting experience 🎊
              </p>
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
                <p className="text-sm text-white/70">
                  Enter a room ID to join the magic ✨
                </p>
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
                    placeholder="🔮 Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="magical-input text-center text-lg font-mono"
                    maxLength={8}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim()}
                  className="magical-button w-full py-3 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Join the Magic
                    <Heart size={20} />
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
          <p className="text-sm">Where friends become magic makers 💫</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoomSelection;