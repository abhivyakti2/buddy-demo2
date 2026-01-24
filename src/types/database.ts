export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          activities: Json
          food_preferences: Json
          transport_preferences: Json
          home_address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activities?: Json
          food_preferences?: Json
          transport_preferences?: Json
          home_address?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activities?: Json
          food_preferences?: Json
          transport_preferences?: Json
          home_address?: string
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_code: string
          creator_id: string
          occasion: string
          mood_atmosphere: Json
          start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_code: string
          creator_id: string
          occasion?: string
          mood_atmosphere?: Json
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_code?: string
          creator_id?: string
          occasion?: string
          mood_atmosphere?: Json
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          is_online: boolean
          joined_at: string
          last_seen: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          is_online?: boolean
          joined_at?: string
          last_seen?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          is_online?: boolean
          joined_at?: string
          last_seen?: string
        }
      }
      session_preferences: {
        Row: {
          id: string
          room_id: string
          user_id: string
          budget: string
          distance_km: number | null
          location: string
          outdoor_indoor: string
          activities: Json
          food_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          budget?: string
          distance_km?: number | null
          location?: string
          outdoor_indoor?: string
          activities?: Json
          food_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          budget?: string
          distance_km?: number | null
          location?: string
          outdoor_indoor?: string
          activities?: Json
          food_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          room_id: string
          name: string
          description: string
          category: string
          price_level: string
          location: string
          distance_km: number | null
          rating: number | null
          images: Json
          parameters: Json
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          name: string
          description?: string
          category?: string
          price_level?: string
          location?: string
          distance_km?: number | null
          rating?: number | null
          images?: Json
          parameters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          name?: string
          description?: string
          category?: string
          price_level?: string
          location?: string
          distance_km?: number | null
          rating?: number | null
          images?: Json
          parameters?: Json
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          room_id: string
          recommendation_id: string
          user_id: string
          vote_type: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          recommendation_id: string
          user_id: string
          vote_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          recommendation_id?: string
          user_id?: string
          vote_type?: string
          created_at?: string
        }
      }
      saved_recommendations: {
        Row: {
          id: string
          user_id: string
          recommendation_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recommendation_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recommendation_id?: string
          saved_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
