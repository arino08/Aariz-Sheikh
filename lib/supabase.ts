import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export type Project = {
  id: string;
  title: string;
  description: string;
  short_description: string;
  tech_stack: string[];
  image_url: string;
  project_url?: string;
  github_url?: string;
  featured: boolean;
  order_index: number;
  status: 'active' | 'archived' | 'draft';
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;
