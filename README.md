# 📱 Secure PWA Web App - Ứng Dụng Cài Đặt Không Lộ File APK

Dự án này là giải pháp trọn gói giúp bạn tạo một **Web App PWA (Progressive Web App)**:
- **Người dùng cài trực tiếp vào điện thoại (Android / iOS / PC)** chỉ với 1 chạm.
- **Hoàn toàn KHÔNG có file APK:** Không sợ bị người khác tải trôi nổi, không sợ bị dịch ngược (decompile) trích xuất mã nguồn.
- **Tự động cập nhật phiên bản mới:** Khi bạn cập nhật code trên GitHub, ứng dụng trên điện thoại người dùng sẽ tự động nhận diện và hiện thông báo cập nhật ngay.
- **Hỗ trợ chạy Offline:** Hoạt động bình thường ngay cả khi mất kết nối mạng.

---

## 📂 Cấu trúc thư mục
```text
rôt/
├── index.html        # Giao diện chính của ứng dụng
├── style.css         # Giao diện hiện đại (Dark theme, responsive mobile-first)
├── app.js            # Logic kích hoạt cài đặt PWA và xử lý cập nhật
├── sw.js             # Service Worker: Lưu cache offline & phát hiện bản mới
├── manifest.json     # Cấu hình PWA (Tên app, icon, chế độ standalone)
├── icons/            # Icon hiển thị trên màn hình chính điện thoại
│   ├── icon-192.png  # Kích thước 192x192
│   ├── icon-512.png  # Kích thước 512x512
│   └── icon.svg      # Icon vector
└── README.md         # Hướng dẫn chi tiết
```

---

## 🚀 Hướng Dẫn Từng Bước Đăng Lên GitHub (GitHub Pages)

### Bước 1: Khởi tạo Git trong thư mục này
Mở terminal (PowerShell hoặc Git Bash) tại thư mục này và chạy các lệnh sau:

```bash
git init
git add .
git commit -m "Khoi tao ung dung Secure PWA v1.0.0"
```

### Bước 2: Tạo Repository trên GitHub
1. Truy cập vào [GitHub](https://github.com) và đăng nhập tài khoản của bạn.
2. Bấm vào dấu **`+`** ở góc trên cùng bên phải ➡️ Chọn **New repository**.
3. Đặt tên Repository (ví dụ: `my-secure-app`).
4. Chọn chế độ **Public** (để dùng GitHub Pages miễn phí).
5. Bấm **Create repository**.

### Bước 3: Đẩy code từ máy lên GitHub
GitHub sẽ cung cấp cho bạn đường link repository (dạng `https://github.com/TÊN_BẠN/my-secure-app.git`). Chạy 3 lệnh sau:

```bash
git branch -M main
git remote add origin https://github.com/TÊN_BẠN/my-secure-app.git
git push -u origin main
```
*(Thay `TÊN_BẠN/my-secure-app` bằng tài khoản và tên repo thật của bạn)*

### Bước 4: Bật tính năng GitHub Pages
1. Tại trang repository của bạn trên GitHub, bấm vào tab **Settings** (Cài đặt).
2. Ở menu bên trái, tìm và chọn mục **Pages**.
3. Tại phần **Build and deployment** ➡️ **Branch**:
   - Chọn nhánh **`main`**.
   - Thư mục chọn **`/(root)`**.
   - Bấm nút **Save**.
4. Chờ khoảng 1 - 2 phút, GitHub sẽ hiển thị đường link trang web của bạn:
   👉 **`https://TÊN_BẠN.github.io/my-secure-app/`**

---

## 📲 Cách Người Dùng Cài Đặt Vào Điện Thoại

1. **Trên điện thoại Android (Chrome / Cốc Cốc / Edge):**
   - Mở link GitHub Pages ở trên.
   - Bấm vào nút **"📲 Cài đặt ứng dụng vào điện thoại"** trên màn hình.
   - Hoặc bấm dấu 3 chấm góc phải trình duyệt ➡️ chọn **"Cài đặt ứng dụng"** (hoặc *Thêm vào màn hình chính*).
   - Biểu tượng ứng dụng sẽ xuất hiện trên màn hình điện thoại như một app tải từ CH Play!

2. **Trên iPhone / iPad (Safari):**
   - Mở link bằng trình duyệt Safari.
   - Bấm nút **Chia sẻ (Share)** ở thanh công cụ dưới ➡️ chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.

---

## 🔄 Cách Cập Nhật Phiên Bản Mới

Khi bạn muốn sửa giao diện hoặc thêm tính năng mới cho app:
1. Chỉnh sửa code trong `index.html` hoặc `style.css` hoặc `app.js`.
2. Mở file `sw.js`, đổi dòng số 3:
   ```javascript
   const APP_VERSION = 'v1.0.1'; // Tăng số phiên bản lên
   ```
3. Đẩy code lên GitHub:
   ```bash
   git add .
   git commit -m "Cap nhat phien ban v1.0.1"
   git push
   ```
4. **Kết quả:** Khi người dùng mở app trên điện thoại của họ, ứng dụng sẽ tự động hiện thông báo:
   `✨ Có phiên bản mới! [Cập nhật ngay]` ➡️ Người dùng chỉ cần bấm nút là app lập tức chuyển sang bản mới nhất!
