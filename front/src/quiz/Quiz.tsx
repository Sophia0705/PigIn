import { useState } from 'react';
import ShadowButton from '../components/ShadowButton';
import QImg from '../assets/Q_image.svg?url';
import OImg from '../assets/O_image.svg?url';
import XImg from '../assets/X_image.svg?url';

interface ModalProps {
  isCorrect: boolean;
  explanation: string;
  onClose: () => void;
}

const ResultModal: React.FC<ModalProps> = ({
  isCorrect,
  explanation,
  onClose,
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-40 overflow-y-auto h-full w-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md h-3/5">
      <div className="flex items-center justify-center mb-4">
        {isCorrect ? (
          <img src={OImg} alt="Correct" />
        ) : (
          <img src={XImg} alt="Incorrect" />
        )}
      </div>
      <p className="text-3xl font-semibold mb-4">
        {isCorrect ? '정답입니다!' : '틀렸습니다.'}
      </p>
      <p
        className="text-xl text-gray-600 mb-6"
        dangerouslySetInnerHTML={{ __html: explanation }}
      ></p>
      <button onClick={onClose}>확인</button>
    </div>
  </div>
);

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QuizPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question: Question = {
    text: '주식을 소유하면 회사의 일부를 소유하는 것이다.',
    options: ['O', 'X'],
    correctAnswer: 'O',
    explanation:
      '주식은 회사의 실질적인 일부를 나타내며, 소유자에게 회사의 자산과 수익에 대한 청구권을 부여합니다.',
  };

  const handleAnswer = (answer: string) => {
    setIsCorrect(answer === question.correctAnswer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="relative bg-customDarkGreen rounded-b-[40px] h-3/5 p-6 flex flex-col items-center pt-16">
        <img src={QImg} alt="Question" />
        <div
          className="bg-white rounded-[20px] shadow-lg p-8 w-11/12 max-w-md flex items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          <p className="text-2xl text-gray-800 font-medium text-center">
            {question.text}
          </p>
        </div>
      </div>
      <div className="flex-grow flex flex-col w-full justify-center items-center gap-12 pb-24 px-6">
        {question.options.map((option) => (
          <div key={option} className="w-full flex justify-center">
            <ShadowButton text={option} onClick={() => handleAnswer(option)} />
          </div>
        ))}
      </div>
      {showModal && (
        <ResultModal
          isCorrect={isCorrect}
          explanation={question.explanation}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default QuizPage;
