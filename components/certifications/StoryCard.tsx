'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Certification } from '@/types/certifications';

interface StoryCardProps {
  certification: Certification;
}

export default function StoryCard({ certification }: StoryCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(false);
    setTypingComplete(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    const typingTimer = setTimeout(() => setTypingComplete(true), 1200);
    return () => {
      clearTimeout(timer);
      clearTimeout(typingTimer);
    };
  }, [certification.id]);

  const statusColor =
    certification.status === 'completed' ? '#00ff88' :
    certification.status === 'in-progress' ? '#00d4ff' : '#8b949e';

  const statusText =
    certification.status === 'completed' ? 'Completed' :
    certification.status === 'in-progress' ? 'In Progress' : 'Planned';

  return (
    <div className={`
      h-full overflow-y-auto
      transition-all duration-600 ease-out
      ${isVisible
        ? 'opacity-100 translate-x-0 blur-0'
        : 'opacity-0 translate-x-12 blur-sm'
      }
    `}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Terminal Window Header */}
        <div className="bg-[#0D1117] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
          {/* Window Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="font-mono text-xs text-[#8b949e]">
              {certification.id}.story
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Title Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{certification.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-[#00ff88] font-mono">
                    {certification.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#8b949e]">
                    <span>Earned: <span className="text-[#c9d1d9]">{certification.issueDate}</span></span>
                    {certification.score && (
                      <span>Score: <span className="text-[#00ff88]">{certification.score}</span></span>
                    )}
                    <span>Study: <span className="text-[#c9d1d9]">{certification.studyDuration}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1 rounded-full text-xs font-mono border"
                  style={{
                    borderColor: statusColor,
                    backgroundColor: `${statusColor}20`,
                    color: statusColor
                  }}
                >
                  {statusText}
                </div>
                <div className="text-xs font-mono text-[#8b949e]">
                  {certification.issuer}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

            {/* The Student Journey Section */}
            <section className={`
              space-y-4 transition-all duration-500 delay-100
              ${typingComplete ? 'opacity-100' : 'opacity-0'}
            `}>
              <h2 className="text-lg font-bold text-[#00d4ff] font-mono border-l-4 border-[#00d4ff] pl-3">
                THE STUDENT JOURNEY
              </h2>

              <div className="space-y-4 pl-4">
                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">💡 THE SPARK:</div>
                  <p className="text-[#c9d1d9] leading-relaxed italic">
                    &ldquo;{certification.story.theSpark}&rdquo;
                  </p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">📚 THE DEDICATION:</div>
                  <ul className="space-y-1.5">
                    {certification.story.theDedication.map((item, index) => (
                      <li
                        key={index}
                        className="text-[#c9d1d9] text-sm flex items-start gap-2 transition-all duration-300"
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <span className="text-[#00ff88] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">🚀 THE BREAKTHROUGH:</div>
                  <p className="text-[#c9d1d9] leading-relaxed italic">
                    &ldquo;{certification.story.theBreakthrough}&rdquo;
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

            {/* Skills & Impact Section */}
            <section className={`
              space-y-4 transition-all duration-500 delay-200
              ${typingComplete ? 'opacity-100' : 'opacity-0'}
            `}>
              <h2 className="text-lg font-bold text-[#00d4ff] font-mono border-l-4 border-[#00d4ff] pl-3">
                SKILLS & IMPACT
              </h2>

              <div className="space-y-4 pl-4">
                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">🛠️ Technical Skills Mastered:</div>
                  <div className="flex flex-wrap gap-2">
                    {certification.skillsMastered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#238636]/20 border border-[#238636] text-[#00ff88] text-xs font-mono rounded hover:bg-[#238636]/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">📈 Academic Integration:</div>
                  <ul className="space-y-1.5">
                    {certification.academicIntegration.map((item, index) => (
                      <li key={index} className="text-[#c9d1d9] text-sm flex items-start gap-2">
                        <span className="text-[#00d4ff]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#ff8c00] font-mono mb-2">💼 Real-World Application:</div>
                  <ul className="space-y-1.5">
                    {certification.realWorldApplications.map((item, index) => (
                      <li key={index} className="text-[#c9d1d9] text-sm flex items-start gap-2">
                        <span className="text-[#8b5cf6]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Verification & Proof Section */}
            {(certification.verification.certificateUrl ||
              certification.verification.projectLinks?.length ||
              certification.verification.liveDemo) && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

                <section className={`
                  space-y-4 transition-all duration-500 delay-300
                  ${typingComplete ? 'opacity-100' : 'opacity-0'}
                `}>
                  <h2 className="text-lg font-bold text-[#00d4ff] font-mono border-l-4 border-[#00d4ff] pl-3">
                    VERIFICATION & PROOF
                  </h2>

                  <div className="pl-4 flex flex-wrap gap-3">
                    {certification.verification.certificateUrl && (
                      <Link
                        href={certification.verification.certificateUrl}
                        target="_blank"
                        className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-mono rounded transition-all hover:shadow-lg hover:scale-105"
                      >
                        🔗 Verify Certificate
                      </Link>
                    )}
                    {certification.verification.projectLinks?.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#9d6fff] text-white text-sm font-mono rounded transition-all hover:shadow-lg hover:scale-105"
                      >
                        💻 View Project {index + 1}
                      </Link>
                    ))}
                    {certification.verification.liveDemo && (
                      <Link
                        href={certification.verification.liveDemo}
                        className="px-4 py-2 bg-[#0077b5] hover:bg-[#0088cc] text-white text-sm font-mono rounded transition-all hover:shadow-lg hover:scale-105"
                      >
                        🚀 Live Demo
                      </Link>
                    )}
                  </div>
                </section>
              </>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

            {/* Employer Value Proposition */}
            <section className={`
              space-y-4 transition-all duration-500 delay-400
              ${typingComplete ? 'opacity-100' : 'opacity-0'}
            `}>
              <h2 className="text-lg font-bold text-[#00d4ff] font-mono border-l-4 border-[#00d4ff] pl-3">
                WHAT THIS MEANS FOR EMPLOYERS
              </h2>

              <div className="pl-4 space-y-2">
                {certification.employerValue.map((value, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-[#c9d1d9]">
                    <span className="text-[#00ff88] mt-0.5">✅</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
