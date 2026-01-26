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
