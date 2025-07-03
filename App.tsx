
import React, { useState, useCallback, useEffect } from 'react';
import { LeaveRequestData, LeaveType, Tone, WordLimit } from './types.ts';
import LeaveForm from './components/LeaveForm.tsx';
import GeneratedLeaveLetter from './components/GeneratedLeaveLetter.tsx';
import CacheInfo from './components/CacheInfo.tsx';
import TemplateSelector from './components/TemplateSelector.tsx';
import { generateLeaveRequest } from './services/geminiService.ts';
import SparklesIcon from './components/icons/SparklesIcon.tsx';
import { useFormPersistence } from './hooks/useLocalStorage.ts';
import { CacheService } from './services/cacheService.ts';

const App: React.FC = () => {
  // Sử dụng localStorage để lưu form data
  const [formData, setFormData, clearFormData] = useFormPersistence<LeaveRequestData>('leaveFormData', {
    fullName: '',
    position: '',
    recipientName: '',
    recipientPosition: '',
    leaveType: LeaveType.VACATION,
    startDate: '',
    endDate: '',
    reason: '',
    notes: '',
    tone: Tone.FRIENDLY_PROFESSIONAL,
    wordLimit: WordLimit.UNLIMITED,
    remoteWork: false,
    checkEmail: false,
  });

  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showCacheInfo, setShowCacheInfo] = useState<boolean>(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedLetter('');

    // Scroll to the result section on mobile
    const resultElement = document.getElementById('result-section');
    if (resultElement && window.innerWidth < 1024) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const letter = await generateLeaveRequest(formData);
      setGeneratedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleClearData = () => {
    if (showClearConfirm) {
      clearFormData();
      setGeneratedLetter('');
      setError('');
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleSelectTemplate = (templateData: Partial<LeaveRequestData>) => {
    setFormData(prev => ({
      ...prev,
      ...templateData
    }));
  };

  // Initialize cache service
  useEffect(() => {
    CacheService.preloadCommonCaches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Trợ lý Tạo Đơn Xin Nghỉ Phép
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Điền thông tin, tùy chỉnh văn phong và để AI của Gemini giúp bạn soạn một lá đơn chuyên nghiệp.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin & Tùy chỉnh</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  title="Chọn mẫu đơn có sẵn"
                >
                  📋 Mẫu đơn
                </button>
                <button
                  onClick={() => setShowCacheInfo(true)}
                  className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  title="Xem thông tin cache"
                >
                  📊 Cache
                </button>
                <button
                  onClick={handleClearData}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    showClearConfirm
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Xóa tất cả dữ liệu đã lưu"
                >
                  {showClearConfirm ? 'Nhấn lại để xác nhận' : 'Xóa dữ liệu'}
                </button>
              </div>
            </div>
            <LeaveForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div id="result-section" className="flex flex-col">
              <div className="flex-grow sticky top-8">
                 <GeneratedLeaveLetter
                   letterText={generatedLetter}
                   requestedWordCount={
                     formData.wordLimit && formData.wordLimit !== WordLimit.UNLIMITED
                       ? (() => {
                           const match = formData.wordLimit?.match(/\d+/);
                           return match ? parseInt(match[0]) : undefined;
                         })()
                       : undefined
                   }
                 />
                 {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
              <div className="mt-6 sticky bottom-8">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang kiến tạo...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2"/>
                      Tạo đơn bằng AI
                    </>
                  )}
                </button>
              </div>
          </div>
        </main>

         <footer className="text-center mt-12 py-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
                Cung cấp bởi Gemini API. Thiết kế và phát triển với React & Tailwind CSS.
            </p>
        </footer>
      </div>

      {/* Cache Info Modal */}
      <CacheInfo
        isVisible={showCacheInfo}
        onClose={() => setShowCacheInfo(false)}
      />

      {/* Template Selector Modal */}
      <TemplateSelector
        isVisible={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default App;