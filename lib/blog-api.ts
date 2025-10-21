import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export interface BlogPostWithCategory extends BlogPost {
  category?: BlogCategory;
}

/**
 * Fetch all active blog categories
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as BlogCategory[];
}

/**
 * Fetch all published blog posts with category info
 */
export async function getPosts(categoryId?: string) {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as BlogPostWithCategory[];
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;

  // Increment view count
  if (data) {
    await supabase.rpc('increment_post_views', { post_id: data.id });
  }

  return data as BlogPostWithCategory;
}

/**
 * Search posts by title, description, or tags
 */
export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPostWithCategory[];
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('is_published', true)
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPostWithCategory[];
}

/**
 * Get category with post count
 */
export async function getCategoriesWithCounts() {
  const { data: categories, error: catError } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (catError) throw catError;

  // Get post counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);

      return {
        ...category,
        post_count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

// ============================================
// ADMIN FUNCTIONS (Require Authentication)
// ============================================

/**
 * Create a new blog post
 */
export async function createPost(post: BlogPostInsert) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

/**
 * Update an existing blog post
 */
export async function updatePost(id: string, updates: BlogPostUpdate) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get all posts (including unpublished) for admin
 */
export async function getAllPostsAdmin() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogPostWithCategory[];
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string = 'blog-images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Toggle post publish status
 */
export async function togglePublishPost(id: string, isPublished: boolean) {
  const updates: BlogPostUpdate = {
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  return updatePost(id, updates);
}
