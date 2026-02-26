// مكون الهيدر - Header Component
// يمكن استخدامه في جميع صفحات المشروع

/**
 * إنشاء مكون الهيدر
 * @param {Object} options - خيارات الهيدر
 * @param {string} options.activePage - الصفحة النشطة حالياً (customers, templates, campaigns, chats, automations, webhooks, zapier)
 * @returns {string} - HTML الهيدر
 */
function createHeader(options = {}) {
  const { activePage = '' } = options;

  // تحديد الـ classes للرابط النشط وغير النشط - سطح المكتب
  const baseClasses = 'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const activeClasses = `${baseClasses} border-primary bg-primary/10 text-primary`;
  const inactiveClasses = `${baseClasses} border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground`;

  // تحديد الـ classes للرابط النشط وغير النشط - الجوال
  const mobileBaseClasses = 'flex items-center gap-3 rounded-lg px-4 py-3 text-body-md font-medium transition-colors';
  const mobileActiveClasses = `${mobileBaseClasses} bg-primary/10 text-primary`;
  const mobileInactiveClasses = `${mobileBaseClasses} text-muted-foreground hover:bg-accent hover:text-accent-foreground`;

  // دالة مساعدة لتحديد الـ classes بناءً على الصفحة النشطة
  const getLinkClasses = (page) => activePage === page ? activeClasses : inactiveClasses;
  const getMobileLinkClasses = (page) => activePage === page ? mobileActiveClasses : mobileInactiveClasses;

  return `
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <!-- الشعار (على اليمين في RTL) -->
        <div class="flex items-center">
          <a href="./dashboard.html" class="text-heading-md font-bold hover:opacity-80 transition-opacity">TCHAT</a>
        </div>

        <!-- قائمة التنقل - سطح المكتب -->
        <nav class="hidden md:flex flex-1 justify-center space-x-3 space-x-reverse">
          <!-- العملاء -->
          <a
            href="./customers.html"
            class="${getLinkClasses('customers')}"
          >
            <i data-lucide="users" class="h-4 w-4"></i>
            <span>العملاء</span>
          </a>

          <!-- القوالب -->
          <a
            href="./templates.html"
            class="${getLinkClasses('templates')}"
          >
            <i data-lucide="layout-dashboard" class="h-4 w-4"></i>
            <span>القوالب</span>
          </a>

          <!-- الحملات -->
          <a
            href="./campaigns.html"
            class="${getLinkClasses('campaigns')}"
          >
            <i data-lucide="megaphone" class="h-4 w-4"></i>
            <span>الحملات</span>
          </a>

          <!-- الدردشات -->
          <a
            href="./chats.html"
            class="${getLinkClasses('chats')} relative"
          >
            <div class="relative">
              <i data-lucide="message-circle" class="h-4 w-4"></i>
              <div id="unread-indicator" class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive hidden"></div>
            </div>
            <span>الدردشات</span>
          </a>

          <!-- المؤتمتة -->
          <a
            href="./automations.html"
            class="${getLinkClasses('automations')}"
          >
            <i data-lucide="workflow" class="h-4 w-4"></i>
            <span>المؤتمتة</span>
          </a>

          <!-- سجل الويب هوك -->
          <a
            href="./webhooks.html"
            class="${getLinkClasses('webhooks')}"
          >
            <i data-lucide="webhook" class="h-4 w-4"></i>
            <span>سجل الويب هوك</span>
          </a>

          <!-- AI Chatbot -->
          <a
            href="./ai-chatbot.html"
            class="${getLinkClasses('ai-chatbot')}"
          >
            <i data-lucide="bot" class="h-4 w-4"></i>
            <span>الشات بوت</span>
          </a>

          <!-- Zapier -->
          <a
            href="./zapier.html"
            class="${getLinkClasses('zapier')}"
          >
            <i data-lucide="zap" class="h-4 w-4"></i>
            <span>Zapier</span>
          </a>
        </nav>

        <!-- زر الخروج وزر القائمة (على اليسار في RTL) -->
        <div class="flex items-center gap-2">
          <!-- زر تسجيل الخروج - سطح المكتب -->
          <button 
            onclick="logout()" 
            class="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <i data-lucide="log-out" class="ml-2 h-4 w-4"></i>
            <span class="text-body-md">تسجيل الخروج</span>
          </button>

          <!-- زر القائمة - الجوال -->
          <button 
            id="mobile-menu-button"
            onclick="toggleMobileMenu()"
            class="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            aria-label="فتح القائمة"
          >
            <i data-lucide="menu" class="h-5 w-5" id="menu-icon"></i>
            <i data-lucide="x" class="h-5 w-5 hidden" id="close-icon"></i>
          </button>
        </div>
      </div>

      <!-- قائمة الجوال المنسدلة -->
      <div id="mobile-menu" class="md:hidden hidden border-t bg-background">
        <nav class="container mx-auto px-4 py-4 space-y-1">
          <!-- العملاء -->
          <a
            href="./customers.html"
            class="${getMobileLinkClasses('customers')}"
          >
            <i data-lucide="users" class="h-5 w-5"></i>
            <span>العملاء</span>
          </a>

          <!-- القوالب -->
          <a
            href="./templates.html"
            class="${getMobileLinkClasses('templates')}"
          >
            <i data-lucide="layout-dashboard" class="h-5 w-5"></i>
            <span>القوالب</span>
          </a>

          <!-- الحملات -->
          <a
            href="./campaigns.html"
            class="${getMobileLinkClasses('campaigns')}"
          >
            <i data-lucide="megaphone" class="h-5 w-5"></i>
            <span>الحملات</span>
          </a>

          <!-- الدردشات -->
          <a
            href="./chats.html"
            class="${getMobileLinkClasses('chats')} relative"
          >
            <div class="relative">
              <i data-lucide="message-circle" class="h-5 w-5"></i>
              <div id="unread-indicator-mobile" class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive hidden"></div>
            </div>
            <span>الدردشات</span>
          </a>

          <!-- المؤتمتة -->
          <a
            href="./automations.html"
            class="${getMobileLinkClasses('automations')}"
          >
            <i data-lucide="workflow" class="h-5 w-5"></i>
            <span>المؤتمتة</span>
          </a>

          <!-- سجل الويب هوك -->
          <a
            href="./webhooks.html"
            class="${getMobileLinkClasses('webhooks')}"
          >
            <i data-lucide="webhook" class="h-5 w-5"></i>
            <span>سجل الويب هوك</span>
          </a>

          <!-- AI Chatbot -->
          <a
            href="./ai-chatbot.html"
            class="${getMobileLinkClasses('ai-chatbot')}"
          >
            <i data-lucide="bot" class="h-5 w-5"></i>
            <span>الشات بوت</span>
          </a>

          <!-- Zapier -->
          <a
            href="./zapier.html"
            class="${getMobileLinkClasses('zapier')}"
          >
            <i data-lucide="zap" class="h-5 w-5"></i>
            <span>Zapier</span>
          </a>

          <!-- فاصل -->
          <div class="border-t my-3"></div>

          <!-- تسجيل الخروج - الجوال -->
          <button 
            onclick="logout()" 
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-body-md font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <i data-lucide="log-out" class="h-5 w-5"></i>
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </div>
    </header>
  `;
}

/**
 * فتح/إغلاق قائمة الجوال
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (mobileMenu && menuIcon && closeIcon) {
    const isHidden = mobileMenu.classList.contains('hidden');
    
    if (isHidden) {
      // فتح القائمة
      mobileMenu.classList.remove('hidden');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      // إغلاق القائمة
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  }
}

/**
 * إغلاق قائمة الجوال
 */
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (mobileMenu && menuIcon && closeIcon) {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}

/**
 * تثبيت مكون الهيدر في الصفحة
 * @param {string} containerId - معرف العنصر الذي سيحتوي الهيدر (افتراضي: 'header-container')
 * @param {Object} options - خيارات الهيدر
 */
function renderHeader(containerId = 'header-container', options = {}) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createHeader(options);
    // إعادة تهيئة أيقونات Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // إغلاق القائمة عند تغيير حجم الشاشة إلى سطح المكتب
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  } else {
    console.error(`لم يتم العثور على عنصر الهيدر: ${containerId}`);
  }
}

/**
 * إدراج الهيدر في بداية عنصر محدد
 * @param {string} parentSelector - محدد CSS للعنصر الأب
 * @param {Object} options - خيارات الهيدر
 */
function insertHeader(parentSelector = '.min-h-screen', options = {}) {
  const parent = document.querySelector(parentSelector);
  if (parent) {
    const headerElement = document.createElement('div');
    headerElement.id = 'app-header';
    headerElement.innerHTML = createHeader(options);
    parent.insertBefore(headerElement.firstElementChild, parent.firstChild);
    // إعادة تهيئة أيقونات Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } else {
    console.error(`لم يتم العثور على العنصر الأب: ${parentSelector}`);
  }
}

/**
 * تحديث حالة مؤشر المحادثات غير المقروءة
 * @param {number} count - عدد المحادثات غير المقروءة
 */
function updateUnreadIndicator(count) {
  // تحديث المؤشر في سطح المكتب
  const indicator = document.getElementById('unread-indicator');
  if (indicator) {
    if (count > 0) {
      indicator.classList.remove('hidden');
      indicator.title = `${count} محادثة غير مقروءة`;
    } else {
      indicator.classList.add('hidden');
    }
  }
  
  // تحديث المؤشر في الجوال
  const mobileIndicator = document.getElementById('unread-indicator-mobile');
  if (mobileIndicator) {
    if (count > 0) {
      mobileIndicator.classList.remove('hidden');
      mobileIndicator.title = `${count} محادثة غير مقروءة`;
    } else {
      mobileIndicator.classList.add('hidden');
    }
  }
}

/**
 * تحديد الصفحة النشطة تلقائياً من URL الحالي
 * @returns {string} - اسم الصفحة النشطة
 */
function getActivePageFromURL() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  
  const pageMap = {
    'customers': 'customers',
    'templates': 'templates',
    'campaigns': 'campaigns',
    'chats': 'chats',
    'automations': 'automations',
    'webhooks': 'webhooks',
    'ai-chatbot': 'ai-chatbot',
    'zapier': 'zapier',
    'dashboard': 'dashboard',
    'index': 'dashboard'
  };
  
  return pageMap[filename] || '';
}

/**
 * تهيئة الهيدر تلقائياً عند تحميل الصفحة
 * يستخدم هذه الدالة عند الحاجة لإضافة الهيدر تلقائياً
 */
function initHeader() {
  document.addEventListener('DOMContentLoaded', function() {
    const activePage = getActivePageFromURL();
    renderHeader('header-container', { activePage });
    
    // فحص المحادثات غير المقروءة
    if (typeof checkUnreadConversations === 'function') {
      checkUnreadConversations();
      // فحص دوري كل دقيقة
      setInterval(checkUnreadConversations, 60000);
    }
  });
}

// تصدير الدوال للاستخدام في الصفحات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createHeader,
    renderHeader,
    insertHeader,
    updateUnreadIndicator,
    getActivePageFromURL,
    initHeader,
    toggleMobileMenu,
    closeMobileMenu
  };
}
