import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchQuestionsByExamId,
  createQuestion as createQuestionAction,
  updateQuestion as updateQuestionAction,
  deleteQuestion as deleteQuestionAction,
} from "../store/slices/questionSlice";
import type { CreateQuestionData } from "../types";

export function useQuestions(examId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: questions, loading, error } = useSelector((state: RootState) => state.questions);

  useEffect(() => {
    if (examId) {
      dispatch(fetchQuestionsByExamId(examId));
    }
  }, [examId, dispatch]);

  const createQuestion = async (data: CreateQuestionData) => {
    return dispatch(createQuestionAction(data)).unwrap();
  };

  const updateQuestion = async (id: string, data: Partial<CreateQuestionData>) => {
    return dispatch(updateQuestionAction({ id, data })).unwrap();
  };

  const deleteQuestion = async (id: string) => {
    return dispatch(deleteQuestionAction(id)).unwrap();
  };

  return {
    questions,
    loading,
    error,
    refetch: () => examId && dispatch(fetchQuestionsByExamId(examId)),
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
