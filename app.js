/**
 * app.js - Logic quản lý PWA, Cài đặt ứng dụng và Tự động Cập nhật
 */

// Biến lưu trữ sự kiện cài đặt của trình duyệt
let deferredPrompt = null;
let swRegistration = null;
let newWorkerWaiting = null;

// Khởi chạy khi tài liệu tải xong
document.addEventListener('DOMContentLoaded', () => {
  initNetworkStatus();
  checkDisplayMode();
  checkPlatformGuide();
  initDemoApp();
  registerServiceWorker();
});

/* ==========================================================================
   1. Đăng ký Service Worker & Quản lý Cập nhật tự động
   ========================================================================== */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Trình duyệt không hỗ trợ Service Worker');
    return;
  }

  // Đăng ký Service Worker
  navigator.serviceWorker.register('./sw.js')
    .then((registration) => {
      swRegistration = registration;
      console.log('[PWA] Service Worker đăng ký thành công');

      // Nếu đã có bản cập nhật đang chờ sẵn
      if (registration.waiting) {
        newWorkerWaiting = registration.waiting;
        showUpdateToast();
      }

      // Lắng nghe khi có bản cập nhật mới được tải về ngầm
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Đã có phiên bản cũ chạy, phiên bản mới đã sẵn sàng!
              newWorkerWaiting = installingWorker;
              showUpdateToast();
            } else {
              console.log('[PWA] Nội dung đã được lưu cache để dùng Offline');
            }
          }
        });
      });
    })
    .catch((err) => {
      console.error('[PWA] Đăng ký Service Worker thất bại:', err);
    });

  // Khi Service Worker mới kích hoạt, tự động reload trang để áp dụng bản mới
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] Đã chuyển sang phiên bản mới, đang tải lại trang...');
    window.location.reload();
  });
}

// Hiển thị thông báo có phiên bản mới
function showUpdateToast() {
  const toast = document.getElementById('updateToast');
  if (toast) {
    toast.classList.add('show');
  }
}

// Ẩn thông báo cập nhật
function dismissUpdateToast() {
  const toast = document.getElementById('updateToast');
  if (toast) {
    toast.classList.remove('show');
  }
}

// Người dùng bấm "Cập nhật ngay"
function applyUpdate() {
  if (newWorkerWaiting) {
    // Gửi lệnh cho Service Worker mới kích hoạt ngay
    newWorkerWaiting.postMessage({ type: 'SKIP_WAITING' });
  } else if (swRegistration && swRegistration.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}

// Nút "Kiểm tra cập nhật thủ công"
function manualCheckUpdate() {
  const statusEl = document.getElementById('versionStatus');
  const btn = document.getElementById('btnCheckUpdate');
  
  if (!swRegistration) {
    statusEl.textContent = 'Chưa sẵn sàng kiểm tra.';
    return;
  }

  btn.disabled = true;
  statusEl.textContent = 'Đang kiểm tra máy chủ...';

  swRegistration.update()
    .then(() => {
      setTimeout(() => {
        btn.disabled = false;
        if (!swRegistration.waiting && !swRegistration.installing) {
          statusEl.textContent = 'Bạn đang sử dụng phiên bản mới nhất! ✓';
          setTimeout(() => {
            statusEl.textContent = 'Hệ thống tự động đồng bộ khi có bản mới';
          }, 4000);
        }
      }, 1000);
    })
    .catch((err) => {
      btn.disabled = false;
      statusEl.textContent = 'Không thể kiểm tra (có thể đang Offline)';
    });
}

/* ==========================================================================
   2. Xử lý Cài đặt Ứng dụng (Không qua file APK)
   ========================================================================== */

// Lắng nghe sự kiện trước khi trình duyệt hiển thị popup cài đặt mặc định
window.addEventListener('beforeinstallprompt', (e) => {
  // Ngăn trình duyệt hiển thị thanh cài đặt mặc định
  e.preventDefault();
  // Lưu lại sự kiện để kích hoạt khi người dùng bấm nút của chúng ta
  deferredPrompt = e;

  // Hiển thị nút cài đặt trong trang web
  const installContainer = document.getElementById('installContainer');
  if (installContainer) {
    installContainer.style.display = 'block';
  }
  console.log('[PWA] Sự kiện beforeinstallprompt đã sẵn sàng');
});

// Hàm gọi khi người dùng bấm nút "Cài đặt ứng dụng"
function promptInstallApp() {
  if (!deferredPrompt) {
    alert('Để cài đặt ứng dụng:\n- Trên Chrome/Cốc Cốc: Bấm dấu 3 chấm góc phải ➡️ Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".');
    return;
  }

  // Mở hộp thoại cài đặt của hệ thống Android
  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] Người dùng đã chấp nhận cài đặt');
      const installContainer = document.getElementById('installContainer');
      if (installContainer) {
        installContainer.style.display = 'none';
      }
    } else {
      console.log('[PWA] Người dùng đã từ chối cài đặt');
    }
    deferredPrompt = null;
  });
}

// Lắng nghe khi cài đặt thành công
window.addEventListener('appinstalled', () => {
  console.log('[PWA] Ứng dụng đã được cài đặt thành công vào máy!');
  deferredPrompt = null;
  const installContainer = document.getElementById('installContainer');
  if (installContainer) {
    installContainer.style.display = 'none';
  }
  const installedAlert = document.getElementById('installedBanner');
  if (installedAlert) {
    installedAlert.style.display = 'block';
  }
  const modeBadge = document.getElementById('modeBadge');
  if (modeBadge) {
    modeBadge.textContent = 'Ứng dụng đã cài đặt';
    modeBadge.className = 'badge installed';
  }
});

/* ==========================================================================
   3. Kiểm tra Trạng thái Màn hình & Nền tảng
   ========================================================================== */
function checkDisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true;

  const modeBadge = document.getElementById('modeBadge');
  const installContainer = document.getElementById('installContainer');
  const installedBanner = document.getElementById('installedBanner');

  if (isStandalone) {
    if (modeBadge) {
      modeBadge.textContent = 'Chế độ App Độc Lập';
      modeBadge.className = 'badge installed';
    }
    if (installContainer) installContainer.style.display = 'none';
    if (installedBanner) installedBanner.style.display = 'block';
  } else {
    if (modeBadge) {
      modeBadge.textContent = 'Chế độ Trình Duyệt Web';
    }
    if (installedBanner) installedBanner.style.display = 'none';
  }
}

// Hướng dẫn cài đặt trên iOS (Safari)
function checkPlatformGuide() {
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isStandalone = window.navigator.standalone === true;
  
  if (isIos && !isStandalone) {
    const iosGuide = document.getElementById('iosGuide');
    if (iosGuide) {
      iosGuide.style.display = 'block';
    }
  }
}

/* ==========================================================================
   4. Kiểm tra Kết nối Mạng (Online/Offline)
   ========================================================================== */
function initNetworkStatus() {
  const netBadge = document.getElementById('networkBadge');

  function updateStatus() {
    if (navigator.onLine) {
      netBadge.innerHTML = '<span class="dot"></span> Online';
      netBadge.className = 'badge online';
    } else {
      netBadge.innerHTML = '<span class="dot"></span> Offline';
      netBadge.className = 'badge offline';
    }
  }

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();
}

/* ==========================================================================
   5. Demo App Logic (Mẫu tính năng thử nghiệm trong app)
   ========================================================================== */
function initDemoApp() {
  let count = parseInt(localStorage.getItem('demo_count') || '0', 10);
  const countEl = document.getElementById('counterValue');

  if (countEl) {
    countEl.textContent = count;
  }

  window.changeCount = function(delta) {
    count += delta;
    localStorage.setItem('demo_count', count);
    if (countEl) countEl.textContent = count;
  };
}
