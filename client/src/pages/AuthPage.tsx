import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  loginUser,
  registerUser,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "../api/auth";

// Props passed down from App.tsx.
// When login/register succeeds, App will update the current user state.
type AuthPageProps = {
  onAuthSuccess: (user: AuthUser) => void;
};

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  // Toggle between login mode and create-account mode.
  const [mode, setMode] = useState<"login" | "register">("login");

  // Store form field values here.
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    real_name: "",
    is_oncampus: true,
  });

  // Simple UI state for errors and submit loading.
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handles typing into form fields.
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Handles the whole form submit.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let user: AuthUser;

      if (mode === "login") {
        // Build the login payload from the shared form state.
        const loginData: LoginInput = {
          username: formData.username,
          password: formData.password,
        };

        // Send login request to backend.
        user = await loginUser(loginData);
      } else {
        // Build the register payload from the shared form state.
        const registerData: RegisterInput = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          real_name: formData.real_name,
          is_oncampus: formData.is_oncampus,
        };

        // Send register request to backend.
        user = await registerUser(registerData);
      }

      // Tell App.tsx that auth worked.
      onAuthSuccess(user);
    } catch (err) {
      // Show a readable message on the page if auth fails.
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Switches between login and register mode and clears old errors.
  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
  }

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-blue-400 bg-gray-100 p-6 shadow-sm">
        {/* App title / intro */}
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-500">Roommate Finder</h1>
          <p className="text-sm text-blue-400">
            {mode === "login"
              ? "Log in to continue."
              : "Create an account to get started."}
          </p>
        </div>

        {/* Toggle buttons for Login vs Create Account */}
        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              mode === "login"
                ? "bg-blue-400 text-white opacity-10"
                : "border border-gray-300 bg-blue-400 text-white"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              mode === "register"
                ? "bg-blue-400 text-white opacity-10"
                : "border border-gray-300 bg-blue-400 text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-blue-500">Username</span>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="rounded-md border border-blue-200 px-3 py-2 text-blue-400"
            />
          </label>

          {/* Password */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-blue-500">Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-md border border-blue-200 px-3 py-2 text-blue-400"
            />
          </label>

          {/* Only show these fields during account creation */}
          {mode === "register" && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-blue-500">Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-md border border-blue-200 px-3 py-2 text-blue-400"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-blue-500">Real Name</span>
                <input
                  name="real_name"
                  value={formData.real_name}
                  onChange={handleChange}
                  required
                  className="rounded-md border border-blue-200 px-3 py-2 text-blue-400"
                />
              </label>

              <label className="flex items-center gap-2">
                <input
                  name="is_oncampus"
                  type="checkbox"
                  checked={formData.is_oncampus}
                  onChange={handleChange}
                />
                <span className="text-sm font-medium text-blue-500">Lives on campus</span>
              </label>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-400 px-4 py-2 text-white disabled:opacity-60"
          >
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
