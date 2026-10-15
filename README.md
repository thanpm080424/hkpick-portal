# ⚡ HKPick Auto Tool 1ms - Cổng Phân Phối & Cập Nhật Bảo Mật

Trang web chính thức được triển khai tự động lên GitHub Pages:
👉 **Website Truy Cập:** [https://thanpm080424.github.io/hkpick-portal/](https://thanpm080424.github.io/hkpick-portal/)

---

## 🛡️ Cơ Chế Bảo Mật & Chống Lộ File APK

1. **Khóa Mật Khẩu Khách Hàng (Gatekeeper):**
   - Người ngoài, bot quét link hoặc đối thủ vào web **hoàn toàn không thấy link tải**.
   - Bắt buộc phải nhập đúng **Mã Khách Hàng / Mật khẩu** thì nút tải mới xuất hiện.
   - Các mã mở khóa mẫu đang cài sẵn: `HKPICK88`, `VIP888`, `1310`, `ADMIN`.

2. **Cách Đổi Hoặc Thêm Mật Khẩu:**
   - Mở file `config.js` trong thư mục này, tìm phần `validPasscodes` và chỉnh sửa:
     ```javascript
     validPasscodes: [
       "MAT_KHAU_CUA_BAN",
       "KHACH_HANG_A",
       "KHACH_HANG_B"
     ],
     ```
   - Chạy lệnh sau để lưu lên web:
     ```bash
     git add config.js
     git commit -m "Cap nhat mat khau moi"
     git push
     ```

---

## 🔄 Cách Phát Hành Bản Cập Nhật Mới (Sau Này)

Khi bạn có bản APK mới (ví dụ bản `20-10` hay `v1.0.1`):

### Bước 1: Tải bản APK mới lên GitHub Release
Mở terminal tại thư mục này và chạy:
```bash
gh release create v1.0.1 "ĐƯỜNG_DẪN_FILE_APK_MỚI#HKPick_v1.0.1.apk" --title "HKPick v1.0.1 (Bản 20-10)" --notes "Cập nhật tối ưu mới"
```

### Bước 2: Cập nhật link tải và ngày trong `config.js`
Đổi `version` và `downloadUrl` sang `v1.0.1`:
```javascript
version: "1.0.1",
releaseDate: "20-10-2026",
downloadUrl: "https://github.com/thanpm080424/hkpick-portal/releases/download/v1.0.1/HKPick_v1.0.1.apk"
```

### Bước 3: Đẩy lên GitHub
```bash
git add config.js
git commit -m "Phat hanh ban cap nhat v1.0.1"
git push
```
**Kết quả:** Khách hàng vào lại web hoặc bấm nút **"🔄 Kiểm tra bản mới"** sẽ thấy thông báo cập nhật ngay lập tức!
