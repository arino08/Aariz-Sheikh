"use client";

import { useState, useEffect } from "react";
import ProjectAdminPanel from "./ProjectAdminPanel";
import BlogAdminContent from "../blog/BlogAdminContent";

interface UnifiedAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnifiedAdminPanel({ isOpen, onClose }: UnifiedAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects');

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock body
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        // Restore original styles and scroll position
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        onClick={onClose}
      />

      {/* Admin Panel */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 md:p-4">
        <div className="bg-[#0D1117] border-2 border-[#00ff88] rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col overscroll-contain">
          {/* Header with Tabs */}
          <div className="bg-[#161b22] border-b border-[#00ff88]/30">
            <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
              <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
                </div>
                <h2 className="ml-0 sm:ml-4 font-mono text-sm md:text-lg font-bold text-[#00ff88] truncate">
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[#00ff88] transition-colors p-1 active:scale-95 flex-shrink-0"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-gray-700">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 px-4 py-3 font-mono text-sm md:text-base transition-colors relative ${
                  activeTab === 'projects'
                    ? 'text-[#00ff88] bg-[#0D1117]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Projects
                {activeTab === 'projects' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff88]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex-1 px-4 py-3 font-mono text-sm md:text-base transition-colors relative ${
                  activeTab === 'blog'
                    ? 'text-[#00ff88] bg-[#0D1117]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Blog Posts
                {activeTab === 'blog' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff88]" />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden overscroll-contain scrollbar-terminal">
            {activeTab === 'projects' && <ProjectAdminPanel />}
            {activeTab === 'blog' && <BlogAdminContent />}
          </div>
        </div>
      </div>
    </>
  );
}
