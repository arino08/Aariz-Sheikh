"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/ui/Navigation";
import Link from "next/link";

interface ProjectDoc {
  id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  title: string;
  short_description: string;
}

export default function ProjectDocsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [docs, setDocs] = useState<ProjectDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProjectDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load project info
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("id, title, short_description")
          .eq("id", projectId)
          .single();

        if (projectError) {
          setError("Project not found");
          setIsLoading(false);
          return;
        }

        setProject(projectData);

        // Load docs for this project
        const { data: docsData, error: docsError } = await supabase
          .from("project_docs")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: true });

        if (docsError) {
          console.error("Error loading docs:", docsError);
          setDocs([]);
        } else {
          setDocs(docsData || []);
          if (docsData && docsData.length > 0) {
            setSelectedDoc(docsData[0]);
          }
        }
      } catch {
        setError("Failed to load documentation");
      }

      setIsLoading(false);
    };

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  // Simple markdown to HTML converter
  const renderMarkdown = (content: string) => {
    const html = content
      // Headers
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-bold text-[var(--terminal-green)] mt-6 mb-3">$1</h3>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-bold text-[var(--terminal-blue)] mt-8 mb-4">$1</h2>',
      )
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>',
      )
      // Bold
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-semibold">$1</strong>',
      )
      // Italic
      .replace(
        /\*(.*?)\*/g,
        '<em class="text-[var(--terminal-purple)]">$1</em>',
      )
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
        return `<pre class="bg-[#0D1117] border border-gray-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-[var(--terminal-green)] font-mono text-sm">${code.trim()}</code></pre>`;
      })
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-[#0D1117] text-[var(--terminal-orange)] px-1.5 py-0.5 rounded font-mono text-sm">$1</code>',
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-[var(--terminal-blue)] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // Unordered lists
      .replace(
        /^\- (.*$)/gm,
        '<li class="text-[var(--code-comment)] ml-4 list-disc">$1</li>',
      )
      // Ordered lists
      .replace(
        /^\d+\. (.*$)/gm,
        '<li class="text-[var(--code-comment)] ml-4 list-decimal">$1</li>',
      )
      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-[var(--terminal-purple)] pl-4 my-4 text-[var(--code-comment)] italic">$1</blockquote>',
      )
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="border-gray-800 my-8" />')
      // Paragraphs
      .replace(
        /\n\n/g,
        '</p><p class="text-[var(--code-comment)] leading-relaxed mb-4">',
      )
      // Line breaks
      .replace(/\n/g, "<br />");

    return `<p class="text-[var(--code-comment)] leading-relaxed mb-4">${html}</p>`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[var(--terminal-green)] font-mono animate-pulse flex items-center gap-3">
          <div className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-bounce" />
          <span>Loading documentation...</span>
          <div
            className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-[var(--terminal-orange)] mb-2">
              {error || "Project not found"}
            </h1>
            <p className="text-[var(--code-comment)] font-mono mb-6">
              The documentation you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/#projects"
              className="font-mono text-sm bg-[var(--terminal-green)] text-[#0D1117] px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/#projects"
              className="font-mono text-sm text-[var(--terminal-green)] hover:underline mb-4 inline-flex items-center gap-2"
            >
              <span>←</span> Back to Projects
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">
              <span className="text-[var(--terminal-green)]">
                {project.title}
              </span>{" "}
              <span className="text-[var(--terminal-orange)]">Docs</span>
            </h1>
            <p className="text-[var(--code-comment)] mt-2 max-w-2xl">
              {project.short_description}
            </p>
          </div>

          {docs.length === 0 ? (
            /* No docs state */
            <div className="bg-[#161B22] border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-white mb-2">
                No documentation yet
              </h2>
              <p className="text-[var(--code-comment)] font-mono">
                Documentation for this project is coming soon.
              </p>
            </div>
          ) : (
            /* Docs layout */
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-[#161B22] border border-gray-800 rounded-xl p-4 sticky top-24">
                  <h3 className="font-mono text-sm text-[var(--terminal-green)] mb-4 flex items-center gap-2">
                    <span>📚</span> Contents
                  </h3>
                  <nav className="space-y-1">
                    {docs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                          selectedDoc?.id === doc.id
                            ? "bg-[var(--terminal-green)]/10 text-[var(--terminal-green)] border border-[var(--terminal-green)]/30"
                            : "text-[var(--code-comment)] hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        {doc.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {selectedDoc ? (
                  <div className="bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden">
                    {/* Doc header */}
                    <div className="bg-[#21262D] px-6 py-4 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
                          </div>
                          <span className="font-mono text-sm text-[var(--code-comment)]">
                            {selectedDoc.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            .md
                          </span>
                        </div>
                        <span className="font-mono text-xs text-[var(--code-comment)]">
                          Updated:{" "}
                          {new Date(
                            selectedDoc.updated_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Doc content */}
                    <div className="p-6 md:p-8">
                      <article
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(selectedDoc.content),
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#161B22] border border-gray-800 rounded-xl p-12 text-center">
                    <p className="text-[var(--code-comment)]">
                      Select a document to view
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono text-xs text-[var(--code-comment)]">
          <p>Documentation powered by Terminal Portfolio</p>
        </div>
      </div>
    </div>
  );
}
