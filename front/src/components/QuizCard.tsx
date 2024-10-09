import { useState } from 'react';
import { ChevronUp, ChevronDown, Smile } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface QuizCardProps {
  isLoggedIn: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(true);

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
            <>
              <NavLink to="/quiz">
                <h3 className="text-black font-semibold mb-2">
                  금융 상식 퀴즈
                </h3>
              </NavLink>
              <NavLink to="/flow-quiz">
                <h3>주가 Up Down?!</h3>
              </NavLink>
            </>
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
