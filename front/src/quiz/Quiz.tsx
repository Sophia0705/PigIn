import { useState } from 'react';
import ResultModal from './components/ResultModal';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string; 
}

interface ModalProps {
  isCorrect: boolean;
  explanation: string;  
  onClose: () => void;
}



const QuizPage: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question: Question = {
    text: '주식을 소유하면 회사의 일부를 소유하는 것이다.',
    options: ['O', 'X'],
    correctAnswer: 'O',
    explanation: '주식은 회사의 실질적인 일부를 나타내며, 소유자에게 회사의 자산과 수익에 대한 청구권을 부여합니다.'
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === question.correctAnswer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="relative bg-customDarkGreen rounded-b-[40px] h-3/5 p-6 flex flex-col items-center pt-16">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          <span className="text-white font-bold text-5xl">Q</span>
        </div>
        <div className="bg-white rounded-[20px] shadow-lg p-8 mt-12 w-11/12 max-w-md flex items-center justify-center" style={{ minHeight: '300px' }}>
          <p className="text-2xl text-gray-800 font-medium text-center">{question.text}</p>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center p-6 space-y-4">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="relative w-full py-5 rounded-full font-bold text-2xl text-black overflow-hidden"
          >
            <div className="absolute inset-0 bg-teal-600 opacity-50"></div>
            <div className={`absolute inset-0 bg-customAqua rounded-full transform transition-transform origin-left ${selectedAnswer === option ? 'scale-x-100' : 'scale-x-0'}`}></div>
            <span className="relative z-10">{option}</span>
          </button>
        ))}
      </div>
      {showModal && <ResultModal isCorrect={isCorrect} explanation={question.explanation} onClose={closeModal} />}
    </div>
  );
};

export default QuizPage;