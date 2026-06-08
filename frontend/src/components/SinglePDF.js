import React, { useState } from 'react';
import { FiUploadCloud, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import ResultsDisplay from './ResultsDisplay';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function SinglePDF() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_URL}/api/upload-pdf`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing PDF');
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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/export-excel`,
        {
          data: {
            fileName: result.fileName,
            pageCount: result.pageCount,
          },
          mode: 'single',
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
        mode="single"
        onExport={handleExport}
        onReset={() => setResult(null)}
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
            Upload a PDF File
          </h2>
          <p className="text-slate-200 mb-8">
            Drag and drop your PDF here or click to select
          </p>

          <input
            type="file"
            id="pdf-input"
            accept=".pdf"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />

          <label
            htmlFor="pdf-input"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition transform hover:scale-105 font-semibold"
          >
            Select PDF
          </label>

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
              <p className="text-white mt-4">Processing PDF...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePDF;
