import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProfileManagement from "./admin/pages/ProfileManagement";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import SkillsManagement from "./admin/pages/SkillsManagement";
import ProjectsManagement from "./admin/pages/ProjectsManagement";
import ExperienceManagement from "./admin/pages/ExperienceManagement";
import EducationManagement from "./admin/pages/EducationManagement";
import CertificationManagement from "./admin/pages/CertificationManagement";
import Certifications from "./components/Certifications";
import AchievementManagement from "./admin/pages/AchievementManagement";
import ResumeManagement from "./admin/pages/ResumeManagement";
import ContactManagement from "./admin/pages/ContactManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Public Portfolio
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =========================
            Admin Login
        ========================== */}

        <Route
  path="/admin"
  element={<AdminLogin />}
/>

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =========================
            Protected Admin Routes
        ========================== */}

        <Route element={<ProtectedRoute />}>
          
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/profile"
            element={<ProfileManagement />}
          />

          <Route
  path="/admin/skills"
  element={<SkillsManagement />}
/>

<Route
  path="/admin/projects"
  element={<ProjectsManagement />}
/>

        </Route>

        <Route
  path="/admin/experience"
  element={<ExperienceManagement />}
/>

<Route
  path="/admin/education"
  element={<EducationManagement />}
/>

<Route
  path="/admin/certifications"
  element={<CertificationManagement />}
/>

<Route
  path="/admin/achievements"
  element={<AchievementManagement />}
/>

<Route
  path="/admin/resume"
  element={<ResumeManagement />}
/>

<Route
  path="/admin/contact"
  element={<ContactManagement />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;