import { useState, useEffect } from "react";
import { getHabits, type Habit } from "../api/habits";
import type { User } from "../types/user";
import "./pages.css";

type ProfilePageProps = {
  userId: number;
  onBack: () => void;
};

export default function ProfilePage({ userId, onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [userRes, habitsData] = await Promise.all([
          fetch(`/users/${userId}`).then((res) => {
            if (!res.ok) throw new Error("User not found");
            return res.json();
          }),
          getHabits(userId).catch(() => null),
        ]);
        setProfile(userRes);
        setHabits(habitsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="page-container">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>{profile.real_name}</h1>
        <p className="username">@{profile.username}</p>
      </header>

      <div className="card">
        <h3>About</h3>
        <div className="roommate-info">
          {profile.major && (
            <p><span className="label">Major:</span> {profile.major}</p>
          )}
          {profile.grad_year && (
            <p><span className="label">Grad Year:</span> {profile.grad_year}</p>
          )}
          {profile.gender && (
            <p><span className="label">Gender:</span> {profile.gender}</p>
          )}
          {profile.home_state && (
            <p><span className="label">Home State:</span> {profile.home_state}</p>
          )}
          <p>
            <span className="label">Campus:</span>{" "}
            {profile.is_oncampus ? "On Campus" : "Off Campus"}
          </p>
        </div>
      </div>

      {habits && (
        <div className="card">
          <h3>Habits</h3>
          <div className="habits-list">
            {habits.wake_time && (
              <p>Wake-Up Time: {habits.wake_time}</p>
            )}
            {habits.sleep_time && (
              <p>Sleep Time: {habits.sleep_time}</p>
            )}
            {habits.study_hours !== null && (
              <p>Study Hours: {habits.study_hours} hrs/day</p>
            )}
          </div>
        </div>
      )}

      <button onClick={onBack} className="btn btn-secondary back-button">
        Back to Browse
      </button>
    </div>
  );
}