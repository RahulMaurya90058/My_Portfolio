import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Projects
  // ==========================================

  useEffect(() => {
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
            data.message || "Failed to load projects"
          );
        }

        const sortedProjects = (
          data.projects || []
        ).sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0)
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        setError(
          "Unable to load projects right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="bg-slate-900 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Section Heading
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
            My Work
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Featured{" "}
            <span className="text-cyan-400">
              Projects
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            Some of the projects I have built while
            learning and working with modern web
            technologies.
          </p>
        </motion.div>

        {/* ======================================
            Loading
        ======================================= */}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          </div>
        )}

        {/* ======================================
            Error
        ======================================= */}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* ======================================
            Empty State
        ======================================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Projects will be added soon.
              </p>
            </div>
          )}

        {/* ======================================
            Projects Grid
        ======================================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {projects.map(
                (project, index) => (
                  <motion.article
                    key={project._id}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.08,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 transition hover:border-cyan-400/30"
                  >

                    {/* ==================================
                        Project Image
                    =================================== */}

                    <div className="relative aspect-video overflow-hidden bg-slate-950">

                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
                          No Project Image
                        </div>
                      )}

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/30" />

                      {/* Featured Badge */}

                      {project.featured && (
                        <span className="absolute left-4 top-4 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                          Featured
                        </span>
                      )}

                      {/* Arrow */}

                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <ArrowUpRight size={18} />
                      </div>

                    </div>

                    {/* ==================================
                        Project Content
                    =================================== */}

                    <div className="p-6">

                      {/* Title */}

                      <h3 className="text-xl font-bold text-white">
                        {project.title}
                      </h3>

                      {/* Description */}

                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                        {project.description ||
                          project.shortDescription}
                      </p>

                      {/* Technologies */}

                      {project.technologies?.length >
                        0 && (
                        <div className="mt-5 flex flex-wrap gap-2">

                          {project.technologies.map(
                            (technology) => (
                              <span
                                key={technology}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                              >
                                {technology}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* ==================================
                          Project Links
                      =================================== */}

                      {(project.githubUrl ||
                        project.liveUrl) && (
                        <div className="mt-6 flex items-center gap-3">

                          {/* GitHub */}

                          {project.githubUrl && (
                            <a
                              href={
                                project.githubUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title} GitHub repository`}
                              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                            >
                              <FaGithub size={16} />
                              GitHub
                            </a>
                          )}

                          {/* Live Demo */}

                          {project.liveUrl && (
                            <a
                              href={
                                project.liveUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title} live demo`}
                              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                            >
                              <ExternalLink size={16} />
                              Live Demo
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

      </div>
    </section>
  );
}

export default Projects;