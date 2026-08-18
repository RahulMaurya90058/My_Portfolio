import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedinIn,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ==========================================
  // SUBMIT CONTACT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError(
        "Please fill in all the fields."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to send message."
        );
      }

      setSuccess(
        "Your message has been sent successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      setError(
        error.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-slate-950 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            SECTION HEADING
        ======================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Contact
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Let's Work{" "}
            <span className="text-cyan-400">
              Together
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            Have a project idea, opportunity or just
            want to connect? Feel free to send me a
            message.
          </p>
        </motion.div>

        {/* ======================================
            CONTACT GRID
        ======================================= */}

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ====================================
              CONTACT INFORMATION
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">

              <h3 className="text-2xl font-bold text-white">
                Get In Touch
              </h3>

              <p className="mt-4 leading-8 text-slate-400">
                I'm always open to discussing new
                opportunities, interesting projects and
                collaborations.
              </p>

              {/* Email */}

              <a
                href="mailto:your.email@example.com"
                className="mt-8 flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-400/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <FaEnvelope size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    your.email@example.com
                  </p>
                </div>
              </a>

              {/* Location */}

              <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <FaMapMarkerAlt size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>

              {/* Social Links */}

              <div className="mt-8">
                <p className="text-sm font-medium text-slate-300">
                  Connect with me
                </p>

                <div className="mt-4 flex gap-3">

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <FaGithub size={19} />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <FaLinkedinIn size={19} />
                  </a>

                </div>
              </div>
            </div>
          </motion.div>

          {/* ====================================
              CONTACT FORM
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10"
            >

              <h3 className="text-2xl font-bold text-white">
                Send Me a Message
              </h3>

              {/* Success Message */}

              {success && (
                <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  {success}
                </div>
              )}

              {/* Error Message */}

              {error && (
                <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Name */}

              <div className="mt-7">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Email */}

              <div className="mt-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Subject */}

              <div className="mt-5">
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Message */}

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FaSpinner
                      size={15}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane size={15} />
                  </>
                )}
              </button>

            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;