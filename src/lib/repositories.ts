// ========================================
// REPOSITORY ABSTRACTION LAYER (OPTIONAL)
// ========================================
// This layer provides a clean abstraction over data storage
// TODO: Replace implementations with real Supabase database calls
// Benefits:
// 1. Single point of change when switching from temp storage to real DB
// 2. Easier to mock for testing
// 3. Type-safe database operations
// ========================================

import {
  tempAuth,
  tempPreferences,
  tempRooms,
  tempParticipants,
  tempSessionPreferences,
} from './tempStorage';

// ========================================
// AUTH REPOSITORY
// ========================================
export const authRepository = {
  // TODO: Replace with Supabase: supabase.auth.signUp()
  signUp: async (email: string, password: string) => {
    return tempAuth.signUp(email, password);
  },

  // TODO: Replace with Supabase: supabase.auth.signInWithPassword()
  signIn: async (email: string, password: string) => {
    return tempAuth.signIn(email, password);
  },

  // TODO: Replace with Supabase: supabase.auth.signOut()
  signOut: async () => {
    return tempAuth.signOut();
  },

  // TODO: Replace with Supabase: supabase.auth.getSession()
  getSession: async () => {
    return tempAuth.getSession();
  },

  // TODO: Replace with Supabase: supabase.auth.onAuthStateChange()
  onAuthStateChange: (callback: any) => {
    return tempAuth.onAuthStateChange(callback);
  },
};

// ========================================
// PREFERENCES REPOSITORY
// ========================================
export const preferencesRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('user_preferences').upsert(preferences, { onConflict: 'user_id' })
  save: async (userId: string, preferences: any) => {
    return tempPreferences.save(userId, preferences);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle()
  get: async (userId: string) => {
    return tempPreferences.get(userId);
  },
};

// ========================================
// ROOMS REPOSITORY
// ========================================
export const roomsRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('rooms').insert(roomData).select().single()
  create: async (roomData: any) => {
    return tempRooms.create(roomData);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('rooms').select('*').eq('room_code', code).maybeSingle()
  getByCode: async (code: string) => {
    return tempRooms.getByCode(code);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('rooms').update(updates).eq('id', roomId)
  update: async (roomId: string, updates: any) => {
    return tempRooms.update(roomId, updates);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('rooms').select('*').eq('id', roomId).maybeSingle()
  getById: async (roomId: string) => {
    // TODO: Implement when needed
    throw new Error('Not implemented');
  },
};

// ========================================
// PARTICIPANTS REPOSITORY
// ========================================
export const participantsRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('room_participants').insert({ room_id, user_id, is_online: true })
  add: async (roomId: string, userId: string) => {
    return tempParticipants.add(roomId, userId);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('room_participants').select('*').eq('room_id', roomId)
  get: async (roomId: string) => {
    return tempParticipants.get(roomId);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('room_participants')
  //   .update({ is_online, last_seen: new Date().toISOString() })
  //   .eq('room_id', roomId)
  //   .eq('user_id', userId)
  updateStatus: async (roomId: string, userId: string, isOnline: boolean) => {
    // TODO: Implement when needed
    throw new Error('Not implemented');
  },
};

// ========================================
// SESSION PREFERENCES REPOSITORY
// ========================================
export const sessionPreferencesRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('session_preferences').insert(preferences)
  save: async (roomId: string, userId: string, preferences: any) => {
    return tempSessionPreferences.save(roomId, userId, preferences);
  },

  // TODO: Replace with Supabase:
  // await supabase.from('session_preferences')
  //   .select('*')
  //   .eq('room_id', roomId)
  //   .eq('user_id', userId)
  //   .maybeSingle()
  get: async (roomId: string, userId: string) => {
    return tempSessionPreferences.get(roomId, userId);
  },
};

// ========================================
// RECOMMENDATIONS REPOSITORY
// ========================================
export const recommendationsRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('recommendations').select('*').eq('room_id', roomId)
  getByRoom: async (roomId: string) => {
    // TODO: Implement when backend is ready
    throw new Error('Not implemented - use mock data for now');
  },

  // TODO: Replace with Supabase:
  // await supabase.from('recommendations').insert(recommendation).select().single()
  create: async (recommendation: any) => {
    // TODO: Implement when backend is ready
    throw new Error('Not implemented');
  },
};

// ========================================
// VOTES REPOSITORY
// ========================================
export const votesRepository = {
  // TODO: Replace with Supabase:
  // await supabase.from('votes').insert(vote)
  cast: async (vote: any) => {
    // TODO: Implement when backend is ready
    throw new Error('Not implemented');
  },

  // TODO: Replace with Supabase:
  // await supabase.from('votes')
  //   .delete()
  //   .eq('recommendation_id', recommendationId)
  //   .eq('user_id', userId)
  remove: async (recommendationId: string, userId: string) => {
    // TODO: Implement when backend is ready
    throw new Error('Not implemented');
  },

  // TODO: Replace with Supabase:
  // await supabase.from('votes').select('*').eq('room_id', roomId)
  getByRoom: async (roomId: string) => {
    // TODO: Implement when backend is ready
    throw new Error('Not implemented');
  },
};
