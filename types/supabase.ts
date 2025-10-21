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
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          description: string | null
          content: string
          cover_image: string | null
          author: string
          tags: string[] | null
          is_published: boolean
          published_at: string | null
          views: number
          reading_time: number | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          description?: string | null
          content: string
          cover_image?: string | null
          author?: string
          tags?: string[] | null
          is_published?: boolean
          published_at?: string | null
          views?: number
          reading_time?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          content?: string
          cover_image?: string | null
          author?: string
          tags?: string[] | null
          is_published?: boolean
          published_at?: string | null
          views?: number
          reading_time?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_views: {
        Args: {
          post_id: string
        }
        Returns: void
      }
      calculate_reading_time: {
        Args: {
          content_text: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
