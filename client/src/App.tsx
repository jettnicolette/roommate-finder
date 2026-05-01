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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    getCurrentUser()
  );

  function handleAuthSuccess(user: AuthUser) {
    saveCurrentUser(user);
    setCurrentUser(user);
  }

  function handleCurrentUserUpdate(user: AuthUser) {
    saveCurrentUser(user);
    setCurrentUser(user);
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <DashboardPage
      currentUser={currentUser}
      onCurrentUserUpdate={handleCurrentUserUpdate}
      onLogout={handleLogout}
    />
  );
}

export default App;