'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Certification, CertificationStats } from '@/types/certifications';

interface NavigationPanelProps {
  certifications: Certification[];
  stats: CertificationStats;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function NavigationPanel({
  certifications,
  stats,
  selectedId,
  onSelect
}: NavigationPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
      h-full bg-[#0D1117] border-r border-[#30363d]
      flex flex-col overflow-hidden
      transition-all duration-300 ease-out
      ${isCollapsed ? 'w-16' : 'w-full'}
    `}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {!isCollapsed && (
            <div className="ml-3 font-mono text-xs text-[#8b949e]">
              <span className="text-[#00ff88]">aariz@student-dev</span>
              <span className="text-[#ff8c00]">:</span>
              <span className="text-[#00d4ff]">certifications</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#8b949e] hover:text-[#00ff88] transition-colors lg:hidden"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Progress Stats Section */}
          <div className="px-4 py-4 border-b border-[#30363d]">
            <h2 className="font-mono text-sm font-semibold text-[#00ff88] mb-3 flex items-center gap-2">
              🎓 LEARNING JOURNEY OVERVIEW
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[#8b949e]">
                <div className="text-[#00d4ff] mb-1.5">📊 Progress Stats:</div>
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span>├─ Certifications Earned:</span>
                    <span className="text-[#00ff88]">{stats.completedCount}/{stats.totalCertifications} planned</span>
                  </div>
                  <div className="flex justify-between">
                    <span>├─ Study Hours Invested:</span>
                    <span className="text-[#00ff88]">{stats.totalStudyHours}+ hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>├─ Projects Enabled:</span>
                    <span className="text-[#00ff88]">{stats.projectsEnabled} deployed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>└─ Academic Integration:</span>
                    <span className="text-[#00ff88]">{stats.coursesEnhanced} courses enhanced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Portfolio List */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <h2 className="font-mono text-sm font-semibold text-[#00ff88] mb-3 flex items-center gap-2">
              🏆 CERTIFICATION PORTFOLIO
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => {
                const isSelected = cert.id === selectedId;
                const statusIcon =
                  cert.status === 'completed' ? '✨' :
                  cert.status === 'in-progress' ? '🔄' : '📋';

                return (
                  <button
                    key={cert.id}
                    onClick={() => onSelect(cert.id)}
                    className={`
                      w-full text-left px-3 py-2.5 rounded
                      font-mono text-xs
                      transition-all duration-300 ease-out
                      border border-transparent
                      ${isSelected
                        ? 'bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.2)] scale-[1.02]'
                        : 'hover:bg-[#30363d]/50 hover:border-[#30363d] hover:scale-[1.01] hover:shadow-lg'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm flex-shrink-0">{cert.icon}</span>
                        <div className="min-w-0">
                          <div className={`font-semibold truncate ${
                            isSelected ? 'text-[#00ff88]' : 'text-[#c9d1d9]'
                          }`}>
                            {cert.title}
                          </div>
                          <div className="text-[#8b949e] text-[10px] mt-0.5">
                            {cert.issuer}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] text-[#8b949e]">{cert.issueDate}</span>
                        <span className="text-xs">{statusIcon}</span>
                      </div>
                    </div>
                    {cert.status === 'completed' && cert.score && (
                      <div className="mt-2 pt-2 border-t border-[#30363d]/50">
                        <div className="text-[10px] text-[#8b949e]">
                          Score: <span className="text-[#00ff88]">{cert.score}</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-1.5 text-[10px] text-[#8b949e]">
                      └─ {cert.story.theSpark.slice(0, 60)}...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="px-4 py-3 border-t border-[#30363d] bg-[#161b22]">
            <div className="text-[10px] font-mono text-[#00ff88] mb-2">
              💡 Click any certification to explore the story
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="px-2 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-mono rounded transition-colors"
              >
                📧 Contact
              </Link>
              <Link
                href="#"
                className="px-2 py-1 bg-[#8b5cf6] hover:bg-[#9d6fff] text-white text-[10px] font-mono rounded transition-colors"
              >
                📄 Resume
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="px-2 py-1 bg-[#0077b5] hover:bg-[#0088cc] text-white text-[10px] font-mono rounded transition-colors"
              >
                🔗 LinkedIn
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="px-2 py-1 bg-[#30363d] hover:bg-[#484f58] text-white text-[10px] font-mono rounded transition-colors"
              >
                💻 GitHub
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
