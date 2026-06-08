import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import axios from 'axios';
import ResultsDisplay from './ResultsDisplay';

function FolderUpload() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState('');

  const handleFiles = async (files) => {
    // Filter only PDF files from the folder
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (pdfFiles.length === 0) {
      setError('No PDF files found in the selected folder');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    pdfFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(
        `${API_URL}/api/process-folder`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing folder');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.items;
    if (files.length > 0) {
      const fileList = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].kind === 'file') {
          fileList.push(files[i].getAsFile());
        }
      }
      if (fileList.length > 0) {
        handleFiles(fileList);
      }
    }
  };

  const handleFolderSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Extract folder name from the first file's path
      const firstFilePath = files[0].webkitRelativePath || files[0].name;
      const folderName = firstFilePath.split('/')[0];
      setSelectedFolderName(folderName);
      handleFiles(files);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/export-excel`,
        {
          data: result,
          mode: 'multiple',
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pdf-analysis-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Error exporting to Excel');
    }
  };

  if (result) {
    return (
      <ResultsDisplay
        result={result}
        mode="multiple"
        onExport={handleExport}
        onReset={() => setResult(null)}
        folderName={selectedFolderName}
      />
    );
  }

  return (
    <div className="fade-in">
      <div
        className={`glass-effect bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-12 transition ${
          dragActive ? 'pulse-border active' : 'pulse-border'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FiUploadCloud className="text-6xl text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Upload a Folder with PDFs
          </h2>
          <p className="text-slate-200 mb-4">
            All PDF files in the folder will be processed and counted
          </p>
          <p className="text-sm text-slate-300 mb-8">
            Supported in Chrome, Edge, and Firefox
          </p>

          <input
            type="file"
            id="folder-input"
            webkitdirectory="true"
            mozdirectory="true"
            onChange={handleFolderSelect}
            className="hidden"
          />

          <label
            htmlFor="folder-input"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition transform hover:scale-105 font-semibold"
          >
            Select Folder
          </label>

          {selectedFolderName && (
            <div className="mt-4 text-white">
              <p className="text-sm text-slate-200">
                Selected Folder: <span className="font-semibold">{selectedFolderName}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500 bg-opacity-20 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-6">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white mt-4">Processing PDFs from folder...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 glass-effect bg-blue-400 bg-opacity-10 backdrop-blur-md rounded-xl">
        <p className="text-blue-100 text-sm">
          <strong>ℹ️ Folder Upload Tips:</strong><br/>
          • Select a folder that contains PDF files<br/>
          • Only PDF files will be processed<br/>
          • Works best with modern browsers (Chrome, Edge, Firefox)<br/>
          • All PDFs in the folder will be counted and summarized
        </p>
      </div>
    </div>
  );
}

export default FolderUpload;
