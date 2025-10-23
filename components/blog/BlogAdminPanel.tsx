"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPostsAdmin, createPost, updatePost, deletePost, uploadImage } from '@/lib/blog-api';
import { getCategories } from '@/lib/blog-api';
import type { Database } from '@/types/supabase';
import Image from 'next/image';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];

export default function BlogAdminPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    cover_image: '',
    category_id: '',
    tags: '',
    is_published: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        getAllPostsAdmin(),
        getCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load blog data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, cover_image: imageUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      };

      if (editingPost) {
        await updatePost(editingPost.id, postData);
        alert('Post updated successfully!');
      } else {
        await createPost(postData);
        alert('Post created successfully!');
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      description: post.description || '',
      content: post.content,
      cover_image: post.cover_image || '',
      category_id: post.category_id || '',
      tags: post.tags?.join(', ') || '',
      is_published: post.is_published,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(id);
      alert('Post deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      cover_image: '',
      category_id: '',
      tags: '',
      is_published: false,
    });
    setEditingPost(null);
    setShowEditor(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#00ff88] font-mono">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#c9d1d9] font-mono">
      {/* Header */}
      <header className="border-b border-[#00ff88]/20 bg-[#161b22] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[#00ff88]">BLOG ADMIN PANEL</h1>
            <p className="text-sm text-gray-500">Manage your blog posts and content</p>
          </div>
          <div className="flex gap-4">
            <Link href="/blog" className="px-4 py-2 border border-[#00ff88]/30 text-[#00ff88] rounded hover:bg-[#00ff88]/10 transition-colors">
              View Blog
            </Link>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="px-4 py-2 bg-[#00ff88] text-[#0D1117] rounded hover:bg-[#00d4ff] transition-colors font-bold"
            >
              {showEditor ? 'Cancel' : '+ New Post'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Editor Form */}
        {showEditor && (
          <div className="mb-8 p-6 border border-[#00ff88]/20 rounded-lg bg-[#161b22]">
            <h2 className="text-xl text-[#00ff88] mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Slug (auto-generated if empty)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Content (Markdown) *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88] font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Category *</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="react, typescript, tutorial"
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Cover Image</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleInputChange}
                    placeholder="Image URL or upload below"
                    className="flex-1 px-3 py-2 bg-[#0D1117] border border-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88]"
                  />
                  <label className="px-4 py-2 border border-[#00ff88]/30 text-[#00ff88] rounded hover:bg-[#00ff88]/10 transition-colors cursor-pointer">
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.cover_image && (
                  <div className="mt-2 relative w-full h-40 rounded overflow-hidden">
                    <Image
                      src={formData.cover_image}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_published"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label htmlFor="is_published" className="text-sm">Publish immediately</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00ff88] text-[#0D1117] rounded hover:bg-[#00d4ff] transition-colors font-bold"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-[#00ff88]/30 text-[#00ff88] rounded hover:bg-[#00ff88]/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h2 className="text-xl text-[#00ff88] mb-4">All Posts ({posts.length})</h2>
          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="p-4 border border-[#00ff88]/20 rounded-lg bg-[#161b22] hover:border-[#00ff88]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-[#00ff88]">{post.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.is_published
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{post.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                      <span>👁 {post.views} views</span>
                      <span>⏱ {post.reading_time} min read</span>
                      {post.tags && post.tags.length > 0 && (
                        <span>🏷 {post.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1 border border-[#00ff88]/30 text-[#00ff88] rounded hover:bg-[#00ff88]/10 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 border border-red-500/30 text-red-500 rounded hover:bg-red-500/10 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
