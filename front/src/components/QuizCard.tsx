import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Smile, Lock } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface QuizCardProps {
  isLoggedIn: boolean;
  fetchQuizStatus: () => Promise<{
    oxQuizSolved: boolean;
    stockQuizSolved: boolean;
  }>;
}

const QuizCard = ({ isLoggedIn, fetchQuizStatus }: QuizCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [quizStatus, setQuizStatus] = useState({
    oxQuizSolved: false,
    stockQuizSolved: false,
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuizStatus().then(setQuizStatus);
    }
  }, [isLoggedIn, fetchQuizStatus]);

  const allQuizzesSolved =
    quizStatus.oxQuizSolved && quizStatus.stockQuizSolved;

  useEffect(() => {
    if (allQuizzesSolved) {
      setIsOpen(false);
    }
  }, [allQuizzesSolved]);

  const QuizLink = ({
    to,
    disabled,
    children,
  }: {
    to: string;
    disabled: boolean;
    children: React.ReactNode;
  }) =>
    disabled ? (
      <div className="flex items-center text-gray-500 cursor-not-allowed">
        {children}
        <Lock size={20} className="ml-2" />
      </div>
    ) : (
      <NavLink
        to={to}
        className="text-black hover:text-teal-600 transition-colors"
      >
        {children}
      </NavLink>
    );

  return (
    <div className="bg-teal-400 text-white rounded-xl mb-4 overflow-hidden">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">오늘의 Quiz</h2>
        {isOpen ? (
          <ChevronUp className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6" />
        )}
      </div>
      {isOpen && (
        <div className="bg-white text-black p-4">
          {isLoggedIn ? (
            allQuizzesSolved ? (
              <p className="text-black font-semibold">
                오늘의 퀴즈를 다 푸셨어요!
              </p>
            ) : (
              <>
                <QuizLink to="/quiz" disabled={quizStatus.oxQuizSolved}>
                  <h3 className="font-semibold mb-2">금융 상식 퀴즈</h3>
                </QuizLink>
                <QuizLink to="/flow-quiz" disabled={quizStatus.stockQuizSolved}>
                  <h3>주가 Up Down?!</h3>
                </QuizLink>
              </>
            )
          ) : (
            <div className="flex items-center">
              <p>로그인 하고 퀴즈를 풀어보세요</p>
              <Smile size={30} color="pink" className="ml-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizCard;
