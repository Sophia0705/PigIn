import { useState, useEffect } from 'react';
import { create } from 'zustand';
import ShadowButton from '../components/ShadowButton';
import QImg from '../assets/Q_image.svg?url';
import {
  FlowQuizData,
  FlowQuizResult,
  fetchQuizData,
  submitQuizResult,
} from '../api/quiz/flowQuiz';

interface FlowQuizStore {
  quizData: FlowQuizData | null;
  loading: boolean;
  error: string | null;
  fetchQuizData: () => Promise<void>;
  submitQuizResult: (result: FlowQuizResult) => Promise<void>;
}

const useFlowQuizStore = create<FlowQuizStore>((set) => ({
  quizData: null,
  loading: false,
  error: null,
  fetchQuizData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchQuizData();
      set({ quizData: response, loading: false });
    } catch (error) {
      set({ error: '퀴즈 데이터를 불러오는데 실패했습니다.', loading: false });
    }
  },
  submitQuizResult: async (result) => {
    set({ loading: true, error: null });
    try {
      await submitQuizResult(result);
      set({ loading: false });
    } catch (error) {
      set({ error: '퀴즈 결과 제출에 실패했습니다.', loading: false });
    }
  },
}));

interface ModalProps {
  onClose: () => void;
}

const ResultModal = ({ onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-40 overflow-y-auto h-full w-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
      <p className="text-2xl font-semibold mb-4">내일을 기대하세요!</p>
      <p className="text-xl text-gray-600 mb-6">
        결과는 내일 확인할 수 있습니다.
      </p>
      <button
        onClick={onClose}
        className="mt-4 bg-customAqua text-white font-bold py-2 px-4 rounded"
      >
        확인
      </button>
    </div>
  </div>
);

const FlowQuizPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { quizData, loading, error, fetchQuizData, submitQuizResult } =
    useFlowQuizStore();

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleAnswer = async (prediction: 'UP' | 'DOWN') => {
    if (!quizData) return;

    const result: FlowQuizResult = { id: quizData.id, prediction };
    await submitQuizResult(result);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quizData) {
    return <div>No quiz data available</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="relative bg-customDarkGreen rounded-b-[40px] h-3/5 p-6 flex flex-col items-center pt-16">
        <img src={QImg} alt="Question" className="mb-4" />
        <div
          className="bg-white rounded-[20px] shadow-lg p-8 w-11/12 max-w-md flex flex-col items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          <h2 className="text-3xl font-bold mb-4">{quizData.stockName}</h2>
          <p className="text-xl mb-4">현재 가격: {quizData.currentPrice}원</p>
          <p className="text-2xl text-gray-800 font-semibold text-center">
            내일 이 주식의 가격이 오를까요, 내릴까요?
          </p>
        </div>
      </div>
      <div className="flex-grow flex flex-col w-full justify-center items-center gap-12 pb-24 px-6">
        <div className="w-full flex justify-center">
          <ShadowButton text="UP" onClick={() => handleAnswer('UP')} />
        </div>
        <div className="w-full flex justify-center">
          <ShadowButton text="DOWN" onClick={() => handleAnswer('DOWN')} />
        </div>
      </div>
      {showModal && <ResultModal onClose={closeModal} />}
    </div>
  );
};

export default FlowQuizPage;
