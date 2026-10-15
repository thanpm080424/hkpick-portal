// CẤU HÌNH CỔNG PHÂN PHỐI HKPICK
// Bạn có thể chỉnh sửa mật khẩu hoặc phiên bản tại đây bất kỳ lúc nào

const APP_CONFIG = {
  appName: "HKPick Auto Tool 1ms",
  version: "1.0.0",
  releaseDate: "13-10-2026",
  changelog: [
    "Tối ưu tốc độ nhận diện ảnh OCR và phản hồi 1ms",
    "Tương thích hoàn hảo với LDPlayer 9 / NoxPlayer và điện thoại Android",
    "Khắc phục hiện tượng delay giật lag khi chạy đa nhiệm",
    "Bảo mật kết nối và cơ chế tự động kiểm tra bản mới"
  ],
  // DANH SÁCH MÃ MỞ KHÓA TẢI APP (Bạn có thể thêm/bớt mã khách hàng tùy ý)
  validPasscodes: [
    "HKPICK88", 
    "VIP888", 
    "1310",
    "ADMIN"
  ],
  // Link file tải được bảo vệ (Chỉ lộ khi nhập đúng mật khẩu)
  downloadUrl: "https://github.com/thanpm080424/hkpick-portal/releases/download/v1.0.0/HKPick_BanMoiNhat_13-10_1ms.apk"
};
