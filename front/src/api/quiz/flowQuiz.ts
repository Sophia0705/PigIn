export interface FlowQuizData {
  id: string;
  stockName: string;
  currentPrice: number;
}

export interface FlowQuizResult {
  id: string;
  prediction: 'UP' | 'DOWN';
}

export const fetchQuizData = async (): Promise<FlowQuizData> => {
  // 임시데이터
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: '1',
          stockName: '삼성전자',
          currentPrice: 70000,
        }),
      1000
    )
  );
};

export const submitQuizResult = async (
  _result: FlowQuizResult
): Promise<void> => {
  // 임시 데이터 반환
  return new Promise((resolve) => setTimeout(resolve, 1000));
};
