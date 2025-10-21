import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_categories']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          content: ContentBlock[];
          cover_image: string | null;
          author: string;
          tags: string[];
          is_published: boolean;
          published_at: string | null;
          views: number;
          reading_time: number | null;
          metadata: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'reading_time'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
    };
  };
}

// Content block types
export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string; author?: string };

export type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];
