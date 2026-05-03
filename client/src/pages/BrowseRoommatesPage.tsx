import { useState, useEffect } from "react";
import type { AuthUser } from "../api/auth";
import { getUsers } from "../api/users";
import { getHabits, type Habit } from "../api/habits";
import type { User } from "../types/user";
import "./pages.css";

type RoommateWithDetails = User & {
  habits?: Habit;
  matchScore?: number;
};

type BrowseRoommatesPageProps = {
  currentUser: AuthUser;
  onBack: () => void;
};

export default function BrowseRoommatesPage({
  currentUser,
  onBack,
}: BrowseRoommatesPageProps) {
  const [users, setUsers] = useState<RoommateWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RoommateWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, habitsData] = await Promise.all([
          getUsers(),
          getHabits(currentUser.user_id),
        ]);

        const usersWithHabits = await Promise.all(
          usersData
            .filter((user) => user.user_id !== currentUser.user_id)
            .map(async (user) => {
              try {
                const habits = await getHabits(user.user_id);
                return { ...user, habits, matchScore: calculateMatch(habitsData, habits) };
              } catch {
                return { ...user, habits: undefined, matchScore: 0 };
              }
            })
        );

        const sortedUsers = usersWithHabits.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load roommates");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [currentUser.user_id]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.real_name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  function calculateMatch(userHabits: Habit, otherHabits: Habit | null): number {
    if (!otherHabits) return 0;

    let score = 0;
    const maxScore = 300;

    if (userHabits.wake_time && otherHabits.wake_time) {
      const [userHour, userMin] = userHabits.wake_time.split(":").map(Number);
      const [otherHour, otherMin] = otherHabits.wake_time.split(":").map(Number);
      const diff = Math.abs(userHour * 60 + userMin - (otherHour * 60 + otherMin));
      if (diff <= 60) score += 100;
      else if (diff <= 120) score += 50;
    }

    if (userHabits.sleep_time && otherHabits.sleep_time) {
      const [userHour, userMin] = userHabits.sleep_time.split(":").map(Number);
      const [otherHour, otherMin] = otherHabits.sleep_time.split(":").map(Number);
      const diff = Math.abs(userHour * 60 + userMin - (otherHour * 60 + otherMin));
      if (diff <= 60) score += 100;
      else if (diff <= 120) score += 50;
    }

    if (userHabits.study_hours !== null && otherHabits.study_hours !== null) {
      const diff = Math.abs(userHabits.study_hours - otherHabits.study_hours);
      if (diff <= 2) score += 100;
      else if (diff <= 5) score += 50;
    }

    return Math.round((score / maxScore) * 100);
  }

  if (loading) {
    return (
      <div className="page-container">
        <p className="text-center">Loading roommates...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Browse Roommates</h1>
        <p>Find compatible roommates based on your habits and preferences</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card">
          <p className="text-center">
            {searchTerm ? "No roommates match your search." : "No roommates available."}
          </p>
        </div>
      ) : (
        <div className="roommates-grid">
          {filteredUsers.map((roommate) => (
            <div key={roommate.user_id} className="roommate-card">
              <div className="roommate-header">
                <div>
                  <h3>{roommate.real_name}</h3>
                  <p className="username">@{roommate.username}</p>
                </div>
                {roommate.matchScore !== undefined && (
                  <div className="match-badge">
                    <span className="match-score">{roommate.matchScore}%</span>
                    <span className="match-label">Match</span>
                  </div>
                )}
              </div>

              <div className="roommate-info">
                {roommate.major && (
                  <p><span className="label">Major:</span> {roommate.major}</p>
                )}
                {roommate.grad_year && (
                  <p><span className="label">Grad Year:</span> {roommate.grad_year}</p>
                )}
                {roommate.gender && (
                  <p><span className="label">Gender:</span> {roommate.gender}</p>
                )}
                <p>
                  <span className="label">Campus:</span>{" "}
                  {roommate.is_oncampus ? "On Campus" : "Off Campus"}
                </p>
              </div>

              {roommate.habits && (
                <div className="habits-summary">
                  <h4>Habits</h4>
                  <div className="habits-list">
                    {roommate.habits.wake_time && (
                      <p>Wake-Up Time: {roommate.habits.wake_time}</p>
                    )}
                    {roommate.habits.sleep_time && (
                      <p>Sleep Time: {roommate.habits.sleep_time}</p>
                    )}
                    {roommate.habits.study_hours !== null && (
                      <p>Study Hours: {roommate.habits.study_hours} hrs/day</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} className="btn btn-secondary back-button">
        Back
      </button>
    </div>
  );
}