import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Users,
  Play,
  Square,
  Eye,
  Sparkles,
  UserCircle,
  Crown,
  Heart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateRoomStatus, setParticipants } from '../store/roomsSlice';
import { socketEvents } from '../lib/socket';

const RoomPage = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // UI state - Keep in local state (not Redux)
  const [showParticipants, setShowParticipants] = useState(true);

  // Shared state - Get from Redux
  const currentRoom = useAppSelector((state) => state.rooms.currentRoom);
  const participants = useAppSelector((state) => state.rooms.participants);
  const { user } = useAppSelector((state) => state.auth);

  const isVoting = currentRoom?.is_active || false;
  const isHost = currentRoom?.creator_id === user?.id;

  // TODO: Load participants from backend/database
  // TODO: Setup WebSocket connection to listen for participant updates
  useEffect(() => {
    if (!roomId) return;

    // TODO: Replace with actual participants fetch from backend
    // Example: dispatch(fetchParticipants(roomId));

    // For now, set mock participants data
    const mockParticipants = [
      {
        id: 'participant_1',
        room_id: roomId,
        user_id: user?.id || 'user_1',
        is_online: true,
        joined_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        user_email: user?.email,
      },
      {
        id: 'participant_2',
        room_id: roomId,
        user_id: 'user_2',
        is_online: true,
        joined_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        user_email: 'stella@example.com',
      },
      {
        id: 'participant_3',
        room_id: roomId,
        user_id: 'user_3',
        is_online: true,
        joined_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        user_email: 'aurora@example.com',
      },
      {
        id: 'participant_4',
        room_id: roomId,
        user_id: 'user_4',
        is_online: false,
        joined_at: new Date().toISOString(),
        last_seen: new Date(Date.now() - 3600000).toISOString(),
        user_email: 'iris@example.com',
      },
    ];

    dispatch(setParticipants(mockParticipants));

    // TODO: Setup WebSocket listener for participant updates
    // socketService.connect(dispatch, roomId);
    // return () => socketService.disconnect(dispatch);
  }, [roomId, dispatch, user]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoom?.room_code || roomId || '');
  };

  const startVoting = () => {
    if (!roomId || !isHost) return;

    // Update Redux state
    dispatch(updateRoomStatus(true));

    // TODO: Send start voting event through WebSocket
    socketEvents.startVoting(roomId);

    // TODO: Update room status in backend/database
    // Example: await tempRooms.update(roomId, { is_active: true });

    navigate(`/room/${roomId}/voting`);
  };

  const endVoting = () => {
    if (!roomId || !isHost) return;

    // Update Redux state
    dispatch(updateRoomStatus(false));

    // TODO: Send end voting event through WebSocket
    socketEvents.endVoting(roomId);

    // TODO: Update room status in backend/database
    // Example: await tempRooms.update(roomId, { is_active: false });
  };

  return (
    <div className="min-h-screen p-4">
      {/* Magical Header */}
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
          {/* Main Content */}
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

          {/* Participants Panel */}
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