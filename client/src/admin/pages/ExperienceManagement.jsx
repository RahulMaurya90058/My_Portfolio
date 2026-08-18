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
  FaBriefcase,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  jobTitle: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  technologies: "",
  order: 0,
};

function ExperienceManagement() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  // ==========================================
  // Fetch Experiences
  // ==========================================

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/experience`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch experiences"
        );
      }

      setExperiences(data.experiences || []);
    } catch (error) {
      console.error(
        "Fetch experiences error:",
        error
      );

      setError(
        error.message || "Failed to load experiences"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

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
  // Open Add Form
  // ==========================================

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Open Edit Form
  // ==========================================

  const openEditForm = (experience) => {
    setFormData({
      jobTitle: experience.jobTitle || "",
      company: experience.company || "",
      location: experience.location || "",
      employmentType:
        experience.employmentType ||
        "Full-time",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      current: experience.current || false,
      description:
        experience.description || "",
      technologies: Array.isArray(
        experience.technologies
      )
        ? experience.technologies.join(", ")
        : "",
      order: experience.order ?? 0,
    });

    setEditingId(experience._id);
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
    setError("");
  };

  // ==========================================
  // Save / Update Experience
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    if (!formData.jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!formData.company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!formData.startDate.trim()) {
      setError("Start date is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/experience/${editingId}`
        : `${API_URL}/api/experience`;

      const method = editingId
        ? "PUT"
        : "POST";

      const technologies =
        formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      const payload = {
        jobTitle: formData.jobTitle.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        employmentType:
          formData.employmentType.trim(),
        startDate: formData.startDate.trim(),
        endDate: formData.current
          ? ""
          : formData.endDate.trim(),
        current: formData.current,
        description:
          formData.description.trim(),
        technologies,
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
            "Failed to save experience"
        );
      }

      setMessage(
        editingId
          ? "Experience updated successfully."
          : "Experience added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchExperiences();
    } catch (error) {
      console.error(
        "Save experience error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete Experience
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/experience/${id}`,
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
            "Failed to delete experience"
        );
      }

      setMessage(
        "Experience deleted successfully."
      );

      await fetchExperiences();
    } catch (error) {
      console.error(
        "Delete experience error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete experience."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Header
        ======================================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/admin/dashboard")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
              aria-label="Back to dashboard"
            >
              <FaArrowLeft size={14} />
            </button>

            <div>
              <p className="text-sm font-medium text-cyan-400">
                Admin Panel
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Experience Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your professional experience.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Experience
          </button>

        </div>

        {/* ======================================
            Messages
        ======================================= */}

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

        {/* ======================================
            Add / Edit Form
        ======================================= */}

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
                    ? "Edit Experience"
                    : "Add New Experience"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your professional experience details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-500 transition hover:text-white"
                aria-label="Close form"
              >
                <FaTimes size={18} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Job Title */}

                <div>
                  <label
                    htmlFor="job-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Job Title
                  </label>

                  <input
                    id="job-title"
                    name="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="MERN Stack Developer"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Company */}

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Company
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Analyze Infotech"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Lucknow"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Employment Type */}

                <div>
                  <label
                    htmlFor="employment-type"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Employment Type
                  </label>

                  <select
                    id="employment-type"
                    name="employmentType"
                    value={
                      formData.employmentType
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Freelance">
                      Freelance
                    </option>

                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </div>

                {/* Start Date */}

                <div>
                  <label
                    htmlFor="start-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Start Date
                  </label>

                  <input
                    id="start-date"
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                {/* End Date */}

                <div>
                  <label
                    htmlFor="end-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    End Date
                  </label>

                  <input
                    id="end-date"
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.current}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>

                {/* Current Job */}

                <div className="md:col-span-2">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      name="current"
                      checked={formData.current}
                      onChange={handleChange}
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      I currently work here
                    </span>

                  </label>

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="experience-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="experience-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                </div>

                {/* Technologies */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="experience-technologies"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Technologies
                  </label>

                  <input
                    id="experience-technologies"
                    name="technologies"
                    type="text"
                    value={
                      formData.technologies
                    }
                    onChange={handleChange}
                    placeholder="React, Node.js, Express.js, MongoDB"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate technologies with commas.
                  </p>

                </div>

                {/* Display Order */}

                <div>

                  <label
                    htmlFor="experience-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="experience-order"
                    name="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />

                </div>

              </div>

              {/* Form Buttons */}

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
                  disabled={saving}
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
                        ? "Update Experience"
                        : "Save Experience"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </motion.section>
        )}

        {/* ======================================
            Experience List
        ======================================= */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />
            </div>
          ) : experiences.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaBriefcase
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Experience Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first professional experience.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add Experience
              </button>

            </div>
          ) : (
            <div className="space-y-5">

              {experiences.map(
                (experience) => (
                  <motion.article
                    key={experience._id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-6"
                  >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          <FaBriefcase />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-xl font-bold text-white">
                              {experience.jobTitle}
                            </h2>

                            {experience.current && (
                              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                Current
                              </span>
                            )}

                          </div>

                          <p className="mt-1 font-medium text-cyan-400">
                            {experience.company}
                          </p>

                          <p className="mt-2 text-sm text-slate-500">
                            {experience.startDate}
                            {" — "}
                            {experience.current
                              ? "Present"
                              : experience.endDate ||
                                "Present"}

                            {experience.location
                              ? ` • ${experience.location}`
                              : ""}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {experience.employmentType}
                          </p>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              experience
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                          aria-label={`Edit ${experience.jobTitle}`}
                        >
                          <FaEdit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              experience._id
                            )
                          }
                          disabled={
                            deletingId ===
                            experience._id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                          aria-label={`Delete ${experience.jobTitle}`}
                        >
                          {deletingId ===
                          experience._id ? (
                            <FaSpinner
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <FaTrash size={13} />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Description */}

                    {experience.description && (
                      <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-400">
                        {experience.description}
                      </p>
                    )}

                    {/* Technologies */}

                    {experience.technologies?.length >
                      0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {experience.technologies.map(
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

                  </motion.article>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default ExperienceManagement;