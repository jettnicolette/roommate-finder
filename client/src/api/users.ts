import type { AuthUser } from "./auth";
import type { CreateUserInput, User } from "../types/user";

const BASE_URL = "http://localhost:5000/users";

export type UpdateProfileInput = {
  requesting_user_id: number;
  username: string;
  password?: string;
  email: string;
  phone_number: string | null;
  real_name: string;
  grad_year: number | null;
  is_oncampus: boolean;
  gender: string | null;
  major: string | null;
  home_state: string | null;
};

export async function getUsers(): Promise<User[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function createUser(userData: CreateUserInput): Promise<User> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to create user");
  }

  return response.json();
}

export async function updateUser(
  userId: number,
  userData: UpdateProfileInput
): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error || "Failed to update profile");
  }

  return result;
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to delete user");
  }
}