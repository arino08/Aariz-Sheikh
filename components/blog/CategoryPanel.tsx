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
  isLoading: boolean;
  posts: BlogPost[];
  onPostSelect: (post: BlogPost) => void;
  selectedPost: BlogPost | null;
}

export default function CategoryPanel({
  categories,
  selectedCategory,
  hoveredCategory,
  onCategorySelect,
  onCategoryHover,
  isLoading,
  posts,
  onPostSelect,
  selectedPost,
}: CategoryPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement[]>([]);
  const [morphingText, setMorphingText] = useState<{ [key: string]: string }>({});
  const [activePostIndex, setActivePostIndex] = useState(0);
  const autoRotateInterval = useRef<NodeJS.Timeout | null>(null);

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

  const handleCategoryClick = (categoryId: string) => {
    const isCurrentlySelected = categoryId === selectedCategory;
    onCategorySelect(isCurrentlySelected ? '' : categoryId);
    if (!isCurrentlySelected) {
      setActivePostIndex(0);
    }
  };

  // 3D Cylinder rotation for posts
  useEffect(() => {
    if (selectedCategory && posts.length > 0) {
      // Auto-rotate every 3 seconds
      autoRotateInterval.current = setInterval(() => {
        setActivePostIndex((prev) => (prev + 1) % posts.length);
      }, 3000);
    }

    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [selectedCategory, posts.length]);

  // Update selected post when active index changes
  useEffect(() => {
    if (posts[activePostIndex]) {
      onPostSelect(posts[activePostIndex]);
    }
  }, [activePostIndex, posts, onPostSelect]);

  const handlePostClick = (index: number) => {
    setActivePostIndex(index);
    if (autoRotateInterval.current) {
      clearInterval(autoRotateInterval.current);
    }
  };

  // Calculate 3D cylinder positions
  const calculateCylinderPosition = (index: number, total: number) => {
    const anglePerItem = 360 / Math.max(total, 5); // Minimum 5 slots for spacing
    const currentAngle = (index - activePostIndex) * anglePerItem;
    const radius = 150; // Cylinder radius in pixels

    return {
      rotateX: currentAngle,
      translateZ: radius,
    };
  };

  const filteredPosts = posts.filter(post => post.category === selectedCategory);

  return (
    <div
      ref={panelRef}
      className="h-full bg-[#0D1117] border-r-2 border-[#00ff88]/30 flex flex-col overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 p-4 md:p-6 pb-4 flex-shrink-0 border-b border-gray-800">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="font-mono text-xs md:text-sm text-[#00ff88]/70 ml-4">
          blog@terminal:~/categories
        </div>
      </div>

      {/* Terminal Prompt */}
      <div className="font-mono text-xs md:text-sm text-gray-400 px-4 md:px-6 pt-4 pb-2 flex-shrink-0">
        <span className="text-[#00ff88]">aariz@blog</span>
        <span className="text-[#ff8c00]">:</span>
        <span className="text-[#00d4ff]">~/categories</span>
        <span className="text-gray-400">$ tree -L 2</span>
      </div>

      {/* Categories Tree List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-[#00ff88] font-mono text-sm animate-pulse">
            Loading categories...
          </div>
        ) : (
          <div className="space-y-1 font-mono text-xs md:text-sm">
            {categories.map((category, index) => {
              const isActive = category.id === selectedCategory;
              const isHovered = category.id === hoveredCategory;
              const displayName = morphingText[category.id] || category.name;
              const isLast = index === categories.length - 1;

              return (
                <div
                  key={category.id}
                  ref={(el) => {
                    if (el) categoriesRef.current[index] = el;
                  }}
                  className="relative"
                >
                  {/* Category Line with Tree Branch */}
                  <div
                    className={`
                      flex items-center cursor-pointer group
                      transition-all duration-200
                      ${isActive ? 'text-[#00ff88]' : 'text-gray-400'}
                      hover:text-[#00ff88]
                    `}
                    onMouseEnter={() => handleCategoryHover(category, true)}
                    onMouseLeave={() => handleCategoryHover(category, false)}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {/* Tree branch characters */}
                    <span className="text-gray-600 mr-2">
                      {isLast ? '└──' : '├──'}
                    </span>

                    {/* Folder icon */}
                    <span className={`mr-2 ${isActive ? 'text-[#00ff88]' : 'text-[#00d4ff]'}`}>
                      {isActive ? '📂' : '📁'}
                    </span>

                    {/* Category name */}
                    <span className={`font-bold ${isActive ? 'text-[#00ff88]' : ''}`}>
                      {displayName}
                    </span>

                    {/* Post count badge */}
                    <span className="ml-2 text-[10px] text-gray-500">
                      ({category.post_count})
                    </span>

                    {/* Icon */}
                    <span className="ml-2">{category.icon}</span>
                  </div>

                  {/* Expanded Blog List - 3D Cylinder */}
                  {isActive && filteredPosts.length > 0 && (
                    <div className="ml-8 mt-2 mb-4 relative">
                      {/* Tree connector for nested items */}
                      <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-gray-700" />

                      {/* 3D Cylinder Container */}
                      <div
                        className="relative h-[200px] overflow-hidden"
                        style={{
                          perspective: '1000px',
                          perspectiveOrigin: 'center center',
                        }}
                      >
                        <div
                          className="relative w-full h-full"
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: `rotateX(${-activePostIndex * (360 / Math.max(filteredPosts.length, 5))}deg)`,
                            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                          }}
                        >
                          {filteredPosts.map((post, postIndex) => {
                            const position = calculateCylinderPosition(postIndex, filteredPosts.length);
                            const isActivePost = postIndex === activePostIndex;
                            const distanceFromActive = Math.abs(postIndex - activePostIndex);
                            const opacity = isActivePost ? 1 : Math.max(0.2, 1 - distanceFromActive * 0.3);

                            return (
                              <div
                                key={post.id}
                                className={`
                                  absolute inset-x-0 cursor-pointer
                                  transition-all duration-300
                                  ${isActivePost ? 'z-10' : 'z-0'}
                                `}
                                style={{
                                  transform: `rotateX(${position.rotateX}deg) translateZ(${position.translateZ}px)`,
                                  transformStyle: 'preserve-3d',
                                  backfaceVisibility: 'hidden',
                                  opacity,
                                  top: '50%',
                                  marginTop: '-12px',
                                }}
                                onClick={() => handlePostClick(postIndex)}
                              >
                                {/* Post Item */}
                                <div
                                  className={`
                                    flex items-center space-x-2 p-2 rounded
                                    transition-all duration-300
                                    ${isActivePost
                                      ? 'bg-[#00ff88]/10 border-l-2 border-[#00ff88] text-[#00ff88]'
                                      : 'text-gray-500 hover:text-gray-300'
                                    }
                                  `}
                                >
                                  {/* Tree branch for post */}
                                  <span className="text-gray-600 text-[10px]">
                                    {postIndex === filteredPosts.length - 1 ? '└─' : '├─'}
                                  </span>

                                  {/* File icon */}
                                  <span className="text-[10px]">
                                    {isActivePost ? '📄' : '📃'}
                                  </span>

                                  {/* Post title */}
                                  <span className="text-[10px] md:text-xs truncate flex-1">
                                    {post.title}.md
                                  </span>

                                  {/* Date */}
                                  <span className="text-[8px] text-gray-600">
                                    {post.date.split(',')[0]}
                                  </span>
                                </div>

                                {/* Reading time indicator on active */}
                                {isActivePost && (
                                  <div className="ml-8 mt-1 text-[8px] text-[#00ff88]/70">
                                    ⏱️ {post.reading_time} min
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Gradient fades */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0D1117] to-transparent pointer-events-none z-20" />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none z-20" />
                      </div>

                      {/* Controls hint */}
                      <div className="mt-2 text-[8px] text-gray-600 flex items-center justify-between">
                        <span>Click to select • Auto-rotating</span>
                        <span>{activePostIndex + 1}/{filteredPosts.length}</span>
                      </div>
                    </div>
                  )}

                  {/* Matrix particles on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-px h-8 bg-[#00ff88] opacity-30 animate-matrixFall"
                          style={{
                            left: `${20 + i * 30}%`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 pb-4 px-4 md:px-6 border-t border-gray-800 font-mono text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-[#00ff88] animate-pulse">█</span>
          <span>{selectedCategory ? 'Rotating posts...' : 'Expand a category to view posts'}</span>
        </div>
      </div>
    </div>
  );
}
