import React, { useState } from "react";
import SendButton from "./components/SendButton";
import TextInputComponent from "./components/TextInputComponent";
import DragAndDrop from "./components/DragAndDrop";
import HeaderComp from "./components/HeaderComp";
import LinkCopyComponent from "./components/LinkCopyComponent";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [link, setLink] = useState("");

  const handleSendData = async () => {
    if (!file || !text.trim()) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text);

      console.log("Sending to server:", {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        messageText: text,
      });

      const response = await fetch("http://127.0.0.1:8000/encrypt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = `http://127.0.0.1:8000${data.download_url}`;
        setLink(downloadUrl);
      } else {
        const error = await response.json();
        console.error("Encryption failed:", error.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFile(null);
      setText("");
      alert("File and message uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Failed to upload data.");
    } finally {
      setIsUploading(false);
    }
  };

  const isSendDisabled = !file || !text.trim() || isUploading;

  return (
    <div className="">
      <div className="text-center text-xl font-semibold bg-gray-100 mb-5 p-4 pb-5">
        <HeaderComp />
      </div>

      <div className="flex justify-between w-full m-3 h-full">
        <div className="flex-1 m-2 h-full">
          <DragAndDrop file={file} setFile={setFile} />
        </div>
        <div className="w-px bg-gray-300 mx-2"></div>
        <div className="flex-1 m-2 h-full">
          <TextInputComponent text={text} setText={setText} />
        </div>
      </div>

      <div className="flex justify-center">
        <SendButton onSend={handleSendData} disabled={isSendDisabled} />
      </div>

      <div className="m-20">
        <LinkCopyComponent link={link} setLink={setLink} />
      </div>

      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-3 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-blue-500 font-medium">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
