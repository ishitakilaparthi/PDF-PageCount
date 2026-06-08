import React, { useState } from 'react';
import { FiFileText, FiFolder, FiDownloadCloud } from 'react-icons/fi';
import SinglePDF from './components/SinglePDF';
import MultiplePDF from './components/MultiplePDF';
import FolderUpload from './components/FolderUpload';
import './index.css';

function App() {
  const [mode, setMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-indigo-600 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            📄 PDF Page Counter
          </h1>
          <p className="text-xl text-slate-200">
            Easily count pages in your PDF files
          </p>
        </div>

        {/* Mode Selection */}
        {!mode ? (
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <button
              onClick={() => setMode('single')}
              className="glass-effect bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 hover:bg-opacity-20 transition transform hover:scale-105 cursor-pointer fade-in"
            >
              <FiFileText className="text-6xl text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Single PDF
              </h2>
              <p className="text-slate-200">
                Upload one PDF and get the page count
              </p>
            </button>

            <button
              onClick={() => setMode('multiple')}
              className="glass-effect bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 hover:bg-opacity-20 transition transform hover:scale-105 cursor-pointer fade-in"
            >
              <FiFolder className="text-6xl text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Multiple PDFs
              </h2>
              <p className="text-slate-200">
                Upload multiple PDFs and get a summary
              </p>
            </button>

            <button
              onClick={() => setMode('folder')}
              className="glass-effect bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 hover:bg-opacity-20 transition transform hover:scale-105 cursor-pointer fade-in"
            >
              <FiDownloadCloud className="text-6xl text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Upload Folder
              </h2>
              <p className="text-slate-200">
                Select a folder with PDFs and process all
              </p>
            </button>
          </div>
        ) : (
          <div className="px-4">
            <button
              onClick={() => setMode(null)}
              className="mb-6 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
            >
              ← Back
            </button>
            {mode === 'single' && <SinglePDF />}
            {mode === 'multiple' && <MultiplePDF />}
            {mode === 'folder' && <FolderUpload />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
