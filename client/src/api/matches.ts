const BASE_URL = "http://localhost:5000/matches";
const LOCATION_URL = "http://localhost:5000/locations";

export type MatchRecord = {
  match_id: number;
  user1_id: number;
  user2_id: number;
  location_id: number;
  status: string;
};

export async function getMatches(userId?: number): Promise<MatchRecord[]> {
  const url = userId ? `${BASE_URL}?user_id=${userId}` : BASE_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load waves");
  }

  return response.json();
}

export async function updateMatchStatus(
  matchId: number,
  status: string
): Promise<MatchRecord> {
  const response = await fetch(`${BASE_URL}/${matchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error || "Failed to update wave status");
  }

  return result;
}

async function getUserLocationId(userId: number): Promise<number | null> {
  const response = await fetch(`${LOCATION_URL}/user/${userId}`);
  if (!response.ok) {
    return null;
  }

  const locations = await response.json().catch(() => null);
  if (!Array.isArray(locations) || locations.length === 0) {
    return null;
  }

  return locations[0].location_id;
}

export async function sendWave(
  senderId: number,
  receiverId: number
): Promise<MatchRecord> {
  const senderLocationId = await getUserLocationId(senderId);
  const receiverLocationId = await getUserLocationId(receiverId);
  const location_id = senderLocationId ?? receiverLocationId;


  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user1_id: senderId,
      user2_id: receiverId,
      location_id,
      status: "pending",
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error || "Failed to send wave");
  }

  return result;
}
