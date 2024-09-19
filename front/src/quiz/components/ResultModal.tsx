interface ModalProps {
  isCorrect: boolean;
  explanation: string;  
  onClose: () => void;
}

const ResultModal: React.FC<ModalProps> = ({ isCorrect, explanation, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <div className={`text-7xl font-bold mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? 'O' : 'X'}
        </div>
        <p className="text-2xl font-semibold mb-4">
          {isCorrect ? '정답입니다!' : '틀렸습니다.'}
        </p>
        <p className="text-lg text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: explanation }}></p>
        <button
          onClick={onClose}
          className="bg-customAqua text-white font-bold py-2 px-4 rounded-full"
        >
          확인
        </button>
      </div>
    </div>
  );

  export default ResultModal;