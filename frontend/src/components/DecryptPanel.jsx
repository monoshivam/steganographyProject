import React, { useState } from "react";
import config from "../config";

const DecryptPanel = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");

  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  const maxSizeInBytes = 10 * 1024 * 1024;

  const validateFile = (file) => {
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
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setExtractedText("");
      }
    }
  };

  const handleDecrypt = async () => {
    if (!file) return;

    setIsDecrypting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiUrl}/decrypt`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedText(data.message);
      } else {
        const error = await response.json();
        setError(`Decryption failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error decrypting file:", error);
      setError("Failed to decrypt file. Please try again.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setExtractedText("");
      }
      e.dataTransfer.clearData();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
  };

  const removeFile = () => {
    setFile(null);
    setExtractedText("");
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
    <div className="flex justify-between w-full h-full max-w-full overflow-hidden">
      {/* File Upload Section */}
      <div className="flex-1 mr-2 h-full min-w-0">
        <div
          className={`
            relative flex flex-col items-center justify-center w-full p-6
            border-2 border-dashed transition-all duration-200 rounded-lg h-[400px]
            ${
              file
                ? "border-green-500 bg-green-50"
                : error
                  ? "border-red-500 bg-red-50"
                  : "border-blue-400 hover:border-blue-500 hover:bg-blue-50"
            }
          `}
          onClick={!file ? () => document.getElementById('decrypt-file-input').click() : undefined}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            id="decrypt-file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
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
                Drag & Drop your encrypted file here
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

      <div className="w-px bg-gray-300 mx-2 flex-shrink-0"></div>

      {/* Hidden Information Display */}
      <div className="flex-1 ml-2 h-full min-w-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Hidden Information</h3>
            {extractedText && (
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Copy
              </button>
            )}
          </div>

          <div className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-w-0 h-[320px]">
            {extractedText ? (
              <div className="h-full">
                <textarea
                  value={extractedText}
                  readOnly
                  className="w-full h-full p-3 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  placeholder="Extracted text will appear here..."
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>Select a file and click "Decrypt" to reveal hidden information</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDecrypt}
              disabled={!file || isDecrypting}
              className={`
                px-8 py-3 rounded-md font-medium transition-all duration-200
                ${
                  !file || isDecrypting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 active:transform active:scale-95"
                }
              `}
            >
              {isDecrypting ? "Decrypting..." : "Decrypt"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isDecrypting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-3 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-blue-500 font-medium">Decrypting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecryptPanel;