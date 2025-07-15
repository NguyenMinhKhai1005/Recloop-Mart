const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7235";

export interface Category {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}

export async function getCategories(token: string) {
  console.log("🔐 Token được gửi vào getCategories:", token); // 👈 log tại đây
  const res = await fetch(`${API_BASE_URL}/api/Category`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Failed to fetch categories",
    };
  }
  return data;
}

export async function createCategory(token: string, payload: CategoryRequest) {
  const res = await fetch(`${API_BASE_URL}/api/Category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Failed to create category",
    };
  }
  return data;
}

export async function updateCategory(
  token: string,
  id: number,
  payload: CategoryRequest
) {
  const body = JSON.stringify({ id, ...payload });
  console.log("Update category payload:", body);
  const res = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    console.error("Update category error:", res.status, data);
    throw {
      status: res.status,
      message:
        data?.message || `Failed to update category (status ${res.status})`,
    };
  }
  return data;
}

export async function deleteCategory(token: string, id: number) {
  const res = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Failed to delete category",
    };
  }
  return data;
}
