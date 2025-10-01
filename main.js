import './style.css'

// تحقق من تسجيل الدخول عند تحميل الصفحة
if (!localStorage.getItem('tchat_logged_in')) {
  window.location.href = './login.html';
}

// إعداد التطبيق الأساسي مطابق للتصميم
document.querySelector('#app').innerHTML = `
  <div class="min-h-screen" style="background: linear-gradient(to bottom, #eef2ff 0%, #f8fafc 50%, #ffffff 100%)"
    <!-- Header -->
    <header class="shadow-sm border-b border-gray-200" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);"
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-heading-lg font-bold" style="color: #1f2937;">TCHAT</h1>
            <span class="mr-3 text-body-md" style="color: #6b7280;">لوحة التحكم</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <button id="refresh-btn" class="px-3 py-1.5 rounded-md text-button-sm transition-colors" style="background: #4f46e5; color: white;" onmouseover="this.style.background='#4338ca'" onmouseout="this.style.background='#4f46e5'">
              تحديث
            </button>
            <button onclick="logout()" class="text-button-sm transition-colors" style="color: #6b7280;" onmouseover="this.style.color='#1f2937'" onmouseout="this.style.color='#6b7280'">
              خروج
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- جدول إجمالي الإيرادات -->
      <div class="rounded-xl border shadow-sm mb-8" style="background: white; border-color: #e0e7ff; border-radius: 12px;">
        <div class="p-4 rounded-t-xl" style="background: linear-gradient(to right, #4f46e5, #4338ca); color: white;">
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
            <tbody id="revenue-table-body" class="divide-y divide-border">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- جدول رقم الواتساب -->
      <div class="rounded-xl border shadow-sm" style="background: white; border-color: #e0e7ff; border-radius: 12px;">
        <div class="p-4 rounded-t-xl" style="background: linear-gradient(to right, #4f46e5, #4338ca); color: white;">
          <h2 class="text-heading-md font-bold">رقم الواتساب</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">الرقم</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">الحالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">تقييم الجودة</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">الحد اليومي للرسائل</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">الإسم</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-semibold">مزود الخدمة</th>
              </tr>
            </thead>
            <tbody id="whatsapp-table-body" class="divide-y divide-border">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- إحصائيات سريعة -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">السلات المتروكة</h3>
          <p class="text-heading-xl text-primary font-bold" id="abandoned-carts-count">0</p>
        </div>
        
        <div class="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">رسائل WhatsApp</h3>
          <p class="text-heading-xl text-primary font-bold" id="whatsapp-messages-count">0</p>
        </div>
        
        <div class="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">العملاء النشطون</h3>
          <p class="text-heading-xl text-primary font-bold" id="active-customers-count">0</p>
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
