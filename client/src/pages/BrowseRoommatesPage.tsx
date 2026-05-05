import { useState, useEffect } from "react";
import type { AuthUser } from "../api/auth";
import { getUsers } from "../api/users";
import { getHabits, type Habit } from "../api/habits";
import { getMatches, sendWave, type MatchRecord } from "../api/matches";
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
  const [matchRecords, setMatchRecords] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentHabits, setCurrentHabits] = useState<Habit | null>(null);

  // Load all users and current user's habits
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, habitsData, matchesData] = await Promise.all([
          getUsers(),
          getHabits(currentUser.user_id),
          getMatches(currentUser.user_id),
        ]);

        setCurrentHabits(habitsData);
        setMatchRecords(matchesData);

        // Fetch habits for all users
        const usersWithHabits = await Promise.all(
          usersData
            .filter((user) => user.user_id !== currentUser.user_id)
            .map(async (user) => {
              try {
                const habits = await getHabits(user.user_id);
                return { ...user, habits, matchScore: calculateMatch(habitsData, habits) };
              } catch {
                return { ...user, habits: null, matchScore: 0 };
              }
            })
        );

        // Sort by match score (highest first) before setting state
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

  async function handleSendWave(roommateId: number) {
    setError("");
    try {
      const match = await sendWave(currentUser.user_id, roommateId);
      setMatchRecords((prev) => [...prev.filter((m) => m.match_id !== match.match_id), match]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send wave");
    }
  }

  function getMatchForRoommate(roommateId: number) {
    return matchRecords.find(
      (match) =>
        (match.user1_id === currentUser.user_id && match.user2_id === roommateId) ||
        (match.user2_id === currentUser.user_id && match.user1_id === roommateId)
    );
  }

  function getWaveButtonLabel(roommateId: number) {
    const match = getMatchForRoommate(roommateId);
    if (!match) return "👋 Wave";
    if (match.status === "accepted") return "Matched";
    if (match.status === "pending") {
      return match.user1_id === currentUser.user_id ? "Wave sent" : "Incoming";
    }
    if (match.status === "denied") return "Wave denied";
    return "👋 Wave";
  }

  function getWaveButtonDisabled(roommateId: number) {
    const match = getMatchForRoommate(roommateId);
    return Boolean(match && match.status !== "denied");
  }

  // Filter users by name and location/habits
  useEffect(() => {
    let filtered = users;

    // Filter by search term (name or username)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.real_name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term)
      );
    }

    // Sort by match score (highest first)
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  function calculateMatch(userHabits: Habit, otherHabits: Habit | null): number {
    if (!otherHabits) return 0;

    let score = 0;
    const maxScore = 300;

    // Wake time compatibility (within 1 hour)
    if (userHabits.wake_time && otherHabits.wake_time) {
      const [userHour, userMin] = userHabits.wake_time.split(":").map(Number);
      const [otherHour, otherMin] = otherHabits.wake_time.split(":").map(Number);
      const diff = Math.abs(userHour * 60 + userMin - (otherHour * 60 + otherMin));
      if (diff <= 60) score += 100;
      else if (diff <= 120) score += 50;
    }

    // Sleep time compatibility (within 1 hour)
    if (userHabits.sleep_time && otherHabits.sleep_time) {
      const [userHour, userMin] = userHabits.sleep_time.split(":").map(Number);
      const [otherHour, otherMin] = otherHabits.sleep_time.split(":").map(Number);
      const diff = Math.abs(userHour * 60 + userMin - (otherHour * 60 + otherMin));
      if (diff <= 60) score += 100;
      else if (diff <= 120) score += 50;
    }

    // Study hours compatibility (within 2 hours)
    if (
      userHabits.study_hours !== null &&
      otherHabits.study_hours !== null
    ) {
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

      {/* Search Bar */}
      <div className="search-container"><button onClick={onBack} className="back-button ">
        Back
      </button>
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Roommates Grid */}
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
                <div className="waveform">
                  <button
                    type="button"
                    className="wave-action"
                    onClick={() => handleSendWave(roommate.user_id)}
                    disabled={getWaveButtonDisabled(roommate.user_id)}
                  >
                    {getWaveButtonLabel(roommate.user_id)}
                  </button>
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
                  <p>
                    <span className="label">Major:</span> {roommate.major}
                  </p>
                )}
                {roommate.grad_year && (
                  <p>
                    <span className="label">Grad Year:</span> {roommate.grad_year}
                  </p>
                )}
                {roommate.gender && (
                  <p>
                    <span className="label">Gender:</span> {roommate.gender}
                  </p>
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
                      <p> Wake-Up Time: {roommate.habits.wake_time}</p>
                    )}
                    {roommate.habits.sleep_time && (
                      <p> Sleep Time: {roommate.habits.sleep_time}</p>
                    )}
                    {roommate.habits.study_hours !== null && (
                      <p> Amount of Study Hours: {roommate.habits.study_hours} hrs/day</p>
                    )}
                  </div>
                </div>
              )}

              <button className="btn btn-primary roommate-action">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}
