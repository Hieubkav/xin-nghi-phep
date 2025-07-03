
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LeaveRequestData } from "../types.ts";
import { CacheService } from "./cacheService.ts";

// Lấy API key từ environment variables hoặc fallback
const API_KEY = import.meta.env.VITE_API_KEY ||
                (import.meta.env.PROD ?
                  'AIzaSyBmjXxu17AAmBXwYdVYPMScbKf8wdM3jwA' : // API key cho production
                  import.meta.env.VITE_API_KEY);

if (!API_KEY) {
  console.warn("VITE_API_KEY is not defined. Using fallback API key for demo purposes.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generatePrompt = (data: LeaveRequestData, currentDate: string): string => {
  let customizationInstructions = `
    **Hướng dẫn về văn phong:**
    - **Giọng văn:** Hãy sử dụng giọng văn **${data.tone}**.
  `;

  // Thêm hướng dẫn về số từ cụ thể
  if (data.wordLimit && data.wordLimit !== "Không quy định số từ") {
    const wordCount = data.wordLimit.match(/\d+/)?.[0];
    if (wordCount) {
      customizationInstructions += `
    - **YÊU CẦU QUAN TRỌNG VỀ SỐ TỪ:** Nội dung đơn phải có CHÍNH XÁC **${wordCount} từ** (không tính tiêu đề và phần ký tên).
    - **CÁCH ĐẾM TỪ:** Mỗi từ được phân tách bởi dấu cách. Ví dụ: "Tôi xin được nghỉ phép" = 5 từ.
    - **BẮT BUỘC:** Sau khi viết xong, hãy đếm lại số từ và điều chỉnh để đạt ĐÚNG ${wordCount} từ. Không được nhiều hơn hoặc ít hơn.
    - **CHIẾN LƯỢC:** Nếu thiếu từ thì thêm chi tiết phù hợp. Nếu thừa từ thì rút gọn nhưng giữ đầy đủ ý nghĩa.
      `;
    }
  }

  let advancedOptionsText = "";
  if (data.remoteWork) {
    advancedOptionsText += `\n- **Đề nghị làm việc từ xa:** Người viết muốn đề nghị được làm việc từ xa nếu có thể trong thời gian nghỉ. Hãy khéo léo thêm một câu phù hợp về việc này.`;
  }
  if (data.checkEmail) {
    advancedOptionsText += `\n- **Cam kết kiểm tra email:** Người viết cam kết sẽ kiểm tra email định kỳ để xử lý các vấn đề khẩn cấp. Hãy thêm lời cam kết này vào đơn.`;
  }
  
  if (advancedOptionsText) {
      customizationInstructions += `
    **Các cam kết và đề nghị bổ sung:**${advancedOptionsText}
      `;
  }

  return `
    Bạn là một trợ lý nhân sự ảo, chuyên viết email xin nghỉ phép chuyên nghiệp tại Việt Nam.
    Dựa vào các thông tin sau đây, hãy soạn thảo **CHỈ PHẦN NỘI DUNG** của một email/đơn xin nghỉ phép.

    **Yêu cầu quan trọng:**
    - **Bối cảnh thời gian:** Hôm nay là ngày **${currentDate}**. Dựa vào ngày này, hãy diễn giải chính xác các cụm từ tương đối như "ngày mai", "tuần sau", "thứ hai tới" để xác định ngày nghỉ.
    - **Xưng hô thông minh:** Dựa vào **tên tiếng Việt của người nhận**, hãy tự động chọn cách xưng hô ("Anh" hoặc "Chị") cho phù hợp trong lời chào. Ví dụ: tên "Minh Anh" nên dùng "Chị", tên "Quang Minh" nên dùng "Anh". Nếu không chắc chắn, hãy dùng "Anh/Chị".
    - **DIỄN GIẢI NGÀY THÁNG:** Bạn PHẢI đọc và hiểu thông tin ngày tháng được cung cấp dưới dạng văn bản tự do (ví dụ: "ngày mai", "thứ 2 tuần tới"). Dựa vào đó, hãy tự xác định ngày bắt đầu và ngày kết thúc theo định dạng dd/mm/yyyy, tính tổng số ngày nghỉ, và trình bày thông tin này một cách rõ ràng trong đơn.
    - **KHÔNG** bao gồm dòng tiêu đề (subject line) của email.
    - **KHÔNG** bao gồm tiêu đề văn bản như "ĐƠN XIN NGHỈ PHÉP".
    - **KHÔNG** bao gồm phần ký tên ("Trân trọng,", "Người làm đơn", tên của bạn, v.v.).
    - **KHÔNG** thêm bất kỳ lời giải thích, ghi chú hay bình luận nào của bạn ngoài nội dung chính của lá đơn.
    - Bắt đầu trực tiếp bằng lời chào phù hợp (ví dụ: "Kính gửi Anh/Chị [Tên người nhận],").
    - Kết thúc bằng một câu cảm ơn chân thành và mong được sự chấp thuận.
    - Đảm bảo tất cả thông tin dưới đây được tích hợp một cách tự nhiên và mạch lạc vào nội dung.

    ${customizationInstructions}

    **Thông tin chi tiết để soạn thảo:**
    - **Tên nhân viên:** ${data.fullName || "[Chưa cung cấp]"}
    - **Chức vụ:** ${data.position || "[Chưa cung cấp]"}
    - **Người nhận:** ${data.recipientName || "[Chưa cung cấp]"}
    - **Chức vụ người nhận:** ${data.recipientPosition || "[Chưa cung cấp]"}
    - **Loại nghỉ phép:** ${data.leaveType || "[Chưa cung cấp]"}
    - **Ngày bắt đầu nghỉ (dưới dạng văn bản):** ${data.startDate || "[Chưa xác định]"}
    - **Ngày kết thúc nghỉ (dưới dạng văn bản):** ${data.endDate || "[Chưa xác định]"}
    - **Lý do:** ${data.reason || "[Chưa cung cấp]"}
    - **Thông tin bàn giao công việc (Ghi chú):** ${data.notes || "Tôi sẽ sắp xếp và bàn giao công việc đầy đủ cho những người liên quan trước khi bắt đầu nghỉ phép để đảm bảo mọi việc vẫn tiến triển thuận lợi."}

    Hãy tạo ra một nội dung hoàn chỉnh, lịch sự, chuyên nghiệp, và sẵn sàng để sao chép-dán vào email ngay lập tức.
  `;
};

export const generateLeaveRequest = async (data: LeaveRequestData): Promise<string> => {
  try {
    // Kiểm tra cache trước
    const cachedResult = CacheService.get(data);
    if (cachedResult) {
      console.log('Using cached result');
      return cachedResult;
    }

    console.log('Generating new result from API');
    const currentDate = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const prompt = generatePrompt(data, currentDate);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Lưu vào cache
    CacheService.set(data, text);

    return text;
  } catch (error) {
    console.error("Error generating leave request:", error);
    if (error instanceof Error) {
        return `Đã xảy ra lỗi khi tạo đơn xin nghỉ phép: ${error.message}. Vui lòng kiểm tra lại API Key và thử lại.`;
    }
    return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
  }
};