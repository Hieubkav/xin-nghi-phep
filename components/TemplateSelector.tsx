import React, { useState } from 'react';
import { LeaveRequestData } from '../types.ts';
import { 
  leaveTemplates, 
  getTemplatesByCategory, 
  getCategoryName, 
  getCategoryDescription,
  LeaveTemplate 
} from '../data/templates.ts';

interface TemplateSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: Partial<LeaveRequestData>) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  isVisible, 
  onClose, 
  onSelectTemplate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'common' | 'emergency' | 'special'>('common');

  const handleSelectTemplate = (template: LeaveTemplate) => {
    onSelectTemplate(template.data);
    onClose();
  };

  const categories: Array<'common' | 'emergency' | 'special'> = ['common', 'emergency', 'special'];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Chọn mẫu đơn có sẵn</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex h-[calc(90vh-120px)]">
          {/* Category Sidebar */}
          <div className="w-1/3 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{getCategoryName(category)}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {getCategoryDescription(category)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {getTemplatesByCategory(category).length} mẫu
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Templates List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">
                {getCategoryName(selectedCategory)}
              </h3>
              <p className="text-sm text-gray-600">
                {getCategoryDescription(selectedCategory)}
              </p>
            </div>

            <div className="grid gap-4">
              {getTemplatesByCategory(selectedCategory).map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.category === 'common' ? 'bg-green-100 text-green-800' :
                      template.category === 'emergency' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getCategoryName(template.category)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-medium mr-2">Loại:</span>
                      <span>{template.data.leaveType}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-medium mr-2">Giọng văn:</span>
                      <span>{template.data.tone}</span>
                    </div>
                    
                    {template.data.reason && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Lý do mẫu:</span>
                        <p className="mt-1 italic">"{template.data.reason.substring(0, 100)}..."</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      {template.data.remoteWork && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Làm việc từ xa
                        </span>
                      )}
                      {template.data.checkEmail && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Kiểm tra email
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      Sử dụng mẫu này →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              💡 <strong>Mẹo:</strong> Chọn mẫu phù hợp rồi tùy chỉnh thông tin cá nhân
            </div>
            <div className="text-sm text-gray-500">
              Tổng cộng: {leaveTemplates.length} mẫu đơn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
