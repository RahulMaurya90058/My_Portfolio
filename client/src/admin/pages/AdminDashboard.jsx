import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaProjectDiagram,
  FaBriefcase,
  FaGraduationCap,
  FaAward,
  FaFileAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// ==========================================
// Sidebar Menu
// ==========================================

const menuItems = [
  {
    name: "Dashboard",
    icon: FaTachometerAlt,
    path: "/admin/dashboard",
  },
  {
    name: "Profile",
    icon: FaUser,
    path: "/admin/profile",
  },
  {
    name: "Skills",
    icon: FaCode,
    path: "/admin/skills",
  },
  {
    name: "Projects",
    icon: FaProjectDiagram,
    path: "/admin/projects",
  },
  {
    name: "Experience",
    icon: FaBriefcase,
    path: "/admin/experience",
  },
  {
    name: "Education",
    icon: FaGraduationCap,
    path: "/admin/education",
  },
  {
    name: "Achievements",
    icon: FaAward,
    path: "/admin/achievements",
  },
  {
    name: "Resume",
    icon: FaFileAlt,
    path: "/admin/resume",
  },
  {
    name: "Messages",
    icon: FaEnvelope,
    path: "/admin/messages",
  },
];

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const navigate = useNavigate();

  // ==========================================
  // Admin User
  // ==========================================

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  // ==========================================
  // Current Path
  // ==========================================

  const currentPath = window.location.pathname;

  // ==========================================
  // Navigation
  // ==========================================

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          Mobile Header
      ======================================= */}

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/95 px-5 backdrop-blur-lg lg:hidden">

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="text-slate-300 transition hover:text-cyan-400"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>

        <h1 className="text-lg font-bold">
          Rahul
          <span className="text-cyan-400">
            .
          </span>
        </h1>

        <div className="h-8 w-8 rounded-full bg-cyan-400/20" />

      </header>

      {/* ======================================
          Mobile Overlay
      ======================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* ======================================
          Sidebar
      ======================================= */}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Sidebar Header */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <div>

            <h1 className="text-2xl font-bold text-white">
              Rahul
              <span className="text-cyan-400">
                .
              </span>
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Admin Panel
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="text-slate-500 transition hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes size={19} />
          </button>

        </div>

        {/* ======================================
            Admin Info
        ======================================= */}

        <div className="border-b border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              RM
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-white">
                {adminUser.name ||
                  "Rahul Maurya"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {adminUser.email ||
                  "Admin"}
              </p>

            </div>

          </div>

        </div>

        {/* ======================================
            Navigation
        ======================================= */}

        <nav className="flex-1 overflow-y-auto p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Management
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                currentPath === item.path;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.path
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />

                  {item.name}

                </button>
              );

            })}

          </div>

        </nav>

        {/* ======================================
            Logout
        ======================================= */}

        <div className="border-t border-white/10 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-400/10"
          >
            <FaSignOutAlt size={16} />

            Logout

          </button>

        </div>

      </aside>

      {/* ======================================
          Main Content
      ======================================= */}

      <main className="min-h-screen lg:ml-72">

        {/* ======================================
            Desktop Top Bar
        ======================================= */}

        <div className="hidden h-20 items-center justify-between border-b border-white/10 px-8 lg:flex">

          <div>

            <h2 className="text-xl font-bold text-white">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your portfolio from one place.
            </p>

          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            View Portfolio
          </a>

        </div>

        {/* Mobile Spacing */}

        <div className="h-16 lg:hidden" />

        <div className="p-5 sm:p-8">

          {/* ======================================
              Welcome
          ======================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >

            <p className="text-sm font-medium text-cyan-400">
              Welcome back 👋
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white">
              {adminUser.name ||
                "Rahul Maurya"}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Manage your portfolio content,
              projects, skills, education,
              achievements and messages from
              this dashboard.
            </p>

          </motion.div>

          {/* ======================================
              Statistics
          ======================================= */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Projects */}

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  "/admin/projects"
                )
              }
              className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-left transition hover:border-cyan-400/30"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Projects
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    0
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <FaProjectDiagram />
                </div>

              </div>

            </button>

            {/* Skills */}

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  "/admin/skills"
                )
              }
              className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-left transition hover:border-cyan-400/30"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Skills
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    0
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <FaCode />
                </div>

              </div>

            </button>

            {/* Achievements */}

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  "/admin/achievements"
                )
              }
              className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-left transition hover:border-cyan-400/30"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Achievements
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    0
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <FaAward />
                </div>

              </div>

            </button>

            {/* Messages */}

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  "/admin/messages"
                )
              }
              className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-left transition hover:border-cyan-400/30"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Messages
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    0
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <FaEnvelope />
                </div>

              </div>

            </button>

          </div>

          {/* ======================================
              Quick Actions
          ======================================= */}

          <div className="mt-8">

            <h3 className="text-xl font-bold text-white">
              Quick Actions
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Update Profile */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    "/admin/profile"
                  )
                }
                className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-left transition hover:border-cyan-400/30 hover:bg-slate-900/80"
              >

                <FaUser className="text-cyan-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Update Profile
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your personal information.
                </p>

              </button>

              {/* Add Project */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    "/admin/projects"
                  )
                }
                className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-left transition hover:border-cyan-400/30 hover:bg-slate-900/80"
              >

                <FaProjectDiagram className="text-cyan-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Add Project
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new project to your portfolio.
                </p>

              </button>

              {/* Add Skill */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    "/admin/skills"
                  )
                }
                className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-left transition hover:border-cyan-400/30 hover:bg-slate-900/80"
              >

                <FaCode className="text-cyan-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Add Skill
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add or manage your technical skills.
                </p>

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;