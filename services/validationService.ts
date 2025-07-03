import { LeaveRequestData } from '../types.ts';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationService {
  static validateForm(data: LeaveRequestData): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate tên đầy đủ
    if (!data.fullName.trim()) {
      errors.push({ field: 'fullName', message: 'Vui lòng nhập họ và tên' });
    } else if (data.fullName.trim().length < 2) {
      errors.push({ field: 'fullName', message: 'Họ và tên phải có ít nhất 2 ký tự' });
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(data.fullName.trim())) {
      errors.push({ field: 'fullName', message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng' });
    }

    // Validate chức vụ
    if (!data.position.trim()) {
      errors.push({ field: 'position', message: 'Vui lòng nhập chức vụ' });
    } else if (data.position.trim().length < 2) {
      errors.push({ field: 'position', message: 'Chức vụ phải có ít nhất 2 ký tự' });
    }

    // Validate tên người nhận
    if (!data.recipientName.trim()) {
      errors.push({ field: 'recipientName', message: 'Vui lòng nhập tên người nhận' });
    } else if (data.recipientName.trim().length < 2) {
      errors.push({ field: 'recipientName', message: 'Tên người nhận phải có ít nhất 2 ký tự' });
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(data.recipientName.trim())) {
      errors.push({ field: 'recipientName', message: 'Tên người nhận chỉ được chứa chữ cái và khoảng trắng' });
    }

    // Validate chức vụ người nhận
    if (!data.recipientPosition.trim()) {
      errors.push({ field: 'recipientPosition', message: 'Vui lòng nhập chức vụ người nhận' });
    } else if (data.recipientPosition.trim().length < 2) {
      errors.push({ field: 'recipientPosition', message: 'Chức vụ người nhận phải có ít nhất 2 ký tự' });
    }

    // Validate loại nghỉ phép
    if (!data.leaveType) {
      errors.push({ field: 'leaveType', message: 'Vui lòng chọn loại nghỉ phép' });
    }

    // Validate ngày bắt đầu
    if (!data.startDate.trim()) {
      errors.push({ field: 'startDate', message: 'Vui lòng nhập ngày bắt đầu nghỉ' });
    } else {
      const dateValidation = this.validateDateInput(data.startDate.trim());
      if (!dateValidation.isValid) {
        errors.push({ field: 'startDate', message: dateValidation.message });
      }
    }

    // Validate ngày kết thúc
    if (!data.endDate.trim()) {
      errors.push({ field: 'endDate', message: 'Vui lòng nhập ngày kết thúc nghỉ' });
    } else {
      const dateValidation = this.validateDateInput(data.endDate.trim());
      if (!dateValidation.isValid) {
        errors.push({ field: 'endDate', message: dateValidation.message });
      }
    }

    // Validate lý do
    if (!data.reason.trim()) {
      errors.push({ field: 'reason', message: 'Vui lòng nhập lý do nghỉ phép' });
    } else if (data.reason.trim().length < 10) {
      errors.push({ field: 'reason', message: 'Lý do nghỉ phép phải có ít nhất 10 ký tự' });
    } else if (data.reason.trim().length > 500) {
      errors.push({ field: 'reason', message: 'Lý do nghỉ phép không được vượt quá 500 ký tự' });
    }

    // Validate ghi chú (tùy chọn)
    if (data.notes && data.notes.trim().length > 300) {
      errors.push({ field: 'notes', message: 'Ghi chú không được vượt quá 300 ký tự' });
    }

    // Validate số từ
    if (!data.wordLimit) {
      errors.push({ field: 'wordLimit', message: 'Vui lòng chọn số từ cụ thể' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate định dạng ngày tháng
  private static validateDateInput(dateStr: string): { isValid: boolean; message: string } {
    const trimmed = dateStr.trim();
    
    // Cho phép các định dạng linh hoạt
    const flexiblePatterns = [
      /^(ngày mai|mai)$/i,
      /^(hôm nay)$/i,
      /^(thứ [2-7]|chủ nhật) (tuần này|tuần tới|tuần sau)$/i,
      /^(đầu|giữa|cuối) tuần (này|tới|sau)$/i,
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{1,2}-\d{1,2}-\d{4}$/,
      /^(thứ [2-7]|chủ nhật) ngày \d{1,2}\/\d{1,2}$/i,
    ];

    const isFlexibleFormat = flexiblePatterns.some(pattern => pattern.test(trimmed));
    
    if (isFlexibleFormat) {
      return { isValid: true, message: '' };
    }

    // Kiểm tra định dạng ngày cụ thể
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = trimmed.match(datePattern);
    
    if (!match) {
      return {
        isValid: false,
        message: 'Định dạng ngày không hợp lệ. Ví dụ: "mai", "25/12/2024", "thứ 2 tuần tới"'
      };
    }

    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Kiểm tra tính hợp lệ của ngày
    if (dayNum < 1 || dayNum > 31) {
      return { isValid: false, message: 'Ngày phải từ 1 đến 31' };
    }

    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, message: 'Tháng phải từ 1 đến 12' };
    }

    const currentYear = new Date().getFullYear();
    if (yearNum < currentYear || yearNum > currentYear + 2) {
      return { isValid: false, message: `Năm phải từ ${currentYear} đến ${currentYear + 2}` };
    }

    // Kiểm tra ngày hợp lệ trong tháng
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return { isValid: false, message: 'Ngày không tồn tại trong tháng này' };
    }

    return { isValid: true, message: '' };
  }

  // Validate từng field riêng lẻ (cho real-time validation)
  static validateField(fieldName: keyof LeaveRequestData, value: any, allData?: LeaveRequestData): ValidationError | null {
    const tempData = allData || {} as LeaveRequestData;
    tempData[fieldName] = value;

    const result = this.validateForm(tempData);
    const fieldError = result.errors.find(error => error.field === fieldName);
    
    return fieldError || null;
  }

  // Tạo thông báo lỗi thân thiện
  static getFieldErrorMessage(fieldName: string, errors: ValidationError[]): string {
    const error = errors.find(e => e.field === fieldName);
    return error ? error.message : '';
  }

  // Kiểm tra xem field có lỗi không
  static hasFieldError(fieldName: string, errors: ValidationError[]): boolean {
    return errors.some(e => e.field === fieldName);
  }

  // Lấy tất cả lỗi dưới dạng string
  static getAllErrorMessages(errors: ValidationError[]): string[] {
    return errors.map(error => error.message);
  }

  // Kiểm tra độ mạnh của form (tính điểm)
  static getFormStrength(data: LeaveRequestData): { score: number; maxScore: number; percentage: number } {
    let score = 0;
    const maxScore = 10;

    // Điểm cho các field bắt buộc
    if (data.fullName.trim()) score += 1;
    if (data.position.trim()) score += 1;
    if (data.recipientName.trim()) score += 1;
    if (data.recipientPosition.trim()) score += 1;
    if (data.leaveType) score += 1;
    if (data.startDate.trim()) score += 1;
    if (data.endDate.trim()) score += 1;
    if (data.reason.trim()) score += 1;

    // Điểm thưởng cho chất lượng
    if (data.reason.trim().length >= 20) score += 0.3;
    if (data.notes.trim()) score += 0.3;
    if (data.wordLimit) score += 0.4;

    const percentage = Math.round((score / maxScore) * 100);
    
    return { score, maxScore, percentage };
  }
}
