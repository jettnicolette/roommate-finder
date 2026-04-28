import type { CreateUserInput, User } from "../types/user";

const BASE_URL = "http://localhost:5000/users";

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

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to delete user");
  }
}

// Get user with their habits and location details
export async function getUserWithDetails(userId: number): Promise<any> {
  const userResponse = await fetch(`${BASE_URL}/${userId}`);
  if (!userResponse.ok) {
    throw new Error("Failed to fetch user");
  }
  const user = await userResponse.json();

  try {
    const habitsResponse = await fetch(`http://localhost:5000/habits/user/${userId}`);
    const habits = habitsResponse.ok ? await habitsResponse.json() : null;
    return { ...user, habits };
  } catch {
    return { ...user, habits: null };
  }
}

// Get all users with filtered results
export async function getFilteredUsers(currentUserId: number): Promise<any[]> {
  const users = await getUsers();
  // Filter out current user
  return users.filter(user => user.user_id !== currentUserId);
}
