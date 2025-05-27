const HeaderComp = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center">
      <div className="flex bg-gray-200 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('encrypt')}
          className={`
            px-6 py-2 rounded-md font-medium transition-all duration-200
            ${activeTab === 'encrypt' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
        >
          Encrypt
        </button>
        <button
          onClick={() => setActiveTab('decrypt')}
          className={`
            px-6 py-2 rounded-md font-medium transition-all duration-200
            ${activeTab === 'decrypt' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
        >
          Decrypt
        </button>
      </div>
    </div>
  );
};

export default HeaderComp;
