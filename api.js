// إعدادات API — المصدر الوحيد: config.js (يُولَّد من .env عند البناء) ثم القيمة المحقونة عند البناء
const _apiBase = '__VITE_API_URL__';
const _windowApiBase = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : '';
const API_BASE_URL = _windowApiBase && _windowApiBase.startsWith('http')
  ? _windowApiBase
  : (_apiBase && _apiBase.startsWith('http') ? _apiBase : '/api/v1');

// انتهاء الاشتراك (من config.js المُولَّد من .env) — عند تجاوز التاريخ تُقفل واجهة المنصة
function getSubscriptionExpiresAtRaw() {
  if (typeof window === 'undefined' || window.SUBSCRIPTION_EXPIRES_AT == null) return '';
  const s = String(window.SUBSCRIPTION_EXPIRES_AT).trim();
  return s;
}

/** يحوّل قيمة انتهاء الاشتراك إلى timestamp (ms). */
function parseSubscriptionExpiryMs(raw) {
  if (!raw) return NaN;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (dateOnly) {
    const [, y, mo, d] = dateOnly;
    // يوم تقويمي واحد بتوقيت UTC+3 (مثل السعودية): ينتهي الاشتراك آخر لحظة من ذلك اليوم بتوقيت +3
    return Date.parse(`${y}-${mo}-${d}T23:59:59.999+03:00`);
  }
  return Date.parse(raw);
}

function isSubscriptionExpired() {
  const raw = getSubscriptionExpiresAtRaw();
  if (!raw) return false;
  const t = parseSubscriptionExpiryMs(raw);
  if (Number.isNaN(t)) return false;
  return Date.now() >= t;
}

function showSubscriptionLockIfNeeded() {
  if (!isSubscriptionExpired()) return;
  if (typeof document === 'undefined' || document.getElementById('tchat-subscription-lock')) return;

  const renewRaw =
    typeof window !== 'undefined' && window.SUBSCRIPTION_RENEW_URL != null
      ? String(window.SUBSCRIPTION_RENEW_URL).trim()
      : '';
  const renewHref = renewRaw || '#';

  const wrap = document.createElement('div');
  wrap.id = 'tchat-subscription-lock';
  wrap.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'tchat-subscription-lock-title');

  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0 bg-background/70 backdrop-blur-md';
  backdrop.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('div');
  panel.className =
    'relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-xl text-center';

  panel.innerHTML = `
    <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    </div>
    <h2 id="tchat-subscription-lock-title" class="text-heading-lg font-bold text-foreground">انتهى الاشتراك</h2>
    <p class="mt-3 text-body-md text-muted-foreground leading-relaxed">انتهت صلاحية اشتراكك في المنصة. يرجى تجديد الاشتراك لمواصلة الاستخدام.</p>
    <div class="mt-8 flex flex-col items-center gap-2"></div>
  `;

  const btnWrap = panel.querySelector('.mt-8');
  const link = document.createElement('a');
  link.className =
    'inline-flex w-full sm:w-auto min-w-[200px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-button-md font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  link.textContent = 'اشترك الآن';
  link.href = renewHref;
  if (renewRaw && /^https?:\/\//i.test(renewRaw)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  btnWrap.appendChild(link);

  wrap.appendChild(backdrop);
  wrap.appendChild(panel);
  document.body.appendChild(wrap);
  document.body.style.overflow = 'hidden';
}

(function initSubscriptionLock() {
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', function () {
    const path = (window.location && window.location.pathname) || '';
    const file = path.split('/').pop() || '';
    if (file === 'login.html') return;
    if (!localStorage.getItem('tchat_logged_in')) return;
    showSubscriptionLockIfNeeded();
  });
})();

// أيقونة مستخدم SVG (Lucide user) — تظهر دائماً دون الاعتماد على createIcons
function userIconSvg(className) {
  const c = className || 'h-5 w-5';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${c} shrink-0"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}

// دالة لتجديد access token باستخدام refresh token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    console.error('لا يوجد refresh token');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      console.log('✅ تم تجديد access token بنجاح');
      return data.access_token;
    }
    
    // معالجة خطأ التوقيع غير الصالح - توجيه مباشر لتسجيل الدخول
    if (data.error && (data.error.includes('signature') || data.error.includes('invalid'))) {
      console.warn('⚠️ التوقيع غير صالح - يجب إعادة تسجيل الدخول');
      return null;
    }
    
    console.error('فشل تجديد access token:', data.message || data.error);
    return null;
  } catch (error) {
    console.error('خطأ في تجديد access token:', error);
    return null;
  }
}

// توجيه المستخدم لتسجيل الدخول مع رسالة واضحة
function redirectToLogin(reason) {
  console.log('🔒 إعادة التوجيه لتسجيل الدخول:', reason);
  
  // مسح جميع بيانات الجلسة
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('tchat_logged_in');
  localStorage.removeItem('tchat_user');
  localStorage.removeItem('tchat_token');
  
  // التوجيه مع رسالة في URL
  const message = reason === 'expired' ? 'انتهت صلاحية الجلسة' : 'يرجى تسجيل الدخول';
  window.location.href = `./login.html?message=${encodeURIComponent(message)}`;
}

// دالة مساعدة لإرسال طلبات API
async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem('access_token');
  
  const defaultOptions = {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
    // معالجة انتهاء صلاحية الـ token (401 Unauthorized)
    if (response.status === 401) {
      console.warn('⚠️ Token منتهي الصلاحية - محاولة التجديد...');
      
      // محاولة تجديد الـ token
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // إعادة المحاولة مع الـ token الجديد
        defaultOptions.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
        
        // إذا فشل مرة أخرى، توجيه لتسجيل الدخول
        if (retryResponse.status === 401) {
          redirectToLogin('expired');
          throw new Error('Session expired');
        }
        
        return await retryResponse.json();
      } else {
        // فشل التجديد - إعادة توجيه لصفحة تسجيل الدخول بهدوء
        redirectToLogin('expired');
        throw new Error('Session expired');
      }
    }
    
    return await response.json();
  } catch (error) {
    // تجاهل أخطاء الجلسة المنتهية (تم معالجتها)
    if (error.message === 'Session expired') {
      return { success: false, error: 'Session expired' };
    }
    console.error(`خطأ في API ${endpoint}:`, error);
    throw error;
  }
}

// تحميل إحصائيات النظام
async function loadSystemStats() {
  try {
    const data = await apiRequest('/stats');
    return data.data;
  } catch (error) {
    console.error('خطأ في تحميل إحصائيات النظام:', error);
    return null;
  }
}

// تخزين مؤقت لأرقام الهواتف (2 دقيقة) لتقليل طلبات /meta/phone-numbers أثناء الحملات المتكررة وتجنب 80008
let _metaPhoneNumbersCache = { data: null, until: 0 };
const META_PHONE_NUMBERS_CACHE_MS = 2 * 60 * 1000;

// تحميل جميع أرقام WhatsApp من Meta
async function loadMetaPhoneNumbers(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && _metaPhoneNumbersCache.data != null && now < _metaPhoneNumbersCache.until) {
    return _metaPhoneNumbersCache.data;
  }
  try {
    const data = await apiRequest('/meta/phone-numbers');
    
    console.log('Meta Phone Numbers Response:', data);
    
    let result = [];
    if (data.success && Array.isArray(data.data)) {
      result = data.data;
    } else if (data.success && data.data) {
      result = [data.data];
    } else {
      console.error('فشل في جلب أرقام Meta:', data);
      return [];
    }
    _metaPhoneNumbersCache = { data: result, until: now + META_PHONE_NUMBERS_CACHE_MS };
    return result;
  } catch (error) {
    console.error('خطأ في تحميل أرقام Meta:', error);
    // عند الفشل (مثلاً 80008) نُرجع الكاش القديم إن وُجد لتمكين الواجهة من العمل
    if (_metaPhoneNumbersCache.data != null) {
      return _metaPhoneNumbersCache.data;
    }
    throw error;
  }
}

// تحميل إحصائيات WhatsApp
async function loadWhatsAppStats() {
  try {
    const data = await apiRequest('/stats/whatsapp');
    
    console.log('WhatsApp Stats Response:', data);
    
    if (data.success && data.data) {
      return data.data;
    } else {
      console.error('فشل في جلب إحصائيات WhatsApp:', data);
      return getDefaultWhatsAppStats();
    }
  } catch (error) {
    console.error('خطأ في تحميل إحصائيات WhatsApp:', error);
    return getDefaultWhatsAppStats();
  }
}

// بيانات افتراضية لـ WhatsApp
function getDefaultWhatsAppStats() {
  return {
    display_phone_number: '966533934546',
    verified_name: 'TCHAT',
    code_verification_status: 'VERIFIED',
    quality_rating: 'GREEN',
    throughput_level: 'STANDARD'
  };
}

// تحميل بيانات الإيرادات
async function loadRevenueData() {
  try {
    const data = await apiRequest('/stats/revenue');
    return data.data;
  } catch (error) {
    console.error('خطأ في تحميل بيانات الإيرادات:', error);
    return [];
  }
}

// تحميل تنبيهات ميتا (account_alerts، جودة الرقم، جودة/حالة القالب)
async function loadMetaAlerts(limit = 20) {
  try {
    const data = await apiRequest(`/stats/meta-alerts?limit=${limit}`);
    return (data.success && data.data) ? data.data : [];
  } catch (error) {
    console.error('خطأ في تحميل تنبيهات ميتا:', error);
    return [];
  }
}

// حالة تنبيه مشكلة الدفع من ميتا (للإشعار الأحمر في أعلى الصفحات)
async function getMetaPaymentAlert() {
  try {
    const data = await apiRequest('/settings/meta-payment-alert');
    return (data.success && data.active) ? { active: true, triggered_at: data.triggered_at } : { active: false };
  } catch (error) {
    console.error('خطأ في جلب تنبيه الدفع ميتا:', error);
    return { active: false };
  }
}

// إلغاء تنبيه مشكلة الدفع (بعد حل المشكلة في Meta Business)
async function clearMetaPaymentAlert() {
  try {
    const data = await apiRequest('/settings/meta-payment-alert/clear', { method: 'POST' });
    if (data.success && typeof renderMetaPaymentAlertBanner === 'function') {
      renderMetaPaymentAlertBanner({ active: false });
    }
    return data.success === true;
  } catch (error) {
    console.error('خطأ في إلغاء تنبيه الدفع ميتا:', error);
    return false;
  }
}

// تحميل قوالب ميتا (للقائمة في مودال اختبار الدفع وغيره)
async function loadMetaTemplates(limit = 50) {
  try {
    const data = await apiRequest(`/meta/templates?limit=${limit}`);
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('خطأ في تحميل القوالب:', error);
    return [];
  }
}

// إرسال رسالة تجريبية للتحقق من حل مشكلة الدفع — عند وصول webhook (تسليم) يُلغى التنبيه تلقائياً
async function sendMetaPaymentTestAlert(phoneNumber, templateName, templateLanguage) {
  try {
    const data = await apiRequest('/settings/meta-payment-alert/send-test', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        template_name: templateName,
        template_language: templateLanguage || 'ar'
      })
    });
    return data;
  } catch (error) {
    console.error('خطأ في إرسال اختبار الدفع:', error);
    return { success: false, error: error.message };
  }
}

// تحميل webhooks WhatsApp
async function loadWhatsAppWebhooks(limit = 10) {
  try {
    const data = await apiRequest(`/whatsapp/webhooks?limit=${limit}`);
    return data;
  } catch (error) {
    console.error('خطأ في تحميل webhooks WhatsApp:', error);
    return { count: 0, data: [] };
  }
}

// تحميل السلات المتروكة
async function loadAbandonedCarts(limit = 20) {
  try {
    const data = await apiRequest(`/abandoned-carts?limit=${limit}`);
    
    console.log('Abandoned Carts Response:', data);
    
    if (data.success && data.data) {
      return data.data;
    } else {
      console.error('فشل في جلب السلات المتروكة:', data);
      return [];
    }
  } catch (error) {
    console.error('خطأ في تحميل السلات المتروكة:', error);
    return [];
  }
}

// تحميل قائمة العملاء مع pagination. يُرجع { data: [...], total: number }.
// limit و offset للصفحة، dialCode لفلترة مفتاح الدولة (مثل 968 لعُمان).
async function loadCustomers(limit = 50, offset = 0, dialCode = '') {
  try {
    let url = `/customers?limit=${limit}&offset=${offset}`;
    if (dialCode && String(dialCode).trim()) {
      url += `&dial_code=${encodeURIComponent(String(dialCode).trim())}`;
    }
    const res = await apiRequest(url);
    if (res.success && Array.isArray(res.data)) {
      return { data: res.data, total: typeof res.total === 'number' ? res.total : res.data.length };
    }
    console.error('فشل في جلب العملاء:', res);
    return { data: [], total: 0 };
  } catch (error) {
    console.error('خطأ في تحميل العملاء:', error);
    return { data: [], total: 0 };
  }
}

// تحميل عميل واحد بالمعرف (أسرع من جلب القائمة عند عرض تفاصيل عميل في المحادثات)
async function loadCustomerById(customerId) {
  if (!customerId || customerId === 0) return null;
  try {
    const res = await apiRequest(`/customers/${customerId}`);
    if (res.success && res.data) return res.data;
    return null;
  } catch (error) {
    console.error('خطأ في تحميل العميل:', error);
    return null;
  }
}

// تحميل قائمة المحادثات مع دعم الـ pagination (كل صفحة ١٠٠)
// limit: عدد المحادثات في الصفحة (افتراضي ١٠٠)، offset: التخطي للصفحة التالية
// يُرجع: { data: [...], pagination: { limit, offset, has_more } }
async function loadConversations(limit = 100, offset = 0) {
  try {
    const res = await apiRequest(`/conversations?limit=${limit}&offset=${offset}`);
    if (res.success && Array.isArray(res.data)) {
      return {
        data: res.data,
        pagination: res.pagination || { limit, offset, has_more: false },
      };
    }
    console.error('فشل في جلب المحادثات:', res);
    return { data: [], pagination: { limit, offset, has_more: false } };
  } catch (error) {
    console.error('خطأ في تحميل المحادثات:', error);
    return { data: [], pagination: { limit, offset, has_more: false } };
  }
}

// تحميل رسائل محادثة محددة
async function loadConversationMessages(conversationId, limit = 50) {
  try {
    const data = await apiRequest(`/conversations/${conversationId}/messages?limit=${limit}`);
    console.log('Messages Response:', data);
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    console.error('فشل في جلب رسائل المحادثة:', data);
    return [];
  } catch (error) {
    console.error('خطأ في تحميل رسائل المحادثة:', error);
    return [];
  }
}

// فحص المحادثات غير المقروءة
// متغير لحفظ عدد المحادثات غير المقروءة السابق
let previousUnreadCount = 0;

async function checkUnreadConversations() {
  try {
    const { data: conversations } = await loadConversations(100, 0);
    const unreadCount = conversations.filter(conv => !conv.is_read).length;
    
    const indicator = document.getElementById('unread-indicator');
    if (indicator) {
      if (unreadCount > 0) {
        indicator.classList.remove('hidden');
        indicator.title = `${unreadCount} محادثة غير مقروءة`;
      } else {
        indicator.classList.add('hidden');
      }
    }
    
    // تشغيل صوت الإشعار إذا زاد عدد المحادثات غير المقروءة
    if (unreadCount > previousUnreadCount && previousUnreadCount !== null) {
      playNotificationSound();
    }
    
    previousUnreadCount = unreadCount;
    
    return unreadCount;
  } catch (error) {
    console.error('خطأ في فحص المحادثات غير المقروءة:', error);
    return 0;
  }
}

// تشغيل صوت تنبيه احتياطي (عند غياب ملف MP3) باستخدام Web Audio API
function playFallbackNotificationBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.warn('تعذر تشغيل الصوت الاحتياطي:', e);
  }
}

// تشغيل صوت الإشعار (ملف MP3 أو صوت احتياطي)
function playNotificationSound() {
  try {
    const audio = new Audio('./message-sound-sounds.mp3');
    audio.volume = 0.5;
    audio.play()
      .then(() => console.log('🔔 تم تشغيل صوت إشعار محادثة جديدة'))
      .catch((error) => {
        console.warn('لم يتم العثور على ملف الصوت، استخدام الصوت الاحتياطي:', error?.message || error);
        playFallbackNotificationBeep();
      });
  } catch (error) {
    console.warn('خطأ في تشغيل صوت الإشعار، استخدام الصوت الاحتياطي:', error);
    playFallbackNotificationBeep();
  }
}

// نظام الإشعارات Toast (بديل عن alert)
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification fixed bottom-4 left-4 z-[9999] rounded-lg px-4 py-3 shadow-lg transition-all duration-300 transform translate-y-full opacity-0 flex items-center gap-3 max-w-md';

  let bgColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-primary text-white';
      icon = '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      break;
    case 'error':
      bgColor = 'bg-destructive text-white';
      icon = '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      break;
    case 'warning':
      bgColor = 'bg-warning text-white';
      icon = '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      break;
    default:
      bgColor = 'bg-foreground text-background';
      icon = '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  }

  toast.classList.add(...bgColor.split(' '));
  const span = document.createElement('span');
  span.className = 'text-body-sm';
  span.textContent = message;
  toast.innerHTML = icon;
  toast.appendChild(span);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-full', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// حذف جميع سجلات الويب هوك
async function deleteAllWebhooks() {
  try {
    const response = await apiRequest('/whatsapp/webhooks', {
      method: 'DELETE',
    });
    
    console.log('Delete webhooks response:', response);
    return response;
  } catch (error) {
    console.error('خطأ في حذف سجلات الويب هوك:', error);
    throw error;
  }
}

// =============================================================================
// AI Chatbot API Functions
// =============================================================================

// جلب إعدادات AI Chatbot
async function loadAIChatbotSettings() {
  try {
    const data = await apiRequest('/ai-chatbot/settings');
    console.log('AI Chatbot Settings Response:', data);
    if (data.success && data.settings) {
      return data.settings;
    }
    // إرجاع إعدادات افتراضية إذا فشل
    console.warn('فشل في جلب إعدادات AI Chatbot - استخدام الافتراضية:', data);
    return {
      is_enabled: false,
      ai_provider: 'anthropic',
      ai_model: 'claude-sonnet-4-20250514',
      store_context: '',
      max_tokens: 500,
      temperature: 0.7,
      reply_to_all: false,
      working_hours_start: '09:00',
      working_hours_end: '23:00',
      excluded_keywords: ''
    };
  } catch (error) {
    console.error('خطأ في تحميل إعدادات AI Chatbot:', error);
    // إرجاع إعدادات افتراضية
    return {
      is_enabled: false,
      ai_provider: 'anthropic',
      ai_model: 'claude-sonnet-4-20250514',
      store_context: '',
      max_tokens: 500,
      temperature: 0.7,
      reply_to_all: false,
      working_hours_start: '09:00',
      working_hours_end: '23:00',
      excluded_keywords: ''
    };
  }
}

// تحديث إعدادات AI Chatbot
async function updateAIChatbotSettings(settings) {
  try {
    const data = await apiRequest('/ai-chatbot/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    console.log('Update AI Chatbot Settings Response:', data);
    return data;
  } catch (error) {
    console.error('خطأ في تحديث إعدادات AI Chatbot:', error);
    throw error;
  }
}

// تفعيل/تعطيل AI Chatbot
async function toggleAIChatbot(enabled) {
  try {
    const data = await apiRequest('/ai-chatbot/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
    console.log('Toggle AI Chatbot Response:', data);
    return data;
  } catch (error) {
    console.error('خطأ في تغيير حالة AI Chatbot:', error);
    throw error;
  }
}

// جلب سجلات الردود التلقائية
async function loadAIChatbotLogs(limit = 50) {
  try {
    const data = await apiRequest(`/ai-chatbot/logs?limit=${limit}`);
    console.log('AI Chatbot Logs Response:', data);
    if (data.success && data.logs) {
      return data.logs;
    }
    return [];
  } catch (error) {
    console.error('خطأ في تحميل سجلات AI Chatbot:', error);
    return [];
  }
}

// اختبار AI Chatbot
async function testAIChatbot(message, customerName = '') {
  try {
    const data = await apiRequest('/ai-chatbot/test', {
      method: 'POST',
      body: JSON.stringify({ message, customer_name: customerName })
    });
    console.log('Test AI Chatbot Response:', data);
    return data;
  } catch (error) {
    console.error('خطأ في اختبار AI Chatbot:', error);
    throw error;
  }
}

// جلب حالة AI Chatbot
async function getAIChatbotStatus() {
  try {
    const data = await apiRequest('/ai-chatbot/status');
    console.log('AI Chatbot Status Response:', data);
    if (data.success) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('خطأ في جلب حالة AI Chatbot:', error);
    return null;
  }
}

// جلب النماذج المتاحة من المزود
async function fetchAIModels(provider) {
  try {
    const data = await apiRequest(`/ai-chatbot/models?provider=${encodeURIComponent(provider)}`);
    console.log('AI Models Response:', data);
    if (data.success && data.models) {
      return data.models;
    }
    return null;
  } catch (error) {
    console.error('خطأ في جلب النماذج:', error);
    return null;
  }
}

// =============================================================================

// تسجيل الخروج
async function logout() {
  try {
    // استدعاء API لتسجيل الخروج (إذا كان متاحاً)
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } catch (error) {
        console.error('خطأ في استدعاء API logout:', error);
      }
    }
  } finally {
    // مسح جميع البيانات المحفوظة
    localStorage.removeItem('tchat_logged_in');
    localStorage.removeItem('tchat_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // إزالة التوكن القديم إذا كان موجوداً
    localStorage.removeItem('tchat_token');
    
    console.log('✅ تم تسجيل الخروج بنجاح');
    
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    window.location.href = './login.html';
  }
}
