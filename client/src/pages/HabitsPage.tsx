import { useState, useEffect } from "react";
import type { AuthUser } from "../api/auth";
import { getHabits, saveHabits, deleteHabits, type Habit } from "../api/habits";

type HabitsPageProps = {
  currentUser: AuthUser;
  onBack: () => void;
};

export default function HabitsPage({ currentUser, onBack }: HabitsPageProps) {
  const [habits, setHabits] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load habits on component mount
  useEffect(() => {
    async function loadHabits() {
      try {
        setLoading(true);
        const data = await getHabits(currentUser.user_id);
        setHabits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load habits");
      } finally {
        setLoading(false);
      }
    }

    loadHabits();
  }, [currentUser.user_id]);

  function handleChange(field: keyof Habit, value: string | number | null) {
    if (!habits) return;
    
    const numValue = field === "study_hours" && value !== null ? parseInt(String(value), 10) : value;
    
    setHabits({
      ...habits,
      [field]: numValue || null,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!habits) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveHabits(currentUser.user_id, {
        wake_time: habits.wake_time,
        sleep_time: habits.sleep_time,
        study_hours: habits.study_hours,
      });

      setSuccess("Habits saved successfully!");
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save habits");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete all your habits? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteHabits(currentUser.user_id);
      setSuccess("Habits deleted successfully!");
      // Reset form to empty state
      setHabits({
        user_id: currentUser.user_id,
        wake_time: null,
        sleep_time: null,
        study_hours: null,
      });
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete habits");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-800 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-blue-300">Loading habits...</p>
        </div>
      </div>
    );
  }

  if (!habits) {
    return (
      <div className="min-h-screen bg-zinc-800 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-red-300">Failed to load habits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-blue-400 text-3xl font-bold">Your Habits</h1>
          <p className="mt-2 text-sm text-blue-300">
            Set your daily schedule and preferences
          </p>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-400 bg-green-50 px-4 py-3">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Current Habits View */}
        {(habits.wake_time || habits.sleep_time || habits.study_hours) && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-zinc-600 p-6">
            <h2 className="text-green-300 mb-4 text-lg font-semibold">Current Habits</h2>
            <div className="grid gap-3 text-sm md:grid-cols-3">
              {habits.wake_time && (
                <p className="text-blue-300">
                  <span className="font-medium">Wake Up:</span> {habits.wake_time}
                </p>
              )}
              {habits.sleep_time && (
                <p className="text-blue-300">
                  <span className="font-medium">Sleep Time:</span> {habits.sleep_time}
                </p>
              )}
              {habits.study_hours && (
                <p className="text-blue-300">
                  <span className="font-medium">Study Hours:</span> {habits.study_hours} hrs/day
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm"
        >
          <div className="space-y-6">
            {/* Wake Time */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Wake Up Time
              </label>
              <input
                type="time"
                value={habits.wake_time || ""}
                onChange={(e) => handleChange("wake_time", e.target.value)}
                className="w-full rounded-md border border-blue-300 bg-zinc-700 px-4 py-2 text-blue-100 focus:border-blue-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-blue-300">
                When do you typically wake up?
              </p>
            </div>

            {/* Sleep Time */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Sleep Time
              </label>
              <input
                type="time"
                value={habits.sleep_time || ""}
                onChange={(e) => handleChange("sleep_time", e.target.value)}
                className="w-full rounded-md border border-blue-300 bg-zinc-700 px-4 py-2 text-blue-100 focus:border-blue-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-blue-300">
                When do you typically go to sleep?
              </p>
            </div>

            {/* Study Hours */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Study Hours Per Day
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={habits.study_hours ?? ""}
                onChange={(e) => handleChange("study_hours", e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full rounded-md border border-blue-300 bg-zinc-700 px-4 py-2 text-blue-100 focus:border-blue-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-blue-300">
                How many hours do you study per day?
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md border border-blue-300 bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Habits"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-md border border-blue-300 bg-zinc-700 px-4 py-2 font-medium text-blue-300 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-md border border-red-400 bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete All"}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-zinc-600 p-6">
          <h3 className="text-blue-300 mb-2 font-semibold">About Your Habits</h3>
          <p className="text-sm text-blue-300">
            Your habits help us match you with compatible roommates. Be honest about your daily
            routine so we can find someone with similar lifestyle preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
