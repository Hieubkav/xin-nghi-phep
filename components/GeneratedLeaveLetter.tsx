import React, { useState, useEffect } from 'react';
import CopyIcon from './icons/CopyIcon.tsx';
import CheckIcon from './icons/CheckIcon.tsx';
import { PDFService } from '../services/pdfService.ts';

interface GeneratedLeaveLetterProps {
  letterText: string;
  requestedWordCount?: number;
}

const GeneratedLeaveLetter: React.FC<GeneratedLeaveLetterProps> = ({ letterText, requestedWordCount }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hàm đếm số từ
  const countWords = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const wordCount = countWords(letterText);

  // Kiểm tra độ chính xác
  const getWordCountStatus = () => {
    if (!requestedWordCount || !letterText) return null;

    const difference = Math.abs(wordCount - requestedWordCount);
    const accuracy = ((requestedWordCount - difference) / requestedWordCount) * 100;

    if (difference === 0) {
      return { status: 'perfect', message: 'Chính xác!', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (difference <= 5) {
      return { status: 'good', message: `Sai lệch ${difference} từ`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'poor', message: `Sai lệch ${difference} từ`, color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  const wordCountStatus = getWordCountStatus();

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (letterText) {
      navigator.clipboard.writeText(letterText);
      setIsCopied(true);
    }
  };

  const handleExportPDF = async () => {
    if (!letterText) return;

    setIsExporting(true);
    try {
      await PDFService.exportToPDF(letterText, {
        filename: 'don-xin-nghi-phep.pdf',
        title: 'Đơn xin nghỉ phép'
      });
    } catch (error) {
      alert('Có lỗi khi xuất PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    if (!letterText) return;

    setIsExporting(true);
    try {
      await PDFService.exportToWord(letterText, 'don-xin-nghi-phep.docx');
    } catch (error) {
      alert('Có lỗi khi xuất Word. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportText = () => {
    if (!letterText) return;

    try {
      PDFService.exportToText(letterText, 'don-xin-nghi-phep.txt');
    } catch (error) {
      alert('Có lỗi khi xuất Text. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Đơn xin nghỉ phép được tạo bởi AI</h3>
          {letterText && (
            <div className="text-sm mt-1 space-y-1">
              <p className="text-gray-600">
                📊 Số từ: <span className="font-medium text-blue-600">{wordCount} từ</span>
                {requestedWordCount && (
                  <span className="text-gray-500"> / {requestedWordCount} từ yêu cầu</span>
                )}
              </p>
              {wordCountStatus && (
                <p className={`text-xs px-2 py-1 rounded-full inline-block ${wordCountStatus.bgColor} ${wordCountStatus.color}`}>
                  {wordCountStatus.status === 'perfect' ? '✅' : wordCountStatus.status === 'good' ? '⚠️' : '❌'} {wordCountStatus.message}
                </p>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!letterText}
          className={`p-2 rounded-full transition-all duration-200 ${
            isCopied
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Copy to clipboard"
        >
          {isCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[50vh] overflow-y-auto mb-4">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
          {letterText ? letterText : "Nội dung đơn xin nghỉ phép sẽ xuất hiện ở đây sau khi bạn điền thông tin và nhấn nút tạo..."}
        </pre>
      </div>

      {letterText && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Xuất file:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? 'Đang xuất...' : '📄 PDF'}
            </button>
            <button
              onClick={handleExportWord}
              disabled={isExporting}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? 'Đang xuất...' : '📝 Word (.docx)'}
            </button>
            <button
              onClick={handleExportText}
              className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              📋 Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedLeaveLetter;