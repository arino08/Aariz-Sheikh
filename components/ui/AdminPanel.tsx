"use client";

import { useState, useEffect } from "react";
import { supabase, type Project } from "@/lib/supabase";
import { gsap } from "gsap";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    tech_stack: [] as string[],
    image_url: "",
    project_url: "",
    github_url: "",
    featured: false,
    status: "active" as "active" | "archived" | "draft",
  });

  // Load projects
  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading projects:", error);
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProject) {
      // Update existing project
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingProject.id);

      if (error) {
        alert("Error updating project: " + error.message);
      } else {
        alert("Project updated successfully!");
        resetForm();
        loadProjects();
      }
    } else {
      // Create new project
      const { error } = await supabase.from("projects").insert([
        {
          ...formData,
          order_index: projects.length,
        },
      ]);

      if (error) {
        alert("Error creating project: " + error.message);
      } else {
        alert("Project created successfully!");
        resetForm();
        loadProjects();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      alert("Error deleting project: " + error.message);
    } else {
      alert("Project deleted successfully!");
      loadProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      short_description: project.short_description,
      tech_stack: project.tech_stack,
      image_url: project.image_url,
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      featured: project.featured,
      status: project.status,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      short_description: "",
      tech_stack: [],
      image_url: "",
      project_url: "",
      github_url: "",
      featured: false,
      status: "active",
    });
    setEditingProject(null);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    setFormData({ ...formData, image_url: data.publicUrl });
    setUploadingImage(false);
  };

  const handleTechStackChange = (value: string) => {
    // Store the raw input for better user experience
    // Only split into array when comma or space is typed
    const techArray = value
      .split(/[,\s]+/) // Split by comma OR space OR both
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setFormData({ ...formData, tech_stack: techArray });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        onClick={onClose}
      />

      {/* Admin Panel */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-[#0D1117] border-2 border-[#00ff88] rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#161b22] border-b border-[#00ff88]/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h2 className="ml-4 font-mono text-lg font-bold text-[#00ff88]">
                Admin Panel - Project Management
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-4">
                <h3 className="font-mono text-xl text-[#00ff88] mb-4">
                  {isEditing ? "Edit Project" : "Add New Project"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({ ...formData, short_description: e.target.value })
                      }
                      required
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      rows={4}
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Tech Stack (comma or space separated) *
                    </label>
                    <input
                      type="text"
                      value={formData.tech_stack.join(", ")}
                      onChange={(e) => handleTechStackChange(e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      required
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.tech_stack.length > 0 && (
                        <span className="text-[#00ff88]">
                          {formData.tech_stack.length} tag{formData.tech_stack.length !== 1 ? 's' : ''}: {formData.tech_stack.join(' • ')}
                        </span>
                      )}
                      {formData.tech_stack.length === 0 && "Type tags separated by commas or spaces"}
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Project Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                    {uploadingImage && (
                      <p className="text-xs text-[#00ff88] mt-1">Uploading...</p>
                    )}
                    {formData.image_url && (
                      <p className="text-xs text-gray-500 mt-1">✓ Image uploaded</p>
                    )}
                  </div>

                  {/* URLs */}
                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={formData.project_url}
                      onChange={(e) =>
                        setFormData({ ...formData, project_url: e.target.value })
                      }
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-sm text-gray-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-4 h-4 bg-[#161b22] border-gray-700 rounded text-[#00ff88] focus:ring-[#00ff88]"
                      />
                      <span className="font-mono text-sm text-gray-400">Featured</span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#00ff88] text-black font-mono text-sm rounded hover:bg-[#00d4ff] transition-colors"
                    >
                      {isEditing ? "Update Project" : "Create Project"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-700 text-white font-mono text-sm rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column - Project List */}
              <div className="space-y-4">
                <h3 className="font-mono text-xl text-[#00ff88] mb-4">
                  Existing Projects ({projects.length})
                </h3>

                {isLoading ? (
                  <div className="text-gray-400 font-mono text-sm">Loading...</div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-[#161b22] border border-gray-700 rounded p-4 hover:border-[#00ff88]/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-mono text-sm font-bold text-white">
                            {project.title}
                            {project.featured && (
                              <span className="ml-2 text-xs text-[#ff8c00]">★ Featured</span>
                            )}
                          </h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-[#00d4ff] hover:text-[#00ff88] text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{project.short_description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
