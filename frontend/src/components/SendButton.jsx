const SendButton = ({ onSend, disabled }) => {
  return (
    <button
      onClick={onSend}
      disabled={disabled}
      className={`
        transition-all duration-200 font-bold text-2xl
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        p-3 pl-10 pr-10
        bg-blue-500 text-white text-center rounded-md shadow-lg

      `}
    >
      Send
    </button>
  );
};

export default SendButton;
