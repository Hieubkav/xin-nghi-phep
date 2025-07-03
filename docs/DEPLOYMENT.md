# 🚀 Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Chuẩn bị Repository

### 1.1 Fork hoặc Clone
```bash
git clone https://github.com/your-username/trợ-lý-tạo-đơn-xin-nghỉ-phép.git
cd trợ-lý-tạo-đơn-xin-nghỉ-phép
```

### 1.2 Cài đặt dependencies
```bash
npm install
```

## Bước 2: Cấu hình API Key

### 2.1 Lấy Gemini API Key
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với Google Account
3. Tạo API Key mới
4. Copy API Key

### 2.2 Thêm API Key vào GitHub Secrets
1. Vào repository trên GitHub
2. Chọn `Settings` > `Secrets and variables` > `Actions`
3. Click `New repository secret`
4. Name: `VITE_API_KEY`
5. Secret: Paste API key của bạn
6. Click `Add secret`

## Bước 3: Enable GitHub Pages

### 3.1 Cấu hình Pages
1. Vào `Settings` > `Pages`
2. Source: Chọn `GitHub Actions`
3. Save

### 3.2 Cập nhật base URL (nếu cần)
Trong file `vite.config.ts`, đảm bảo base path đúng:
```typescript
const base = isProduction ? '/trợ-lý-tạo-đơn-xin-nghỉ-phép/' : '/';
```

## Bước 4: Deploy

### 4.1 Push code
```bash
git add .
git commit -m "feat: deploy to GitHub Pages"
git push origin main
```

### 4.2 Kiểm tra deployment
1. Vào tab `Actions` trên GitHub
2. Xem workflow `Deploy to GitHub Pages`
3. Đợi build hoàn thành (khoảng 2-3 phút)

## Bước 5: Truy cập ứng dụng

URL: `https://your-username.github.io/trợ-lý-tạo-đơn-xin-nghỉ-phép/`

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. Build failed - API Key not found
**Nguyên nhân**: Chưa set VITE_API_KEY trong GitHub Secrets
**Giải pháp**: Làm theo Bước 2.2

#### 2. 404 Page not found
**Nguyên nhân**: Base path không đúng
**Giải pháp**: Kiểm tra base path trong vite.config.ts

#### 3. Blank page
**Nguyên nhân**: JavaScript error
**Giải pháp**: Mở DevTools, kiểm tra Console errors

#### 4. API calls failed
**Nguyên nhân**: API key không hợp lệ hoặc hết quota
**Giải pháp**: Kiểm tra API key và quota tại Google AI Studio

## 📊 Monitoring

### Kiểm tra logs
1. Vào `Actions` > Workflow run
2. Click vào job `build-and-deploy`
3. Xem logs chi tiết

### Performance monitoring
- Sử dụng tính năng Cache Info trong app
- Theo dõi hit rate và performance

## 🔄 Auto-deployment

Workflow sẽ tự động chạy khi:
- Push vào branch `main`
- Tạo Pull Request vào `main`

## 🛡️ Security Best Practices

1. **Không commit API key** vào code
2. **Sử dụng GitHub Secrets** cho sensitive data
3. **Kiểm tra permissions** của GitHub Actions
4. **Monitor API usage** để tránh vượt quota

## 📱 Custom Domain (Optional)

### Thêm custom domain:
1. Tạo file `CNAME` trong thư mục `public/`:
```
your-domain.com
```

2. Cấu hình DNS:
```
Type: CNAME
Name: www (hoặc @)
Value: your-username.github.io
```

3. Vào `Settings` > `Pages` > Custom domain
4. Nhập domain và Save

## 🎯 Next Steps

Sau khi deploy thành công:
1. Test tất cả tính năng
2. Chia sẻ link với team
3. Collect feedback
4. Monitor usage và performance
5. Plan cho version tiếp theo

---

**🎉 Chúc mừng! Ứng dụng của bạn đã live trên GitHub Pages!**
