import { supabase, BlogPost, BlogCategory, BlogPostInsert, BlogPostUpdate, ContentBlock } from './supabaseClient';

/**
 * Blog Service - API layer for blog operations
 */

// ==================== CATEGORIES ====================

/**
 * Fetch all active blog categories
 */
export async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function fetchCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// ==================== POSTS ====================

/**
 * Fetch all published blog posts
 */
export async function fetchPosts(categoryId?: string): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by ID
 */
export async function fetchPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment view count
    if (data) {
      await incrementPostViews(id);
    }

    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/**
 * Fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    // Increment view count
    if (data) {
      await incrementPostViews(data.id);
    }

    return data;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Increment post view count
 */
async function incrementPostViews(postId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_post_views', {
      post_id: postId,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * Search posts by title or content
 */
export async function searchPosts(searchTerm: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// ==================== ADMIN OPERATIONS ====================

/**
 * Create a new blog post (requires authentication)
 */
export async function createPost(post: BlogPostInsert): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

/**
 * Update an existing blog post (requires authentication)
 */
export async function updatePost(id: string, updates: BlogPostUpdate): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

/**
 * Delete a blog post (requires authentication)
 */
export async function deletePost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

/**
 * Fetch all posts for admin (including drafts)
 */
export async function fetchAllPostsAdmin(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return [];
  }
}

// ==================== STORAGE ====================

/**
 * Upload an image to Supabase storage
 */
export async function uploadImage(file: File, folder: string = 'blog-images'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-storage')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-storage').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('blog-storage') + 1).join('/');

    const { error } = await supabase.storage.from('blog-storage').remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// ==================== UTILITIES ====================

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Convert HTML or Markdown to content blocks (simple version)
 */
export function parseContentToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Simple parser - split by paragraphs
  const paragraphs = html.split('\n\n').filter(p => p.trim());

  paragraphs.forEach(para => {
    const trimmed = para.trim();

    // Check if it's an image
    if (trimmed.startsWith('<img') || trimmed.startsWith('![')) {
      // Extract image data (simplified)
      blocks.push({
        type: 'paragraph',
        text: trimmed,
      });
    } else {
      blocks.push({
        type: 'paragraph',
        text: trimmed.replace(/<[^>]*>/g, ''), // Strip HTML tags
      });
    }
  });

  return blocks;
}

/**
 * Convert content blocks to plain text (for reading time calculation)
 */
export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .filter(block => block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote')
    .map(block => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        return block.text;
      }
      if (block.type === 'quote') {
        return block.text;
      }
      return '';
    })
    .join(' ');
}
