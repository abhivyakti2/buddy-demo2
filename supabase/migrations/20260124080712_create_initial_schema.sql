/*
  # Create VoteSpace Initial Database Schema

  ## Overview
  This migration sets up the complete database schema for the VoteSpace voting application with user preferences, rooms, recommendations, and voting functionality.

  ## 1. User Preferences Table
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `activities` (jsonb) - Array of selected activities + custom entries
    - `food_preferences` (jsonb) - Food categories + custom restrictions
    - `transport_preferences` (jsonb) - Preferred transport modes
    - `home_address` (text) - User's home address
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## 2. Rooms Table
    - `id` (uuid, primary key)
    - `room_code` (text, unique) - 8-character room code
    - `creator_id` (uuid, references auth.users)
    - `occasion` (text) - Purpose of the outing
    - `mood_atmosphere` (jsonb) - Array of selected moods
    - `start_time` (timestamptz) - When the outing starts
    - `end_time` (timestamptz) - When the outing ends
    - `duration_minutes` (integer) - Duration in minutes
    - `is_active` (boolean) - Whether voting is active
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## 3. Room Participants Table
    - `id` (uuid, primary key)
    - `room_id` (uuid, references rooms)
    - `user_id` (uuid, references auth.users)
    - `is_online` (boolean) - Connection status
    - `joined_at` (timestamptz)
    - `last_seen` (timestamptz)

  ## 4. Session Preferences Table
    - `id` (uuid, primary key)
    - `room_id` (uuid, references rooms)
    - `user_id` (uuid, references auth.users)
    - `budget` (text) - Budget preference for this session
    - `distance_km` (integer) - Maximum distance in km
    - `location` (text) - Override location for this session
    - `outdoor_indoor` (text) - 'outdoor', 'indoor', or 'both'
    - `activities` (jsonb) - Temporary override of activities
    - `food_preferences` (jsonb) - Temporary override of food prefs
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## 5. Recommendations Table
    - `id` (uuid, primary key)
    - `room_id` (uuid, references rooms)
    - `name` (text) - Name of the place/option
    - `description` (text) - Description
    - `category` (text) - Type of recommendation
    - `price_level` (text) - Price indicator
    - `location` (text) - Location/address
    - `distance_km` (numeric) - Distance from user
    - `rating` (numeric) - Rating score
    - `images` (jsonb) - Array of image URLs
    - `parameters` (jsonb) - Additional parameters and scores
    - `created_at` (timestamptz)

  ## 6. Votes Table
    - `id` (uuid, primary key)
    - `room_id` (uuid, references rooms)
    - `recommendation_id` (uuid, references recommendations)
    - `user_id` (uuid, references auth.users)
    - `vote_type` (text) - 'yes', 'no', 'maybe'
    - `created_at` (timestamptz)
    - Unique constraint on (room_id, recommendation_id, user_id)

  ## 7. Saved Recommendations Table
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `recommendation_id` (uuid, references recommendations)
    - `saved_at` (timestamptz)
    - Unique constraint on (user_id, recommendation_id)

  ## 8. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
    - Policies for room participants to view and interact with room data
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activities jsonb DEFAULT '[]'::jsonb,
  food_preferences jsonb DEFAULT '{}'::jsonb,
  transport_preferences jsonb DEFAULT '[]'::jsonb,
  home_address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE NOT NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  occasion text DEFAULT '',
  mood_atmosphere jsonb DEFAULT '[]'::jsonb,
  start_time timestamptz,
  end_time timestamptz,
  duration_minutes integer,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_online boolean DEFAULT true,
  joined_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create session_preferences table
CREATE TABLE IF NOT EXISTS session_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  budget text DEFAULT '',
  distance_km integer,
  location text DEFAULT '',
  outdoor_indoor text DEFAULT 'both',
  activities jsonb DEFAULT '[]'::jsonb,
  food_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  price_level text DEFAULT '',
  location text DEFAULT '',
  distance_km numeric(10, 2),
  rating numeric(3, 2),
  images jsonb DEFAULT '[]'::jsonb,
  parameters jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  recommendation_id uuid REFERENCES recommendations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vote_type text DEFAULT 'yes',
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, recommendation_id, user_id)
);

-- Create saved_recommendations table
CREATE TABLE IF NOT EXISTS saved_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommendation_id uuid REFERENCES recommendations(id) ON DELETE CASCADE NOT NULL,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recommendation_id)
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for rooms
CREATE POLICY "Users can view rooms they created or joined"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = rooms.id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Room creators can update their rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policies for room_participants
CREATE POLICY "Users can view participants in their rooms"
  ON room_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants rp
      WHERE rp.room_id = room_participants.room_id
      AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms"
  ON room_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant status"
  ON room_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for session_preferences
CREATE POLICY "Users can view session preferences in their rooms"
  ON session_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = session_preferences.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own session preferences"
  ON session_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session preferences"
  ON session_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for recommendations
CREATE POLICY "Users can view recommendations in their rooms"
  ON recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = recommendations.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Room creators can insert recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_id
      AND rooms.creator_id = auth.uid()
    )
  );

-- Policies for votes
CREATE POLICY "Users can view votes in their rooms"
  ON votes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = votes.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for saved_recommendations
CREATE POLICY "Users can view their own saved recommendations"
  ON saved_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recommendations"
  ON saved_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recommendations"
  ON saved_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_creator_id ON rooms(creator_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_session_preferences_room_id ON session_preferences(room_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_room_id ON recommendations(room_id);
CREATE INDEX IF NOT EXISTS idx_votes_room_id ON votes(room_id);
CREATE INDEX IF NOT EXISTS idx_votes_recommendation_id ON votes(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_saved_recommendations_user_id ON saved_recommendations(user_id);