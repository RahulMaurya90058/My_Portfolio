const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = {
  get: async (endpoint) => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  post: async (endpoint, body) => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  put: async (endpoint, body) => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  delete: async (endpoint) => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },
};

export default API;