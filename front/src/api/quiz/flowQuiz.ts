import axiosInstance from '../axiosInstance';

export interface FlowQuizData {
  stockCode: string;
  stockName: string;
  currentPrice: number;
}

export interface FlowQuizRequest {
  stockCode: string;
  memberAnswer: 'O' | 'X';
}

export const fetchQuizData = async (): Promise<FlowQuizData> => {
  const response = await axiosInstance.get<FlowQuizData>(
    'api/quiz/fluctuation'
  );
  console.log('퀴즈 get!', response.data);
  return response.data;
};

export const submitQuizResult = async (
  FlowQuizRequest: FlowQuizRequest
): Promise<FlowQuizRequest> => {
  const response = await axiosInstance.post<FlowQuizRequest>(
    '/api/quiz/fluctuation',
    FlowQuizRequest
  );
  console.log('퀴즈 결과 req', FlowQuizRequest);
  return response.data;
};
