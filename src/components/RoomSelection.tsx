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
      // TODO: Replace temp repository with Supabase rooms fetch
      const { data: room, error: roomError } = await roomsRepository.getByCode(roomCode.trim().toUpperCase());

      if (roomError) throw roomError;

      if (!room) {
        setError('Room not found. Please check the room code.');
        setLoading(false);
        return;
      }

      // TODO: Replace temp repository with Supabase participants insert
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

      // TODO: Replace temp repository with Supabase session_preferences insert
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
    // TODO: Replace temp repository with Supabase auth.signOut()
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
