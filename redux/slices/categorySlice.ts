import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoryRequest } from "../../service/categoryService";
import {
  getCategories as apiGetCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "../../service/categoryService";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await apiGetCategories(token);
      return data;
    } catch (err: any) {
      if (err && typeof err === "object" && "message" in err) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (
    { token, payload }: { token: string; payload: CategoryRequest },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiCreateCategory(token, payload);
      return data;
    } catch (err: any) {
      if (err && typeof err === "object" && "message" in err) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (
    {
      token,
      id,
      payload,
    }: { token: string; id: number; payload: CategoryRequest },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiUpdateCategory(token, id, payload);
      return data;
    } catch (err: any) {
      if (err && typeof err === "object" && "message" in err) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const data = await apiDeleteCategory(token, id);
      return { id, data }; // Return ID for state update
    } catch (err: any) {
      console.error("Delete category thunk error:", err);
      if (err && typeof err === "object") {
        if ("status" in err && err.status === 500) {
          // Check if it's a foreign key constraint error
          if ("message" in err && typeof err.message === "string") {
            if (
              err.message.includes("REFERENCE constraint") ||
              err.message.includes("FK__Products__Catego") ||
              err.message.includes("contains products")
            ) {
              return rejectWithValue(
                "Cannot delete this category because it contains products. Please move or delete all products in this category first."
              );
            }
          }
          return rejectWithValue(
            "Cannot delete category due to database constraints. It may contain related data."
          );
        }
        if ("message" in err) {
          return rejectWithValue(err.message);
        }
      }
      return rejectWithValue("Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        // Sau khi tạo thành công, không cập nhật state.categories ở đây
        // Để đảm bảo đồng bộ dữ liệu mới nhất, hãy fetch lại toàn bộ danh sách ở component
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        // Không cập nhật state.categories ở đây, luôn fetch lại list ở component để đồng bộ tuyệt đối
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        // Không cập nhật state.categories ở đây, luôn fetch lại list ở component để đồng bộ tuyệt đối
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
