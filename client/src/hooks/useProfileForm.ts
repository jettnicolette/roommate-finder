import { useState, ChangeEvent, FormEvent } from "react";
import type { AuthUser } from "../api/auth";
import type { ProfileFormState } from "../types/user";
import { updateUser } from "../api/users";
import { buildFormFromUser, validateProfileForm } from "../utils/profileHelpers";

export function useProfileForm(
  currentUser: AuthUser,
  onSuccess: (user: AuthUser) => void
) {
  const [formData, setFormData] = useState<ProfileFormState>(() =>
    buildFormFromUser(currentUser)
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>, mode: "create" | "edit") {
    e.preventDefault();
    setMessage("");

    const validationError = validateProfileForm(formData);
    if (validationError) {
      setMessage(validationError);
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

      onSuccess(updatedUser);
      setFormData(buildFormFromUser(updatedUser));
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

  function resetForm() {
    setFormData(buildFormFromUser(currentUser));
    setMessage("");
  }

  return {
    formData,
    message,
    isSaving,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
