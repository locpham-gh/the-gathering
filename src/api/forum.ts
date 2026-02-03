const API_BASE_URL = "http://localhost:5000/api";

export async function fetchRooms() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/forum/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}

export async function joinRoom(roomCode: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/forum/rooms/${roomCode}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to join room");
  }

  return response.json();
}

export async function fetchMessages(roomCode: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/forum/rooms/${roomCode}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export async function sendMessage(
  roomCode: string,
  content: string,
  parentId?: number,
) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/forum/rooms/${roomCode}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parent_id: parentId }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

export async function leaveRoom(code: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/forum/rooms/${code}/leave`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to leave room");
  }

  return response.json();
}

export async function deleteRoom(code: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/forum/rooms/${code}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete room");
  }

  return response.json();
}

// --- ADMIN API ---

export async function fetchAdminRooms() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/forum/admin/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin rooms");
  }

  return response.json();
}

export async function toggleRoomStatus(code: string, isActive: boolean) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/forum/admin/rooms/${code}/toggle`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: isActive }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to toggle room status");
  }

  return response.json();
}

export async function fetchAdminMessages(code: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/forum/admin/rooms/${code}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch admin messages");
  }

  return response.json();
}
