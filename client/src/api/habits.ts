const BASE_URL = "http://localhost:5000/habits";

export type Habit = {
  habit_id?: number;
  user_id: number;
  wake_time: string | null;
  sleep_time: string | null;
  study_hours: number | null;
};

export type HabitInput = {
  wake_time: string | null;
  sleep_time: string | null;
  study_hours: number | null;
};

// Get habits for a user
export async function getHabits(userId: number): Promise<Habit> {
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error || "Failed to fetch habits");
  }

  return result;
}

// Save or update habits for a user
export async function saveHabits(userId: number, habits: HabitInput): Promise<Habit> {
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(habits),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error || "Failed to save habits");
  }

  return result;
}

// Delete habits for a user
export async function deleteHabits(userId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "DELETE",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error || "Failed to delete habits");
  }
}
