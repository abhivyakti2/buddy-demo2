import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ThumbsUp,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addVote, removeVote, setRecommendations } from '../store/recommendationsSlice';
import { socketEvents } from '../lib/socket';

const VotingPage = () => {
  const { id: roomId } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // UI state - Keep in local state (not Redux)
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Shared state - Get from Redux
  const recommendations = useAppSelector((state) => state.recommendations.recommendations);
  const votes = useAppSelector((state) => state.recommendations.votes);

  // TODO: Load recommendations from backend/database when room starts voting
  // For now, set mock data on component mount
  useEffect(() => {
    // TODO: Replace with actual data fetch from backend
    // Example: dispatch(fetchRecommendations(roomId));
    const mockRecommendations = [
    {
      id: 1,
      name: "Sparkle Bistro ✨",
      images: [
        "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
        "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
        "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg"
      ],
      parameters: {
        price: { value: "$$", score: 8, icon: DollarSign },
        location: { value: "Downtown", score: 9, icon: MapPin },
        ambience: { value: "Cozy & Magical", score: 10, icon: Sparkles },
        reviews: { value: "4.8/5 ⭐", score: 9, icon: Star },
        capacity: { value: "20-40 people", score: 8, icon: Users },
        timing: { value: "Open until 11 PM", score: 7, icon: Clock }
      }
    },
    {
      id: 2,
      name: "Moonlight Lounge 🌙",
      images: [
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
        "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
        "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"
      ],
      parameters: {
        price: { value: "$$$", score: 6, icon: DollarSign },
        location: { value: "Uptown", score: 7, icon: MapPin },
        ambience: { value: "Elegant & Dreamy", score: 9, icon: Sparkles },
        reviews: { value: "4.6/5 ⭐", score: 8, icon: Star },
        capacity: { value: "30-60 people", score: 9, icon: Users },
        timing: { value: "Open until midnight", score: 9, icon: Clock }
      }
    }
  ];

    // TODO: Replace with actual data loading from backend
    if (mockRecommendations.length > 0) {
      dispatch(setRecommendations(mockRecommendations as any));
    }
  }, [dispatch]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/70">Loading recommendations...</p>
      </div>
    );
  }

  const currentRec = recommendations[currentRecommendationIndex];

  // Check if current user has voted for this recommendation
  const userVote = votes[currentRec.id]?.find((vote: any) => vote.user_id === user?.id);
  const hasVoted = !!userVote;

  // Count total votes for this recommendation
  const totalVotes = votes[currentRec.id]?.length || 0;

  // Voting handler - dispatches Redux action
  const handleVote = (recommendationId: string) => {
    if (!user || !roomId) return;

    if (hasVoted) {
      // Remove vote
      dispatch(removeVote({ recommendationId, userId: user.id }));
    } else {
      // Add vote
      const vote = {
        id: `vote_${Date.now()}`,
        room_id: roomId,
        recommendation_id: recommendationId,
        user_id: user.id,
        vote_type: 'yes',
        created_at: new Date().toISOString(),
      };
      dispatch(addVote(vote as any));

      // TODO: Send vote through WebSocket for real-time updates
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
      {/* Header */}
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
            {/* Image Carousel */}
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

              {/* Image Navigation */}
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

              {/* Image Indicators */}
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

              {/* Magical overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 text-2xl"
              >
                ✨
              </motion.div>
            </div>

            {/* Content */}
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

              {/* Parameters Grid */}
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

              {/* Bottom Actions */}
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