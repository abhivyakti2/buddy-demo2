// ============================================================================
// TEMPORARY IN-MEMORY STORAGE - EDUCATIONAL GUIDE FOR BEGINNERS
// ============================================================================
//
// WHY THIS FILE EXISTS:
// This file provides a temporary, fake backend that stores data in the browser's
// localStorage instead of a real database. Think of it as a "pretend server"
// that lets the app work without needing actual backend infrastructure.
//
// WHAT IS A BACKEND?
// In a typical web application:
// - Frontend (React): What users see and interact with (this app)
// - Backend (Server + Database): Where data is permanently stored
// - API: How the frontend talks to the backend
//
// In a real setup:
// Frontend → Makes HTTP request → Backend Server → Queries Database → Returns data
//
// In this temporary setup:
// Frontend → Calls function → This file → Reads/writes localStorage → Returns data
//
// WHY USE TEMPORARY STORAGE?
// 1. Development Speed: Work on the UI without setting up a database first
// 2. Testing: Prototype features before committing to database design
// 3. Learning: Understand frontend logic before tackling backend complexity
// 4. Flexibility: Change data structures easily during early development
//
// WHAT WILL REPLACE THIS FILE:
// Eventually, this entire file will be replaced with:
// - Supabase Database: PostgreSQL database for permanent data storage
// - Supabase Auth: Real authentication with security, password hashing, etc.
// - Real API Calls: HTTP requests to a backend server
// - WebSockets: Real-time data synchronization across multiple users
//
// WHAT DATA DOES THIS FILE STORE?
// This file mimics a complete backend database with tables for:
// 1. Users & Authentication (login, signup, sessions)
// 2. User Preferences (food, activities, transport choices)
// 3. Rooms (voting rooms users create)
// 4. Participants (who's in each room)
// 5. Session Preferences (room-specific preferences)
// 6. Recommendations (places to vote on)
// 7. Votes (who voted for what)
//
// WHY NOT STORE THIS DATA IN REDUX?
// Redux is for STATE (current UI conditions), NOT for DATA PERSISTENCE:
// - Redux: "What is the user currently looking at?" (temporary, in-memory)
// - Backend: "What data needs to be saved permanently?" (persistent, on disk)
//
// Example:
// - Redux: "Current user is logged in as john@example.com" ← Temporary state
// - Backend: "User john@example.com exists with password xyz123" ← Permanent data
//
// If you refresh the page, Redux state resets, but backend data persists.
// That's why we need storage separate from Redux.
//
// WHY ARE THESE FUNCTIONS ASYNC?
// Even though we're reading from localStorage (which is instant), we use
// async/await to mimic real backend behavior:
//
// Real Backend:
//   const data = await fetch('/api/users') ← Takes time (network delay)
//
// Temporary Storage:
//   const data = await tempAuth.getSession() ← Instant, but acts like it takes time
//
// This way, when we replace these functions with real API calls, the rest
// of the code doesn't need to change. The app is already written to handle
// asynchronous data loading.
//
// HOW LOCALSTORAGE WORKS:
// localStorage is built into web browsers. It's like a tiny database that:
// - Stores data as key-value pairs (like a dictionary/object)
// - Persists even when you close the browser
// - Is limited to about 5-10MB of data
// - Only stores strings (so we convert objects to JSON strings)
// - Is specific to one domain (other websites can't read your data)
//
// Example:
//   localStorage.setItem('name', 'John')  ← Save
//   localStorage.getItem('name')          ← Returns 'John'
//
// LIMITATIONS OF THIS TEMPORARY APPROACH:
// 1. Data only exists in YOUR browser (not shared with other users)
// 2. Clear browser data = lose all saved information
// 3. No real security (passwords stored in plain text - NEVER do this in production!)
// 4. No data validation or relationships between tables
// 5. No real-time updates (can't see when other users make changes)
// 6. No backups or recovery if data is lost
//
// TODO: Replace this entire file with real backend integration
// TODO: Migrate all data to Supabase database tables
// TODO: Implement proper authentication with password hashing
// TODO: Add real-time WebSocket connections for live updates
// ============================================================================

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// These define the shape of our data (what properties each object has)

export interface TempUser {
  id: string;           // Unique identifier for this user
  email: string;        // User's email address
  created_at: string;   // When the account was created
}

export interface TempSession {
  user: TempUser;       // The logged-in user's information
  access_token: string; // Token used to authenticate requests (fake token here)
}

// ============================================================================
// USER AUTHENTICATION
// ============================================================================
// In a real app, authentication is handled by a secure backend service like
// Supabase Auth or Firebase Auth. They handle:
// - Password hashing (storing passwords securely)
// - Session management (keeping users logged in)
// - Email verification (confirming email addresses)
// - Password reset (forgot password functionality)
// - OAuth (login with Google, Facebook, etc.)
//
// This temporary version stores everything in localStorage, which is:
// - NOT SECURE (passwords stored in plain text!)
// - NOT SHARED (only works on your browser)
// - TEMPORARY (data lost if you clear browser storage)
//
// TODO: Replace with Supabase Auth for production-ready security
// ============================================================================
export const tempAuth = {
  // ==========================================================================
  // SIGN UP - CREATE NEW USER ACCOUNT
  // ==========================================================================
  // What happens in a real backend:
  // 1. Receive email and password
  // 2. Hash the password (encrypt it so it can't be read)
  // 3. Save user to database
  // 4. Send verification email
  // 5. Return user object
  //
  // What happens here:
  // 1. Read existing users from localStorage
  // 2. Check if email already exists
  // 3. Create new user with fake ID
  // 4. Save to localStorage (with plain text password - INSECURE!)
  // 5. Return user object
  //
  // Why async? Real databases take time to respond (network latency).
  // By making this async, our code already handles waiting for responses.
  // ==========================================================================
  signUp: async (email: string, password: string) => {
    // Read existing users from localStorage
    // localStorage only stores strings, so we parse the JSON string into an array
    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');

    // Check if this email is already registered
    const existing = users.find((u: any) => u.email === email);

    if (existing) {
      // In a real backend, this would be a 409 Conflict HTTP error
      throw new Error('User already exists');
    }

    // Create a new user object
    // In production, the database auto-generates IDs (usually UUID)
    // Here, we use timestamp to create a fake unique ID
    const newUser: TempUser = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };

    // Store user with password (NEVER do this in production!)
    // Real backends hash passwords: 'password123' becomes '$2a$10$N9qo8uLO...'
    users.push({ ...newUser, password });
    localStorage.setItem('temp_users', JSON.stringify(users));

    // Return data in the same format Supabase returns
    // This makes switching to Supabase later easier
    return { data: { user: newUser }, error: null };
  },

  // ==========================================================================
  // SIGN IN - LOG INTO EXISTING ACCOUNT
  // ==========================================================================
  // What happens in a real backend:
  // 1. Receive email and password
  // 2. Find user in database by email
  // 3. Compare hashed password with stored hash
  // 4. Generate secure session token (JWT)
  // 5. Return user object and session token
  //
  // What happens here:
  // 1. Read users from localStorage
  // 2. Find user with matching email AND password (plain text comparison)
  // 3. Create fake session with fake token
  // 4. Save session to localStorage
  // 5. Return user and session
  //
  // Why return { data, error }? This matches how real APIs return data,
  // making it easier to replace this with real API calls later.
  // ==========================================================================
  signIn: async (email: string, password: string) => {
    // Read all users from localStorage
    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');

    // Find user with matching credentials
    // SECURITY WARNING: This compares plain text passwords (insecure!)
    // Real backends compare password hashes using bcrypt or similar
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      // In a real backend, this would be a 401 Unauthorized HTTP error
      throw new Error('Invalid email or password');
    }

    // Create a fake session object
    // Real sessions include:
    // - JWT token (encrypted, time-limited)
    // - Refresh token (for getting new access tokens)
    // - Expiration time
    const session: TempSession = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      access_token: `token_${Date.now()}`, // Fake token (not secure!)
    };

    // Save session to localStorage
    // Real backends store sessions in:
    // - HTTP-only cookies (can't be accessed by JavaScript)
    // - Secure session stores (Redis, database)
    localStorage.setItem('temp_session', JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  // ==========================================================================
  // GET SESSION - CHECK IF USER IS LOGGED IN
  // ==========================================================================
  // What this does:
  // Checks if there's a current logged-in session. Apps call this on startup
  // to see if the user is already logged in (from a previous visit).
  //
  // Real backend flow:
  // 1. Browser sends session token (from cookie)
  // 2. Backend validates token (checks signature, expiration)
  // 3. Returns user info if valid, null if expired/invalid
  //
  // Temporary flow:
  // 1. Read session from localStorage
  // 2. Return it (no validation)
  // ==========================================================================
  getSession: async () => {
    // Check if there's a saved session
    const session = localStorage.getItem('temp_session');

    if (!session) {
      // No active session (user not logged in)
      return { data: { session: null }, error: null };
    }

    // Parse and return the session
    // Real backends would validate the token here before returning
    return { data: { session: JSON.parse(session) }, error: null };
  },

  // ==========================================================================
  // SIGN OUT - LOG OUT OF ACCOUNT
  // ==========================================================================
  // What this does:
  // Removes the current session, logging the user out.
  //
  // Real backend flow:
  // 1. Invalidate session token on server
  // 2. Clear session cookie
  // 3. Possibly log the logout event
  //
  // Temporary flow:
  // 1. Remove session from localStorage
  // ==========================================================================
  signOut: async () => {
    // Remove the session data
    // This logs the user out
    localStorage.removeItem('temp_session');
    return { error: null };
  },

  // ==========================================================================
  // AUTH STATE CHANGE LISTENER
  // ==========================================================================
  // What this does:
  // Sets up a listener that watches for changes in authentication state.
  // Real auth services (like Supabase) emit events when:
  // - User logs in
  // - User logs out
  // - Session expires
  // - Token refreshes
  //
  // This temporary version just checks once immediately and returns.
  // It doesn't actually "listen" for changes since localStorage doesn't
  // emit events when modified.
  //
  // The callback function is called with:
  // - event: What happened ('SIGNED_IN', 'SIGNED_OUT', etc.)
  // - session: The current session (or null)
  // ==========================================================================
  onAuthStateChange: (callback: (event: string, session: TempSession | null) => void) => {
    // Check current session immediately
    const session = localStorage.getItem('temp_session');

    // Call the callback with current state
    // Real implementation would continue listening for changes
    callback('SIGNED_IN', session ? JSON.parse(session) : null);

    // Return a subscription object (mimics Supabase API)
    // Real subscriptions can be unsubscribed to stop listening
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            // In a real implementation, this would stop listening for auth changes
            // Here it does nothing since we're not actually listening
          },
        },
      },
    };
  },
};

// ============================================================================
// USER PREFERENCES STORAGE
// ============================================================================
// Stores each user's personal preferences (activities, food, transport, etc.)
//
// Why not in Redux?
// - Redux: Current viewing state (which screen am I on?)
// - Database: Permanent data (what are my saved preferences?)
//
// These preferences need to:
// - Persist across browser sessions (still there after closing browser)
// - Be loaded once on app start and used throughout the app
// - Be saved whenever user updates them
//
// Think of it like:
// - Redux is like RAM (temporary memory, reset on restart)
// - This storage is like a hard drive (permanent memory, survives restart)
//
// TODO: Replace with Supabase 'user_preferences' table
// ============================================================================
export const tempPreferences = {
  // ==========================================================================
  // SAVE PREFERENCES
  // ==========================================================================
  // What this does:
  // Saves a user's preferences permanently (until they clear browser data).
  //
  // Real backend:
  // - SQL: INSERT INTO user_preferences VALUES (...) ON CONFLICT UPDATE
  // - API: POST /api/users/:id/preferences
  //
  // Temporary:
  // - Store JSON string in localStorage with key 'preferences_{userId}'
  // ==========================================================================
  save: async (userId: string, preferences: any) => {
    // Create a unique key for this user's preferences
    // Each user gets their own localStorage key
    const key = `preferences_${userId}`;

    // Convert preferences object to JSON string and save
    // localStorage can only store strings, so we use JSON.stringify()
    localStorage.setItem(key, JSON.stringify(preferences));

    return { error: null };
  },

  // ==========================================================================
  // GET PREFERENCES
  // ==========================================================================
  // What this does:
  // Retrieves a user's saved preferences.
  //
  // Real backend:
  // - SQL: SELECT * FROM user_preferences WHERE user_id = $1
  // - API: GET /api/users/:id/preferences
  //
  // Temporary:
  // - Read JSON string from localStorage and parse it back to an object
  // ==========================================================================
  get: async (userId: string) => {
    const key = `preferences_${userId}`;
    const data = localStorage.getItem(key);

    // If no preferences found, return null (user hasn't set preferences yet)
    // If found, parse JSON string back into object
    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

// ============================================================================
// ROOMS STORAGE
// ============================================================================
// Stores voting rooms that users create. Each room has:
// - Unique code for sharing
// - Creator (host) information
// - Occasion details (birthday, date night, etc.)
// - Voting status (is voting currently active?)
//
// Why separate from Redux?
// - Rooms need to persist even if user navigates away
// - Room data needs to be accessible by multiple users (in real app)
// - Redux stores "current room" state, this stores "all rooms" data
//
// TODO: Replace with Supabase 'rooms' table
// ============================================================================
export const tempRooms = {
  // ==========================================================================
  // CREATE ROOM
  // ==========================================================================
  // What this does:
  // Creates a new voting room with a unique ID.
  //
  // Real backend:
  // - Generates UUID for room ID
  // - Stores in database with indexes for fast lookups
  // - Returns the created room
  //
  // Temporary:
  // - Reads all rooms from localStorage
  // - Adds new room to array
  // - Saves updated array back to localStorage
  // ==========================================================================
  create: async (roomData: any) => {
    // Get all existing rooms
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');

    // Create new room with generated ID and timestamps
    // Real databases auto-generate these values
    const newRoom = {
      id: `room_${Date.now()}`,
      ...roomData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to rooms array
    rooms.push(newRoom);

    // Save back to localStorage
    localStorage.setItem('temp_rooms', JSON.stringify(rooms));

    return { data: newRoom, error: null };
  },

  // ==========================================================================
  // GET ROOM BY CODE
  // ==========================================================================
  // What this does:
  // Finds a room by its shareable code (e.g., "ABC123").
  // This is used when users join a room by entering the room code.
  //
  // Real backend:
  // - SQL: SELECT * FROM rooms WHERE room_code = $1
  // - Database has an index on room_code for fast lookups
  //
  // Temporary:
  // - Loads all rooms and searches through them
  // - Inefficient for large datasets (no indexing)
  // ==========================================================================
  getByCode: async (code: string) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');

    // Find room with matching code
    // Real databases do this much faster with indexes
    const room = rooms.find((r: any) => r.room_code === code);

    return { data: room || null, error: null };
  },

  // ==========================================================================
  // UPDATE ROOM
  // ==========================================================================
  // What this does:
  // Updates room information (like changing voting status).
  //
  // Real backend:
  // - SQL: UPDATE rooms SET ... WHERE id = $1
  // - Only updates specified fields
  // - Updates 'updated_at' timestamp automatically
  //
  // Temporary:
  // - Loads all rooms
  // - Finds the one to update
  // - Merges in new data
  // - Saves all rooms back
  // ==========================================================================
  update: async (roomId: string, updates: any) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');
    const index = rooms.findIndex((r: any) => r.id === roomId);

    if (index >= 0) {
      // Merge updates into existing room data
      rooms[index] = {
        ...rooms[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('temp_rooms', JSON.stringify(rooms));
    }

    return { error: null };
  },
};

// ============================================================================
// ROOM PARTICIPANTS STORAGE
// ============================================================================
// Stores who has joined each room. In a real app, this data would:
// - Update in real-time when users join/leave
// - Show online/offline status (green dot vs gray dot)
// - Track when each user last interacted with the room
//
// Why not in Redux?
// - Participant data needs to be shared across all users in the room
// - Needs to persist if user refreshes the page
// - Redux stores "current room's participants" but this stores all participants
//
// TODO: Replace with Supabase 'room_participants' table
// TODO: Add WebSocket listeners for real-time presence updates
// ============================================================================
export const tempParticipants = {
  // ==========================================================================
  // ADD PARTICIPANT
  // ==========================================================================
  // What this does:
  // Adds a user to a room's participant list.
  //
  // Real backend:
  // - Checks if user already in room (prevent duplicates)
  // - Inserts new participant record
  // - Emits WebSocket event to notify other participants
  //
  // Temporary:
  // - Stores participants separately for each room
  // - No real-time notifications
  // ==========================================================================
  add: async (roomId: string, userId: string) => {
    // Each room has its own participant list
    const key = `participants_${roomId}`;
    const participants = JSON.parse(localStorage.getItem(key) || '[]');

    // Check if user already in room
    const existing = participants.find((p: any) => p.user_id === userId);
    if (existing) {
      return { error: null };
    }

    // Create participant record
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

  // ==========================================================================
  // GET PARTICIPANTS
  // ==========================================================================
  // What this does:
  // Retrieves all participants in a room.
  //
  // Real backend:
  // - SQL: SELECT * FROM room_participants WHERE room_id = $1
  // - Joins with users table to get names, avatars, etc.
  // - Returns live online/offline status
  //
  // Temporary:
  // - Reads from localStorage
  // - No join operations (can't get user details automatically)
  // ==========================================================================
  get: async (roomId: string) => {
    const key = `participants_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : [], error: null };
  },
};

// ============================================================================
// SESSION PREFERENCES STORAGE
// ============================================================================
// Stores preferences SPECIFIC TO THIS ROOM/SESSION.
//
// Why separate from user preferences?
// - User Preferences: "I usually like Italian food" (general preferences)
// - Session Preferences: "For THIS birthday party, let's do Chinese" (one-time override)
//
// Users might have different preferences for different occasions:
// - Birthday: Fancy restaurants, higher budget
// - Casual lunch: Fast food, lower budget
// - Date night: Romantic atmosphere, specific location
//
// These session-specific preferences override general preferences for this room.
//
// TODO: Replace with Supabase 'session_preferences' table
// ============================================================================
export const tempSessionPreferences = {
  // ==========================================================================
  // SAVE SESSION PREFERENCES
  // ==========================================================================
  // What this does:
  // Saves preferences for a specific room and user combination.
  //
  // Real backend:
  // - SQL: INSERT INTO session_preferences (room_id, user_id, ...)
  // - Composite key on (room_id, user_id) ensures one preference set per user per room
  // ==========================================================================
  save: async (roomId: string, userId: string, preferences: any) => {
    // Create unique key for this room-user combination
    const key = `session_prefs_${roomId}_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
    return { error: null };
  },

  // ==========================================================================
  // GET SESSION PREFERENCES
  // ==========================================================================
  // What this does:
  // Retrieves preferences for a specific room and user.
  //
  // Real backend:
  // - SQL: SELECT * FROM session_preferences WHERE room_id = $1 AND user_id = $2
  // ==========================================================================
  get: async (roomId: string, userId: string) => {
    const key = `session_prefs_${roomId}_${userId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

// ============================================================================
// RECOMMENDATIONS STORAGE
// ============================================================================
// Stores place recommendations for each room to vote on.
//
// In a real app, recommendations would be:
// - Generated by an AI service based on preferences
// - Fetched from external APIs (Google Places, Yelp, etc.)
// - Stored in database after generation
// - Include rich data (photos, reviews, hours, etc.)
//
// This temporary version:
// - Returns hardcoded mock data
// - Same recommendations for every room
// - Static images and parameters
//
// Why mock data?
// - Allows UI development without AI service
// - No API keys needed for external services
// - Predictable data for testing
//
// TODO: Replace with AI service that generates personalized recommendations
// TODO: Integrate with Google Places API or similar for real venue data
// TODO: Store generated recommendations in Supabase 'recommendations' table
// ============================================================================
export const tempRecommendations = {
  // ==========================================================================
  // GET RECOMMENDATIONS FOR ROOM
  // ==========================================================================
  // What this does:
  // Returns mock recommendation data.
  //
  // Real backend flow:
  // 1. Receive room ID and user preferences
  // 2. Call AI service with preferences (OpenAI, Claude, etc.)
  // 3. AI generates personalized recommendations
  // 4. Fetch venue details from Google Places API
  // 5. Score each venue based on preference match
  // 6. Return top recommendations
  //
  // Temporary flow:
  // 1. Return hardcoded array of 2 sample venues
  //
  // Why still use roomId parameter? So the function signature matches
  // what the real implementation will need.
  // ==========================================================================
  getByRoom: async (roomId: string) => {
    // Mock recommendation data
    // In production, this would be dynamically generated based on:
    // - User preferences (food, activities, budget)
    // - Location (proximity to user's address)
    // - Time/date (open now? available at the event time?)
    // - Group size (capacity for all participants)
    // - Historical data (places user liked before)
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

// ============================================================================
// VOTES STORAGE
// ============================================================================
// Stores who voted for which recommendations.
//
// Voting data structure:
// {
//   "votes_room123": {
//     "recommendation_1": [
//       { user_id: "user1", vote_type: "yes", ... },
//       { user_id: "user2", vote_type: "yes", ... }
//     ],
//     "recommendation_2": [
//       { user_id: "user1", vote_type: "no", ... }
//     ]
//   }
// }
//
// Why structured this way?
// - Easy to count votes per recommendation
// - Easy to check if specific user voted
// - Easy to find what a user voted for
//
// In a real app:
// - Votes sync instantly via WebSocket (all users see votes immediately)
// - Backend validates votes (can't vote twice, must be in room, etc.)
// - Stored in database for permanent record
//
// TODO: Replace with Supabase 'votes' table
// TODO: Add WebSocket events for real-time vote updates
// TODO: Add vote validation (prevent duplicate votes, verify room membership)
// ============================================================================
export const tempVotes = {
  // ==========================================================================
  // CAST VOTE
  // ==========================================================================
  // What this does:
  // Records a user's vote for a recommendation.
  //
  // Real backend:
  // - Validates: User is in the room
  // - Validates: Voting is currently active
  // - Upserts vote (insert new or update existing)
  // - Emits WebSocket event to all participants
  // - Returns updated vote count
  //
  // Temporary:
  // - Stores in localStorage
  // - No validation
  // - No real-time updates
  // ==========================================================================
  cast: async (vote: any) => {
    const key = `votes_${vote.room_id}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');

    // Initialize array for this recommendation if it doesn't exist
    if (!votes[vote.recommendation_id]) {
      votes[vote.recommendation_id] = [];
    }

    // Check if user already voted on this recommendation
    const existingIndex = votes[vote.recommendation_id].findIndex(
      (v: any) => v.user_id === vote.user_id
    );

    if (existingIndex >= 0) {
      // Update existing vote (user changed their mind)
      votes[vote.recommendation_id][existingIndex] = vote;
    } else {
      // Add new vote
      votes[vote.recommendation_id].push(vote);
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },

  // ==========================================================================
  // REMOVE VOTE
  // ==========================================================================
  // What this does:
  // Removes a user's vote (when they un-vote).
  //
  // Real backend:
  // - SQL: DELETE FROM votes WHERE recommendation_id = $1 AND user_id = $2
  // - Emits WebSocket event
  //
  // Temporary:
  // - Filters vote out of array
  // - Saves updated array
  // ==========================================================================
  remove: async (roomId: string, recommendationId: string, userId: string) => {
    const key = `votes_${roomId}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');

    if (votes[recommendationId]) {
      // Filter out this user's vote
      votes[recommendationId] = votes[recommendationId].filter(
        (v: any) => v.user_id !== userId
      );
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },

  // ==========================================================================
  // GET ALL VOTES FOR ROOM
  // ==========================================================================
  // What this does:
  // Retrieves all votes for all recommendations in a room.
  //
  // Real backend:
  // - SQL: SELECT * FROM votes WHERE room_id = $1
  // - Groups by recommendation_id
  // - Includes user information (names, avatars)
  //
  // Temporary:
  // - Reads from localStorage
  // - Returns raw vote data
  // ==========================================================================
  getByRoom: async (roomId: string) => {
    const key = `votes_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : {}, error: null };
  },
};
