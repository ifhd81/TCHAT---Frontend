import './style.css'

// إعداد التطبيق الأساسي
document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-background">
    <header class="bg-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-heading-lg text-primary">TCHAT</h1>
            <span class="mr-2 text-body-md text-muted-foreground">لوحة التحكم</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <button id="refresh-btn" class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-button-md hover:bg-primary/90 transition-colors">
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- إحصائيات سريعة -->
        <div class="bg-card p-6 rounded-lg border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">السلات المتروكة</h3>
          <p class="text-heading-xl text-primary" id="abandoned-carts-count">0</p>
        </div>
        
        <div class="bg-card p-6 rounded-lg border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">رسائل WhatsApp</h3>
          <p class="text-heading-xl text-primary" id="whatsapp-messages-count">0</p>
        </div>
        
        <div class="bg-card p-6 rounded-lg border border-border">
          <h3 class="text-heading-sm text-card-foreground mb-2">العملاء النشطون</h3>
          <p class="text-heading-xl text-primary" id="active-customers-count">0</p>
        </div>
      </div>

      <!-- جدول السلات المتروكة -->
      <div class="bg-card rounded-lg border border-border">
        <div class="p-6 border-b border-border">
          <h2 class="text-heading-md text-card-foreground">السلات المتروكة الحديثة</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">اسم العميل</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">رقم الجوال</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">المبلغ</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">عدد المنتجات</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">حالة الرسالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody id="abandoned-carts-table" class="divide-y divide-border">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- جدول رسائل WhatsApp -->
      <div class="bg-card rounded-lg border border-border mt-8">
        <div class="p-6 border-b border-border">
          <h2 class="text-heading-md text-card-foreground">رسائل WhatsApp الحديثة</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">معرف الرسالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">رقم الهاتف</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">الحالة</th>
                <th class="px-6 py-3 text-right text-body-sm text-muted-foreground font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody id="whatsapp-webhooks-table" class="divide-y divide-border">
              <!-- البيانات ستُحمل هنا -->
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
`

// إعداد الوظائف
async function loadData() {
  try {
    // تحميل الإحصائيات والبيانات من API
    console.log('تحميل البيانات...')
    
    // هنا سنضيف استدعاءات API للـ backend
    // مثال: await fetch('https://tchat-production.up.railway.app/api/v1/stats')
    
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error)
  }
}

// إعداد الأحداث
document.getElementById('refresh-btn').addEventListener('click', loadData)

// تحميل البيانات عند بدء التطبيق
loadData()
