/**
 * 個人網頁核心互動邏輯
 * 包含：動態高精度時鐘、智慧時段問候、姓名持久化編輯、深淺色主題切換、頭像切換與互動小工具
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素引用
  const clockHours = document.getElementById('clock-hours');
  const clockMinutes = document.getElementById('clock-minutes');
  const clockSeconds = document.getElementById('clock-seconds');
  const clockPeriod = document.getElementById('clock-period');
  const dateDisplay = document.getElementById('date-display');
  const weekdayDisplay = document.getElementById('weekday-display');
  const timezoneDisplay = document.getElementById('timezone-display');
  const greetingText = document.getElementById('greeting-text');
  const greetingSub = document.getElementById('greeting-sub');
  const greetingIcon = document.getElementById('greeting-icon');

  const userName = document.getElementById('user-name');
  const editNameBtn = document.getElementById('edit-name-btn');
  const userBio = document.getElementById('user-bio');
  const avatarEmoji = document.getElementById('avatar-emoji');
  const changeAvatarBtn = document.getElementById('change-avatar-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const toast = document.getElementById('toast');
  const copyTimeBtn = document.getElementById('copy-time-btn');
  const randomQuoteBtn = document.getElementById('random-quote-btn');
  const quotePreview = document.getElementById('quote-preview');

  // --------------------------------------------------------------------------
  // 1. 即時動態時鐘與智慧問候
  // --------------------------------------------------------------------------
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  function updateClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 格式化數字為兩位數
    const pad = (n) => String(n).padStart(2, '0');

    // 12小時制 / 24小時制顯示
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hoursFormatted = pad(hours24);
    const minutesFormatted = pad(minutes);
    const secondsFormatted = pad(seconds);

    if (clockHours) clockHours.textContent = hoursFormatted;
    if (clockMinutes) clockMinutes.textContent = minutesFormatted;
    if (clockSeconds) clockSeconds.textContent = secondsFormatted;
    if (clockPeriod) clockPeriod.textContent = period;

    // 日期顯示
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const weekday = weekdays[now.getDay()];

    if (dateDisplay) dateDisplay.textContent = `${year}年 ${month}月 ${day}日`;
    if (weekdayDisplay) weekdayDisplay.textContent = weekday;

    // 時區顯示
    const offset = -now.getTimezoneOffset() / 60;
    const offsetSign = offset >= 0 ? '+' : '-';
    const offsetStr = `UTC${offsetSign}${Math.abs(offset)}`;
    if (timezoneDisplay) timezoneDisplay.textContent = offsetStr;

    // 更新問候語
    updateGreeting(hours24);
  }

  function updateGreeting(hour) {
    let icon = '☀️';
    let title = '您好，歡迎光臨！';
    let sub = '保持好心情，開啟精彩每一天';

    if (hour >= 5 && hour < 9) {
      icon = '🌅';
      title = '清晨好，新的一天充滿希望！';
      sub = '深呼吸，今天也是值得期待的一天';
    } else if (hour >= 9 && hour < 12) {
      icon = '☀️';
      title = '早安，工作與學習順利！';
      sub = '維持專注，穩步推進你的每項目標';
    } else if (hour >= 12 && hour < 14) {
      icon = '🍲';
      title = '午安，記得好好享用午餐！';
      sub = '短暫休息放鬆，為下午蓄滿充沛能量';
    } else if (hour >= 14 && hour < 18) {
      icon = '☕';
      title = '下午好，來杯茶或咖啡提神！';
      sub = '高效專注當下，保持熱情與創造力';
    } else if (hour >= 18 && hour < 22) {
      icon = '🌇';
      title = '傍晚好，辛苦忙碌了一整天！';
      sub = '放下工作的疲憊，享受屬於自己的放鬆時光';
    } else {
      icon = '🌙';
      title = '夜深了，早點休息照顧自己！';
      sub = '祝你有個香甜安穩的美夢，晚安';
    }

    if (greetingIcon) greetingIcon.textContent = icon;
    if (greetingText) greetingText.textContent = title;
    if (greetingSub) greetingSub.textContent = sub;
  }

  // 立即啟動時鐘並每秒更新
  updateClock();
  setInterval(updateClock, 1000);

  // --------------------------------------------------------------------------
  // 2. 姓名與簡介持久化編輯 (LocalStorage)
  // --------------------------------------------------------------------------
  const STORAGE_KEY_NAME = 'personal_page_user_name';
  const STORAGE_KEY_BIO = 'personal_page_user_bio';
  const STORAGE_KEY_AVATAR = 'personal_page_avatar';
  const STORAGE_KEY_THEME = 'personal_page_theme';

  // 載入儲存的名字（若無儲存或為舊預設值則使用 Anson6118）
  const savedName = localStorage.getItem(STORAGE_KEY_NAME);
  if (savedName && savedName !== '您的名字' && savedName !== '陳泳碩' && userName) {
    userName.textContent = savedName;
  } else if (userName) {
    userName.textContent = 'Anson6118';
  }

  // 載入儲存的簡介
  const savedBio = localStorage.getItem(STORAGE_KEY_BIO);
  if (savedBio && userBio) {
    userBio.textContent = savedBio;
  }

  // 編輯姓名邏輯
  function enableNameEdit() {
    if (!userName) return;
    userName.contentEditable = 'true';
    userName.focus();
    
    // 全選文字以利快速修改
    const range = document.createRange();
    range.selectNodeContents(userName);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function saveName() {
    if (!userName) return;
    userName.contentEditable = 'false';
    const cleanName = userName.textContent.trim() || 'Anson6118';
    userName.textContent = cleanName;
    localStorage.setItem(STORAGE_KEY_NAME, cleanName);
    showToast(`姓名已儲存為「${cleanName}」✨`);
  }

  if (editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      if (userName.contentEditable === 'true') {
        saveName();
      } else {
        enableNameEdit();
      }
    });
  }

  if (userName) {
    userName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveName();
      } else if (e.key === 'Escape') {
        userName.contentEditable = 'false';
        userName.textContent = localStorage.getItem(STORAGE_KEY_NAME) || 'Anson6118';
      }
    });

    userName.addEventListener('blur', () => {
      if (userName.contentEditable === 'true') {
        saveName();
      }
    });
  }

  // 簡介編輯邏輯
  if (userBio) {
    userBio.addEventListener('click', () => {
      userBio.contentEditable = 'true';
    });

    userBio.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        userBio.blur();
      }
    });

    userBio.addEventListener('blur', () => {
      userBio.contentEditable = 'false';
      const cleanBio = userBio.textContent.trim() || '探索技術、熱愛生活 · 這是我的個人專屬空間';
      userBio.textContent = cleanBio;
      localStorage.setItem(STORAGE_KEY_BIO, cleanBio);
      showToast('個人簡介已更新！📝');
    });
  }

  // --------------------------------------------------------------------------
  // 3. 頭像圖示切換輪播
  // --------------------------------------------------------------------------
  const avatarList = ['🚀', '💻', '☕', '🌟', '🎧', '🐱', '⚡', '🎨', '🌿', '🎯'];
  let currentAvatarIndex = 0;

  const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
  if (savedAvatar && avatarEmoji) {
    avatarEmoji.textContent = savedAvatar;
    currentAvatarIndex = avatarList.indexOf(savedAvatar);
    if (currentAvatarIndex === -1) currentAvatarIndex = 0;
  }

  if (changeAvatarBtn && avatarEmoji) {
    changeAvatarBtn.addEventListener('click', () => {
      currentAvatarIndex = (currentAvatarIndex + 1) % avatarList.length;
      const nextEmoji = avatarList[currentAvatarIndex];
      avatarEmoji.textContent = nextEmoji;
      localStorage.setItem(STORAGE_KEY_AVATAR, nextEmoji);
      showToast(`頭像已切換為 ${nextEmoji}`);
    });
  }

  // --------------------------------------------------------------------------
  // 4. 深色 / 淺色主題切換
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
      showToast(`已切換為${newTheme === 'dark' ? '深色夜間' : '明亮日間'}主題 🌓`);
    });
  }

  // --------------------------------------------------------------------------
  // 5. 互動功能：複製目前時間 & 每日靈感
  // --------------------------------------------------------------------------
  if (copyTimeBtn) {
    copyTimeBtn.addEventListener('click', () => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      navigator.clipboard.writeText(timeStr).then(() => {
        showToast(`已複製時間：${timeStr} 📋`);
      }).catch(() => {
        showToast(`目前時間：${timeStr}`);
      });
    });
  }

  const quotes = [
    '保持好奇心，世界會為你敞開大門。',
    '每一天都是一塊全新的畫布，盡情揮灑色彩。',
    '專注於過程，成果自然水到渠成。',
    '生活就像程式碼，持續重構就能越變越好。',
    '簡約是極致的精巧。',
    '心之所向，素履以往。'
  ];

  let quoteIdx = 0;
  if (randomQuoteBtn && quotePreview) {
    randomQuoteBtn.addEventListener('click', () => {
      quoteIdx = (quoteIdx + 1) % quotes.length;
      const q = quotes[quoteIdx];
      quotePreview.textContent = q;
      showToast(`今日靈感：「${q}」✨`);
    });
  }

  // --------------------------------------------------------------------------
  // 6. 輕量 Toast 提示框系統
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
});
