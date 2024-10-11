import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShadowButton from '../components/ShadowButton';
import QImg from '../assets/Q_image.svg?url';
import OImg from '../assets/O_image.svg?url';
import XImg from '../assets/X_image.svg?url';
import {
  fetchQuizData,
  submitQuizResult,
  QuizData,
  QuizResult,
} from '../api/quiz/quiz';

interface ModalProps {
  result: boolean;
  description: string;
  reward: number;
}

const ResultModal: React.FC<ModalProps> = ({ result, description, reward }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-40 overflow-y-auto h-full w-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md min-h-0">
        <div className="flex items-center justify-center mb-4">
          <img
            src={result ? OImg : XImg}
            alt={result ? 'Correct' : 'Incorrect'}
          />
        </div>
        <p className="text-3xl font-bold mb-4">
          {result ? '정답입니다!' : '틀렸습니다.'}
        </p>
        <p
          className="text-xl text-gray-600 mb-6"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
        <p className="text-lg font-semibold">
          {result ? `${reward}원을 획득했어요!` : '다음에는 맞춰봐요!'}
        </p>
        <button
          onClick={() => navigate('/main')}
          className="mt-4 bg-customAqua text-white font-bold py-2 px-4 rounded"
        >
          확인
        </button>
      </div>
    </div>
  );
};

const QuizPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const data = await fetchQuizData();
        setQuizData(data);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
      }
    };

    loadQuizData();
  }, []);

  const handleAnswer = async (memberAnswer: 'O' | 'X') => {
    if (!quizData) return;

    try {
      const result = await submitQuizResult({ id: quizData.id, memberAnswer });
      setQuizResult(result);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to submit quiz result:', error);
    }
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="relative bg-customDarkGreen rounded-b-[40px] h-3/5 p-6 flex flex-col items-center pt-16">
        <img src={QImg} alt="Question" />
        <div
          className="bg-white rounded-[20px] shadow-lg p-8 w-11/12 max-w-md flex items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          <p className="text-2xl text-gray-800 font-medium text-center">
            {quizData.question}
          </p>
        </div>
      </div>
      <div className="flex-grow flex flex-col w-full justify-center items-center gap-12 pb-24 px-6">
        {(['O', 'X'] as const).map((answer) => (
          <div key={answer} className="w-full flex justify-center">
            <ShadowButton text={answer} onClick={() => handleAnswer(answer)} />
          </div>
        ))}
      </div>
      {showModal && quizResult && (
        <ResultModal
          result={quizResult.result}
          description={quizResult.description}
          reward={quizResult.reward}
        />
      )}
    </div>
  );
};

export default QuizPage;
