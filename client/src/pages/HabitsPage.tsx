import { useState, useEffect } from "react";
import type { AuthUser } from "../api/auth";
import { getHabits, saveHabits, deleteHabits, type Habit } from "../api/habits";
import "./pages.css";

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
      <div className="page-container">
        <p className="text-center">Loading habits...</p>
      </div>
    );
  }

  if (!habits) {
    return (
      <div className="page-container">
        <p className="text-center text-error">Failed to load habits</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Your Habits</h1>
        <p>Set your daily schedule and preferences</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {(habits.wake_time || habits.sleep_time || habits.study_hours) && (
        <div className="card card-success">
          <h2>Current Habits</h2>
          <div className="habits-grid">
            {habits.wake_time && (
              <p>
                <span className="label">Wake Up:</span> {habits.wake_time}
              </p>
            )}
            {habits.sleep_time && (
              <p>
                <span className="label">Sleep Time:</span> {habits.sleep_time}
              </p>
            )}
            {habits.study_hours && (
              <p>
                <span className="label">Study Hours:</span> {habits.study_hours} hrs/day
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="form">
        <div className="form-group">
          <label htmlFor="wake-time">Wake Up Time</label>
          <input
            id="wake-time"
            type="time"
            value={habits.wake_time || ""}
            onChange={(e) => handleChange("wake_time", e.target.value)}
          />
          <p className="form-hint">When do you typically wake up?</p>
        </div>

        <div className="form-group">
          <label htmlFor="sleep-time">Sleep Time</label>
          <input
            id="sleep-time"
            type="time"
            value={habits.sleep_time || ""}
            onChange={(e) => handleChange("sleep_time", e.target.value)}
          />
          <p className="form-hint">When do you typically go to sleep?</p>
        </div>

        <div className="form-group">
          <label htmlFor="study-hours">Study Hours Per Day</label>
          <input
            id="study-hours"
            type="number"
            min="0"
            max="24"
            value={habits.study_hours ?? ""}
            onChange={(e) => handleChange("study_hours", e.target.value ? parseInt(e.target.value, 10) : null)}
          />
          <p className="form-hint">How many hours do you study per day?</p>
        </div>

        <div className="button-group">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save Habits"}
          </button>
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Back
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-danger">
            {deleting ? "Deleting..." : "Delete All"}
          </button>
        </div>
      </form>

      <div className="card">
        <h3>About Your Habits</h3>
        <p>
          Your habits help us match you with compatible roommates. Be honest about your daily
          routine so we can find someone with similar lifestyle preferences.
        </p>
      </div>
    </div>
  );
}
