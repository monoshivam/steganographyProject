import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeaderComp from "./components/HeaderComp";
import EncryptPanel from "./components/EncryptPanel";
import DecryptPanel from "./components/DecryptPanel";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState('encrypt');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="text-center text-xl font-semibold bg-gray-100 mb-2 p-2">
          <HeaderComp activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="container mx-auto px-4 pb-2">
          {activeTab === 'encrypt' ? (
            <EncryptPanel />
          ) : (
            <DecryptPanel />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
