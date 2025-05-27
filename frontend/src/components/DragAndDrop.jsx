import React, { useState, useRef, useCallback } from "react";

const DragAndDrop = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  const maxSizeInBytes = 10 * 1024 * 1024;

  const validateFile = useCallback((file) => {
    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPEG, and PDF files are allowed.");
      return false;
    }

    if (file.size > maxSizeInBytes) {
      setError("File size must be less than 10MB.");
      return false;
    }

    return true;
  }, [allowedTypes, maxSizeInBytes]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
          setFile(droppedFile);
        }
        e.dataTransfer.clearData();
      }
    },
    [setFile, validateFile],
  );

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return (
        <svg
          className="w-8 h-8 mr-3 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-8 h-8 mr-3 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }
  };

  return (
    <div className="">
      <div
        ref={dropRef}
        className={`
          relative flex flex-col items-center justify-center w-full p-6
          border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : file
                ? "border-green-500 bg-green-50"
                : error
                  ? "border-red-500 bg-red-50"
                  : "border-blue-400 hover:border-blue-500 hover:bg-blue-50"
          }
          rounded-lg h-[400px]
        `}
        onClick={!file ? openFileDialog : undefined}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".png,.jpeg,.jpg,.pdf,image/png,image/jpeg,application/pdf"
        />

        {file ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-800">Selected file:</span>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="overflow-hidden">
                  <p
                    className="font-medium text-gray-900 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 mb-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <p className="mb-2 text-lg font-medium text-gray-700">
              Drag & Drop your file here
            </p>
            <p className="text-sm text-gray-500 mb-1">
              or click to select a file
            </p>
            <p className="text-xs text-blue-500 font-medium">
              Accepted formats: PNG, JPEG, PDF (Max 10MB)
            </p>

            {error && (
              <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
