import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  UserResponse,
  UserUpdateRequest,
} from "../../service/userService";
import {
  getUsers as apiGetUsers,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  toggleUserLock as apiToggleUserLock,
} from "../../service/userService";

interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (token: string, { rejectWithValue }) => {
    try {
      return await apiGetUsers(token);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      return await apiGetUserById(token, id);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (
    {
      token,
      id,
      payload,
    }: { token: string; id: number; payload: UserUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await apiUpdateUser(token, id, payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update user");
    }
  }
);

export const toggleUserLock = createAsyncThunk(
  "user/toggleLock",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      return await apiToggleUserLock(token, id);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to toggle user lock");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserResponse[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.selectedUser = action.payload;
        }
      )
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          // Update user in list
          state.users = state.users.map((u) =>
            u.id === action.payload.id ? action.payload : u
          );
        }
      )
      .addCase(
        toggleUserLock.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          // Update user in list
          state.users = state.users.map((u) =>
            u.id === action.payload.id ? action.payload : u
          );
        }
      );
  },
});

export default userSlice.reducer;
