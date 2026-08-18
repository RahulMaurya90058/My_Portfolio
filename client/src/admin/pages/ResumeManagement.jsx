import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaFilePdf,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

function ResumeManagement() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(
    "Rahul Maurya Resume"
  );

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("adminToken");

  // ==========================================
  // FETCH CURRENT RESUME
  // ==========================================

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/resume`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch resume"
        );
      }

      setResume(data.resume || null);

      if (data.resume?.title) {
        setTitle(data.resume.title);
      }
    } catch (error) {
      console.error(
        "Fetch resume error:",
        error
      );

      setError(
        error.message ||
          "Failed to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // PDF check
    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      setError(
        "Only PDF files are allowed."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    // 5 MB check
    const maxSize =
      5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError(
        "Resume PDF must be smaller than 5 MB."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // UPLOAD / REPLACE RESUME
  // ==========================================

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select a PDF resume."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "resume",
        file
      );

      formData.append(
        "title",
        title.trim() ||
          "Rahul Maurya Resume"
      );

      const method = resume
        ? "PUT"
        : "POST";

      const url = resume
        ? `${API_URL}/api/resume/${resume._id}`
        : `${API_URL}/api/resume`;

      const response = await fetch(
        url,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to upload resume"
        );
      }

      setMessage(
        resume
          ? "Resume replaced successfully."
          : "Resume uploaded successfully."
      );

      setResume(data.resume);
      setFile(null);

      // Reset file input
      const fileInput =
        document.getElementById(
          "resume-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Upload resume error:",
        error
      );

      setError(
        error.message ||
          "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // DELETE RESUME
  // ==========================================

  const handleDelete = async () => {
    if (!resume) {
      return;
    }

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete the current resume?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/resume/${resume._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete resume"
        );
      }

      setResume(null);
      setMessage(
        "Resume deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete resume."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">

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
                Resume Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Upload, replace and manage your resume.
              </p>
            </div>

          </div>

        </div>

        {/* ======================================
            MESSAGE
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
            CURRENT RESUME
        ======================================= */}

        {!loading && resume && (
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-400">
                  <FaFilePdf size={30} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Active Resume
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {resume.title}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {resume.fileName}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {formatFileSize(
                      resume.fileSize
                    )}
                  </p>
                </div>

              </div>

              {/* Current Resume Actions */}

              <div className="flex flex-wrap gap-2">

                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  <FaEye size={14} />
                  View
                </a>

                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  <FaDownload size={14} />
                  Download
                </a>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? (
                    <FaSpinner
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <FaTrash size={14} />
                  )}

                  Delete
                </button>

              </div>

            </div>

          </motion.section>
        )}

        {/* ======================================
            UPLOAD FORM
        ======================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
        >

          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
              {resume ? (
                <FaUpload size={20} />
              ) : (
                <FaPlus size={20} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {resume
                  ? "Replace Resume"
                  : "Upload Resume"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                PDF only, maximum 5 MB.
              </p>
            </div>

          </div>

          <form onSubmit={handleUpload}>

            {/* Title */}

            <div className="mb-6">

              <label
                htmlFor="resume-title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Resume Title
              </label>

              <input
                id="resume-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Rahul Maurya Resume"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
              />

            </div>

            {/* File */}

            <div>

              <label
                htmlFor="resume-file"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Resume PDF
              </label>

              <input
                id="resume-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950 text-sm text-slate-400 file:mr-4 file:border-0 file:bg-cyan-400 file:px-5 file:py-3 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
              />

            </div>

            {/* Selected File */}

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">

                <FaFilePdf
                  className="shrink-0 text-red-400"
                  size={20}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {formatFileSize(
                      file.size
                    )}
                  </p>
                </div>

              </div>
            )}

            {/* Upload Button */}

            <div className="mt-7 flex justify-end">

              <button
                type="submit"
                disabled={
                  uploading || !file
                }
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <FaSpinner
                      size={14}
                      className="animate-spin"
                    />
                    {resume
                      ? "Replacing..."
                      : "Uploading..."}
                  </>
                ) : (
                  <>
                    <FaUpload size={14} />
                    {resume
                      ? "Replace Resume"
                      : "Upload Resume"}
                  </>
                )}
              </button>

            </div>

          </form>

        </motion.section>

      </div>
    </div>
  );
}

export default ResumeManagement;