const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7235";

export interface Product {
  id: number;
  title: string;
  descriptions: string;
  price: number;
  condition: string;
  locations: string;
  categoryName: string;
  isActive: boolean;
  isApproved: boolean;
  approvedAt: string | null;
  rejectedReason: string | null;
  createdAt: string;
}

export interface RejectProductPayload {
  rejectedReason: string;
}

export async function getProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(
  token: string,
  id: number
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function approveProduct(
  token: string,
  id: number
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to approve product");
  return res.json();
}

export async function rejectProduct(
  token: string,
  id: number,
  payload: RejectProductPayload
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to reject product");
  return res.json();
}
