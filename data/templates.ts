import { LeaveRequestData, LeaveType, Tone, WordLimit } from '../types.ts';

export interface LeaveTemplate {
  id: string;
  name: string;
  description: string;
  category: 'common' | 'emergency' | 'special';
  data: Partial<LeaveRequestData>;
}

export const leaveTemplates: LeaveTemplate[] = [
  // Common templates
  {
    id: 'vacation-annual',
    name: 'Nghỉ phép năm',
    description: 'Template chuẩn cho nghỉ phép năm',
    category: 'common',
    data: {
      leaveType: LeaveType.VACATION,
      reason: 'Tôi xin được nghỉ phép năm để nghỉ ngơi và tái tạo năng lượng sau thời gian làm việc.',
      tone: Tone.FRIENDLY_PROFESSIONAL,
      wordLimit: WordLimit.UNLIMITED,
      notes: 'Tôi sẽ sắp xếp và bàn giao công việc đầy đủ cho đồng nghiệp trước khi nghỉ phép.',
      checkEmail: true
    }
  },
  {
    id: 'sick-leave',
    name: 'Nghỉ ốm',
    description: 'Template cho đơn xin nghỉ ốm',
    category: 'common',
    data: {
      leaveType: LeaveType.SICK,
      reason: 'Tôi xin được nghỉ ốm do sức khỏe không đảm bảo, cần thời gian nghỉ ngơi để phục hồi.',
      tone: Tone.FORMAL,
      wordLimit: WordLimit.WORDS_150,
      notes: 'Tôi sẽ cung cấp giấy chứng nhận y tế nếu cần thiết.',
      remoteWork: false,
      checkEmail: false
    }
  },
  {
    id: 'personal-business',
    name: 'Nghỉ việc riêng',
    description: 'Template cho nghỉ việc cá nhân',
    category: 'common',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được nghỉ phép để giải quyết một số việc cá nhân quan trọng.',
      tone: Tone.FRIENDLY_PROFESSIONAL,
      wordLimit: WordLimit.WORDS_200,
      notes: 'Tôi sẽ hoàn thành các công việc cấp bách trước khi nghỉ và bàn giao các việc khác cho đồng nghiệp.',
      checkEmail: true
    }
  },

  // Emergency templates
  {
    id: 'family-emergency',
    name: 'Khẩn cấp gia đình',
    description: 'Template cho trường hợp khẩn cấp gia đình',
    category: 'emergency',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được nghỉ phép khẩn cấp do có việc gia đình đột xuất cần xử lý ngay.',
      tone: Tone.FORMAL,
      wordLimit: WordLimit.WORDS_100,
      notes: 'Tôi sẽ liên hệ với đồng nghiệp để bàn giao công việc cấp bách và sẽ cập nhật tình hình sớm nhất có thể.',
      checkEmail: true
    }
  },
  {
    id: 'medical-emergency',
    name: 'Cấp cứu y tế',
    description: 'Template cho trường hợp cấp cứu y tế',
    category: 'emergency',
    data: {
      leaveType: LeaveType.SICK,
      reason: 'Tôi xin được nghỉ phép do cần đi cấp cứu/khám bệnh khẩn cấp.',
      tone: Tone.FORMAL,
      wordLimit: WordLimit.WORDS_100,
      notes: 'Tôi sẽ cung cấp giấy tờ y tế và cập nhật tình hình sức khỏe khi có thể.',
      remoteWork: false,
      checkEmail: false
    }
  },

  // Special templates
  {
    id: 'wedding-leave',
    name: 'Nghỉ cưới',
    description: 'Template cho nghỉ phép cưới hỏi',
    category: 'special',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được nghỉ phép để tổ chức đám cưới và các nghi lễ liên quan.',
      tone: Tone.FRIENDLY_PROFESSIONAL,
      wordLimit: WordLimit.WORDS_250,
      notes: 'Tôi đã sắp xếp và bàn giao toàn bộ công việc cho đồng nghiệp. Sẽ cung cấp giấy đăng ký kết hôn nếu cần.',
      checkEmail: true
    }
  },
  {
    id: 'maternity-leave',
    name: 'Nghỉ thai sản',
    description: 'Template cho nghỉ thai sản',
    category: 'special',
    data: {
      leaveType: LeaveType.OTHER,
      reason: 'Tôi xin được nghỉ thai sản theo quy định của pháp luật để chăm sóc con nhỏ.',
      tone: Tone.FORMAL,
      wordLimit: WordLimit.WORDS_300,
      notes: 'Tôi đã chuẩn bị đầy đủ giấy tờ thai sản và sẽ bàn giao công việc chi tiết cho người thay thế.',
      remoteWork: false,
      checkEmail: false
    }
  },
  {
    id: 'study-leave',
    name: 'Nghỉ học tập',
    description: 'Template cho nghỉ phép học tập, thi cử',
    category: 'special',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được nghỉ phép để tham gia kỳ thi/khóa học quan trọng nhằm nâng cao trình độ chuyên môn.',
      tone: Tone.FRIENDLY_PROFESSIONAL,
      wordLimit: WordLimit.WORDS_200,
      notes: 'Việc học tập này sẽ giúp tôi nâng cao năng lực làm việc, đóng góp tích cực hơn cho công ty.',
      checkEmail: true
    }
  },
  {
    id: 'bereavement-leave',
    name: 'Nghỉ tang lễ',
    description: 'Template cho nghỉ phép tang lễ',
    category: 'emergency',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được nghỉ phép để lo hậu sự cho người thân trong gia đình.',
      tone: Tone.FORMAL,
      wordLimit: WordLimit.WORDS_150,
      notes: 'Tôi sẽ cung cấp giấy chứng tử và các giấy tờ liên quan nếu cần thiết.',
      remoteWork: false,
      checkEmail: false
    }
  },
  {
    id: 'remote-work',
    name: 'Làm việc từ xa',
    description: 'Template cho đề nghị làm việc từ xa',
    category: 'special',
    data: {
      leaveType: LeaveType.PERSONAL,
      reason: 'Tôi xin được làm việc từ xa do có việc cá nhân cần xử lý nhưng vẫn có thể đảm bảo công việc.',
      tone: Tone.FRIENDLY_PROFESSIONAL,
      wordLimit: WordLimit.WORDS_250,
      notes: 'Tôi cam kết hoàn thành đầy đủ công việc được giao và sẽ online thường xuyên để phối hợp với team.',
      remoteWork: true,
      checkEmail: true
    }
  }
];

export const getTemplatesByCategory = (category: 'common' | 'emergency' | 'special') => {
  return leaveTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return leaveTemplates.find(template => template.id === id);
};

export const getAllTemplates = () => {
  return leaveTemplates;
};

export const getCategoryName = (category: 'common' | 'emergency' | 'special') => {
  const names = {
    common: 'Thông dụng',
    emergency: 'Khẩn cấp',
    special: 'Đặc biệt'
  };
  return names[category];
};

export const getCategoryDescription = (category: 'common' | 'emergency' | 'special') => {
  const descriptions = {
    common: 'Các mẫu đơn thường dùng hàng ngày',
    emergency: 'Các mẫu đơn cho tình huống khẩn cấp',
    special: 'Các mẫu đơn cho trường hợp đặc biệt'
  };
  return descriptions[category];
};
