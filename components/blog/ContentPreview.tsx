"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import type { BlogPost } from './BlogInterface';

interface ContentPreviewProps {
  post: BlogPost | null;
}

export default function ContentPreview({ post }: ContentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typing animation for title
  useEffect(() => {
    if (!post || !titleRef.current) return;

    setIsTyping(true);
    setDisplayedTitle('');

    let currentIndex = 0;
    const title = post.title;

    const typingInterval = setInterval(() => {
      if (currentIndex <= title.length) {
        setDisplayedTitle(title.substring(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [post]);

  // Content transition animation
  useEffect(() => {
    if (!post || !contentRef.current) return;

    // Matrix transition effect
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-[#0D1117] z-20';
    overlay.style.opacity = '0';
    containerRef.current?.appendChild(overlay);

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.remove();
      },
    });

    tl.to(overlay, {
      opacity: 1,
      duration: 0.2,
    })
      .to(overlay, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
      });

    // Fade in content
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      }
    );
  }, [post]);

  if (!post) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="font-mono text-[#00ff88] text-xl mb-4 animate-pulse">
            $ ./select_post.sh
          </div>
          <p className="text-gray-400 font-mono text-sm">
            Select a category and post to view preview
          </p>
          <div className="mt-8 text-6xl opacity-20">
            📝
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full p-4 md:p-8 overflow-y-auto custom-scrollbar relative"
    >
      {/* Terminal Window Container */}
      <div className="max-w-4xl mx-auto bg-[#161b22] border-2 border-[#00ff88]/30 rounded-lg overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0D1117] border-b border-[#00ff88]/30">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-xs md:text-sm text-[#00ff88]/70 ml-4">
              preview/{post.slug}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="hidden md:inline">⏱️ {post.reading_time} min</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-6 md:p-8">
          {/* Cover Image with ASCII Border */}
          {post.cover_image && (
            <div className="mb-8 relative group">
              <div className="absolute -inset-1 border border-[#00ff88]/20 rounded-lg pointer-events-none group-hover:border-[#00ff88]/40 transition-colors" />
              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#161b22]">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  loading="lazy"
                  quality={85}
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/60 to-transparent" />
              </div>

              {/* ASCII art corners */}
              <div className="absolute -top-2 -left-2 text-[#00ff88] font-mono text-xs opacity-50 z-10">
                ╔══
              </div>
              <div className="absolute -top-2 -right-2 text-[#00ff88] font-mono text-xs opacity-50 z-10">
                ══╗
              </div>
              <div className="absolute -bottom-2 -left-2 text-[#00ff88] font-mono text-xs opacity-50 z-10">
                ╚══
              </div>
              <div className="absolute -bottom-2 -right-2 text-[#00ff88] font-mono text-xs opacity-50 z-10">
                ══╝
              </div>
            </div>
          )}

          {/* Title with Typing Animation */}
          <h1
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#00ff88] font-mono"
          >
            {displayedTitle}
            {isTyping && (
              <span className="animate-pulse text-[#00ff88]">█</span>
            )}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-700">
            <div className="font-mono text-xs text-gray-400">
              <span className="text-[#ff8c00]">category:</span>{' '}
              <span className="text-[#00d4ff]">{post.category}</span>
            </div>
            <div className="font-mono text-xs text-gray-400">
              <span className="text-[#ff8c00]">date:</span>{' '}
              <span className="text-gray-300">{post.date}</span>
            </div>
            <div className="font-mono text-xs text-gray-400">
              <span className="text-[#ff8c00]">reading_time:</span>{' '}
              <span className="text-gray-300">{post.reading_time} min</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="font-mono text-xs px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="font-mono text-xs text-[#ff8c00] mb-2">
              {'//'} Description
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {post.description}
            </p>
          </div>

          {/* Render content blocks */}
          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-6 mb-8">
            {Array.isArray(post.content)
              ? post.content.map((block, idx: number) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p key={idx} className="text-gray-300">
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === 'image' && block.src) {
                    return (
                      <figure key={idx} className="mx-0">
                        <div className="relative w-full aspect-video rounded overflow-hidden bg-[#0f1519]">
                          <Image
                            src={block.src}
                            alt={block.alt || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            loading="lazy"
                            quality={85}
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-xs text-gray-400 font-mono">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  // Unknown block fallback: render JSON
                  return (
                    <pre key={idx} className="text-xs text-gray-500 p-3 bg-[#0b0f11] rounded">
                      {JSON.stringify(block)}
                    </pre>
                  );
                })
              : // fallback to legacy raw content string
                <div className="text-gray-300 whitespace-pre-wrap">{post.content}</div>}
          </div>

          {/* Terminal Output Simulation */}
          <div className="bg-[#0D1117] rounded-lg p-4 mb-8 border border-gray-700">
            <div className="font-mono text-xs space-y-2">
              <div className="text-gray-500">
                <span className="text-[#00ff88]">$</span> cat {post.slug}.md
              </div>
              <div className="text-gray-400 pl-4">
                Loading full article...
              </div>
              <div className="text-gray-500 pl-4">
                Status: <span className="text-[#00ff88]">Ready to read</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`/blog/${post.slug}`}
              className="group relative flex-1 sm:flex-none font-mono text-sm md:text-base bg-[#00ff88] text-[#0D1117] px-8 py-4 rounded-lg hover:bg-[#00ff88]/90 transition-all duration-300 font-bold overflow-hidden block text-center"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="group-hover:hidden">$ read --full</span>
                <span className="hidden group-hover:inline">→ Open Article</span>
              </span>
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-full animate-scanline opacity-0 group-hover:opacity-100" />
            </a>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.description,
                    url: `/blog/${post.slug}`,
                  });
                } else {
                  navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
                  alert('Link copied to clipboard!');
                }
              }}
              className="font-mono text-sm md:text-base border-2 border-[#00d4ff] text-[#00d4ff] px-6 py-4 rounded-lg hover:bg-[#00d4ff] hover:text-[#0D1117] transition-all duration-300"
            >
              <span className="hidden sm:inline">$ share --post</span>
              <span className="sm:hidden">Share</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0D1117] border-t border-[#00ff88]/30">
          <div className="font-mono text-xs text-gray-500 flex items-center justify-between">
            <span>End of preview</span>
            <span className="text-[#00ff88] animate-pulse">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}
