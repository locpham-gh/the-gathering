const API_BASE_URL = "http://localhost:5000/api";

export async function fetchResources(search?: string, activeType?: string) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (activeType && activeType !== "all")
    queryParams.append("type", activeType);

  const response = await fetch(
    `${API_BASE_URL}/resources?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}
