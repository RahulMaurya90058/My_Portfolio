import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSpinner,
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaImage,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  technologies: "",
  image: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  order: 0,
};

function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  // ==========================================
  // Fetch Projects
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/projects`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch projects"
        );
      }

      setProjects(data.projects || []);
    } catch (error) {
      setError(
        error.message || "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
          ? Number(value)
          : value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // Add Form
  // ==========================================

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setImagePreview("");
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Edit Form
  // ==========================================

  const openEditForm = (project) => {
    setFormData({
      title: project.title || "",
      shortDescription:
        project.shortDescription || "",
      description: project.description || "",
      technologies: Array.isArray(
        project.technologies
      )
        ? project.technologies.join(", ")
        : "",
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
      order: project.order ?? 0,
    });

    setImagePreview(project.image || "");
    setEditingId(project._id);
    setShowForm(true);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Close Form
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    setImagePreview("");
    setError("");
  };

  // ==========================================
  // Upload Project Image
  // ==========================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    try {
      setUploadingImage(true);

      // Local preview
      const localPreview =
        URL.createObjectURL(file);

      setImagePreview(localPreview);

      const uploadData = new FormData();

      uploadData.append("image", file);
      uploadData.append("folder", "projects");

      const response = await fetch(
        `${API_URL}/api/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Image upload failed"
        );
      }

      // Cloudinary URL
      setFormData((previous) => ({
        ...previous,
        image: data.imageUrl,
      }));

      setImagePreview(data.imageUrl);

      setMessage(
        "Project image uploaded successfully."
      );
    } catch (error) {
      setImagePreview(
        formData.image || ""
      );

      setError(
        error.message || "Image upload failed."
      );
    } finally {
      setUploadingImage(false);

      // Reset file input
      event.target.value = "";
    }
  };

  // ==========================================
  // Remove Selected Image
  // ==========================================

  const removeImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: "",
    }));

    setImagePreview("");
    setMessage("");
    setError("");
  };

  // ==========================================
  // Save Project
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    if (!formData.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError(
        "Short description is required."
      );
      return;
    }

    if (uploadingImage) {
      setError(
        "Please wait until image upload is complete."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;

      const method = editingId
        ? "PUT"
        : "POST";

      const technologies =
        formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        shortDescription:
          formData.shortDescription.trim(),
        description:
          formData.description.trim(),
        technologies,
        image: formData.image.trim(),
        githubUrl:
          formData.githubUrl.trim(),
        liveUrl:
          formData.liveUrl.trim(),
        featured: formData.featured,
        order: formData.order,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save project"
        );
      }

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
      setImagePreview("");

      await fetchProjects();
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete Project
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete project"
        );
      }

      setMessage(
        "Project deleted successfully."
      );

      await fetchProjects();
    } catch (error) {
      setError(
        error.message ||
          "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <a
              href="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              <FaArrowLeft size={14} />
            </a>

            <div>
              <p className="text-sm font-medium text-cyan-400">
                Admin Panel
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Projects Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your portfolio projects.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Project
          </button>

        </div>

        {/* Messages */}

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300"
          >
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Add / Edit Form */}

        {showForm && (
          <motion.section
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >

            <div className="mb-7 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  {editingId
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your project information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-500 transition hover:text-white"
              >
                <FaTimes size={18} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Project Title */}

                <div>
                  <label
                    htmlFor="project-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Project Title
                  </label>

                  <input
                    id="project-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Smart Resume Builder"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Display Order */}

                <div>
                  <label
                    htmlFor="project-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="project-order"
                    name="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                {/* Short Description */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="project-short-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Short Description
                  </label>

                  <input
                    id="project-short-description"
                    name="shortDescription"
                    type="text"
                    value={
                      formData.shortDescription
                    }
                    onChange={handleChange}
                    placeholder="A MERN based smart resume builder."
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Full Description */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full Description
                  </label>

                  <textarea
                    id="project-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your project..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Technologies */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="project-technologies"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Technologies
                  </label>

                  <input
                    id="project-technologies"
                    name="technologies"
                    type="text"
                    value={
                      formData.technologies
                    }
                    onChange={handleChange}
                    placeholder="React, Node.js, Express, MongoDB"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate technologies with commas.
                  </p>
                </div>

                {/* Project Image */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project Image
                  </label>

                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950 p-5">

                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-xl">

                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="h-64 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removeImage}
                          disabled={uploadingImage}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50"
                        >
                          <FaTrash size={13} />
                        </button>

                      </div>
                    ) : (
                      <div className="flex h-52 flex-col items-center justify-center text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                          <FaImage size={22} />
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-300">
                          Choose project image
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          PNG, JPG, JPEG or WEBP • Max 5MB
                        </p>

                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-center">

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">

                        {uploadingImage ? (
                          <>
                            <FaSpinner
                              size={14}
                              className="animate-spin"
                            />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaImage size={14} />
                            {imagePreview
                              ? "Change Image"
                              : "Choose Image"}
                          </>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleImageUpload
                          }
                          disabled={uploadingImage}
                          className="hidden"
                        />

                      </label>

                    </div>

                  </div>

                </div>

                {/* GitHub URL */}

                <div>
                  <label
                    htmlFor="project-github"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    GitHub URL
                  </label>

                  <input
                    id="project-github"
                    name="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Live URL */}

                <div>
                  <label
                    htmlFor="project-live"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Live Demo URL
                  </label>

                  <input
                    id="project-live"
                    name="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    placeholder="https://my-project.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Featured */}

                <div className="md:col-span-2">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <FaStar className="text-cyan-400" />
                      Featured Project
                    </span>

                  </label>

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-8 flex flex-wrap justify-end gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                >
                  <FaTimes size={14} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving || uploadingImage
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FaSpinner
                        size={14}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      {editingId
                        ? "Update Project"
                        : "Save Project"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </motion.section>
        )}

        {/* Projects List */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />

            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaImage
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Projects Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first portfolio project.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add First Project
              </button>

            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {projects.map((project) => (
                <motion.article
                  key={project._id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
                >

                  {/* Project Image */}

                  {project.image ? (
                    <div className="h-52 overflow-hidden bg-slate-950">

                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />

                    </div>
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-950 text-slate-700">
                      No Project Image
                    </div>
                  )}

                  <div className="p-6">

                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-xl font-bold text-white">
                            {project.title}
                          </h2>

                          {project.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                              <FaStar size={10} />
                              Featured
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {project.shortDescription}
                        </p>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              project
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          <FaEdit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              project._id
                            )
                          }
                          disabled={
                            deletingId ===
                            project._id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                        >
                          {deletingId ===
                          project._id ? (
                            <FaSpinner
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <FaTrash
                              size={13}
                            />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Technologies */}

                    {project.technologies?.length >
                      0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {project.technologies.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-400"
                            >
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    {/* Links */}

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-5">

                      {project.githubUrl && (
                        <a
                          href={
                            project.githubUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          <FaGithub />
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          <FaExternalLinkAlt />
                          Live Demo
                        </a>
                      )}

                      <span className="ml-auto self-center text-xs text-slate-600">
                        Order: {project.order}
                      </span>

                    </div>

                  </div>

                </motion.article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default ProjectsManagement;