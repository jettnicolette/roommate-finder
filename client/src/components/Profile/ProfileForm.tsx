import type { FormEvent, ChangeEvent } from "react";
import type { ProfileFormState } from "../../types/user";

type ProfileFormProps = {
  mode: "create" | "edit";
  formData: ProfileFormState;
  message: string;
  isSaving: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function ProfileForm({
  mode,
  formData,
  message,
  isSaving,
  onChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  return (
    <>
      {message && (
        <p className="mt-4 rounded-md border border-blue-300 bg-zinc-700 p-3 text-sm text-blue-100">
          {message}
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <h3 className="text-xl font-semibold text-blue-300">
          {mode === "create" ? "Create My Profile" : "Edit My Profile"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Username
            <input
              name="username"
              value={formData.username}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Phone Number
            <input
              name="phone_number"
              value={formData.phone_number}
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Real Name
            <input
              name="real_name"
              value={formData.real_name}
              onChange={onChange}
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
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Gender
            <input
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Major
            <input
              name="major"
              value={formData.major}
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-blue-100">
            Home State
            <input
              name="home_state"
              value={formData.home_state}
              onChange={onChange}
              className="rounded-md border border-blue-200 bg-zinc-800 px-3 py-2 text-white"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-blue-100">
            <input
              name="is_oncampus"
              type="checkbox"
              checked={formData.is_oncampus}
              onChange={onChange}
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
            onClick={onCancel}
            className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
