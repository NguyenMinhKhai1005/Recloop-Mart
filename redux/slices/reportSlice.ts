import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as reportService from "../../service/reportService";

export interface Report {
  id: number;
  productTitle: string;
  reason: string;
  reporterName: string;
  createdAt: string;
  isResolved: boolean;
}

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportService.getAllReports();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReportById = createAsyncThunk(
  "reports/fetchReportById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await reportService.getReportById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resolveReport = createAsyncThunk(
  "reports/resolveReport",
  async (id: number, { rejectWithValue }) => {
    try {
      await reportService.resolveReport(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",
  async (id: number, { rejectWithValue }) => {
    try {
      await reportService.deleteReport(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch reports";
      })
      // Resolve Report
      .addCase(resolveReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(
          (report) => report.id === action.payload
        );
        if (index !== -1) {
          state.reports[index].isResolved = true;
        }
      })
      // Delete Report
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (report) => report.id !== action.payload
        );
      })
      // Fetch Report By Id
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch report details";
      });
  },
});

export default reportSlice.reducer;