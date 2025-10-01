import './style.css'

// تحقق من تسجيل الدخول عند تحميل الصفحة
if (!localStorage.getItem('tchat_logged_in')) {
  window.location.href = './login.html';
}

// إعداد التطبيق الأساسي مطابق للتصميم
document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-heading-lg text-gray-900 font-bold">TCHAT</h1>
            <span class="mr-3 text-body-md text-gray-500">لوحة التحكم</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <button id="refresh-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md text-button-md hover:bg-blue-700 transition-colors">
              تحديث البيانات
            </button>
            <button onclick="logout()" class="text-gray-500 hover:text-gray-700 text-button-md">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- جدول إجمالي الإيرادات -->
      <div class="bg-white rounded-lg shadow-sm border mb-8">
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-lg">
          <h2 class="text-heading-md font-bold">إجمالي الإيرادات (SAR)</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الطلبات المنسوبة<br><span class="font-normal text-gray-500">(آخر 30 يوماً)</span></th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الحالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">إجمالي الإيرادات<br><span class="font-normal text-gray-500">(منذ البدء)</span></th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">إجمالي الإيرادات<br><span class="font-normal text-gray-500">(30 يوماً سابقة)</span></th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">إجمالي الإيرادات<br><span class="font-normal text-gray-500">(آخر 30 يوماً)</span></th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold"></th>
              </tr>
            </thead>
            <tbody id="revenue-table-body" class="divide-y divide-gray-200">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- جدول رقم الواتساب -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-lg">
          <h2 class="text-heading-md font-bold">رقم الواتساب</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الرقم</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الحالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">تقييم الجودة</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الحد اليومي للرسائل</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">الإسم</th>
                <th class="px-6 py-3 text-right text-body-sm text-gray-700 font-semibold">مزود الخدمة</th>
              </tr>
            </thead>
            <tbody id="whatsapp-table-body" class="divide-y divide-gray-200">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- إحصائيات سريعة -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-heading-sm text-gray-700 mb-2">السلات المتروكة</h3>
          <p class="text-heading-xl text-blue-600 font-bold" id="abandoned-carts-count">0</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-heading-sm text-gray-700 mb-2">رسائل WhatsApp</h3>
          <p class="text-heading-xl text-green-600 font-bold" id="whatsapp-messages-count">0</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-heading-sm text-gray-700 mb-2">العملاء النشطون</h3>
          <p class="text-heading-xl text-purple-600 font-bold" id="active-customers-count">0</p>
        </div>
      </div>
    </main>
  </div>
`

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // التحقق من تسجيل الدخول
  if (!localStorage.getItem('tchat_logged_in')) {
    window.location.href = './login.html';
    return;
  }

  // إعداد زر التحديث
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      if (window.initApp) {
        window.initApp();
      }
    });
  }

  // تهيئة التطبيق
  if (window.initApp) {
    window.initApp();
  }
});
