// وظائف لوحة التحكم
const API_BASE_URL = 'https://tchat-production.up.railway.app/api/v1';

// تحقق من تسجيل الدخول
function checkAuth() {
  const isLoggedIn = localStorage.getItem('tchat_logged_in');
  if (!isLoggedIn) {
    window.location.href = './login.html';
    return false;
  }
  return true;
}

// تحميل إحصائيات الإيرادات
async function loadRevenueStats() {
  try {
    // هنا سنضيف API calls للحصول على البيانات الحقيقية
    // مؤقتاً سنستخدم بيانات تجريبية مطابقة للصورة
    
    const revenueData = [
      {
        title: 'السلات المتروكة',
        subtitle: 'آخر 30 يوماً',
        total: '403,095.84',
        last30Days: '13,398.51',
        previous30Days: '26,613.77',
        count: 127,
        status: 'فعالة',
        statusColor: 'green'
      },
      {
        title: 'سلسلة الترحيب بالعملاء',
        subtitle: '',
        total: '228,899.92',
        last30Days: '10,770.62', 
        previous30Days: '19,721.20',
        count: 67,
        status: 'فعالة',
        statusColor: 'green'
      },
      {
        title: 'إعادة الاستهداف بعد الشراء',
        subtitle: '',
        total: '21,074.63',
        last30Days: '1,562.99',
        previous30Days: '2,737.64',
        count: 10,
        status: 'فعالة',
        statusColor: 'green'
      },
      {
        title: 'ترك تصفح المتجر',
        subtitle: '',
        total: '26,296.19',
        last30Days: '0.00',
        previous30Days: '0.00',
        count: 0,
        status: 'متوقفة',
        statusColor: 'orange'
      },
      {
        title: 'استرداد العملاء',
        subtitle: '',
        total: '12,473.91',
        last30Days: '0.00',
        previous30Days: '484.33',
        count: 1,
        status: 'فعالة',
        statusColor: 'green'
      }
    ];

    renderRevenueTable(revenueData);
    
  } catch (error) {
    console.error('خطأ في تحميل إحصائيات الإيرادات:', error);
  }
}

// عرض جدول الإيرادات
function renderRevenueTable(data) {
  const tableBody = document.getElementById('revenue-table-body');
  
  tableBody.innerHTML = data.map(item => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4">
        <div class="flex items-center">
          <span class="text-body-md font-medium text-gray-900">${item.count}</span>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }">
            ${item.status}
          </span>
        </div>
      </td>
      <td class="px-6 py-4 text-body-md text-gray-900 number">${item.total}</td>
      <td class="px-6 py-4 text-body-md text-gray-900 number">${item.last30Days}</td>
      <td class="px-6 py-4 text-body-md text-gray-900 number">${item.previous30Days}</td>
      <td class="px-6 py-4">
        <div class="text-right">
          <div class="text-body-md font-medium text-gray-900">${item.title}</div>
          ${item.subtitle ? `<div class="text-body-sm text-gray-500">${item.subtitle}</div>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

// تحميل بيانات رقم الواتساب
async function loadWhatsAppData() {
  try {
    // بيانات تجريبية مطابقة للصورة
    const whatsappData = [
      {
        number: '966533934546',
        name: 'Her - هير',
        dailyLimit: '100,000',
        quality: 'مرتفع',
        status: 'متصل',
        provider: 'Whatsapp'
      }
    ];

    renderWhatsAppTable(whatsappData);
    
  } catch (error) {
    console.error('خطأ في تحميل بيانات الواتساب:', error);
  }
}

// عرض جدول رقم الواتساب
function renderWhatsAppTable(data) {
  const tableBody = document.getElementById('whatsapp-table-body');
  
  tableBody.innerHTML = data.map(item => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 text-body-md text-gray-900 number">${item.number}</td>
      <td class="px-6 py-4">
        <div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ${item.status}
          </span>
          <span class="mr-2 text-body-sm text-gray-600">🔄</span>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ${item.quality}
          </span>
          <span class="mr-2 text-body-sm text-gray-600">🟢</span>
        </div>
      </td>
      <td class="px-6 py-4 text-body-md text-gray-900 number">${item.dailyLimit}</td>
      <td class="px-6 py-4 text-body-md text-gray-900">${item.name}</td>
      <td class="px-6 py-4">
        <div class="flex items-center">
          <span class="text-body-md text-gray-900">${item.provider}</span>
          <span class="mr-2 text-green-500">📱</span>
        </div>
      </td>
    </tr>
  `).join('');
}

// تحميل إحصائيات من الـ Backend
async function loadBackendStats() {
  try {
    // استدعاء API للحصول على إحصائيات حقيقية
    const [healthResponse, webhooksResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/health`),
      fetch(`${API_BASE_URL}/whatsapp/webhooks?limit=10`)
    ]);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('حالة النظام:', healthData);
    }

    if (webhooksResponse.ok) {
      const webhooksData = await webhooksResponse.json();
      console.log('رسائل WhatsApp:', webhooksData);
      
      // تحديث عداد الرسائل
      document.getElementById('whatsapp-messages-count').textContent = webhooksData.count || 0;
    }

  } catch (error) {
    console.error('خطأ في تحميل بيانات Backend:', error);
  }
}

// تسجيل الخروج
function logout() {
  localStorage.removeItem('tchat_logged_in');
  localStorage.removeItem('tchat_user');
  window.location.href = './login.html';
}

// تهيئة التطبيق
function initApp() {
  if (!checkAuth()) return;
  
  loadRevenueStats();
  loadWhatsAppData();
  loadBackendStats();
  
  // تحديث دوري كل 30 ثانية
  setInterval(loadBackendStats, 30000);
}

// تصدير الوظائف للاستخدام العام
window.logout = logout;
window.loadRevenueStats = loadRevenueStats;
window.loadWhatsAppData = loadWhatsAppData;
window.initApp = initApp;
