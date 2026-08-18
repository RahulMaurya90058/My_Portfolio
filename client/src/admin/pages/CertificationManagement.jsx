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
  FaCertificate,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  description: "",
  skills: "",
  order: 0,
};

function CertificationManagement() {
  const [certifications, setCertifications] =
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
  // Fetch Certifications
  // ==========================================

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/certifications`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch certifications"
        );
      }

      setCertifications(
        data.certifications || []
      );
    } catch (error) {
      console.error(
        "Fetch certifications error:",
        error
      );

      setError(
        error.message ||
          "Failed to load certifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // ==========================================
  // Handle Input
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

  const openEditForm = (certification) => {
    setFormData({
      title:
        certification.title || "",

      issuer:
        certification.issuer || "",

      issueDate:
        certification.issueDate || "",

      credentialId:
        certification.credentialId || "",

      credentialUrl:
        certification.credentialUrl || "",

      description:
        certification.description || "",

      skills: Array.isArray(
        certification.skills
      )
        ? certification.skills.join(", ")
        : "",

      order:
        certification.order ?? 0,
    });

    setEditingId(certification._id);
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
  // Save / Update Certification
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
        "Certification title is required."
      );
      return;
    }

    if (!formData.issuer.trim()) {
      setError(
        "Issuing organization is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/certifications/${editingId}`
        : `${API_URL}/api/certifications`;

      const method = editingId
        ? "PUT"
        : "POST";

      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),

        issuer: formData.issuer.trim(),

        issueDate:
          formData.issueDate.trim(),

        credentialId:
          formData.credentialId.trim(),

        credentialUrl:
          formData.credentialUrl.trim(),

        description:
          formData.description.trim(),

        skills,

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
            "Failed to save certification"
        );
      }

      setMessage(
        editingId
          ? "Certification updated successfully."
          : "Certification added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchCertifications();
    } catch (error) {
      console.error(
        "Save certification error:",
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
  // Delete Certification
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/certifications/${id}`,
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
            "Failed to delete certification"
        );
      }

      setMessage(
        "Certification deleted successfully."
      );

      await fetchCertifications();
    } catch (error) {
      console.error(
        "Delete certification error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete certification."
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
                Certification Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your certifications.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FaPlus size={14} />
            Add Certification
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
                    ? "Edit Certification"
                    : "Add New Certification"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your certification details.
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

                {/* Certification Title */}

                <div>
                  <label
                    htmlFor="certification-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Certification Title
                  </label>

                  <input
                    id="certification-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="MERN Stack Development"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Issuer */}

                <div>
                  <label
                    htmlFor="certification-issuer"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Issuing Organization
                  </label>

                  <input
                    id="certification-issuer"
                    name="issuer"
                    type="text"
                    value={formData.issuer}
                    onChange={handleChange}
                    placeholder="Analyze Infotech"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Issue Date */}

                <div>
                  <label
                    htmlFor="issue-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Issue Date
                  </label>

                  <input
                    id="issue-date"
                    name="issueDate"
                    type="month"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                {/* Credential ID */}

                <div>
                  <label
                    htmlFor="credential-id"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Credential ID
                  </label>

                  <input
                    id="credential-id"
                    name="credentialId"
                    type="text"
                    value={
                      formData.credentialId
                    }
                    onChange={handleChange}
                    placeholder="ABC123XYZ"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Credential URL */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="credential-url"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Credential URL
                  </label>

                  <input
                    id="credential-url"
                    name="credentialUrl"
                    type="url"
                    value={
                      formData.credentialUrl
                    }
                    onChange={handleChange}
                    placeholder="https://example.com/certificate"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Skills */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="certification-skills"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Skills
                  </label>

                  <input
                    id="certification-skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, Express.js, MongoDB"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate skills with commas.
                  </p>
                </div>

                {/* Description */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="certification-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="certification-description"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe what you learned or achieved..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />
                </div>

                {/* Display Order */}

                <div>
                  <label
                    htmlFor="certification-order"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="certification-order"
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
                        ? "Update Certification"
                        : "Save Certification"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </motion.section>
        )}

        {/* ======================================
            Certifications List
        ======================================= */}

        <section>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <FaSpinner
                size={28}
                className="animate-spin text-cyan-400"
              />
            </div>
          ) : certifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">

              <FaCertificate
                size={35}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">
                No Certifications Added
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first certification.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <FaPlus size={13} />
                Add Certification
              </button>

            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {certifications.map(
                (certification) => (
                  <motion.article
                    key={certification._id}
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

                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          <FaCertificate />
                        </div>

                        <div>

                          <h2 className="text-xl font-bold text-white">
                            {certification.title}
                          </h2>

                          <p className="mt-1 font-medium text-cyan-400">
                            {certification.issuer}
                          </p>

                          {certification.issueDate && (
                            <p className="mt-1 text-sm text-slate-500">
                              Issued:{" "}
                              {certification.issueDate}
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
                              certification
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                          aria-label={`Edit ${certification.title}`}
                        >
                          <FaEdit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              certification._id
                            )
                          }
                          disabled={
                            deletingId ===
                            certification._id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                          aria-label={`Delete ${certification.title}`}
                        >
                          {deletingId ===
                          certification._id ? (
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

                    {/* Credential ID */}

                    {certification.credentialId && (
                      <p className="mt-5 text-xs text-slate-500">
                        Credential ID:{" "}
                        <span className="text-slate-300">
                          {
                            certification.credentialId
                          }
                        </span>
                      </p>
                    )}

                    {/* Description */}

                    {certification.description && (
                      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-400">
                        {certification.description}
                      </p>
                    )}

                    {/* Skills */}

                    {certification.skills?.length >
                      0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {certification.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    {/* Credential Link */}

                    {certification.credentialUrl && (
                      <div className="mt-6 border-t border-white/5 pt-5">

                        <a
                          href={
                            certification.credentialUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          <FaExternalLinkAlt
                            size={13}
                          />
                          View Credential
                        </a>

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

export default CertificationManagement;