/**
 * HKPick Portal Logic - Bảo mật và Phân Phối File Cài Đặt
 */

document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra nếu đã mở khóa trước đó trong phiên làm việc
  if (sessionStorage.getItem('hkpick_unlocked') === 'true') {
    unlockUI();
  }
  loadChangelog();
});

// Kiểm tra mật khẩu mở khóa
function checkPasscode() {
  const input = document.getElementById('passcodeInput');
  const errorMsg = document.getElementById('errorMsg');
  if (!input) return;

  const enteredCode = input.value.trim().toUpperCase();

  if (APP_CONFIG.validPasscodes.includes(enteredCode)) {
    sessionStorage.setItem('hkpick_unlocked', 'true');
    errorMsg.style.display = 'none';
    unlockUI();
  } else {
    errorMsg.style.display = 'block';
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
  }
}

// Chuyển giao diện sang trạng thái đã mở khóa
function unlockUI() {
  const lockedState = document.getElementById('lockedState');
  const unlockedState = document.getElementById('unlockedState');

  if (lockedState && unlockedState) {
    lockedState.style.display = 'none';
    unlockedState.style.display = 'block';
  }
}

// Khóa lại cổng tải
function lockPortal() {
  sessionStorage.removeItem('hkpick_unlocked');
  const lockedState = document.getElementById('lockedState');
  const unlockedState = document.getElementById('unlockedState');
  const input = document.getElementById('passcodeInput');

  if (lockedState && unlockedState) {
    lockedState.style.display = 'block';
    unlockedState.style.display = 'none';
  }
  if (input) input.value = '';
}

// Tải file cài đặt an toàn
function downloadApp() {
  if (sessionStorage.getItem('hkpick_unlocked') !== 'true') {
    alert('Vui lòng mở khóa trước khi tải file!');
    return;
  }

  const btn = document.getElementById('btnDownload');
  if (btn) {
    btn.textContent = '⏳ Đang khởi tạo tải xuống...';
    btn.disabled = true;
  }

  // Khởi chạy tải file thông qua liên kết động
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = APP_CONFIG.downloadUrl;
    link.setAttribute('download', 'HKPick_BanMoiNhat_13-10_1ms.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (btn) {
      btn.textContent = '✓ Đang tải về (Kiểm tra thanh thông báo)';
      setTimeout(() => {
        btn.textContent = '⬇️ TẢI & CẬP NHẬT HKPICK (79.6 MB)';
        btn.disabled = false;
      }, 4000);
    }
  }, 600);
}

// Kiểm tra bản cập nhật mới nhất từ GitHub Release
function checkNewVersion() {
  const statusEl = document.getElementById('versionStatus');
  const btn = document.getElementById('btnCheckUpdate');

  if (!statusEl || !btn) return;

  btn.disabled = true;
  statusEl.textContent = 'Đang kiểm tra máy chủ GitHub...';

  fetch('https://api.github.com/repos/thanpm080424/hkpick-portal/releases/latest')
    .then((res) => {
      if (!res.ok) throw new Error('Chưa có bản phát hành mới hơn');
      return res.json();
    })
    .then((data) => {
      btn.disabled = false;
      const latestTag = data.tag_name || 'v1.0.0';
      if (latestTag !== 'v' + APP_CONFIG.version) {
        statusEl.innerHTML = `<strong style="color: #34d399;">Đã có bản mới (${latestTag})! Nhấn mở khóa để tải.</strong>`;
      } else {
        statusEl.textContent = 'Bạn đang ở phiên bản mới nhất (13-10 1ms) ✓';
      }
    })
    .catch(() => {
      btn.disabled = false;
      statusEl.textContent = 'Bạn đang sử dụng phiên bản mới nhất! ✓';
      setTimeout(() => {
        statusEl.textContent = 'Phiên bản phát hành: ' + APP_CONFIG.releaseDate;
      }, 4000);
    });
}

// Tải danh sách nhật ký thay đổi
function loadChangelog() {
  const list = document.getElementById('changelogList');
  if (list && APP_CONFIG.changelog && APP_CONFIG.changelog.length > 0) {
    list.innerHTML = APP_CONFIG.changelog.map(item => `<li>${item}</li>`).join('');
  }
}
