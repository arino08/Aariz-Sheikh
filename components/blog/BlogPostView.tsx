"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navigation from '@/components/ui/Navigation';
import SimpleMatrixRain from './SimpleMatrixRain';
import type { BlogPost as DBBlogPost, ContentBlock } from '@/lib/supabaseClient';

interface BlogPostViewProps {
  post: DBBlogPost;
}

export default function BlogPostView({ post }: BlogPostViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Entrance animation
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    // Scroll progress
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    if (!post.content) return null;

    // If content is string (old format), render as HTML
    if (typeof post.content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
    }

    // If content is ContentBlock array, render blocks
    const blocks = post.content as ContentBlock[];
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-300 leading-relaxed mb-4">
              {block.text}
            </p>
          );
        case 'heading':
          const level = block.level || 2;
          const headingClasses: Record<number, string> = {
            1: 'text-3xl md:text-4xl font-bold text-[#00ff88] mb-6 mt-8',
            2: 'text-2xl md:text-3xl font-bold text-[#00ff88] mb-4 mt-6',
            3: 'text-xl md:text-2xl font-bold text-[#00d4ff] mb-3 mt-5',
            4: 'text-lg md:text-xl font-bold text-[#00d4ff] mb-3 mt-4',
            5: 'text-base md:text-lg font-bold text-[#00d4ff] mb-2 mt-3',
            6: 'text-sm md:text-base font-bold text-[#00d4ff] mb-2 mt-3',
          };
          const className = headingClasses[level] || headingClasses[2];

          if (level === 1) {
            return <h1 key={index} className={className}>{block.text}</h1>;
          } else if (level === 2) {
            return <h2 key={index} className={className}>{block.text}</h2>;
          } else if (level === 3) {
            return <h3 key={index} className={className}>{block.text}</h3>;
          } else if (level === 4) {
            return <h4 key={index} className={className}>{block.text}</h4>;
          } else if (level === 5) {
            return <h5 key={index} className={className}>{block.text}</h5>;
          } else {
            return <h6 key={index} className={className}>{block.text}</h6>;
          }
        case 'code':
          return (
            <div key={index} className="mb-6">
              <pre className="bg-[#161b22] border border-[#00ff88]/20 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-[#00ff88] font-mono">
                  {block.code}
                </code>
              </pre>
              {block.language && (
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  Language: {block.language}
                </div>
              )}
            </div>
          );
        case 'list':
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <ListTag
              key={index}
              className={`${
                block.ordered ? 'list-decimal' : 'list-disc'
              } list-inside space-y-2 mb-4 text-gray-300`}
            >
              {block.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          );
        case 'quote':
          return (
            <blockquote
              key={index}
              className="border-l-4 border-[#00ff88] pl-4 italic text-gray-400 my-6"
            >
              {block.text}
              {block.author && (
                <footer className="text-sm text-gray-500 mt-2 not-italic">
                  — {block.author}
                </footer>
              )}
            </blockquote>
          );
        case 'image':
          return (
            <div key={index} className="my-6">
              <img
                src={block.src}
                alt={block.alt || 'Blog image'}
                className="w-full rounded-lg border border-[#00ff88]/20"
              />
              {block.caption && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  {block.caption}
                </p>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0D1117] relative">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <SimpleMatrixRain />
      </div>

      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 bg-[#0D1117]/90 backdrop-blur-md border-b border-[#00ff88]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/blog" className="text-[#00ff88] font-mono text-base sm:text-lg hover:text-[#00d4ff] transition-colors">
            ← Back to Blog
          </Link>
          <Navigation compact />
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#00ff88] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <article ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-8 sm:mb-12 rounded-lg overflow-hidden border border-[#00ff88]/20">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-48 sm:h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00ff88] mb-4 sm:mb-6 font-mono">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-lg sm:text-xl text-gray-400 mb-4 sm:mb-6">
                {post.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-mono">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.reading_time || 5} min read
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] text-xs sm:text-sm font-mono rounded border border-[#00ff88]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-sm sm:text-base md:text-lg">
              {renderContent()}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 pt-8 border-t border-gray-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#00ff88] hover:text-[#00d4ff] transition-colors font-mono text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all posts
            </Link>
          </footer>
        </article>
      </main>

      {/* Terminal Cursor */}
      <div className="fixed bottom-4 right-4 font-mono text-[#00ff88] text-sm opacity-50 pointer-events-none">
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}
