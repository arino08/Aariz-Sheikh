"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlockEditor from '@/components/blog/BlockEditor';
import {
  fetchCategories,
  fetchAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  generateSlug
} from '@/lib/blogService';
import type { BlogPost, BlogCategory, ContentBlock, BlogPostInsert } from '@/lib/supabaseClient';

export default function BlogAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    content: ContentBlock[];
    cover_image: string;
    category_id: string;
    tags: string;
    is_published: boolean;
  }>({
    title: '',
    slug: '',
    description: '',
    content: [],
    cover_image: '',
    category_id: '',
    tags: '',
    is_published: false,
  });

  // Authentication check
  const handleAuth = () => {
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'az8576';
    if (password === adminSecret) {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Incorrect password');
    }
  };

  // Load categories and posts
  const loadData = async () => {
    setIsLoading(true);
    const [cats, allPosts] = await Promise.all([
      fetchCategories(),
      fetchAllPostsAdmin(),
    ]);
    setCategories(cats);
    setPosts(allPosts);
    setIsLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const postData: BlogPostInsert = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      description: formData.description,
      content: formData.content,
      cover_image: formData.cover_image || null,
      category_id: formData.category_id || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      author: 'Aariz Sheikh',
      metadata: null,
    };

    let success = false;
    if (editingPost) {
      const result = await updatePost(editingPost.id, postData);
      success = result !== null;
    } else {
      const result = await createPost(postData);
      success = result !== null;
    }

    if (success) {
      alert(editingPost ? 'Post updated!' : 'Post created!');
      resetForm();
      loadData();
    } else {
      alert('Error saving post');
    }

    setIsLoading(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: [],
      cover_image: '',
      category_id: '',
      tags: '',
      is_published: false,
    });
    setEditingPost(null);
    setShowForm(false);
  };

  // Edit post
  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      description: post.description || '',
      content: post.content,
      cover_image: post.cover_image || '',
      category_id: post.category_id || '',
      tags: post.tags.join(', '),
      is_published: post.is_published,
    });
    setEditingPost(post);
    setShowForm(true);
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsLoading(true);
    const success = await deletePost(id);
    if (success) {
      alert('Post deleted!');
      loadData();
    } else {
      alert('Error deleting post');
    }
    setIsLoading(false);
  };

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string | null> => {
    return await uploadImage(file);
  };

  // Handle cover image upload
  const handleCoverImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = await uploadImage(file);
        if (url) {
          setFormData(prev => ({ ...prev, cover_image: url }));
        }
      }
    };
    input.click();
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !editingPost) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title, editingPost]);

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#161b22] border border-[#00ff88]/30 rounded-lg p-8">
          <h1 className="text-2xl font-mono text-[#00ff88] mb-6">Blog Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Enter admin password"
            className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono mb-4 focus:outline-none focus:border-[#00ff88]"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#00ff88] text-[#0D1117] font-mono py-2 rounded hover:bg-[#00ff88]/90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-300">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-mono text-[#00ff88]">Blog Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/blog')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded font-mono text-sm"
            >
              View Blog
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded font-mono text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Action buttons */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[#00ff88] text-[#0D1117] font-mono rounded hover:bg-[#00ff88]/90"
          >
            + New Post
          </button>
        </div>

        {/* Post form */}
        {showForm && (
          <div className="mb-8 bg-[#161b22] border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-mono text-[#00ff88] mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                  placeholder="Post title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                  placeholder="auto-generated-from-title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                  placeholder="Brief description"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                    className="flex-1 bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                    placeholder="Image URL or upload"
                  />
                  <button
                    type="button"
                    onClick={handleCoverImageUpload}
                    className="px-4 py-2 bg-[#00d4ff] text-[#0D1117] font-mono rounded hover:bg-[#00d4ff]/80"
                  >
                    Upload
                  </button>
                </div>
                {formData.cover_image && (
                  <img src={formData.cover_image} alt="Cover preview" className="mt-2 w-full max-w-sm rounded" />
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full bg-[#0D1117] border border-gray-700 rounded px-4 py-2 text-gray-300 font-mono focus:outline-none focus:border-[#00ff88]"
                  placeholder="React, TypeScript, Tutorial"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Content *</label>
                <BlockEditor
                  content={formData.content}
                  onChange={(blocks) => setFormData(prev => ({ ...prev, content: blocks }))}
                  onImageUpload={handleImageUpload}
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-mono text-gray-400">
                  Publish immediately
                </label>
              </div>

              {/* Submit buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#00ff88] text-[#0D1117] font-mono rounded hover:bg-[#00ff88]/90 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-800 text-gray-300 font-mono rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts list */}
        <div className="bg-[#161b22] border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-mono text-[#00ff88]">All Posts ({posts.length})</h2>
          </div>

          <div className="divide-y divide-gray-700">
            {posts.map(post => (
              <div key={post.id} className="p-4 hover:bg-[#0D1117] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-mono text-gray-300 mb-1">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-mono">
                      <span>{post.is_published ? '✓ Published' : '• Draft'}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.category_id && (
                        <>
                          <span>•</span>
                          <span>{categories.find(c => c.id === post.category_id)?.name}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded text-sm font-mono hover:bg-[#00d4ff]/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 bg-red-900/20 text-red-400 rounded text-sm font-mono hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-mono">
                No posts yet. Create your first post!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
