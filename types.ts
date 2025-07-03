
export enum Tone {
  FRIENDLY_PROFESSIONAL = "Thân thiện & Chuyên nghiệp",
  FORMAL = "Trang trọng",
  CONCISE = "Ngắn gọn & Trực tiếp",
}

export enum WordLimit {
  UNLIMITED = "Không quy định số từ",
  WORDS_100 = "Đúng 100 từ",
  WORDS_150 = "Đúng 150 từ",
  WORDS_200 = "Đúng 200 từ",
  WORDS_250 = "Đúng 250 từ",
  WORDS_300 = "Đúng 300 từ",
}

export interface LeaveRequestData {
  fullName: string;
  position: string;
  recipientName: string;
  recipientPosition: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes: string;
  // New customization fields
  tone: string;
  wordLimit: string;
  remoteWork: boolean;
  checkEmail: boolean;
}

export enum LeaveType {
  SICK = "Nghỉ ốm",
  VACATION = "Nghỉ phép năm",
  PERSONAL = "Nghỉ việc riêng",
  UNPAID = "Nghỉ không lương",
  OTHER = "Khác",
}