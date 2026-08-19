import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaProjectDiagram,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaTrophy,
  FaFileAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

import API from "../../api/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // Admin User
  // ==========================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("adminUser");

      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load admin user:", error);
    }
  }, []);

  // ==========================================
  // Admin Details
  // ==========================================

  const adminName = adminUser?.name || "Rahul Maurya";

  const adminEmail =
    adminUser?.email || "admin@portfolio.com";

  // Profile image:
  // Backend se image aaye to use karega,
  // otherwise public/profile.jpg use karega.
  const profileImage =
    adminUser?.profileImage ||
    adminUser?.avatar ||
    adminUser?.photo ||
    "/profile.png";

  // ==========================================
  // Extract Array From API Response
  // ==========================================

  const extractArray = (response, key) => {
    const payload = response?.data ?? response;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (key && Array.isArray(payload?.[key])) {
      return payload[key];
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload?.results)) {
      return payload.results;
    }

    return [];
  };

  // ==========================================
  // Fetch Dashboard Counts
  // ==========================================

  const fetchDashboardCounts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const results = await Promise.allSettled([
        API.get("/api/projects"),
        API.get("/api/skills"),
        API.get("/api/achievements"),
        API.get("/api/contact"),
      ]);

      const [
        projectsResult,
        skillsResult,
        achievementsResult,
        messagesResult,
      ] = results;

      // Debug
      if (projectsResult.status === "fulfilled") {
        console.log(
          "Projects API:",
          projectsResult.value.data
        );
      }

      if (skillsResult.status === "fulfilled") {
        console.log(
          "Skills API:",
          skillsResult.value.data
        );
      }

      if (achievementsResult.status === "fulfilled") {
        console.log(
          "Achievements API:",
          achievementsResult.value.data
        );
      }

      if (messagesResult.status === "fulfilled") {
        console.log(
          "Messages API:",
          messagesResult.value.data
        );
      }

      // ==========================================
      // Set Counts
      // ==========================================

      setCounts({
        projects:
          projectsResult.status === "fulfilled"
            ? extractArray(
                projectsResult.value,
                "projects"
              ).length
            : 0,

        skills:
          skillsResult.status === "fulfilled"
            ? extractArray(
                skillsResult.value,
                "skills"
              ).length
            : 0,

        achievements:
          achievementsResult.status === "fulfilled"
            ? extractArray(
                achievementsResult.value,
                "achievements"
              ).length
            : 0,

        messages:
          messagesResult.status === "fulfilled"
            ? extractArray(
                messagesResult.value,
                "contacts"
              ).length
            : 0,
      });

      // API errors
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const names = [
            "Projects",
            "Skills",
            "Achievements",
            "Messages",
          ];

          console.error(
            `Failed to load ${names[index]}:`,
            result.reason
          );
        }
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // Load Dashboard
  // ==========================================

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // ==========================================
  // Sidebar
  // ==========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUser />,
    },
    {
      name: "Skills",
      path: "/admin/skills",
      icon: <FaCode />,
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Experience",
      path: "/admin/experience",
      icon: <FaBriefcase />,
    },
    {
      name: "Education",
      path: "/admin/education",
      icon: <FaGraduationCap />,
    },
    {
      name: "Certifications",
      path: "/admin/certifications",
      icon: <FaCertificate />,
    },
    {
      name: "Achievements",
      path: "/admin/achievements",
      icon: <FaTrophy />,
    },
    {
      name: "Resume",
      path: "/admin/resume",
      icon: <FaFileAlt />,
    },
    {
      name: "Messages",
      path: "/admin/contact",
      icon: <FaEnvelope />,
    },
  ];

  // ==========================================
  // Statistics
  // ==========================================

  const stats = [
    {
      title: "Projects",
      value: counts.projects,
      icon: <FaProjectDiagram />,
      path: "/admin/projects",
      description: "Portfolio projects",
    },
    {
      title: "Skills",
      value: counts.skills,
      icon: <FaCode />,
      path: "/admin/skills",
      description: "Technical skills",
    },
    {
      title: "Achievements",
      value: counts.achievements,
      icon: <FaTrophy />,
      path: "/admin/achievements",
      description: "Career achievements",
    },
    {
      title: "Messages",
      value: counts.messages,
      icon: <FaEnvelope />,
      path: "/admin/contact",
      description: "Contact messages",
    },
  ];

  // ==========================================
  // Quick Actions
  // ==========================================

  const quickActions = [
    {
      title: "Update Profile",
      description:
        "Manage your personal information.",
      path: "/admin/profile",
      icon: <FaUser />,
    },
    {
      title: "Add Project",
      description:
        "Add a new project to your portfolio.",
      path: "/admin/projects",
      icon: <FaProjectDiagram />,
    },
    {
      title: "Add Skill",
      description:
        "Add or manage your technical skills.",
      path: "/admin/skills",
      icon: <FaCode />,
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ================================
          MOBILE HEADER
      ================================= */}

      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0f172a]/95 px-5 py-4 backdrop-blur-xl lg:hidden">

        <Link
          to="/admin/dashboard"
          className="text-2xl font-bold"
        >
          Rahul<span className="text-cyan-400">.</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen w-72
          flex-col border-r border-white/10
          bg-[#0f172a]
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="border-b border-white/10 px-7 py-6">

          <Link
            to="/admin/dashboard"
            className="text-3xl font-bold"
          >
            Rahul<span className="text-cyan-400">.</span>
          </Link>

          <p className="mt-1 text-sm text-slate-500">
            Admin Panel
          </p>

        </div>

        {/* ================================
            ADMIN PROFILE
        ================================= */}

        <div className="border-b border-white/10 px-6 py-6">

          <div className="flex items-center gap-4">

            {/* Profile Photo */}

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-cyan-400/40 bg-cyan-400">

              <img
                src={profileImage}
                alt={adminName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

            {/* Name + Admin ID */}

            <div className="min-w-0">

              <h3 className="truncate text-base font-semibold text-white">
                {adminName}
              </h3>

              <p className="mt-1 truncate text-sm text-slate-500">
                {adminEmail}
              </p>

              <p className="mt-1 text-xs font-medium text-cyan-400">
                Administrator
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-600">
            Management
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={`
                  group flex items-center gap-4
                  rounded-xl px-4 py-3
                  text-sm font-medium
                  transition-all
                  ${
                    item.path ===
                    "/admin/dashboard"
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >

                <span
                  className={`
                    text-base
                    ${
                      item.path ===
                      "/admin/dashboard"
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-cyan-400"
                    }
                  `}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

              </Link>

            ))}

          </div>

        </nav>

        {/* Logout */}

        <div className="border-t border-white/10 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-400/10"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </aside>

      {/* Mobile Overlay */}

      {mobileMenu && (
        <div
          onClick={() =>
            setMobileMenu(false)
          }
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================================
          MAIN
      ================================= */}

      <main className="min-h-screen lg:ml-72">

        {/* Top Bar */}

        <header className="hidden h-24 items-center justify-between border-b border-white/10 bg-[#020617] px-10 lg:flex">

          <div>

            <h1 className="text-2xl font-bold">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your portfolio from one place.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                fetchDashboardCounts(true)
              }
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-400 disabled:opacity-50"
            >

              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              View Portfolio
              <FaExternalLinkAlt size={12} />
            </Link>

          </div>

        </header>

        {/* Content */}

        <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* ================================
              WELCOME
          ================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#07111f] p-7 shadow-2xl sm:p-10"
          >

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl">

              <p className="mb-3 text-sm font-semibold text-cyan-400">
                Welcome back 👋
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {adminName}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Manage your portfolio content,
                projects, skills, education,
                achievements and messages
                from this dashboard.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/admin/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Manage Projects
                  <FaArrowRight size={13} />
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  View Website
                  <FaExternalLinkAlt size={12} />
                </Link>

              </div>

            </div>

          </motion.section>

          {/* ================================
              STATISTICS
          ================================= */}

          <section className="mt-10">

            <div className="mb-5 flex items-end justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your portfolio statistics
                </p>

              </div>

              {loading && (
                <span className="text-xs text-slate-600">
                  Loading...
                </span>
              )}

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {stats.map((stat, index) => (

                <motion.div
                  key={stat.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >

                  <Link
                    to={stat.path}
                    className="group block h-full"
                  >

                    <div className="h-full rounded-2xl border border-white/10 bg-[#0f172a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-[#111c31]">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-sm font-medium text-slate-500">
                            {stat.title}
                          </p>

                          <p className="mt-3 text-4xl font-bold text-white">

                            {loading ? (
                              <span className="inline-block h-10 w-12 animate-pulse rounded-lg bg-white/10" />
                            ) : (
                              stat.value
                            )}

                          </p>

                          <p className="mt-2 text-xs text-slate-600">
                            {stat.description}
                          </p>

                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl text-cyan-400 transition group-hover:scale-105">
                          {stat.icon}
                        </div>

                      </div>

                      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 transition group-hover:text-cyan-400">

                        Manage

                        <FaArrowRight
                          size={10}
                          className="transition group-hover:translate-x-1"
                        />

                      </div>

                    </div>

                  </Link>

                </motion.div>

              ))}

            </div>

          </section>

          {/* ================================
              QUICK ACTIONS
          ================================= */}

          <section className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly manage your portfolio
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {quickActions.map(
                (action, index) => (

                  <motion.div
                    key={action.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        0.2 + index * 0.08,
                    }}
                  >

                    <Link
                      to={action.path}
                      className="group flex h-full items-center gap-5 rounded-2xl border border-white/10 bg-[#0f172a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-[#111c31]"
                    >

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl text-cyan-400">
                        {action.icon}
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-white">
                          {action.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {action.description}
                        </p>

                      </div>

                      <FaArrowRight
                        className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                        size={13}
                      />

                    </Link>

                  </motion.div>

                )
              )}

            </div>

          </section>

          {/* ================================
              MANAGEMENT GRID
          ================================= */}

          <section className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold">
                Manage Portfolio
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access all portfolio sections
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {menuItems
                .slice(1)
                .map((item) => (

                  <Link
                    key={item.path}
                    to={item.path}
                    className="group rounded-2xl border border-white/10 bg-[#0f172a] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-[#111c31]"
                  >

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:bg-cyan-400/10 group-hover:text-cyan-400">
                      {item.icon}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-300 transition group-hover:text-white">
                      {item.name}
                    </p>

                  </Link>

                ))}

            </div>

          </section>

          {/* Footer */}

          <footer className="mt-12 border-t border-white/10 pt-6 text-center">

            <p className="text-xs text-slate-600">
              Admin Dashboard • Rahul Maurya Portfolio
            </p>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;