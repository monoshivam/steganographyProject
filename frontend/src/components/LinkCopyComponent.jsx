const LinkCopyComponent = ({ link, setLink }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <label className="text-gray-700 font-bold text-3xl mb-4">Link</label>
      <div className="flex items-center gap-3 w-full max-w-200">
        <input
          type="text"
          value={`${link ? link : "Link will appear here."}`}
          onChange={(e) => setLink(e.target.value)}
          className={`${!link ? "opacity-50" : "opacity-100"} flex-7 px-4 py-2 rounded-md bg-purple-50 border border-purple-100 text-gray-800 text-lg`}
        />
        <button
          onClick={copyToClipboard}
          className="flex flex-2 justify-center items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md transition-colors text-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy link
        </button>
      </div>
    </div>
  );
};

export default LinkCopyComponent;
