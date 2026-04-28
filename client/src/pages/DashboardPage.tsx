import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { AuthUser } from "../api/auth";
import { updateUser } from "../api/users";

type DashboardPageProps = {
  currentUser: AuthUser;
  onCurrentUserUpdate: (user: AuthUser) => void;
  onLogout: () => void;
};

type FormMode = "view" | "create" | "edit";

type ProfileFormState = {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  real_name: string;
  grad_year: string;
  is_oncampus: boolean;
  gender: string;
  major: string;
  home_state: string;
};

function buildFormFromUser(user: AuthUser): ProfileFormState {
  return {
    username: user.username ?? "",
    password: "",
    email: user.email ?? "",
    phone_number: user.phone_number ?? "",
    real_name: user.real_name ?? "",
    grad_year: user.grad_year?.toString() ?? "",
    is_oncampus: user.is_oncampus ?? true,
    gender: user.gender ?? "",
    major: user.major ?? "",
    home_state: user.home_state ?? "",
  };
}

function isProfileComplete(user: AuthUser): boolean {
  return Boolean(
    user.username &&
      user.email &&
      user.real_name &&
      user.phone_number &&
      user.grad_year &&
      user.gender &&
      user.major &&
      user.home_state
  );
}

export default function DashboardPage({
  currentUser,
  onCurrentUserUpdate,
  onLogout,
}: DashboardPageProps) {
  const [mode, setMode] = useState<FormMode>("view");
  const [formData, setFormData] = useState<ProfileFormState>(() =>
    buildFormFromUser(currentUser)
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const profileAlreadyMade = isProfileComplete(currentUser);

  function openProfileForm(nextMode: "create" | "edit") {
    setFormData(buildFormFromUser(currentUser));
    setMode(nextMode);
    setMessage("");
  }

  function closeProfileForm() {
    setFormData(buildFormFromUser(currentUser));
    setMode("view");
    setMessage("");
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.real_name.trim()
    ) {
      setMessage("Username, email, and real name are required.");
      return;
    }

    if (
      formData.grad_year.trim() &&
      !Number.isInteger(Number(formData.grad_year))
    ) {
      setMessage("Graduation year must be a whole number.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateUser(currentUser.user_id, {
        requesting_user_id: currentUser.user_id,
        username: formData.username.trim(),
        password: formData.password.trim() || undefined,
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim() || null,
        real_name: formData.real_name.trim(),
        grad_year: formData.grad_year.trim()
          ? Number(formData.grad_year)
          : null,
        is_oncampus: formData.is_oncampus,
        gender: formData.gender.trim() || null,
        major: formData.major.trim() || null,
        home_state: formData.home_state.trim() || null,
      });

      onCurrentUserUpdate(updatedUser);
      setFormData(buildFormFromUser(updatedUser));
      setMode("view");

      setMessage(
        mode === "create"
          ? "Profile created successfully."
          : "Profile updated successfully."
      );
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Profile could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-800 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              Welcome, {currentUser.real_name || currentUser.username}
            </h1>
            <p className="mt-1 text-sm text-blue-300">
              Logged in as @{currentUser.username}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700"
          >
            Log Out
          </button>
        </header>

        <section className="rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-blue-300">
                My Profile
              </h2>
              <p className="text-sm text-blue-200">
                {profileAlreadyMade
                  ? "Edit only your own profile information."
                  : "Create your profile information to help find compatible roommates."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!profileAlreadyMade && (
                <button
                  onClick={() => openProfileForm("create")}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Create Profile
                </button>
              )}

              <button
                onClick={() => openProfileForm("edit")}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-md border border-blue-300 bg-zinc-700 p-3 text-sm text-blue-100">
              {message}
            </p>
          )}

          {mode === "view" && (
            <div className="mt-6 grid gap-3 text-sm text-blue-200 md:grid-cols-2">
              <p>
                <span className="font-medium">Username:</span>{" "}
                {currentUser.username}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {currentUser.email}
              </p>

              <p>
                <span className="font-medium">Phone:</span>{" "}
                {currentUser.phone_number || "Not set"}
              </p>

              <p>
                <span className="font-medium">Real Name:</span>{" "}
                {currentUser.real_name || "Not set"}
              </p>

              <p>
                <span className="font-medium">Grad Year:</span>{" "}
                {currentUser.grad_year || "Not set"}
              </p>

              <p>
                <span className="font-medium">On Campus:</span>{" "}
                {currentUser.is_oncampus ? "Yes" : "No"}
              </p>

              <p>
                <span className="font-medium">Gender:</span>{" "}
                {currentUser.gender || "Not set"}
              </p>

              <p>
                <span className="font-medium">Major:</span>{" "}
                {currentUser.major || "Not set"}
              </p>

              <p>
                <span className="font-medium">Home State:</span>{" "}
                {currentUser.home_state || "Not set"}
              </p>
            </div>
          )}

          {mode !== "view" && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <h3 className="text-xl font-semibold text-blue-300">
                {mode === "create" ? "Create My Profile" : "Edit My Profile"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Username
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                    required
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  New Password
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                    required
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Phone Number
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Real Name
                  <input
                    name="real_name"
                    value={formData.real_name}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                    required
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Graduation Year
                  <input
                    name="grad_year"
                    type="number"
                    value={formData.grad_year}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Gender
                  <input
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Major
                  <input
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-blue-100">
                  Home State
                  <input
                    name="home_state"
                    value={formData.home_state}
                    onChange={handleChange}
                    className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
                  />
                </label>

                <label className="flex items-center gap-3 text-sm font-medium text-blue-100">
                  <input
                    name="is_oncampus"
                    type="checkbox"
                    checked={formData.is_oncampus}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Lives on campus
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={closeProfileForm}
                  className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">
            Next Steps
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">Habits</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add roommate preferences and lifestyle info later.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">Location</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add housing or preferred location details later.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">
                Browse Roommates
              </h3>
              <p className="mt-2 text-sm text-blue-300">
                This will be a separate page later.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}