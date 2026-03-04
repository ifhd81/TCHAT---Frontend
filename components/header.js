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
    <!-- تنبيه مشكلة الدفع من ميتا (يُعرض في أعلى كل الصفحات عند التفعيل) -->
    <div id="meta-payment-alert-banner" class="hidden bg-red-600 text-white text-center py-2 px-4 text-body-sm font-medium flex items-center justify-center gap-3 flex-wrap" role="alert">
      <span class="flex items-center gap-2">
        <i data-lucide="alert-triangle" class="h-4 w-4 shrink-0"></i>
        <span>لديك مشكلة في الدفع في ميتا. يرجى التحقق من بطاقة الائتمان أو طريقة الدفع في Meta Business.</span>
      </span>
      <button type="button" id="meta-payment-alert-dismiss" class="bg-red-700 hover:bg-red-800 text-white border border-red-500 rounded px-3 py-1 text-body-sm font-medium transition-colors">
        تم حل مشكلة الدفع
      </button>
    </div>
    <!-- مودال إرسال تجريبي للتحقق من حل مشكلة الدفع -->
    <div id="meta-payment-test-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/50" aria-hidden="true">
      <div class="bg-background rounded-xl shadow-lg border w-full max-w-md mx-4" role="dialog" aria-labelledby="meta-payment-test-modal-title">
        <div class="p-6 border-b">
          <h2 id="meta-payment-test-modal-title" class="text-heading-md font-bold">إرسال تجريبي للتحقق من حل مشكلة الدفع</h2>
          <p class="text-body-sm text-muted-foreground mt-1">أضف الرقم واختر القالب. عند استلام ميتا (تسليم = تم الحل، فشل = لا تزال هناك مشكلة) سيتم تحديث التنبيه تلقائياً.</p>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label for="meta-payment-test-phone" class="block text-body-sm font-medium mb-1">رقم الهاتف لإرسال التجربة</label>
            <input type="tel" id="meta-payment-test-phone" class="w-full rounded-md border border-input bg-background px-3 py-2 text-body-sm" placeholder="966501234567" dir="ltr" />
          </div>
          <div>
            <label for="meta-payment-test-template" class="block text-body-sm font-medium mb-1">اختيار القالب</label>
            <select id="meta-payment-test-template" class="w-full rounded-md border border-input bg-background px-3 py-2 text-body-sm">
              <option value="">جاري التحميل...</option>
            </select>
          </div>
          <div id="meta-payment-test-message" class="hidden text-body-sm rounded-lg border p-3"></div>
        </div>
        <div class="p-6 border-t flex justify-end gap-2">
          <button type="button" id="meta-payment-test-cancel" class="px-4 py-2 rounded-md border border-input bg-background text-body-sm font-medium hover:bg-accent">
            إلغاء
          </button>
          <button type="button" id="meta-payment-test-send" class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-body-sm font-medium hover:bg-primary/90">
            إرسال التجربة
          </button>
        </div>
      </div>
    </div>
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
function renderMetaPaymentAlertBanner(state) {
  const banner = document.getElementById('meta-payment-alert-banner');
  if (!banner) return;
  if (state && state.active) {
    banner.classList.remove('hidden');
    banner.classList.add('flex');
  } else {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }
}

function closeMetaPaymentTestModal() {
  const modal = document.getElementById('meta-payment-test-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function openMetaPaymentTestModal() {
  const modal = document.getElementById('meta-payment-test-modal');
  const select = document.getElementById('meta-payment-test-template');
  const msgEl = document.getElementById('meta-payment-test-message');
  if (!modal || !select) return;
  msgEl && msgEl.classList.add('hidden');
  select.innerHTML = '<option value="">جاري التحميل...</option>';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof loadMetaTemplates === 'function') {
    try {
      const templates = await loadMetaTemplates(100);
      const approved = (templates || []).filter(function (t) { return t.status === 'APPROVED'; });
      select.innerHTML = '<option value="">اختر القالب</option>' + approved.map(function (t) {
        return '<option value="' + (t.name || '').replace(/"/g, '&quot;') + '">' + (t.name || '') + '</option>';
      }).join('');
    } catch (e) {
      select.innerHTML = '<option value="">فشل تحميل القوالب</option>';
    }
  }
}

function sendMetaPaymentTestModal() {
  const phoneEl = document.getElementById('meta-payment-test-phone');
  const templateEl = document.getElementById('meta-payment-test-template');
  const msgEl = document.getElementById('meta-payment-test-message');
  const sendBtn = document.getElementById('meta-payment-test-send');
  if (!phoneEl || !templateEl || typeof sendMetaPaymentTestAlert !== 'function') return;
  const phone = (phoneEl.value || '').trim().replace(/[\s\-+]/g, '');
  const templateName = (templateEl.value || '').trim();
  if (!phone) {
    if (msgEl) {
      msgEl.textContent = 'يرجى إدخال رقم الهاتف';
      msgEl.classList.remove('hidden');
      msgEl.className = 'text-body-sm rounded-lg border p-3 text-destructive';
    }
    return;
  }
  if (!/^\d{10,15}$/.test(phone)) {
    if (msgEl) {
      msgEl.textContent = 'رقم الهاتف غير صحيح (10–15 رقماً)';
      msgEl.classList.remove('hidden');
      msgEl.className = 'text-body-sm rounded-lg border p-3 text-destructive';
    }
    return;
  }
  if (!templateName) {
    if (msgEl) {
      msgEl.textContent = 'يرجى اختيار القالب';
      msgEl.classList.remove('hidden');
      msgEl.className = 'text-body-sm rounded-lg border p-3 text-destructive';
    }
    return;
  }
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'جاري الإرسال...';
  }
  if (msgEl) msgEl.classList.add('hidden');
  sendMetaPaymentTestAlert(phone, templateName, 'ar').then(function (data) {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'إرسال التجربة';
    }
    if (data.success) {
      if (msgEl) {
        msgEl.textContent = 'تم إرسال الرسالة التجريبية. عند استلام ميتا (تسليم أو فشل) سيتم تحديث حالة التنبيه تلقائياً.';
        msgEl.classList.remove('hidden');
        msgEl.className = 'text-body-sm rounded-lg border p-3 text-green-700 bg-green-50';
      }
      if (typeof showToast === 'function') {
        showToast('تم الإرسال — سنحدّث الحالة عند وصول الرد من ميتا', 'success');
      }
      setTimeout(closeMetaPaymentTestModal, 2500);
    } else {
      if (msgEl) {
        msgEl.textContent = data.error || data.message || 'فشل الإرسال';
        msgEl.classList.remove('hidden');
        msgEl.className = 'text-body-sm rounded-lg border p-3 text-destructive';
      }
      if (typeof showToast === 'function') {
        showToast(data.error || 'فشل الإرسال', 'error');
      }
    }
  }).catch(function () {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'إرسال التجربة';
    }
    if (msgEl) {
      msgEl.textContent = 'حدث خطأ أثناء الإرسال';
      msgEl.classList.remove('hidden');
      msgEl.className = 'text-body-sm rounded-lg border p-3 text-destructive';
    }
  });
}

function renderHeader(containerId = 'header-container', options = {}) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createHeader(options);
    // إعادة تهيئة أيقونات Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    // تحميل وعرض تنبيه مشكلة الدفع من ميتا (شريط أحمر في الأعلى)
    if (typeof getMetaPaymentAlert === 'function') {
      getMetaPaymentAlert().then(function (state) {
        renderMetaPaymentAlertBanner(state);
      });
    }
    // زر "تم حل مشكلة الدفع" — يفتح مودال إرسال تجريبي (إخفاء التنبيه يتم تلقائياً عند وصول webhook تسليم من ميتا)
    const dismissBtn = document.getElementById('meta-payment-alert-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        if (typeof openMetaPaymentTestModal === 'function') {
          openMetaPaymentTestModal();
        }
      });
    }
    // إغلاق مودال اختبار الدفع
    const testModal = document.getElementById('meta-payment-test-modal');
    const testCancel = document.getElementById('meta-payment-test-cancel');
    if (testModal) {
      testModal.addEventListener('click', function (e) {
        if (e.target === testModal) closeMetaPaymentTestModal();
      });
    }
    if (testCancel) {
      testCancel.addEventListener('click', closeMetaPaymentTestModal);
    }
    const testSendBtn = document.getElementById('meta-payment-test-send');
    if (testSendBtn) {
      testSendBtn.addEventListener('click', function () {
        if (typeof sendMetaPaymentTestModal === 'function') {
          sendMetaPaymentTestModal();
        }
      });
    }
    // تحديث مؤشر المحادثات غير المقروءة (النقطة الحمراء) في كل الصفحات
    if (typeof checkUnreadConversations === 'function') {
      checkUnreadConversations();
      if (!window._unreadCheckIntervalStarted) {
        window._unreadCheckIntervalStarted = true;
        setInterval(checkUnreadConversations, 60000);
      }
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
    renderMetaPaymentAlertBanner,
    openMetaPaymentTestModal,
    closeMetaPaymentTestModal,
    sendMetaPaymentTestModal,
    insertHeader,
    updateUnreadIndicator,
    getActivePageFromURL,
    initHeader,
    toggleMobileMenu,
    closeMobileMenu
  };
}
