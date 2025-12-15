import { useState, useEffect, useCallback } from 'react';
import { questionBankApi } from '../services/api';
import type { QuestionBank, CreateQuestionBankData, QuestionType } from '../types';

interface FilterParams {
  subject?: string;
  topic?: string;
  difficulty?: string;
  type?: QuestionType;
  tags?: string;
}

export function useQuestionBank() {
  const [questions, setQuestions] = useState<QuestionBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionBankApi.getAll();
      setQuestions(data);
    } catch (err) {
      setError('Failed to load question bank');
      console.error('Error fetching question bank:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchQuestions = useCallback(async (filters: FilterParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionBankApi.search(filters);
      setQuestions(data);
    } catch (err) {
      setError('Failed to search questions');
      console.error('Error searching questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuestion = useCallback(async (data: CreateQuestionBankData) => {
    try {
      const newQuestion = await questionBankApi.create(data);
      setQuestions(prev => [newQuestion, ...prev]);
      return newQuestion;
    } catch (err) {
      console.error('Error creating question:', err);
      throw err;
    }
  }, []);

  const updateQuestion = useCallback(async (id: string, data: Partial<CreateQuestionBankData>) => {
    try {
      const updated = await questionBankApi.update(id, data);
      setQuestions(prev => prev.map(q => q.id === id ? updated : q));
      return updated;
    } catch (err) {
      console.error('Error updating question:', err);
      throw err;
    }
  }, []);

  const deleteQuestion = useCallback(async (id: string) => {
    try {
      await questionBankApi.delete(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
      throw err;
    }
  }, []);

  const copyToExam = useCallback(async (bankId: string, examId: string) => {
    try {
      const examQuestion = await questionBankApi.copyToExam(bankId, examId);
      // Update local state to reflect increased usage count
      setQuestions(prev => prev.map(q => 
        q.id === bankId ? { ...q, usageCount: q.usageCount + 1 } : q
      ));
      return examQuestion;
    } catch (err) {
      console.error('Error copying to exam:', err);
      throw err;
    }
  }, []);

  const bulkCopyToExam = useCallback(async (bankIds: string[], examId: string) => {
    try {
      const examQuestions = await questionBankApi.bulkCopyToExam(bankIds, examId);
      // Update local state to reflect increased usage counts
      setQuestions(prev => prev.map(q => 
        bankIds.includes(q.id) ? { ...q, usageCount: q.usageCount + 1 } : q
      ));
      return examQuestions;
    } catch (err) {
      console.error('Error bulk copying to exam:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    searchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    copyToExam,
    bulkCopyToExam,
  };
}
