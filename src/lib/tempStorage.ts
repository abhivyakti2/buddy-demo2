// ========================================
// TEMPORARY STORAGE - DO NOT USE IN PRODUCTION
// ========================================
// This file provides localStorage-based storage as a temporary solution
// TODO: Replace ALL functions in this file with real Supabase database calls
// TODO: Remove this file entirely once database integration is complete
// ========================================

export interface TempUser {
  id: string;
  email: string;
  created_at: string;
}

export interface TempSession {
  user: TempUser;
  access_token: string;
}

// TEMPORARY: User Authentication
export const tempAuth = {
  // TEMPORARY: Sign up - Replace with Supabase auth.signUp()
  signUp: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');
    const existing = users.find((u: any) => u.email === email);

    if (existing) {
      throw new Error('User already exists');
    }

    const newUser: TempUser = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem('temp_users', JSON.stringify(users));

    return { data: { user: newUser }, error: null };
  },

  // TEMPORARY: Sign in - Replace with Supabase auth.signInWithPassword()
  signIn: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const session: TempSession = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      access_token: `token_${Date.now()}`,
    };

    localStorage.setItem('temp_session', JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  // TEMPORARY: Get session - Replace with Supabase auth.getSession()
  getSession: async () => {
    const session = localStorage.getItem('temp_session');
    if (!session) {
      return { data: { session: null }, error: null };
    }

    return { data: { session: JSON.parse(session) }, error: null };
  },

  // TEMPORARY: Sign out - Replace with Supabase auth.signOut()
  signOut: async () => {
    localStorage.removeItem('temp_session');
    return { error: null };
  },

  // TEMPORARY: Auth state change listener - Replace with Supabase auth.onAuthStateChange()
  onAuthStateChange: (callback: (event: string, session: TempSession | null) => void) => {
    // Simulate immediate session check
    const session = localStorage.getItem('temp_session');
    callback('SIGNED_IN', session ? JSON.parse(session) : null);

    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};

// TEMPORARY: User Preferences Storage
export const tempPreferences = {
  // TEMPORARY: Save preferences - Replace with Supabase table insert/upsert
  save: async (userId: string, preferences: any) => {
    const key = `preferences_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
    return { error: null };
  },

  // TEMPORARY: Get preferences - Replace with Supabase table select
  get: async (userId: string) => {
    const key = `preferences_${userId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

// TEMPORARY: Rooms Storage
export const tempRooms = {
  // TEMPORARY: Create room - Replace with Supabase rooms table insert
  create: async (roomData: any) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');
    const newRoom = {
      id: `room_${Date.now()}`,
      ...roomData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rooms.push(newRoom);
    localStorage.setItem('temp_rooms', JSON.stringify(rooms));
    return { data: newRoom, error: null };
  },

  // TEMPORARY: Get room by code - Replace with Supabase rooms table select
  getByCode: async (code: string) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');
    const room = rooms.find((r: any) => r.room_code === code);
    return { data: room || null, error: null };
  },

  // TEMPORARY: Update room - Replace with Supabase rooms table update
  update: async (roomId: string, updates: any) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');
    const index = rooms.findIndex((r: any) => r.id === roomId);
    if (index >= 0) {
      rooms[index] = { ...rooms[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('temp_rooms', JSON.stringify(rooms));
    }
    return { error: null };
  },
};

// TEMPORARY: Room Participants Storage
export const tempParticipants = {
  // TEMPORARY: Add participant - Replace with Supabase room_participants table insert
  add: async (roomId: string, userId: string) => {
    const key = `participants_${roomId}`;
    const participants = JSON.parse(localStorage.getItem(key) || '[]');

    const existing = participants.find((p: any) => p.user_id === userId);
    if (existing) {
      return { error: null };
    }

    participants.push({
      id: `participant_${Date.now()}`,
      room_id: roomId,
      user_id: userId,
      is_online: true,
      joined_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(participants));
    return { error: null };
  },

  // TEMPORARY: Get participants - Replace with Supabase room_participants table select
  get: async (roomId: string) => {
    const key = `participants_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : [], error: null };
  },
};

// TEMPORARY: Session Preferences Storage
export const tempSessionPreferences = {
  // TEMPORARY: Save session preferences - Replace with Supabase session_preferences table insert
  save: async (roomId: string, userId: string, preferences: any) => {
    const key = `session_prefs_${roomId}_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
    return { error: null };
  },

  // TEMPORARY: Get session preferences - Replace with Supabase session_preferences table select
  get: async (roomId: string, userId: string) => {
    const key = `session_prefs_${roomId}_${userId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

// TEMPORARY: Recommendations Storage
export const tempRecommendations = {
  // TEMPORARY: Get recommendations for room - Replace with backend/AI service fetch
  getByRoom: async (roomId: string) => {
    // TODO: Replace with actual backend fetch or AI-generated recommendations
    // For now, return mock data
    const mockRecommendations = [
      {
        id: '1',
        room_id: roomId,
        name: "Sparkle Bistro",
        description: "A cozy magical dining experience",
        category: "restaurant",
        price_level: "$$",
        location: "Downtown",
        distance_km: 2.5,
        rating: 4.8,
        images: [
          "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
          "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
          "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg"
        ],
        parameters: {
          price: { value: "$$", score: 8, icon: "DollarSign" },
          location: { value: "Downtown", score: 9, icon: "MapPin" },
          ambience: { value: "Cozy & Magical", score: 10, icon: "Sparkles" },
          reviews: { value: "4.8/5", score: 9, icon: "Star" },
          capacity: { value: "20-40 people", score: 8, icon: "Users" },
          timing: { value: "Open until 11 PM", score: 7, icon: "Clock" }
        },
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        room_id: roomId,
        name: "Moonlight Lounge",
        description: "Elegant evening entertainment venue",
        category: "lounge",
        price_level: "$$$",
        location: "Uptown",
        distance_km: 5.0,
        rating: 4.6,
        images: [
          "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
          "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
          "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"
        ],
        parameters: {
          price: { value: "$$$", score: 6, icon: "DollarSign" },
          location: { value: "Uptown", score: 7, icon: "MapPin" },
          ambience: { value: "Elegant & Dreamy", score: 9, icon: "Sparkles" },
          reviews: { value: "4.6/5", score: 8, icon: "Star" },
          capacity: { value: "30-60 people", score: 9, icon: "Users" },
          timing: { value: "Open until midnight", score: 9, icon: "Clock" }
        },
        created_at: new Date().toISOString(),
      }
    ];

    return { data: mockRecommendations, error: null };
  },
};

// TEMPORARY: Votes Storage
export const tempVotes = {
  // TEMPORARY: Cast a vote - Replace with Supabase votes table insert
  cast: async (vote: any) => {
    const key = `votes_${vote.room_id}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');

    if (!votes[vote.recommendation_id]) {
      votes[vote.recommendation_id] = [];
    }

    // Check if user already voted
    const existingIndex = votes[vote.recommendation_id].findIndex(
      (v: any) => v.user_id === vote.user_id
    );

    if (existingIndex >= 0) {
      votes[vote.recommendation_id][existingIndex] = vote;
    } else {
      votes[vote.recommendation_id].push(vote);
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },

  // TEMPORARY: Remove a vote - Replace with Supabase votes table delete
  remove: async (roomId: string, recommendationId: string, userId: string) => {
    const key = `votes_${roomId}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');

    if (votes[recommendationId]) {
      votes[recommendationId] = votes[recommendationId].filter(
        (v: any) => v.user_id !== userId
      );
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },

  // TEMPORARY: Get all votes for a room - Replace with Supabase votes table select
  getByRoom: async (roomId: string) => {
    const key = `votes_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : {}, error: null };
  },
};
