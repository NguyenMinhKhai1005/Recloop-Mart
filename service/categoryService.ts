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
  // Validate payload
  if (!payload.name || !payload.name.trim()) {
    throw new Error("Category name is required");
  }

  // Trim whitespace and prepare payload
  // Backend might expect only the name field, not the ID
  const cleanPayload = {
    name: payload.name.trim(),
  };

  const body = JSON.stringify(cleanPayload);
  console.log("✏️ Update category request:", {
    id,
    payload: cleanPayload,
    body,
  });

  const res = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  let data;
  const contentType = res.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textResponse = await res.text();
      data = { message: textResponse };
    }
  } catch (parseError) {
    console.error("Failed to parse response:", parseError);
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

  console.log("Update category success:", data);
  return data;
}

export async function deleteCategory(token: string, id: number) {
  console.log("🗑️ Deleting category with ID:", id);
  const res = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("Delete response status:", res.status);

  let data;
  const contentType = res.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textResponse = await res.text();
      console.log("Delete category text response:", textResponse);
      data = { message: textResponse };
    }
  } catch (parseError) {
    console.error("Failed to parse delete response:", parseError);
    data = {};
  }

  if (!res.ok) {
    console.error("Delete category error:", res.status, data);

    // Handle specific error cases
    let errorMessage =
      data?.message || `Failed to delete category (status ${res.status})`;

    if (res.status === 500 && data?.message) {
      if (
        data.message.includes("REFERENCE constraint") ||
        data.message.includes("FK__Products__Catego")
      ) {
        errorMessage =
          "Cannot delete this category because it contains products. Please move or delete all products in this category first.";
      } else if (data.message.includes("DbUpdateException")) {
        errorMessage =
          "Cannot delete this category due to database constraints. It may contain related data.";
      }
    }

    throw {
      status: res.status,
      message: errorMessage,
    };
  }

  console.log("Delete category success:", data);
  return data;
}
