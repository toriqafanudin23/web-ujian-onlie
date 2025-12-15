import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchExams,
  createExam as createExamAction,
  updateExam as updateExamAction,
  deleteExam as deleteExamAction,
} from "../store/slices/examSlice";
import type { CreateExamData } from "../types";

export function useExams() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: exams, loading, error } = useSelector((state: RootState) => state.exams);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const createExam = async (data: CreateExamData) => {
    return dispatch(createExamAction(data)).unwrap();
  };

  const updateExam = async (id: string, data: Partial<CreateExamData>) => {
    return dispatch(updateExamAction({ id, data })).unwrap();
  };

  const deleteExam = async (id: string) => {
    return dispatch(deleteExamAction(id)).unwrap();
  };

  return {
    exams,
    loading,
    error,
    refetch: () => dispatch(fetchExams()),
    createExam,
    updateExam,
    deleteExam,
  };
}
