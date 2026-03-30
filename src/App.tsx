import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AdminRoute from "./components/routing/AdminRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import GenerateSplitPage from "./pages/GenerateSplitPage";
import DashboardPage from "./pages/DashboardPage";
import DietPage from "./pages/DietPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SchedulerPage from "./pages/SchedulerPage";
import SignupPage from "./pages/SignupPage";
import SuperAdminLoginPage from "./pages/SuperAdminLoginPage";
import WorkoutLibraryPage from "./pages/WorkoutLibraryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/super-admin-login" element={<SuperAdminLoginPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="diet" element={<DietPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="generate" element={<GenerateSplitPage />} />
        <Route path="attendance" element={<SchedulerPage />} />
        <Route path="guides" element={<WorkoutLibraryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
