import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import {
  getCurrentUser,
  logoutUser,
  saveCurrentUser,
  type AuthUser,
} from "./api/auth";

function App() {
  // On first load, try to restore the logged-in user from localStorage.
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    getCurrentUser()
  );

  // Called after a successful register or login.
  function handleAuthSuccess(user: AuthUser) {
    // Save the user in localStorage so refreshes keep them logged in.
    saveCurrentUser(user);

    // Update React state so the app switches to the dashboard immediately.
    setCurrentUser(user);
  }

  // Called when the user clicks logout.
  function handleLogout() {
    // Remove the saved user from localStorage.
    logoutUser();

    // Clear React state so the app returns to the auth page.
    setCurrentUser(null);
  }

  // If nobody is logged in, show the auth page.
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // If a user is logged in, show the dashboard.
  return (
    <DashboardPage currentUser={currentUser} onLogout={handleLogout} />
  );
}

export default App;