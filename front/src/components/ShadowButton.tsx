interface ButtonProps {
  text: string;
  onClick: () => void;
}

const ShadowButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 w-3/4 rounded-xl border-1 border-gray-800 
      shadow-[0px_10px_0px_0px_#00C99D] bg-customAqua text-4xl font-semibold cursor-pointer 
      hover:opacity-90 transition-opacity`}
    >
      {text}
    </button>
  );
};

export default ShadowButton;
