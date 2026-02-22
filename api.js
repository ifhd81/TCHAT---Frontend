// إعدادات API — المصدر الوحيد: config.js (يُولَّد من .env عند البناء) ثم القيمة المحقونة عند البناء
const _apiBase = '__VITE_API_URL__';
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL)
  ? window.API_BASE_URL
  : (_apiBase && _apiBase.startsWith('http') ? _apiBase : '/api/v1');

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

// تحميل قائمة العملاء. اختياري: dialCode لفلترة حسب مفتاح الدولة (مثل 968 لعُمان).
async function loadCustomers(limit = 50, dialCode = '') {
  try {
    let url = `/customers?limit=${limit}`;
    if (dialCode && String(dialCode).trim()) {
      url += `&dial_code=${encodeURIComponent(String(dialCode).trim())}`;
    }
    const data = await apiRequest(url);
    console.log('Customers Response:', data);
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    console.error('فشل في جلب العملاء:', data);
    return [];
  } catch (error) {
    console.error('خطأ في تحميل العملاء:', error);
    return [];
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

// تشغيل صوت الإشعار
function playNotificationSound() {
  try {
    const audio = new Audio('./message-sound-sounds.mp3');
    audio.volume = 0.5; // تعيين مستوى الصوت إلى 50%
    audio.play().catch(error => {
      console.error('خطأ في تشغيل صوت الإشعار:', error);
    });
    console.log('🔔 تم تشغيل صوت إشعار محادثة جديدة');
  } catch (error) {
    console.error('خطأ في تشغيل صوت الإشعار:', error);
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
