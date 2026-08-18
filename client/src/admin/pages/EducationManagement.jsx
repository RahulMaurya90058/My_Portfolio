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
  FaGraduationCap,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  degree: "",
  institution: "",
  location: "",
  field: "",
  startYear: "",
  endYear: "",
  current: false,
  description: "",
  grade: "",
  order: 0,
};

function EducationManagement() {
  const [educations, setEducations] = useState([]);
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
  // Fetch Education
  // ==========================================

  const fetchEducations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/education`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch education"
        );
      }

      setEducations(data.educations || []);
    } catch (error) {
      console.error(
        "Fetch education error:",
        error
      );

      setError(
        error.message || "Failed to load education"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
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
  // Add Form
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
  // Edit Form
  // ==========================================

  const openEditForm = (education) => {
    setFormData({
      degree: education.degree || "",
      institution: education.institution || "",
      location: education.location || "",
      field: education.field || "",
      startYear: education.startYear || "",
      endYear: education.endYear || "",
      current: Boolean(education.current),
      description: education.description || "",
      grade: education.grade || "",
      order: education.order ?? 0,
    });

    setEditingId(education._id);
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
  // Save / Update Education
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    if (!formData.degree.trim()) {
      setError("Degree is required.");
      return;
    }

    if (!formData.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    if (!formData.startYear.trim()) {
      setError("Start year is required.");
      return;
    }

    if (
      !formData.current &&
      !formData.endYear.trim()
    ) {
      setError(
        "End year is required when education is completed."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/education/${editingId}`
        : `${API_URL}/api/education`;

      const method = editingId ? "PUT" : "POST";

      const payload = {
        degree: formData.degree.trim(),

        institution:
          formData.institution.trim(),

        location:
          formData.location.trim(),

        field:
          formData.field.trim(),

        startYear:
          formData.startYear.trim(),

        endYear: formData.current
          ? ""
          : formData.endYear.trim(),

        current: formData.current,

        description:
          formData.description.trim(),

        grade:
          formData.grade.trim(),

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
          data.message || "Failed to save education"
        );
      }

      setMessage(
        editingId
          ? "Education updated successfully."
          : "Education added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchEducations();
    } catch (error) {
      console.error(
        "Save education error:",
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
  // Delete Education
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/education/${id}`,
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
            "Failed to delete education"
        );
      }

      setMessage(
        "Education deleted successfully."
      );

      await fetchEducations();
    } catch (error) {
      console.error(
        "Delete education error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete education."
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
                Education Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your education.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Education
          </button>

        </div>

        {/* ======================================
            Success Message
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

        {/* ======================================
            Error Message
        ======================================= */}

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
                    ? "Edit Education"
                    : "Add New Education"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your educational details.
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

                {/* Degree */}

                <div>
                  <label
                    htmlFor="degree"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Degree
                  </label>

                  <input
                    id="degree"
                    name="degree"
                    type="text"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="B.Tech"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Institution */}

                <div>
                  <label
                    htmlFor="institution"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Institution
                  </label>

                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={
                      formData.institution
                    }
                    onChange={handleChange}
                    placeholder="Bansal Institute of Engineering & Technology"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Location */}

                <div>
                  <label
                    htmlFor="education-location"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Location
                  </label>

                  <input
                    id="education-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Lucknow, Uttar Pradesh"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Field */}

                <div>
                  <label
                    htmlFor="field"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Field / Branch
                  </label>

                  <input
                    id="field"
                    name="field"
                    type="text"
                    value={formData.field}
                    onChange={handleChange}
                    placeholder="Information Technology"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Start Year */}

                <div>
                  <label
                    htmlFor="start-year"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Start Year
                  </label>

                  <input
                    id="start-year"
                    name="startYear"
                    type="text"
                    value={formData.startYear}
                    onChange={handleChange}
                    placeholder="2022"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* End Year */}

                <div>
                  <label
                    htmlFor="end-year"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    End Year
                  </label>

                  <input
                    id="end-year"
                    name="endYear"
                    type="text"
                    value={formData.endYear}
                    onChange={handleChange}
                    placeholder="2026"
                    disabled={formData.current}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  />

                  {formData.current && (
                    <p className="mt-2 text-xs text-slate-600">
                      End year is disabled because
                      you marked this education as
                      current.
                    </p>
                  )}
                </div>

                {/* Current Education */}

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
                      I am currently studying here
                    </span>

                  </label>

                  <p className="mt-2 text-xs text-slate-600">
                    Uncheck this option if the
                    education has been completed.
                  </p>

                </div>

                {/* Grade */}

                <div>
                  <label
                    htmlFor="grade"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Grade / CGPA
                  </label>

                  <input
                    id="grade"
                    name="grade"
                    type="text"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="8.2 CGPA"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Display Order */}

                <div>
                  <label
                    htmlFor="education-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="education-order"
                    name="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="education-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="education-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your education, coursework or achievements..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
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
                        ? "Update Education"
                        : "Save Education"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </motion.section>
        )}

        {/* ======================================
            Education List
        ======================================= */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />
            </div>
          ) : educations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaGraduationCap
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Education Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your educational background.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add Education
              </button>

            </div>
          ) : (
            <div className="space-y-5">

              {educations.map((education) => (
                <motion.article
                  key={education._id}
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
                        <FaGraduationCap />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-xl font-bold text-white">
                            {education.degree}
                          </h2>

                          {education.current && (
                            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                              Current
                            </span>
                          )}

                        </div>

                        <p className="mt-1 font-medium text-cyan-400">
                          {education.institution}
                        </p>

                        {education.field && (
                          <p className="mt-1 text-sm text-slate-400">
                            {education.field}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-slate-500">
                          {education.startYear}
                          {" — "}
                          {education.current
                            ? "Present"
                            : education.endYear ||
                              "Present"}

                          {education.location
                            ? ` • ${education.location}`
                            : ""}
                        </p>

                        {education.grade && (
                          <p className="mt-1 text-xs text-slate-600">
                            Grade: {education.grade}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex shrink-0 items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            education
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                        aria-label={`Edit ${education.degree}`}
                      >
                        <FaEdit size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            education._id
                          )
                        }
                        disabled={
                          deletingId ===
                          education._id
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                        aria-label={`Delete ${education.degree}`}
                      >
                        {deletingId ===
                        education._id ? (
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

                  {education.description && (
                    <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-400">
                      {education.description}
                    </p>
                  )}

                </motion.article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default EducationManagement;