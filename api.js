// إعدادات API
const API_BASE_URL = 'https://tchat-production.up.railway.app/api/v1';

// دالة مساعدة لإرسال طلبات API
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('tchat_token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
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
    const response = await fetch(`${API_BASE_URL}/meta/phone-numbers`);
    const data = await response.json();
    
    console.log('Meta Phone Numbers Response:', data);
    
    if (data.success && data.data) {
      return data.data;
    } else {
      console.error('فشل في جلب أرقام Meta:', data);
      return [getDefaultWhatsAppStats()];
    }
  } catch (error) {
    console.error('خطأ في تحميل أرقام Meta:', error);
    return [getDefaultWhatsAppStats()];
  }
}

// تحميل إحصائيات WhatsApp
async function loadWhatsAppStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/whatsapp`);
    const data = await response.json();
    
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
    phone_number: '966533934546',
    display_name: 'مناسبتي',
    status: 'متصل',
    quality_rating: 'مرتفع',
    daily_limit: 1000,
    messages_sent: 0,
    messages_read: 0,
    messages_delivered: 0,
    messages_failed: 0
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
