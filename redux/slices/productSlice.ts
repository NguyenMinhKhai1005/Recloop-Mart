import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Product,
  RejectProductPayload,
} from "../../service/productService";
import {
  getProducts as apiGetProducts,
  getProductById as apiGetProductById,
  approveProduct as apiApproveProduct,
  rejectProduct as apiRejectProduct,
} from "../../service/productService";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await apiGetProducts(token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const data = await apiGetProductById(token, id);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch product");
    }
  }
);

export const approveProduct = createAsyncThunk(
  "product/approve",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const data = await apiApproveProduct(token, id);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to approve product");
    }
  }
);

export const rejectProduct = createAsyncThunk(
  "product/reject",
  async (
    {
      token,
      id,
      payload,
    }: { token: string; id: number; payload: RejectProductPayload },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRejectProduct(token, id, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to reject product");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        approveProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          // Update product in list
          state.products = state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
        }
      )
      .addCase(approveProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(rejectProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        rejectProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          // Update product in list
          state.products = state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
        }
      )
      .addCase(rejectProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
