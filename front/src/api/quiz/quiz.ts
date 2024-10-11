import axiosInstance from '../axiosInstance';

export interface QuizData {
  id: number;
  question: string;
}

export interface QuizRequest {
  id: number;
  memberAnswer: 'O' | 'X';
}

export interface QuizResult {
  result: boolean;
  description: string;
  reward: number;
}

// 퀴즈 데이터 조회
export const fetchQuizData = async (): Promise<QuizData> => {
  const response = await axiosInstance.get<QuizData>('/api/quiz/daily');
  console.log('퀴즈 get!', response.data);
  return response.data;
};

// 퀴즈 결과 제출
export const submitQuizResult = async (
  quizRequest: QuizRequest
): Promise<QuizResult> => {
  const response = await axiosInstance.post<QuizResult>(
    '/api/quiz/result',
    quizRequest
  );
  console.log('퀴즈 결과 req', quizRequest);
  console.log('퀴즈 결과 res', response.data);
  return response.data;
};
