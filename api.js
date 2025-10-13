// إعدادات API
const API_BASE_URL = 'https://tchat-production.up.railway.app/api/v1';

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

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('✅ تم تجديد access token بنجاح');
        return data.access_token;
      }
    }
    
    console.error('فشل تجديد access token');
    return null;
  } catch (error) {
    console.error('خطأ في تجديد access token:', error);
    return null;
  }
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
        return await retryResponse.json();
      } else {
        // فشل التجديد - إعادة توجيه لصفحة تسجيل الدخول
        console.error('❌ فشل تجديد Token - إعادة التوجيه لتسجيل الدخول');
        localStorage.clear();
        window.location.href = './login.html';
        throw new Error('Session expired - please login again');
      }
    }
    
    return await response.json();
  } catch (error) {
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

// تحميل جميع أرقام WhatsApp من Meta
async function loadMetaPhoneNumbers() {
  try {
    const data = await apiRequest('/meta/phone-numbers');
    
    console.log('Meta Phone Numbers Response:', data);
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (data.success && data.data) {
      return [data.data];
    } else {
      console.error('فشل في جلب أرقام Meta:', data);
      return [];
    }
  } catch (error) {
    console.error('خطأ في تحميل أرقام Meta:', error);
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
    verified_name: 'مناسبتي',
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

// تحميل قائمة العملاء
async function loadCustomers(limit = 50) {
  try {
    const data = await apiRequest(`/customers?limit=${limit}`);
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

// تحميل قائمة المحادثات
async function loadConversations(limit = 50) {
  try {
    const data = await apiRequest(`/conversations?limit=${limit}`);
    console.log('Conversations Response:', data);
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    console.error('فشل في جلب المحادثات:', data);
    return [];
  } catch (error) {
    console.error('خطأ في تحميل المحادثات:', error);
    return [];
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
    const conversations = await loadConversations(50);
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
