import React from "react";

interface ButtonSubmitProps {
  text: string;
  onClick?: () => void;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ text, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="text-xl w-full px-4 py-2 mt-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-md"
    >
      {text}
    </button>
  );
};

export default ButtonSubmit;
