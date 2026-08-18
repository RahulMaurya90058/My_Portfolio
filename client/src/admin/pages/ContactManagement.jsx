import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token =
    localStorage.getItem("adminToken");

  // ==========================================
  // FETCH CONTACT MESSAGES
  // ==========================================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch messages"
        );
      }

      setContacts(data.contacts || []);
    } catch (error) {
      console.error(
        "Fetch contacts error:",
        error
      );

      setError(
        error.message ||
          "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ==========================================
  // VIEW MESSAGE
  // ==========================================

  const handleView = async (contact) => {
    setSelectedContact(contact);
    setMessage("");
    setError("");

    // If already read, no API call needed
    if (contact.isRead) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/api/contact/${contact._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isRead: true,
          }),
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
            "Failed to mark message as read"
        );
      }

      setContacts((prev) =>
        prev.map((item) =>
          item._id === contact._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      setSelectedContact((prev) =>
        prev
          ? {
              ...prev,
              isRead: true,
            }
          : prev
      );
    } catch (error) {
      console.error(
        "Mark read error:",
        error
      );

      setError(
        error.message ||
          "Failed to mark message as read"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // MARK UNREAD
  // ==========================================

  const handleMarkUnread = async (
    contact
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/contact/${contact._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isRead: false,
          }),
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
            "Failed to mark message as unread"
        );
      }

      setContacts((prev) =>
        prev.map((item) =>
          item._id === contact._id
            ? {
                ...item,
                isRead: false,
              }
            : item
        )
      );

      setSelectedContact(null);

      setMessage(
        "Message marked as unread."
      );
    } catch (error) {
      console.error(
        "Mark unread error:",
        error
      );

      setError(
        error.message ||
          "Failed to update message"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE MESSAGE
  // ==========================================

  const handleDelete = async (
    contact
  ) => {
    const confirmed =
      window.confirm(
        `Delete message from ${contact.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/contact/${contact._id}`,
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
            "Failed to delete message"
        );
      }

      setContacts((prev) =>
        prev.filter(
          (item) =>
            item._id !== contact._id
        )
      );

      if (
        selectedContact?._id ===
        contact._id
      ) {
        setSelectedContact(null);
      }

      setMessage(
        "Message deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete contact error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete message"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const unreadCount =
    contacts.filter(
      (contact) => !contact.isRead
    ).length;

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
                Contact Messages
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage messages received from your portfolio.
              </p>
            </div>

          </div>

          {/* Stats */}

          <div className="flex gap-3">

            <div className="rounded-xl border border-white/10 bg-slate-900 px-5 py-3">
              <p className="text-xs text-slate-500">
                Total
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {contacts.length}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3">
              <p className="text-xs text-slate-500">
                Unread
              </p>

              <p className="mt-1 text-xl font-bold text-cyan-400">
                {unreadCount}
              </p>
            </div>

          </div>

        </div>

        {/* ======================================
            MESSAGES
        ======================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <FaSpinner
              className="animate-spin text-cyan-400"
              size={28}
            />
          </div>
        ) : contacts.length === 0 ? (
          /* Empty */

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60 text-center">
            <FaEnvelope
              size={40}
              className="text-slate-600"
            />

            <h2 className="mt-5 text-xl font-bold text-white">
              No Messages Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Contact messages will appear here.
            </p>
          </div>
        ) : (
          /* Message List */

          <div className="space-y-4">

            {contacts.map(
              (contact, index) => (
                <motion.article
                  key={contact._id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  className={`rounded-2xl border p-5 transition ${
                    contact.isRead
                      ? "border-white/10 bg-slate-900/60"
                      : "border-cyan-400/20 bg-cyan-400/5"
                  }`}
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* Message Info */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-bold text-white">
                          {contact.name}
                        </h2>

                        {!contact.isRead && (
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                            New
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-slate-400">
                        {contact.email}
                      </p>

                      <p className="mt-3 font-semibold text-slate-200">
                        {contact.subject}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {contact.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-600">
                        {formatDate(
                          contact.createdAt
                        )}
                      </p>

                    </div>

                    {/* Actions */}

                    <div className="flex shrink-0 flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            contact
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                      >
                        {contact.isRead ? (
                          <FaEnvelopeOpen
                            size={14}
                          />
                        ) : (
                          <FaEye
                            size={14}
                          />
                        )}

                        View
                      </button>

                      {contact.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkUnread(
                              contact
                            )
                          }
                          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          Mark Unread
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            contact
                          )
                        }
                        disabled={
                          actionLoading
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
                      >
                        <FaTrash
                          size={13}
                        />
                        Delete
                      </button>

                    </div>

                  </div>

                </motion.article>
              )
            )}

          </div>
        )}

        {/* ======================================
            MESSAGE MODAL
        ======================================= */}

        {selectedContact && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
            onClick={() =>
              setSelectedContact(null)
            }
          >

            <div
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-start justify-between gap-5">

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                    Contact Message
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {selectedContact.subject}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedContact(
                      null
                    )
                  }
                  className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  ✕
                </button>

              </div>

              <div className="mt-7 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 text-sm text-slate-200">
                    {selectedContact.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="mt-1 inline-block text-sm text-cyan-400 hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {formatDate(
                      selectedContact.createdAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Message
                  </p>

                  <div className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">
                    {selectedContact.message}
                  </div>
                </div>

              </div>

              <div className="mt-7 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedContact
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-400/10"
                >
                  <FaTrash size={13} />
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedContact(
                      null
                    )
                  }
                  className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ContactManagement;