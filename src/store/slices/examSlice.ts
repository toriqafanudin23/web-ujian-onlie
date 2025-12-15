import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import type { Exam, CreateExamData } from '../../types';
import { examApi } from '../../services/api';

interface ExamState {
  items: Exam[];
  currentExam: Exam | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  items: [],
  currentExam: null,
  loading: false,
  error: null,
};

export const fetchExams = createAsyncThunk('exams/fetchAll', async () => {
  const response = await examApi.getAll();
  return response;
});

export const fetchExamById = createAsyncThunk('exams/fetchOne', async (id: string) => {
  const response = await examApi.getById(id);
  return response;
});

export const createExam = createAsyncThunk('exams/create', async (data: CreateExamData) => {
  const response = await examApi.create(data);
  return response;
});

export const updateExam = createAsyncThunk('exams/update', async ({ id, data }: { id: string; data: Partial<CreateExamData> }) => {
  const response = await examApi.update(id, data);
  return response;
});

export const deleteExam = createAsyncThunk('exams/delete', async (id: string) => {
  await examApi.delete(id);
  return id;
});

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder.addCase(fetchExams.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExams.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchExams.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch exams';
    });

    // Fetch One
    builder.addCase(fetchExamById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExamById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentExam = action.payload;
    });
    builder.addCase(fetchExamById.rejected, (state, action) => {
      state.loading = false;
      state.currentExam = null; // Clear if not found or error
      state.error = action.error.message || 'Failed to fetch exam';
    });

    // Create
    builder.addCase(createExam.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // Update
    builder.addCase(updateExam.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentExam?.id === action.payload.id) {
        state.currentExam = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteExam.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.currentExam?.id === action.payload) {
        state.currentExam = null;
      }
    });
  },
});

export const { clearCurrentExam } = examSlice.actions;
export default examSlice.reducer;
