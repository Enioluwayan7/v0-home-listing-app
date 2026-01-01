export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          price: number
          location: string
          bedrooms: number
          bathrooms: number
          area_sqft: number | null
          property_type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string
          title: string
          description: string
          price: number
          location: string
          bedrooms: number
          bathrooms: number
          area_sqft?: number | null
          property_type: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          price?: number
          location?: string
          bedrooms?: number
          bathrooms?: number
          area_sqft?: number | null
          property_type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          property_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
