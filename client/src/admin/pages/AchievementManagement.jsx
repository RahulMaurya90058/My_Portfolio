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
  FaTrophy,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  title: "",
  organization: "",
  date: "",
  category: "Achievement",
  description: "",
  image: "",
  credentialUrl: "",
  credentialId: "",
  order: 0,
};

function AchievementManagement() {
  const [achievements, setAchievements] =
    useState([]);

  const [formData, setFormData] =
    useState(initialForm);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("adminToken");

  // ==========================================
  // FETCH ACHIEVEMENTS
  // ==========================================

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/achievements`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch achievements"
        );
      }

      setAchievements(
        data.achievements || []
      );
    } catch (error) {
      console.error(
        "Fetch achievements error:",
        error
      );

      setError(
        error.message ||
          "Failed to load achievements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "order"
          ? Number(value)
          : value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // OPEN ADD FORM
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
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (achievement) => {
    setFormData({
      title:
        achievement.title || "",

      organization:
        achievement.organization || "",

      date:
        achievement.date || "",

      category:
        achievement.category ||
        "Achievement",

      description:
        achievement.description || "",

      image:
        achievement.image || "",

      credentialUrl:
        achievement.credentialUrl || "",

      credentialId:
        achievement.credentialId || "",

      order:
        achievement.order ?? 0,
    });

    setEditingId(achievement._id);
    setShowForm(true);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);

    setError("");
  };

  // ==========================================
  // CREATE / UPDATE
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
      setError(
        "Achievement title is required."
      );
      return;
    }

    if (!formData.organization.trim()) {
      setError(
        "Organization is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/achievements/${editingId}`
        : `${API_URL}/api/achievements`;

      const method = editingId
        ? "PUT"
        : "POST";

      const payload = {
        title: formData.title.trim(),

        organization:
          formData.organization.trim(),

        date:
          formData.date.trim(),

        category:
          formData.category.trim() ||
          "Achievement",

        description:
          formData.description.trim(),

        image:
          formData.image.trim(),

        credentialUrl:
          formData.credentialUrl.trim(),

        credentialId:
          formData.credentialId.trim(),

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
            "Failed to save achievement"
        );
      }

      setMessage(
        editingId
          ? "Achievement updated successfully."
          : "Achievement added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchAchievements();
    } catch (error) {
      console.error(
        "Save achievement error:",
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
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/achievements/${id}`,
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
            "Failed to delete achievement"
        );
      }

      setMessage(
        "Achievement deleted successfully."
      );

      await fetchAchievements();
    } catch (error) {
      console.error(
        "Delete achievement error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete achievement."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
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
                Achievement Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your achievements.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Achievement
          </button>

        </div>

        {/* ======================================
            MESSAGES
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
            FORM
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
                    ? "Edit Achievement"
                    : "Add New Achievement"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your achievement details.
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

                {/* Title */}

                <div>
                  <label
                    htmlFor="achievement-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Achievement Title
                  </label>

                  <input
                    id="achievement-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Hackathon Winner"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Organization */}

                <div>
                  <label
                    htmlFor="achievement-organization"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Organization
                  </label>

                  <input
                    id="achievement-organization"
                    name="organization"
                    type="text"
                    value={
                      formData.organization
                    }
                    onChange={handleChange}
                    placeholder="Organization / Institute"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Date */}

                <div>
                  <label
                    htmlFor="achievement-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Date
                  </label>

                  <input
                    id="achievement-date"
                    name="date"
                    type="text"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="2025"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Category */}

                <div>
                  <label
                    htmlFor="achievement-category"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Category
                  </label>

                  <select
                    id="achievement-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="Achievement">
                      Achievement
                    </option>

                    <option value="Award">
                      Award
                    </option>

                    <option value="Hackathon">
                      Hackathon
                    </option>

                    <option value="Competition">
                      Competition
                    </option>

                    <option value="Recognition">
                      Recognition
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Image */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="achievement-image"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Achievement Image URL
                  </label>

                  <input
                    id="achievement-image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Cloudinary image URL paste karo.
                  </p>
                </div>

                {/* Credential URL */}

                <div>
                  <label
                    htmlFor="achievement-credential-url"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Credential URL
                  </label>

                  <input
                    id="achievement-credential-url"
                    name="credentialUrl"
                    type="url"
                    value={
                      formData.credentialUrl
                    }
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Credential ID */}

                <div>
                  <label
                    htmlFor="achievement-credential-id"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Credential ID
                  </label>

                  <input
                    id="achievement-credential-id"
                    name="credentialId"
                    type="text"
                    value={
                      formData.credentialId
                    }
                    onChange={handleChange}
                    placeholder="ACH-2025-001"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Description */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="achievement-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="achievement-description"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your achievement..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Order */}

                <div>
                  <label
                    htmlFor="achievement-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="achievement-order"
                    name="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
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
                        ? "Update Achievement"
                        : "Save Achievement"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </motion.section>
        )}

        {/* ======================================
            ACHIEVEMENT LIST
        ======================================= */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />
            </div>
          ) : achievements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaTrophy
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Achievements Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first achievement.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add Achievement
              </button>

            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {achievements.map(
                (achievement) => (
                  <motion.article
                    key={achievement._id}
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

                    {/* Image */}

                    {achievement.image && (
                      <div className="aspect-video overflow-hidden bg-slate-950">
                        <img
                          src={
                            achievement.image
                          }
                          alt={
                            achievement.title
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">

                      {/* Header */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            <FaTrophy />
                          </div>

                          <div>

                            <h2 className="text-xl font-bold text-white">
                              {achievement.title}
                            </h2>

                            <p className="mt-1 font-medium text-cyan-400">
                              {
                                achievement.organization
                              }
                            </p>

                          </div>

                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                achievement
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                            aria-label={`Edit ${achievement.title}`}
                          >
                            <FaEdit size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                achievement._id
                              )
                            }
                            disabled={
                              deletingId ===
                              achievement._id
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                            aria-label={`Delete ${achievement.title}`}
                          >
                            {deletingId ===
                            achievement._id ? (
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

                      {/* Category + Date */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        {achievement.category && (
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                            {achievement.category}
                          </span>
                        )}

                        {achievement.date && (
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                            {achievement.date}
                          </span>
                        )}

                      </div>

                      {/* Description */}

                      {achievement.description && (
                        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-400">
                          {
                            achievement.description
                          }
                        </p>
                      )}

                      {/* Credential */}

                      {(achievement.credentialId ||
                        achievement.credentialUrl) && (
                        <div className="mt-5 border-t border-white/5 pt-5">

                          {achievement.credentialId && (
                            <p className="text-xs text-slate-500">
                              Credential ID:{" "}
                              <span className="text-slate-300">
                                {
                                  achievement.credentialId
                                }
                              </span>
                            </p>
                          )}

                          {achievement.credentialUrl && (
                            <a
                              href={
                                achievement.credentialUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                            >
                              View Credential
                              <FaExternalLinkAlt
                                size={12}
                              />
                            </a>
                          )}

                        </div>
                      )}

                    </div>

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

export default AchievementManagement;