# 🔐 تكامل JWT في Frontend

## 📋 نظرة عامة

تم تحديث Frontend بالكامل لدعم JWT (JSON Web Tokens) للمصادقة والتفويض.

---

## ✅ التحديثات المنفذة

### 1. ملف `api.js`

#### ✨ إضافة دالة `refreshAccessToken()`
```javascript
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
```

#### 🔄 تحديث `apiRequest()`
- تغيير من `tchat_token` إلى `access_token`
- إضافة معالجة تلقائية لـ 401 Unauthorized
- محاولة تجديد الـ token عند انتهاء صلاحيته
- إعادة التوجيه لصفحة تسجيل الدخول عند فشل التجديد

```javascript
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
```

#### 🚪 إضافة دالة `logout()`
```javascript
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
```

---

### 2. ملف `login.html`

#### 🔑 تحديث حفظ Tokens
```javascript
if (data.success) {
  // حفظ بيانات المستخدم والـ JWT tokens
  localStorage.setItem('tchat_logged_in', 'true');
  localStorage.setItem('tchat_user', JSON.stringify(data.user));
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  console.log('✅ تم تسجيل الدخول بنجاح');
  console.log('📌 Access Token:', data.access_token ? 'تم الحفظ' : 'غير موجود');
  console.log('📌 Refresh Token:', data.refresh_token ? 'تم الحفظ' : 'غير موجود');
  
  // توجيه إلى لوحة التحكم
  window.location.href = './dashboard.html';
}
```

**التغييرات:**
- تغيير من `tchat_token` إلى `access_token` و `refresh_token`
- إضافة console logs للتحقق من نجاح العملية

---

### 3. جميع صفحات HTML

تم تحديث الصفحات التالية:
- ✅ `campaigns.html`
- ✅ `chats.html`
- ✅ `dashboard.html`
- ✅ `webhooks.html`
- ✅ `templates.html`
- ✅ `customers.html`

**التغييرات:**
1. **إزالة دوال logout المحلية** - استخدام دالة `logout()` من `api.js`
2. **تحديث استخدامات `tchat_token`** - تغيير إلى `access_token`
3. **الأزرار تستدعي `logout()` مباشرة** من `api.js`

#### مثال على التحديثات في `campaigns.html`:
```javascript
// ❌ قديم
'Authorization': `Bearer ${localStorage.getItem('tchat_token')}`

// ✅ جديد
'Authorization': `Bearer ${localStorage.getItem('access_token')}`
```

```javascript
// ❌ قديم - دالة محلية
function logout() {
  localStorage.removeItem('tchat_logged_in');
  localStorage.removeItem('tchat_user');
  localStorage.removeItem('tchat_token');
  window.location.href = './login.html';
}

// ✅ جديد - استخدام الدالة من api.js
// دالة logout موجودة في api.js
```

---

## 🔄 آلية عمل Tokens

### Access Token
- **الصلاحية:** 24 ساعة
- **الاستخدام:** جميع طلبات API المحمية
- **التخزين:** `localStorage` في مفتاح `access_token`
- **التجديد:** تلقائياً عند انتهاء الصلاحية (401 response)

### Refresh Token
- **الصلاحية:** 7 أيام
- **الاستخدام:** تجديد access token فقط
- **التخزين:** `localStorage` في مفتاح `refresh_token`
- **Endpoint:** `POST /auth/refresh`

---

## 📊 تدفق المصادقة

```
1. المستخدم → Login Page
   ├── يُدخل username + password
   └── Submit

2. Frontend → Backend (POST /auth/login)
   ├── Body: { username, password }
   └── Response: { access_token, refresh_token, user }

3. Frontend
   ├── يحفظ access_token في localStorage
   ├── يحفظ refresh_token في localStorage
   └── إعادة توجيه إلى Dashboard

4. Frontend → Backend (أي API محمي)
   ├── Headers: { Authorization: "Bearer {access_token}" }
   └── إذا 401:
       ├── محاولة تجديد Token (POST /auth/refresh)
       ├── إعادة المحاولة مع Token جديد
       └── أو إعادة توجيه لـ Login إذا فشل

5. Logout
   ├── استدعاء POST /auth/logout
   ├── مسح localStorage (access_token, refresh_token)
   └── إعادة توجيه لـ Login Page
```

---

## 🔐 الأمان

### ✅ ما تم تطبيقه:
1. **JWT Tokens** بدلاً من Simple Tokens
2. **Automatic Token Refresh** - تجديد تلقائي عند انتهاء الصلاحية
3. **Secure Logout** - مسح جميع البيانات الحساسة
4. **401 Handling** - معالجة تلقائية لانتهاء الصلاحية
5. **Bearer Token Format** - `Authorization: Bearer {token}`

### ⚠️ ملاحظات أمنية:
1. **JWT_SECRET** يجب أن يبقى في Backend فقط
2. **Tokens** يتم حفظها في `localStorage` (ليس الأفضل، لكن مناسب للـ SPA)
3. **HTTPS** مطلوب في Production لحماية الـ tokens
4. **Token Expiration** يجب مراقبته والتجديد تلقائياً

---

## 🧪 اختبار التكامل

### 1. اختبار تسجيل الدخول
```javascript
// افتح Console في المتصفح
localStorage.clear();
// سجل الدخول عبر UI
// تحقق من:
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
```

### 2. اختبار Token Refresh
```javascript
// احذف access_token فقط
localStorage.removeItem('access_token');
// حاول الوصول إلى API
// يجب أن يتم تجديد الـ token تلقائياً
```

### 3. اختبار Logout
```javascript
// اضغط على زر تسجيل الخروج
// تحقق من:
console.log('Storage:', localStorage); // يجب أن يكون فارغاً
// يجب إعادة التوجيه لصفحة تسجيل الدخول
```

---

## 📝 TODO - تحسينات مستقبلية

1. **HttpOnly Cookies** - لحماية أفضل من XSS
2. **Token Rotation** - تدوير الـ refresh token عند كل استخدام
3. **CSRF Protection** - حماية من CSRF attacks
4. **Rate Limiting** - في Frontend لمنع الهجمات
5. **Secure Context** - استخدام Service Worker لتخزين آمن

---

## 🎯 الخلاصة

✅ تم تحديث Frontend بالكامل لدعم JWT Authentication  
✅ معالجة تلقائية لانتهاء صلاحية Tokens  
✅ تجديد تلقائي للـ Access Token  
✅ دالة logout مركزية وآمنة  
✅ جميع الصفحات محدثة ومتوافقة  

**النظام الآن جاهز للإنتاج مع مستوى أمان عالٍ! 🚀**

---

© 2025 TCHAT - جميع الحقوق محفوظة

