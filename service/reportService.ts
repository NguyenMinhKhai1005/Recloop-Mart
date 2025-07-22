import { API_BASE_URL } from "./authService"; // Assuming API_BASE_URL is exported from authService

const ENDPOINT = "/api/Admin/ReportManagement";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAllReports = async () => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
};

export const getReportById = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch report details");
  return res.json();
};

export const resolveReport = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}/resolve`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to resolve report");
  return res.ok;
};

export const deleteReport = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete report");
  return res.ok;
};