import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Question, CreateQuestionData } from '../../types';
import { questionApi } from '../../services/api';

interface QuestionState {
  items: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchQuestionsByExamId = createAsyncThunk('questions/fetchByExamId', async (examId: string) => {
  const response = await questionApi.getByExamId(examId);
  return response;
});

export const createQuestion = createAsyncThunk('questions/create', async (data: CreateQuestionData) => {
  const response = await questionApi.create(data);
  return response;
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, data }: { id: string; data: Partial<CreateQuestionData> }) => {
  const response = await questionApi.update(id, data);
  return response;
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id: string) => {
  await questionApi.delete(id);
  return id;
});

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchQuestionsByExamId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestionsByExamId.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchQuestionsByExamId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch questions';
    });

    // Create
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // Update
    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
  },
});

export default questionSlice.reducer;
