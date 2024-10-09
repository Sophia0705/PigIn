import axiosInstance from '../axiosInstance';

export interface QuizStatus {
  oxQuizSolved: boolean;
  stockQuizSolved: boolean;
}

export const fetchQuizStatus = async (): Promise<QuizStatus> => {
  const response = await axiosInstance.get<QuizStatus>('/api/quiz/status');
  return response.data;
};
