"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { BlogCategory, BlogPost } from './BlogInterface';

interface CategoryPanelProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  hoveredCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onCategoryHover: (categoryId: string | null) => void;
  onPostSelect: (post: BlogPost) => void;
  posts: BlogPost[];
  isLoading: boolean;
  selectedPost: BlogPost | null;
}

type CompilationStage = 'idle' | 'compiling' | 'success' | 'displaying';

export default function CategoryPanel({
  categories,
  selectedCategory,
  hoveredCategory,
  onCategorySelect,
  onCategoryHover,
  onPostSelect,
  posts,
  isLoading,
  selectedPost,
}: CategoryPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const [morphingText, setMorphingText] = useState<{ [key: string]: string }>({});
  const [compilationStage, setCompilationStage] = useState<CompilationStage>('idle');
  const [compilationOutput, setCompilationOutput] = useState<string[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Entrance animation
  useEffect(() => {
    if (!isLoading && categoriesRef.current.length > 0) {
      gsap.fromTo(
        categoriesRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [isLoading, categories.length]);

  // Text morphing effect on hover
  const morphText = (targetText: string, categoryId: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iterations = 0;
    const maxIterations = targetText.length;

    const interval = setInterval(() => {
      setMorphingText(prev => ({
        ...prev,
        [categoryId]: targetText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(''),
      }));

      iterations += 1;

      if (iterations > maxIterations) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  };

  const handleCategoryHover = (category: BlogCategory, isEntering: boolean) => {
    if (isEntering) {
      onCategoryHover(category.id);
      morphText(category.name, category.id);
    } else {
      onCategoryHover(null);
    }
  };

  // Compilation animation when category is clicked
  const handleCategoryClick = async (category: BlogCategory) => {
    if (selectedCategory === category.id) {
      // Deselect
      onCategorySelect('');
      setCompilationStage('idle');
      setDisplayedPosts([]);
      setCompilationOutput([]);
      return;
    }

    onCategorySelect(category.id);
    setCompilationStage('compiling');
    setDisplayedPosts([]);
    setCompilationOutput([]);

    // Create particle explosion
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);

    setTimeout(() => setParticles([]), 1000);

    // Compilation output lines
    const categoryName = category.name.toLowerCase();
    const lines = [
      `$ cd ~/blog/${categoryName}`,
      ``,
      `Compiling blog posts...`,
      `[████████████████████] 100%`,
      ``,
      `✓ Found ${posts.length} posts`,
      `✓ Syntax validated`,
      `✓ Metadata parsed`,
      ``,
      `Compilation successful!`,
      ``,
      `Output:`,
    ];

    // Animate compilation output line by line
    for (let i = 0; i < lines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i < 3 ? 100 : 80));
      setCompilationOutput(prev => [...prev, lines[i]]);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setCompilationStage('success');

    // Reveal posts with stagger animation
    await new Promise(resolve => setTimeout(resolve, 200));
    setCompilationStage('displaying');

    for (let i = 0; i < posts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 120));
      setDisplayedPosts(prev => [...prev, posts[i]]);
    }
  };

  const handlePostClick = (post: BlogPost) => {
    onPostSelect(post);

    // Flash effect
    if (outputRef.current) {
      gsap.fromTo(
        outputRef.current,
        { backgroundColor: 'rgba(0, 255, 136, 0.1)' },
        { backgroundColor: 'transparent', duration: 0.3 }
      );
    }
  };

  return (
    <div
      ref={panelRef}
      className="h-full bg-[#0D1117] border-r-2 border-[#00ff88]/30 flex flex-col overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="font-mono text-xs md:text-sm text-[#00ff88]/70 ml-4">
          blog@terminal:~/categories
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories Section */}
        <div className={`transition-all duration-500 ${selectedCategory ? 'h-auto' : 'flex-1'} overflow-y-auto p-4 custom-scrollbar`}>
          {/* Terminal Prompt */}
          <div className="font-mono text-xs md:text-sm text-gray-400 mb-4">
            <span className="text-[#00ff88]">user@blog</span>
            <span className="text-[#ff8c00]">:</span>
            <span className="text-[#00d4ff]">~/categories</span>
            <span className="text-gray-400">$ ls -la</span>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-[#00ff88] font-mono text-sm animate-pulse">
                Loading categories...
              </div>
            ) : (
              categories.map((category, index) => {
                const isActive = category.id === selectedCategory;
                const isHovered = category.id === hoveredCategory;
                const displayName = morphingText[category.id] || category.name;

                return (
                  <div
                    key={category.id}
                    ref={(el) => {
                      if (el) categoriesRef.current[index] = el;
                    }}
                    className="relative group"
                    onMouseEnter={() => handleCategoryHover(category, true)}
                    onMouseLeave={() => handleCategoryHover(category, false)}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div
                      className={`
                        font-mono text-sm cursor-pointer
                        transition-all duration-300 p-3 rounded-lg
                        border relative overflow-hidden
                        ${isActive
                          ? 'bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                          : 'border-transparent hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5'
                        }
                      `}
                    >
                      {/* Scanline effect on active */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/10 to-transparent animate-scanline pointer-events-none" />
                      )}

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center space-x-3">
                          {/* Active indicator */}
                          {isActive && (
                            <span className="text-[#00ff88] animate-pulse">
                              {'▶'}
                            </span>
                          )}

                          {/* Directory indicator */}
                          <span className="text-[#00d4ff] text-xs">drwxr-xr-x</span>

                          {/* Category name */}
                          <span
                            className={`
                              font-bold tracking-wider text-base md:text-lg
                              ${isActive ? 'text-[#00ff88]' : 'text-gray-300'}
                              ${isHovered ? 'text-[#00ff88]' : ''}
                            `}
                          >
                            [{displayName}]
                          </span>
                        </div>

                        {/* Post count */}
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-xs">
                            {category.post_count} posts
                          </span>
                        </div>
                      </div>

                      {/* Particles on click */}
                      {isActive && particles.map(particle => (
                        <div
                          key={particle.id}
                          className="absolute w-1 h-1 bg-[#00ff88] rounded-full pointer-events-none"
                          style={{
                            left: '50%',
                            top: '50%',
                            animation: `particleExplode 1s ease-out forwards`,
                            transform: `translate(${particle.x}px, ${particle.y}px)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Compilation Output & Posts Display */}
        {selectedCategory && (
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto border-t-2 border-[#00ff88]/30 bg-[#0a0e13] custom-scrollbar"
          >
            <div className="p-4 space-y-2">
              {/* Compilation Output */}
              {compilationStage !== 'idle' && (
                <div className="font-mono text-xs space-y-1 mb-4">
                  {compilationOutput.map((line, index) => (
                    <div
                      key={index}
                      className={`
                        ${line.startsWith('$') ? 'text-[#00ff88]' : ''}
                        ${line.startsWith('✓') ? 'text-[#00ff88]' : 'text-gray-400'}
                        ${line.startsWith('[') ? 'text-[#ff8c00]' : ''}
                        ${line === 'Compilation successful!' ? 'text-[#00ff88] font-bold' : ''}
                        ${line === 'Output:' ? 'text-[#00d4ff] font-bold mt-2' : ''}
                      `}
                    >
                      {line || '\u00A0'}
                    </div>
                  ))}
                </div>
              )}

              {/* Posts List */}
              {compilationStage === 'displaying' && (
                <div className="space-y-3">
                  {displayedPosts.map((post, index) => {
                    const isSelected = selectedPost?.id === post.id;
                    const isHovered = hoveredPost === post.id;

                    return (
                      <div
                        key={post.id}
                        className={`
                          font-mono text-sm p-4 rounded-lg border cursor-pointer
                          transition-all duration-300 relative overflow-hidden
                          ${isSelected
                            ? 'bg-[#00ff88]/20 border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                            : 'border-gray-700 hover:border-[#00ff88]/60 hover:bg-[#00ff88]/10'
                          }
                        `}
                        style={{
                          animation: `slideInFromLeft 0.4s ease-out ${index * 0.05}s both`,
                        }}
                        onClick={() => handlePostClick(post)}
                        onMouseEnter={() => setHoveredPost(post.id)}
                        onMouseLeave={() => setHoveredPost(null)}
                      >
                        {/* Glitch effect on hover */}
                        {(isHovered || isSelected) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00ff88]/5 animate-pulse pointer-events-none" />
                        )}

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {isSelected && (
                                <span className="text-[#00ff88] text-lg">→</span>
                              )}
                              <span className="text-[#00d4ff] text-xs">-rw-r--r--</span>
                              <span className={`font-medium ${isSelected ? 'text-[#00ff88] text-base' : 'text-gray-200 text-sm'}`}>
                                {post.title}.md
                              </span>
                            </div>
                            <span className="text-gray-400 text-xs font-medium">
                              {post.date.split(',')[0]}
                            </span>
                          </div>

                          {(isHovered || isSelected) && (
                            <div className="text-gray-300 text-xs ml-8 mt-2 leading-relaxed line-clamp-2">
                              {post.description}
                            </div>
                          )}

                          {isSelected && (
                            <div className="flex flex-wrap items-center gap-2 ml-8 mt-3">
                              <span className="text-[#ff8c00] text-xs px-2 py-1 bg-[#ff8c00]/10 rounded">
                                ⏱️ {post.reading_time} min read
                              </span>
                              {post.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[#8b5cf6] text-xs px-2 py-1 bg-[#8b5cf6]/10 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 font-mono text-[10px] text-gray-500 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span>
            {selectedCategory ? 'Click post to preview' : 'Click category to compile'}
          </span>
          <span className="text-[#00ff88] animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
}
