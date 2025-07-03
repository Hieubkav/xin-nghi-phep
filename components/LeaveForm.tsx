
import React, { useState, useEffect } from 'react';
import { LeaveRequestData, LeaveType, Tone, WordLimit } from '../types.ts';
import { ValidationService, ValidationError } from '../services/validationService.ts';

interface LeaveFormProps {
  formData: LeaveRequestData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

interface InputFieldProps {
  label: string;
  id: keyof LeaveRequestData;
  value: string;
  onChange: LeaveFormProps['onFormChange'];
  placeholder?: string;
  type?: string;
  required?: boolean;
  errors: ValidationError[];
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, placeholder, type = 'text', required = false, errors }) => {
  const hasError = ValidationService.hasFieldError(id, errors);
  const errorMessage = ValidationService.getFieldErrorMessage(id, errors);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition duration-150 ${
          hasError
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

const CheckboxField: React.FC<{label: string, description: string, id: keyof LeaveRequestData, checked: boolean, onChange: LeaveFormProps['onFormChange']}> = ({ label, description, id, checked, onChange }) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input
                id={id}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
        </div>
        <div className="ml-3 text-sm leading-6">
            <label htmlFor={id} className="font-medium text-gray-900">{label}</label>
            <p className="text-gray-500">{description}</p>
        </div>
    </div>
);


const LeaveForm: React.FC<LeaveFormProps> = ({ formData, onFormChange, onSubmit, isLoading }) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  // Validate form khi có thay đổi
  useEffect(() => {
    if (showValidation) {
      const result = ValidationService.validateForm(formData);
      setValidationErrors(result.errors);
    }
  }, [formData, showValidation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    const result = ValidationService.validateForm(formData);
    setValidationErrors(result.errors);

    if (result.isValid) {
      onSubmit(e);
    } else {
      // Scroll to first error
      const firstErrorField = result.errors[0]?.field;
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
    }
  };

  const formStrength = ValidationService.getFormStrength(formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress bar */}
      {showValidation && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Độ hoàn thiện form</span>
            <span className="text-sm text-gray-500">{formStrength.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                formStrength.percentage >= 80 ? 'bg-green-500' :
                formStrength.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${formStrength.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Họ và tên của bạn" id="fullName" value={formData.fullName} onChange={onFormChange} placeholder="Nguyễn Văn A" required errors={validationErrors} />
          <InputField label="Chức vụ" id="position" value={formData.position} onChange={onFormChange} placeholder="Nhân viên Marketing" required errors={validationErrors} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Tên người nhận (Quản lý/Trưởng phòng)" id="recipientName" value={formData.recipientName} onChange={onFormChange} placeholder="Trần Thị B" required errors={validationErrors} />
          <InputField label="Chức vụ người nhận" id="recipientPosition" value={formData.recipientPosition} onChange={onFormChange} placeholder="Trưởng phòng Nhân sự" required errors={validationErrors} />
        </div>
        <div>
          <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">Loại nghỉ phép <span className="text-red-500">*</span></label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            {Object.values(LeaveType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Ngày bắt đầu nghỉ" id="startDate" value={formData.startDate} onChange={onFormChange} type="text" placeholder="VD: mai, 25/12/2024, thứ 2 tuần tới" required errors={validationErrors} />
          <InputField label="Ngày kết thúc nghỉ" id="endDate" value={formData.endDate} onChange={onFormChange} type="text" placeholder="VD: cuối tuần này, 27/12/2024" required errors={validationErrors} />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Lý do nghỉ phép <span className="text-red-500">*</span></label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={onFormChange}
            rows={3}
            placeholder="Trình bày ngắn gọn lý do bạn cần nghỉ..."
            required
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition duration-150 ${
              ValidationService.hasFieldError('reason', validationErrors)
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {ValidationService.hasFieldError('reason', validationErrors) && (
            <p className="mt-1 text-sm text-red-600">{ValidationService.getFieldErrorMessage('reason', validationErrors)}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Tùy chỉnh & Nâng cao</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Giọng văn</label>
              <select id="tone" name="tone" value={formData.tone} onChange={onFormChange} className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">
                {Object.values(Tone).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="wordLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Số từ cụ thể
                <span className="text-xs text-gray-500 ml-1">(AI sẽ tạo đúng số từ)</span>
              </label>
              <select id="wordLimit" name="wordLimit" value={formData.wordLimit} onChange={onFormChange} className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">
                {Object.values(WordLimit).map(limit => (
                  <option key={limit} value={limit}>{limit}</option>
                ))}
              </select>
              {formData.wordLimit !== WordLimit.UNLIMITED && (
                <p className="mt-1 text-xs text-blue-600">
                  💡 AI sẽ tạo đơn có chính xác {formData.wordLimit.match(/\d+/)?.[0]} từ
                </p>
              )}
            </div>
          </div>
          <fieldset>
             <legend className="text-sm font-medium text-gray-700 mb-2">Tùy chọn khác</legend>
             <div className="space-y-3">
                 <CheckboxField label="Đề nghị làm việc từ xa (nếu có thể)" description="Thêm một câu đề nghị được làm việc từ xa." id="remoteWork" checked={formData.remoteWork} onChange={onFormChange} />
                 <CheckboxField label="Cam kết kiểm tra email" description="Thêm cam kết sẽ kiểm tra email cho việc khẩn cấp." id="checkEmail" checked={formData.checkEmail} onChange={onFormChange} />
             </div>
          </fieldset>
           <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú bàn giao công việc (tùy chọn)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onFormChange}
              rows={2}
              placeholder="Ví dụ: Công việc X đã được bàn giao cho anh B, tài liệu Y ở trong thư mục Z..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition duration-150 ${
                ValidationService.hasFieldError('notes', validationErrors)
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {ValidationService.hasFieldError('notes', validationErrors) && (
              <p className="mt-1 text-sm text-red-600">{ValidationService.getFieldErrorMessage('notes', validationErrors)}</p>
            )}
          </div>
      </div>
    </form>
  );
};

export default LeaveForm;