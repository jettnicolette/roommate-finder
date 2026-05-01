import { useState } from "react";
import type { CreateUserInput } from "../types/user";

type UserFormProps = {
  onSubmit: (data: CreateUserInput) => Promise<void>;
};

export default function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    username: "",
    password: "",
    email: "",
    real_name: "",
    is_oncampus: true,
    phone_number: "",
    grad_year: undefined,
    gender: "",
    major: "",
    home_state: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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
      [name]:
        name === "grad_year"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        phone_number: formData.phone_number || undefined,
        gender: formData.gender || undefined,
        major: formData.major || undefined,
        home_state: formData.home_state || undefined,
      });

      setFormData({
        username: "",
        password: "",
        email: "",
        real_name: "",
        is_oncampus: true,
        phone_number: "",
        grad_year: undefined,
        gender: "",
        major: "",
        home_state: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <h2 className="text-2xl font-semibold">Create User</h2>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Username</span>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Real Name</span>
          <input
            name="real_name"
            value={formData.real_name}
            onChange={handleChange}
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Phone Number</span>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Graduation Year</span>
          <input
            name="grad_year"
            type="number"
            value={formData.grad_year ?? ""}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Gender</span>
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Major</span>
          <input
            name="major"
            value={formData.major}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Home State</span>
          <input
            name="home_state"
            value={formData.home_state}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 pt-6">
          <input
            name="is_oncampus"
            type="checkbox"
            checked={formData.is_oncampus}
            onChange={handleChange}
          />
          <span className="text-sm font-medium">Lives on campus</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
