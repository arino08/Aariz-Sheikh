"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Project, ProjectDoc, ProjectDocInsert } from "@/lib/supabase";

export default function DocsAdminContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [docs, setDocs] = useState<ProjectDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ProjectDoc | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order_index: 0,
  });

  // Filter docs based on search
  const filteredDocs = docs.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(searchLower) ||
      doc.content.toLowerCase().includes(searchLower)
    );
  });

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load docs when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadDocs();
    } else {
      setDocs([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.error("Error loading projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  const loadDocs = async () => {
    if (!selectedProjectId) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("project_docs")
      .select("*")
      .eq("project_id", selectedProjectId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading docs:", error);
    } else {
      setDocs(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("Please select a project first");
      return;
    }

    setIsLoading(true);

    const docData: ProjectDocInsert = {
      project_id: selectedProjectId,
      title: formData.title,
      content: formData.content,
      order_index: formData.order_index,
    };

    if (editingDoc) {
      const { error } = await supabase
        .from("project_docs")
        .update(docData)
        .eq("id", editingDoc.id);

      if (error) {
        alert("Error updating doc: " + error.message);
      } else {
        alert("Documentation updated successfully!");
        resetForm();
        loadDocs();
      }
    } else {
      const { error } = await supabase.from("project_docs").insert([docData]);

      if (error) {
        alert("Error creating doc: " + error.message);
      } else {
        alert("Documentation created successfully!");
        resetForm();
        loadDocs();
      }
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this documentation?")) return;

    const { error } = await supabase.from("project_docs").delete().eq("id", id);

    if (error) {
      alert("Error deleting doc: " + error.message);
    } else {
      alert("Documentation deleted successfully!");
      loadDocs();
    }
  };

  const handleEdit = (doc: ProjectDoc) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      content: doc.content,
      order_index: doc.order_index,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      order_index: docs.length,
    });
    setEditingDoc(null);
    setShowForm(false);
    setShowPreview(false);
  };

  // File upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown") && file.type !== "text/markdown" && file.type !== "text/plain") {
      alert("Please upload a markdown (.md) or text file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Extract title from filename or first heading
      let title = file.name.replace(/\.(md|markdown|txt)$/, "");
      const firstHeading = content.match(/^#\s+(.+)$/m);
      if (firstHeading) {
        title = firstHeading[1];
      }
      setFormData((prev) => ({
        ...prev,
        title: prev.title || title,
        content: content,
      }));
    };
    reader.readAsText(file);
  };

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (content: string) => {
    const html = content
      // Headers
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-bold text-[#00ff88] mt-6 mb-3">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-bold text-[#00d4ff] mt-8 mb-4">$1</h2>'
      )
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>'
      )
      // Bold
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-semibold">$1</strong>'
      )
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="text-[#ff8c00]">$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
        return `<pre class="bg-[#0D1117] border border-gray-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-[#00ff88] font-mono text-sm">${code.trim()}</code></pre>`;
      })
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-[#0D1117] text-[#ff8c00] px-1.5 py-0.5 rounded font-mono text-sm">$1</code>'
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-[#00d4ff] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Unordered lists
      .replace(
        /^\- (.*$)/gm,
        '<li class="text-gray-400 ml-4 list-disc">$1</li>'
      )
      // Ordered lists
      .replace(
        /^\d+\. (.*$)/gm,
        '<li class="text-gray-400 ml-4 list-decimal">$1</li>'
      )
      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-[#ff8c00] pl-4 my-4 text-gray-400 italic">$1</blockquote>'
      )
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="border-gray-800 my-8" />')
      // Paragraphs
      .replace(
        /\n\n/g,
        '</p><p class="text-gray-400 leading-relaxed mb-4">'
      )
      // Line breaks
      .replace(/\n/g, "<br />");

    return `<p class="text-gray-400 leading-relaxed mb-4">${html}</p>`;
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Project Selector & Search */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-700 space-y-3">
        {/* Project Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block font-mono text-xs text-gray-400 mb-1">
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
            >
              <option value="">-- Choose a project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {selectedProjectId && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFormData({ title: "", content: "", order_index: docs.length });
                  setEditingDoc(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-[#00ff88] text-black font-mono text-sm rounded hover:bg-[#00d4ff] transition-colors active:scale-95 whitespace-nowrap"
              >
                + New Doc
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        {selectedProjectId && docs.length > 0 && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 pl-10 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 scrollbar-terminal">
        {!selectedProjectId ? (
          /* No project selected */
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="font-mono text-lg text-gray-400 mb-2">
                Select a Project
              </h3>
              <p className="font-mono text-sm text-gray-500">
                Choose a project from the dropdown to manage its documentation
              </p>
            </div>
          </div>
        ) : showForm ? (
          /* Doc Editor Form */
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Editor Panel */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-lg text-[#00ff88]">
                  {editingDoc ? "Edit Documentation" : "New Documentation"}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-3 py-1.5 font-mono text-xs rounded transition-colors ${
                      showPreview
                        ? "bg-[#00d4ff] text-black"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 space-y-4">
                {/* Title */}
                <div>
                  <label className="block font-mono text-xs text-[#00ff88] mb-1">
                    <span className="text-[#ff8c00]">$</span> Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="e.g., Getting Started, API Reference"
                    className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>

                {/* Order Index */}
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1">
                    <span className="text-[#ff8c00]">$</span> Order (lower = first)
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_index: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    className="w-32 bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>

                {/* File Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? "border-[#00ff88] bg-[#00ff88]/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown,.txt,text/markdown,text/plain"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="font-mono text-sm text-gray-400">
                    <span className="text-[#00ff88]">📄 Drop a .md file here</span>
                    <br />
                    <span className="text-xs">or click to browse</span>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="block font-mono text-xs text-[#00ff88] mb-1">
                    <span className="text-[#ff8c00]">$</span> Content (Markdown) *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    placeholder="# Getting Started&#10;&#10;Write your documentation in Markdown...&#10;&#10;## Installation&#10;&#10;```bash&#10;npm install&#10;```"
                    className="flex-1 min-h-[300px] w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors resize-y"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#00ff88] text-black font-mono text-sm rounded hover:bg-[#00d4ff] transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Saving..."
                      : editingDoc
                      ? "Update Doc"
                      : "Create Doc"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-gray-700 text-white font-mono text-sm rounded hover:bg-gray-600 transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="flex-1 min-h-0 flex flex-col bg-[#161b22] border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-[#0D1117] border-b border-gray-700 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
                  </div>
                  <span className="font-mono text-sm text-gray-400">
                    {formData.title.toLowerCase().replace(/\s+/g, "-") || "preview"}.md
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-terminal">
                  {formData.content ? (
                    <article
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(formData.content),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 font-mono text-sm">
                      Start typing to see preview...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Docs List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-lg text-[#00ff88]">
                {selectedProject?.title} Documentation
                <span className="text-gray-500 text-sm ml-2">
                  ({filteredDocs.length}
                  {searchQuery && ` of ${docs.length}`} docs)
                </span>
              </h3>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="font-mono text-sm text-gray-400 animate-pulse">
                  Loading documentation...
                </div>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12 bg-[#161b22] border border-gray-700 rounded-lg">
                <div className="text-4xl mb-3">📝</div>
                <h4 className="font-mono text-white mb-2">
                  {searchQuery ? "No matching docs" : "No documentation yet"}
                </h4>
                <p className="font-mono text-sm text-gray-500 mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first documentation for this project"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => {
                      setFormData({ title: "", content: "", order_index: 0 });
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-[#00ff88] text-black font-mono text-sm rounded hover:bg-[#00d4ff] transition-colors"
                  >
                    + Create First Doc
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="bg-[#161b22] border border-gray-700 rounded-lg p-4 hover:border-[#00ff88]/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            #{index + 1}
                          </span>
                          <h4 className="font-mono text-white font-bold truncate">
                            {doc.title}
                          </h4>
                        </div>
                        <p className="font-mono text-xs text-gray-500 line-clamp-2">
                          {doc.content.substring(0, 150).replace(/[#*`]/g, "")}
                          {doc.content.length > 150 ? "..." : ""}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-600">
                          <span>
                            Updated:{" "}
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </span>
                          <span>
                            {doc.content.split(/\s+/).length} words
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="px-3 py-1.5 text-[#00d4ff] hover:text-[#00ff88] font-mono text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-1.5 text-red-400 hover:text-red-300 font-mono text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View Docs Link */}
            {docs.length > 0 && (
              <div className="pt-4 border-t border-gray-700">
                <a
                  href={`/docs/${selectedProjectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-[#00d4ff] hover:text-[#00ff88] transition-colors"
                >
                  <span>View Live Documentation</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
