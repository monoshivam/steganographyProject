const TextInputComponent = ({ text, setText }) => {
  return (
    <div className="h-full">
      <div className="relative w-full h-[400px] border-2 border-blue-400 rounded-lg p-4 hover:border-blue-500 transition-all duration-200 flex flex-col">
        <label
          htmlFor="messageText"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="messageText"
          rows="6"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow resize-none"
          placeholder="Type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default TextInputComponent;
