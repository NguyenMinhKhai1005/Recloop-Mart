const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7235";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isLocked: boolean;
}

export interface UserUpdateRequest {
  fullName: string;
  role: string;
}

// Helper function to get current user data from localStorage
function getCurrentUserData(userId: number): UserResponse | null {
  try {
    const storedUsers = localStorage.getItem("currentUsersData");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const user = users.find((u: UserResponse) => u.id === userId);
      return user || null;
    }
  } catch (e) {
    // Silent fail
  }
  return null;
}

// Helper function to update user data in localStorage
function updateUserInLocalStorage(updatedUser: UserResponse): void {
  try {
    const storedUsers = localStorage.getItem("currentUsersData");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex(
        (u: UserResponse) => u.id === updatedUser.id
      );

      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("currentUsersData", JSON.stringify(users));
      } else {
        users.push(updatedUser);
        localStorage.setItem("currentUsersData", JSON.stringify(users));
      }
    } else {
      localStorage.setItem("currentUsersData", JSON.stringify([updatedUser]));
    }
  } catch (e) {
    // Silent fail
  }
}

export async function getUsers(token: string): Promise<UserResponse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/UserManager`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Merge with existing lock status from localStorage before storing
    if (Array.isArray(data)) {
      const existingData = localStorage.getItem("currentUsersData");
      let existingUsers: UserResponse[] = [];

      if (existingData) {
        try {
          existingUsers = JSON.parse(existingData);
        } catch (e) {
          // Silent fail
        }
      }

      // Merge: keep API data but preserve lock status from localStorage
      const mergedData = data.map((apiUser: UserResponse) => {
        const existingUser = existingUsers.find((u) => u.id === apiUser.id);

        // If we have existing lock status, preserve it
        if (existingUser && existingUser.isLocked !== undefined) {
          return {
            ...apiUser,
            isLocked: existingUser.isLocked,
          };
        }

        // Otherwise, default to false (Active)
        return {
          ...apiUser,
          isLocked: false,
        };
      });

      localStorage.setItem("currentUsersData", JSON.stringify(mergedData));
      return mergedData;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(
  token: string,
  id: number
): Promise<UserResponse> {
  try {
    // First check if we have updated data in localStorage
    const localUser = getCurrentUserData(id);
    if (localUser) {
      return localUser;
    }

    const res = await fetch(`${API_BASE_URL}/api/UserManager/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const userData = await res.json();

    // If API doesn't return isLocked, check localStorage for updated status
    if (userData.isLocked === undefined) {
      const storedUser = getCurrentUserData(id);
      if (storedUser && storedUser.isLocked !== undefined) {
        userData.isLocked = storedUser.isLocked;
      }
    }

    return userData;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(
  token: string,
  id: number,
  payload: UserUpdateRequest
): Promise<UserResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/UserManager/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // If 401 and mock token, return mock updated user
      if (res.status === 401 && token === "mock-jwt-token-for-testing") {
        console.log("Mock token detected, returning mock updated user");

        // Get current user data from localStorage to update properly
        const currentUsersData = localStorage.getItem("mockUsersData");
        let mockUsers = [];

        if (currentUsersData) {
          try {
            mockUsers = JSON.parse(currentUsersData);
          } catch (e) {
            console.log("Failed to parse stored users data");
          }
        }

        // Find and update the user
        const userIndex = mockUsers.findIndex((u: any) => u.id === id);
        if (userIndex !== -1) {
          mockUsers[userIndex].fullName = payload.fullName;
          mockUsers[userIndex].role = payload.role;

          // Save updated data back to localStorage
          localStorage.setItem("mockUsersData", JSON.stringify(mockUsers));

          console.log(`Updated user ${id}:`, mockUsers[userIndex]);
          return mockUsers[userIndex];
        }

        // Fallback if user not found
        return {
          id,
          fullName: payload.fullName,
          email: `user${id}@example.com`,
          role: payload.role,
          isLocked: false,
        };
      }

      throw new Error("Failed to update user");
    }

    return res.json();
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
}

export async function toggleUserLock(
  token: string,
  id: number
): Promise<UserResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/UserManager/${id}/toggle-lock`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to toggle user lock");
    }

    // Try to parse as JSON, fallback to text
    let data;
    const contentType = res.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // If backend returns success message but no JSON, get current user data and toggle lock
        const currentUser = getCurrentUserData(id);
        if (currentUser) {
          // Handle undefined isLocked as false (Active)
          const currentLockStatus = currentUser.isLocked === true;
          data = {
            ...currentUser,
            isLocked: !currentLockStatus, // Toggle: false/undefined → true, true → false
          };
        } else {
          // Fallback if user not found - default to locking the user
          data = {
            id,
            fullName: `User ${id}`,
            email: `user${id}@example.com`,
            role: "user",
            isLocked: true, // Default to locked when user not found
          };
        }

        // Update localStorage with the new user data
        updateUserInLocalStorage(data);
      }
    } catch (parseError) {
      // Create response based on current user data as fallback
      const currentUser = getCurrentUserData(id);
      if (currentUser) {
        // Handle undefined isLocked as false (Active)
        const currentLockStatus = currentUser.isLocked === true;
        data = {
          ...currentUser,
          isLocked: !currentLockStatus,
        };
      } else {
        data = {
          id,
          fullName: `User ${id}`,
          email: `user${id}@example.com`,
          role: "user",
          isLocked: true,
        };
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
}
