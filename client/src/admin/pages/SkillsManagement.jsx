import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  name: "",
  category: "Frontend",
  level: 50,
  icon: "",
  order: 0,
};

function SkillsManagement() {
  const [skills, setSkills] = useState([]);
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
  // Fetch Skills
  // ==========================================

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/skills`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch skills"
        );
      }

      setSkills(data.skills || []);
    } catch (error) {
      setError(
        error.message || "Failed to load skills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "level" || name === "order"
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
  };

  // ==========================================
  // Open Edit Form
  // ==========================================

  const openEditForm = (skill) => {
    setFormData({
      name: skill.name || "",
      category: skill.category || "Other",
      level: skill.level ?? 50,
      icon: skill.icon || "",
      order: skill.order ?? 0,
    });

    setEditingId(skill._id);
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
  // Save Skill
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/skills/${editingId}`
        : `${API_URL}/api/skills`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save skill"
        );
      }

      setMessage(
        editingId
          ? "Skill updated successfully."
          : "Skill added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchSkills();
    } catch (error) {
      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete Skill
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/skills/${id}`,
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
          data.message || "Failed to delete skill"
        );
      }

      setMessage("Skill deleted successfully.");

      await fetchSkills();
    } catch (error) {
      setError(
        error.message || "Failed to delete skill."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ======================================
            Header
        ======================================= */}

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
                Skills Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your technical skills.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Skill
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

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <FaCode />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {editingId
                      ? "Edit Skill"
                      : "Add New Skill"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter your skill information below.
                  </p>
                </div>

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

                {/* Skill Name */}

                <div>
                  <label
                    htmlFor="skill-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Skill Name
                  </label>

                  <input
                    id="skill-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="React.js"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Category */}

                <div>
                  <label
                    htmlFor="skill-category"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Category
                  </label>

                  <select
                    id="skill-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="Frontend">
                      Frontend
                    </option>

                    <option value="Backend">
                      Backend
                    </option>

                    <option value="Database">
                      Database
                    </option>

                    <option value="Tools">
                      Tools
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Level */}

                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="skill-level"
                      className="text-sm font-medium text-slate-300"
                    >
                      Skill Level
                    </label>

                    <span className="text-sm font-semibold text-cyan-400">
                      {formData.level}%
                    </span>

                  </div>

                  <input
                    id="skill-level"
                    name="level"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Icon */}

                <div>
                  <label
                    htmlFor="skill-icon"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Icon Name
                  </label>

                  <input
                    id="skill-icon"
                    name="icon"
                    type="text"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="FaReact"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Example: FaReact, FaNodeJs
                  </p>
                </div>

                {/* Order */}

                <div>
                  <label
                    htmlFor="skill-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="skill-order"
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
                        ? "Update Skill"
                        : "Save Skill"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </motion.section>
        )}

        {/* ======================================
            Skills List
        ======================================= */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />

            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaCode
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Skills Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first technical skill.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add First Skill
              </button>

            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">

              {skills.map((skill) => (
                <motion.div
                  key={skill._id}
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

                  {/* Skill Header */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <FaCode size={19} />
                      </div>

                      <div>

                        <h3 className="font-bold text-white">
                          {skill.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {skill.category}
                        </p>

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(skill)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                        aria-label={`Edit ${skill.name}`}
                      >
                        <FaEdit size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(skill._id)
                        }
                        disabled={
                          deletingId === skill._id
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                        aria-label={`Delete ${skill.name}`}
                      >
                        {deletingId === skill._id ? (
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

                  {/* Level */}

                  <div className="mt-6">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs text-slate-500">
                        Skill Level
                      </span>

                      <span className="text-sm font-bold text-cyan-400">
                        {skill.level}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                        style={{
                          width: `${skill.level}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Extra Info */}

                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                    <span className="text-xs text-slate-600">
                      Order: {skill.order}
                    </span>

                    {skill.icon && (
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-500">
                        {skill.icon}
                      </span>
                    )}

                  </div>

                </motion.div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default SkillsManagement;