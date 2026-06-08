import React from 'react';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';

function ResultsDisplay({ result, mode, onExport, onReset, folderName }) {
  return (
    <div className="fade-in">
      {/* Success Message */}
      <div className="glass-effect bg-green-400 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-6 flex items-center">
        <FiCheckCircle className="text-3xl text-green-300 mr-4" />
        <p className="text-lg text-green-100">
          {mode === 'single'
            ? 'PDF processed successfully!'
            : `${result.fileCount} PDF(s) processed successfully!`}
        </p>
      </div>

      {/* Results Card */}
      <div className="glass-effect bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 mb-6">
        {mode === 'single' ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-200 text-sm font-semibold uppercase">
                File Name
              </p>
              <p className="text-3xl text-white font-bold break-all">
                {result.fileName}
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <p className="text-slate-200 text-sm font-semibold uppercase mb-2">
                Page Count
              </p>
              <p className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 font-bold">
                {result.pageCount}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folder Name (if provided) */}
            {folderName && (
              <div className="bg-blue-400 bg-opacity-10 rounded-lg p-4 border-l-4 border-blue-400">
                <p className="text-slate-200 text-sm font-semibold uppercase mb-1">
                  Folder Name
                </p>
                <p className="text-white text-lg font-semibold">
                  {folderName}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-slate-200 text-sm font-semibold uppercase">
                  Total Files
                </p>
                <p className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 font-bold">
                  {result.fileCount}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-slate-200 text-sm font-semibold uppercase">
                  Total Pages
                </p>
                <p className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-bold">
                  {result.totalPages}
                </p>
              </div>
            </div>

            {/* File List */}
            <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white bg-opacity-10 border-b border-white border-opacity-10">
                      <th className="px-6 py-4 text-left text-slate-200 font-semibold">
                        File Name
                      </th>
                      <th className="px-6 py-4 text-right text-slate-200 font-semibold">
                        Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.files.map((file, index) => (
                      <tr
                        key={index}
                        className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition"
                      >
                        <td className="px-6 py-4 text-white break-all">
                          {file.fileName}
                        </td>
                        <td className="px-6 py-4 text-right text-pink-300 font-bold">
                          {file.pageCount}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white bg-opacity-20">
                      <td className="px-6 py-4 text-white font-bold">TOTAL</td>
                      <td className="px-6 py-4 text-right text-yellow-300 font-bold text-lg">
                        {result.totalPages}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition transform hover:scale-105 font-semibold"
        >
          <FiDownload className="text-xl" />
          Export to Excel
        </button>

        <button
          onClick={onReset}
          className="px-8 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition font-semibold"
        >
          Process Another
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay;
