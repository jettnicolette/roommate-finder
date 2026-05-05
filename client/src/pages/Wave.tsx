import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../api/auth";
import { getUsers } from "../api/users";
import { getMatches, updateMatchStatus, type MatchRecord } from "../api/matches";
import type { User } from "../types/user";
import "./pages.css";

type WavePageProps = {
  currentUser: AuthUser;
  onBack: () => void;
};

export default function WavePage({ currentUser, onBack }: WavePageProps) {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingMatchId, setUpdatingMatchId] = useState<number | null>(null);

  useEffect(() => {
    async function loadWaveData() {
      setLoading(true);
      setError("");

      try {
        const [userList, userMatches] = await Promise.all([
          getUsers(),
          getMatches(currentUser.user_id),
        ]);

        setUsers(userList);
        setMatches(userMatches);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load waves");
      } finally {
        setLoading(false);
      }
    }

    loadWaveData();
  }, [currentUser.user_id]);

  const userById = useMemo(
    () => new Map(users.map((user) => [user.user_id, user])),
    [users]
  );

  const receivedWaves = matches.filter(
    (match) => match.user2_id === currentUser.user_id && match.status === "pending"
  );

  const sentWaves = matches.filter(
    (match) => match.user1_id === currentUser.user_id && match.status === "pending"
  );

  const acceptedWaves = matches.filter(
    (match) =>
      (match.user1_id === currentUser.user_id || match.user2_id === currentUser.user_id) &&
      match.status === "accepted"
  );

  async function handleUpdateStatus(matchId: number, status: string) {
    setError("");
    setUpdatingMatchId(matchId);

    try {
      const updatedMatch = await updateMatchStatus(matchId, status);
      setMatches((current) =>
        current.map((match) =>
          match.match_id === updatedMatch.match_id ? updatedMatch : match
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update wave status");
    } finally {
      setUpdatingMatchId(null);
    }
  }

  function getOpponent(match: MatchRecord) {
    const opponentId = match.user1_id === currentUser.user_id ? match.user2_id : match.user1_id;
    return userById.get(opponentId) ?? { user_id: opponentId, username: "Unknown", email: "", phone_number: null, real_name: "Unknown", grad_year: null, is_oncampus: false, gender: null, major: null, home_state: null };
  }

  if (loading) {
    return (
      <div className="page-container">
        <p className="text-center">Loading waves...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Waves</h1>
        <p>Track incoming requests and accept or deny pending waves.</p>
      </header>
      <button onClick={onBack} className="back-button ">
        Back
      </button>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="card">
        <h2>Received Waves</h2>
        {receivedWaves.length === 0 ? (
          <p>No pending waves to respond to.</p>
        ) : (
          <div className="roommates-grid">
            {receivedWaves.map((match) => {
              const opponent = userById.get(match.user1_id);
              return (
                <div key={match.match_id} className="roommate-card">
                  <div className="roommate-header">
                    <div>
                      <h3>{opponent?.real_name || opponent?.username || "Unknown"}</h3>
                      <p className="username">@{opponent?.username || "unknown"}</p>
                    </div>
                    <div className="match-badge">
                      <span className="match-score">Pending</span>
                    </div>
                  </div>

                  <p className="roommate-info">
                    Wave received from {opponent?.real_name || opponent?.username}.
                  </p>

                  <div className="button-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={updatingMatchId === match.match_id}
                      onClick={() => handleUpdateStatus(match.match_id, "accepted")}
                    >
                      ✓ Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={updatingMatchId === match.match_id}
                      onClick={() => handleUpdateStatus(match.match_id, "denied")}
                    >
                      ✕ Deny
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Sent Waves</h2>
        {sentWaves.length === 0 ? (
          <p>You haven't sent any waves yet.</p>
        ) : (
          <div className="roommates-grid">
            {sentWaves.map((match) => {
              const opponent = userById.get(match.user2_id);
              return (
                <div key={match.match_id} className="roommate-card">
                  <div className="roommate-header">
                    <div>
                      <h3>{opponent?.real_name || opponent?.username || "Unknown"}</h3>
                      <p className="username">@{opponent?.username || "unknown"}</p>
                    </div>
                    <div className="match-badge">
                      <span className="match-score">Waiting</span>
                    </div>
                  </div>
                  <p className="roommate-info">
                    Waiting for response to your wave.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Accepted Waves</h2>
        {acceptedWaves.length === 0 ? (
          <p>No accepted waves yet.</p>
        ) : (
          <div className="roommates-grid">
            {acceptedWaves.map((match) => {
              const opponent = getOpponent(match);
              return (
                <div key={match.match_id} className="roommate-card">
                  <div className="roommate-header">
                    <div>
                      <h3>{opponent.real_name || opponent.username}</h3>
                      <p className="username">@{opponent.username}</p>
                    </div>
                    <div className="match-badge">
                      <span className="match-score">Accepted</span>
                    </div>
                  </div>
                  <p className="roommate-info">You have a confirmed wave with this user.</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
