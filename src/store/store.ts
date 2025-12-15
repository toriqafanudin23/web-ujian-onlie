import { configureStore } from '@reduxjs/toolkit';
import examReducer from './slices/examSlice';
import questionReducer from './slices/questionSlice';

export const store = configureStore({
  reducer: {
    exams: examReducer,
    questions: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
