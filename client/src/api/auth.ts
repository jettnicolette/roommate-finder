// Base URL for all auth-related backend requests.
// These routes need to exist on the Express server.
const BASE_URL = "http://localhost:5000/auth";

// Key used to store the logged-in user in localStorage.
const STORAGE_KEY = "currentUser";

// Shape of the user object we expect back from the backend
// after a successful register or login.
export type AuthUser = {
  user_id: number;
  username: string;
  email: string;
  real_name: string;
  is_oncampus: boolean;
  phone_number?: string | null;
  grad_year?: number | null;
  gender?: string | null;
  major?: string | null;
  home_state?: string | null;
};

// Data sent to the backend when creating a new account.
export type RegisterInput = {
  username: string;
  password: string;
  email: string;
  real_name: string;
  is_oncampus: boolean;
  phone_number?: string;
  grad_year?: number;
  gender?: string;
  major?: string;
  home_state?: string;
};

// Data sent to the backend when logging in.
export type LoginInput = {
  username: string;
  password: string;
};

// Sends a register request to the backend.
// If successful, returns the created/logged-in user object.
export async function registerUser(data: RegisterInput): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      // Tell the backend we are sending JSON.
      "Content-Type": "application/json",
    },
    // Convert the JS object into a JSON string for the request body.
    body: JSON.stringify(data),
  });

  // Try to read the JSON response.
  // If parsing fails, result becomes null instead of crashing.
  const result = await response.json().catch(() => null);

  // If the backend responded with an error status,
  // throw an Error so the frontend can display a message.
  if (!response.ok) {
    throw new Error(result?.error || "Failed to register");
  }

  return result;
}

// Sends a login request to the backend.
// If successful, returns the logged-in user object.
export async function loginUser(data: LoginInput): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error || "Failed to log in");
  }

  return result;
}

// Saves the current logged-in user in localStorage
// so the app can remember them after refresh.
export function saveCurrentUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// Reads the current user from localStorage.
// Returns null if there is no stored user.
export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    // Parse the stored JSON string back into an object.
    return JSON.parse(raw) as AuthUser;
  } catch {
    // If stored data is corrupted, remove it and treat as logged out.
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Logs the user out by removing them from localStorage.
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}