'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavigationPanel from './NavigationPanel';
import StoryCard from './StoryCard';
import { certificationData } from '@/lib/certificationsData';

export default function CertificationsView() {
  const [selectedId, setSelectedId] = useState<string>(certificationData.certifications[0].id);

  const selectedCertification = certificationData.certifications.find(
    cert => cert.id === selectedId
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#00ff88] hover:text-[#00d4ff] transition-colors font-mono text-sm"
            >
              <span>←</span>
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold mt-2 font-mono">
              <span className="text-[#00ff88]">Certifications</span>
              <span className="text-[#8b949e]"> / Learning Journey</span>
            </h1>
          </div>

          {/* Stats Badge */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 bg-[#238636]/20 border border-[#238636] rounded text-[#00ff88]">
              {certificationData.stats.completedCount}/{certificationData.stats.totalCertifications} Completed
            </div>
            <div className="px-3 py-1.5 bg-[#0077b5]/20 border border-[#0077b5] rounded text-[#00d4ff]">
              {certificationData.stats.totalStudyHours}+ Study Hours
            </div>
            <div className="px-3 py-1.5 bg-[#8b5cf6]/20 border border-[#8b5cf6] rounded text-[#8b5cf6]">
              {certificationData.stats.projectsEnabled} Projects Built
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Panel Layout */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Panel - Navigation (42%) */}
        <aside className="w-full lg:w-[42%] xl:w-[38%] border-r border-[#30363d]">
          <NavigationPanel
            certifications={certificationData.certifications}
            stats={certificationData.stats}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* Right Panel - Story Card (58%) */}
        <main className="hidden lg:block flex-1 bg-[#0D1117] overflow-hidden">
          {selectedCertification && (
            <StoryCard certification={selectedCertification} />
          )}
        </main>
      </div>

      {/* Mobile Story Card (Bottom Sheet) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 top-20 bg-[#0D1117] overflow-hidden">
        {selectedCertification && (
          <StoryCard certification={selectedCertification} />
        )}
      </div>
    </div>
  );
}
