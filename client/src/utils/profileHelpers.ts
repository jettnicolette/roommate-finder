import type { AuthUser } from "../api/auth";
import type { ProfileFormState } from "../types/user";

export function buildFormFromUser(user: AuthUser): ProfileFormState {
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

export function isProfileComplete(user: AuthUser): boolean {
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

export function validateProfileForm(formData: ProfileFormState): string | null {
  if (
    !formData.username.trim() ||
    !formData.email.trim() ||
    !formData.real_name.trim()
  ) {
    return "Username, email, and real name are required.";
  }

  if (
    formData.grad_year.trim() &&
    !Number.isInteger(Number(formData.grad_year))
  ) {
    return "Graduation year must be a whole number.";
  }

  return null;
}
