"use client";

import { useState, useEffect } from "react";
import { supabase, type Project } from "@/lib/supabase";

export default function ProjectAdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter projects based on search
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tech_stack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

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
    const techArray = value
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setFormData({ ...formData, tech_stack: techArray });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Search Bar */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, description, or tech stack..."
            className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 pl-10 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-6 scrollbar-terminal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column - Form */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-mono text-lg md:text-xl text-[#00ff88] mb-3 md:mb-4">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h3>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Title */}
            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                required
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation resize-y"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Tech Stack (comma or space separated) *
              </label>
              <input
                type="text"
                value={formData.tech_stack.join(", ")}
                onChange={(e) => handleTechStackChange(e.target.value)}
                placeholder="React, Node.js, MongoDB"
                required
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation"
              />
              <p className="text-[10px] md:text-xs text-gray-500 mt-1">
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
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Project Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-xs md:text-sm focus:outline-none focus:border-[#00ff88] file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded file:border-0 file:text-xs md:file:text-sm file:font-mono file:bg-[#00ff88] file:text-black hover:file:bg-[#00d4ff] file:cursor-pointer"
              />
              {uploadingImage && (
                <p className="text-[10px] md:text-xs text-[#00ff88] mt-1">Uploading...</p>
              )}
              {formData.image_url && (
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">✓ Image uploaded</p>
              )}
            </div>

            {/* URLs */}
            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                Project URL
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) =>
                  setFormData({ ...formData, project_url: e.target.value })
                }
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block font-mono text-xs md:text-sm text-gray-400 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm md:text-base focus:outline-none focus:border-[#00ff88] touch-manipulation"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 md:w-5 md:h-5 bg-[#161b22] border-gray-700 rounded text-[#00ff88] focus:ring-[#00ff88] cursor-pointer"
                />
                <span className="font-mono text-xs md:text-sm text-gray-400">Featured</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 md:pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-2 bg-[#00ff88] text-black font-mono text-sm md:text-base rounded hover:bg-[#00d4ff] transition-colors active:scale-95 touch-manipulation"
              >
                {isEditing ? "Update Project" : "Create Project"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-700 text-white font-mono text-sm md:text-base rounded hover:bg-gray-600 transition-colors active:scale-95 touch-manipulation"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column - Project List */}
        <div className="space-y-4">
          <h3 className="font-mono text-base md:text-xl text-[#00ff88] mb-3 md:mb-4">
            Existing Projects ({filteredProjects.length}{searchQuery && ` of ${projects.length}`})
          </h3>

          {isLoading ? (
            <div className="text-gray-400 font-mono text-xs md:text-sm">Loading...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-gray-400 font-mono text-xs md:text-sm text-center py-8">
              {searchQuery ? "No projects match your search" : "No projects yet"}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#161b22] border border-gray-700 rounded p-3 md:p-4 hover:border-[#00ff88]/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-mono text-xs md:text-sm font-bold text-white flex-1">
                      {project.title}
                      {project.featured && (
                        <span className="ml-1.5 md:ml-2 text-[10px] md:text-xs text-[#ff8c00]">★ Featured</span>
                      )}
                    </h4>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-[#00d4ff] hover:text-[#00ff88] text-xs md:text-sm touch-manipulation active:scale-95 min-h-[44px] md:min-h-0 flex items-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-400 hover:text-red-300 text-xs md:text-sm touch-manipulation active:scale-95 min-h-[44px] md:min-h-0 flex items-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-400 mb-2">{project.short_description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-1.5 md:px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] text-[10px] md:text-xs font-mono rounded"
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
  );
}
