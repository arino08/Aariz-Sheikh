"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import CategoryPanel from './CategoryPanelV2';
import ContentPreview from './ContentPreview';
import SimpleMatrixRain from './SimpleMatrixRain';
import Navigation from '../ui/Navigation';
import { fetchCategories, fetchPosts } from '@/lib/blogService';
import type { ContentBlock } from '@/lib/supabaseClient';

// Adapted types for UI compatibility
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: ContentBlock[] | string;
  cover_image?: string;
  category: string;
  date: string;
  reading_time: number;
  tags: string[];
  status: 'draft' | 'published';
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  post_count: number;
}

export default function BlogInterface() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch data from Supabase
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // Fetch categories
        const dbCategories = await fetchCategories();

        // Fetch all posts
        const dbPosts = await fetchPosts();

        // Transform categories to UI format
        const uiCategories: BlogCategory[] = dbCategories.map(cat => ({
          id: cat.id,
          name: cat.name.toUpperCase(),
          slug: cat.slug,
          icon: cat.icon || '',
          description: cat.description || '',
          post_count: dbPosts.filter(p => p.category_id === cat.id).length,
        }));

        // Transform posts to UI format
        const uiPosts: BlogPost[] = dbPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description || '',
          content: post.content,
          cover_image: post.cover_image || undefined,
          category: post.category_id || '',
          date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          reading_time: post.reading_time || 5,
          tags: post.tags || [],
          status: post.is_published ? 'published' : 'draft',
        }));

        setCategories(uiCategories);
        setAllPosts(uiPosts);
      } catch (error) {
        console.error('Error loading blog data:', error);

        // Fallback to empty state on error
        setCategories([]);
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      // Fade in the whole container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Animate the header elements
      gsap.fromTo(
        '.blog-header-logo',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.blog-header-nav',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      // Animate the category panel
      gsap.fromTo(
        '.category-panel-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
      );

      // Animate the content preview
      gsap.fromTo(
        '.content-preview-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      );
    }
  }, [isLoading]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get current category posts
      const currentPosts = selectedCategory
        ? allPosts.filter(p => p.category === selectedCategory)
        : allPosts;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentPosts.length > 0) {
          const nextIndex = (selectedPostIndex + 1) % currentPosts.length;
          setSelectedPostIndex(nextIndex);
          setSelectedPost(currentPosts[nextIndex]);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentPosts.length > 0) {
          const prevIndex = selectedPostIndex <= 0 ? currentPosts.length - 1 : selectedPostIndex - 1;
          setSelectedPostIndex(prevIndex);
          setSelectedPost(currentPosts[prevIndex]);
        }
      } else if (e.key === 'Enter') {
        if (selectedPost) {
          // Navigate to full post page
          window.location.href = `/blog/${selectedPost.slug}`;
        }
      } else if (e.key === 'Escape') {
        setSelectedPost(null);
        setSelectedPostIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory, allPosts, selectedPostIndex, selectedPost]);

  // Handle post selection
  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post);

    // Update selected index
    const currentPosts = selectedCategory
      ? allPosts.filter(p => p.category === selectedCategory)
      : allPosts;
    setSelectedPostIndex(currentPosts.findIndex(p => p.id === post.id));
  };

  // Show loading screen with matrix rain
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0D1117] overflow-hidden flex items-center justify-center">
        {/* Matrix Rain Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <SimpleMatrixRain />
        </div>

        {/* Loading indicator */}
        <div className="relative z-10 text-center">
          <div className="font-mono text-[#00ff88] text-xl mb-4 animate-pulse">
            Loading Blog System...
          </div>
          <div className="font-mono text-gray-500 text-sm">
            <span className="inline-block animate-pulse">█</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#0D1117] overflow-hidden"
    >
      {/* Minimal Header - Logo + Terminal Menu (compact) */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0D1117]/80 backdrop-blur-sm border-b border-[#00ff88]/10">
        <Link href="/" className="blog-header-logo text-[#00ff88] font-mono text-base sm:text-lg md:text-xl hover:text-[#00d4ff] transition-colors">
          AS_
        </Link>
        {/* compact prop ensures Navigation only shows the terminal toggle (no full nav links) */}
        <div className="blog-header-nav">
          <Navigation compact />
        </div>
      </header>

      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <SimpleMatrixRain />
      </div>

  {/* Main Container - with top padding for header */}
  <div className="relative z-10 h-full flex flex-col lg:flex-row pt-14 md:pt-16">
        {/* Left Panel - Navigation */}
        <div className="category-panel-container w-full lg:w-[35%] xl:w-[30%] h-[50vh] lg:h-full flex-shrink-0 relative overflow-hidden">
          <CategoryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            hoveredCategory={hoveredCategory}
            onCategorySelect={setSelectedCategory}
            onCategoryHover={setHoveredCategory}
            isLoading={isLoading}
            posts={allPosts}
            onPostSelect={handlePostSelect}
            selectedPost={selectedPost}
          />
        </div>

        {/* Right Panel - Content Preview (Desktop and Tablet landscape) */}
        <div className="content-preview-container hidden lg:flex lg:w-[65%] xl:w-[70%] h-full">
          <ContentPreview post={selectedPost} />
        </div>

        {/* Mobile Content Preview (below categories) */}
        <div className="content-preview-container lg:hidden w-full h-[50vh] overflow-hidden">
          <ContentPreview post={selectedPost} />
        </div>
      </div>

      {/* Keyboard shortcuts hint - Hidden on mobile */}
      <div className="hidden md:block fixed bottom-4 left-4 font-mono text-xs text-gray-600 space-y-1 z-20">
        <div>↑↓ Navigate</div>
        <div>Enter Open</div>
        <div>Esc Close</div>
      </div>

      {/* Terminal Cursor Effect */}
      <div className="fixed bottom-4 right-4 font-mono text-[#00ff88] text-sm opacity-50 pointer-events-none">
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}
