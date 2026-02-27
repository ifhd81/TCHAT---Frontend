/**
 * مودال تأكيد و مودال إدخال مخصص — بديل عن confirm() و prompt() في كامل المشروع
 * الاستخدام: await showConfirmModal({ ... }) أو await showPromptModal({ ... })
 */
(function () {
  const CONFIRM_ID = 'tchat-confirm-modal';
  const PROMPT_ID = 'tchat-prompt-modal';

  function createConfirmModal() {
    if (document.getElementById(CONFIRM_ID)) return;
    const wrap = document.createElement('div');
    wrap.id = CONFIRM_ID;
    wrap.className = 'fixed inset-0 z-[70] hidden items-center justify-center bg-black/50 backdrop-blur-sm';
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = `
      <div class="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg animate-pop-in" role="dialog" aria-labelledby="tchat-confirm-title">
        <div id="tchat-confirm-icon-wrap" class="flex items-center gap-3 mb-4">
          <span id="tchat-confirm-icon" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <i data-lucide="help-circle" class="h-5 w-5 text-primary"></i>
          </span>
          <h3 id="tchat-confirm-title" class="text-heading-md font-semibold text-foreground">تأكيد</h3>
        </div>
        <p id="tchat-confirm-message" class="text-body-sm text-muted-foreground mb-6 whitespace-pre-line"></p>
        <div class="flex items-center justify-end gap-2">
          <button type="button" id="tchat-confirm-cancel" class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-body-sm font-medium transition hover:bg-accent hover:text-accent-foreground">
            إلغاء
          </button>
          <button type="button" id="tchat-confirm-submit" class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground transition hover:bg-primary-hover">
            موافق
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function createPromptModal() {
    if (document.getElementById(PROMPT_ID)) return;
    const wrap = document.createElement('div');
    wrap.id = PROMPT_ID;
    wrap.className = 'fixed inset-0 z-[70] hidden items-center justify-center bg-black/50 backdrop-blur-sm';
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = `
      <div class="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg animate-pop-in" role="dialog" aria-labelledby="tchat-prompt-title">
        <div class="flex items-center gap-3 mb-4">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <i data-lucide="edit-3" class="h-5 w-5 text-primary"></i>
          </span>
          <h3 id="tchat-prompt-title" class="text-heading-md font-semibold text-foreground">إدخال</h3>
        </div>
        <p id="tchat-prompt-message" class="text-body-sm text-muted-foreground mb-3"></p>
        <input type="text" id="tchat-prompt-input" class="flex h-11 w-full rounded-lg border border-input bg-background px-4 text-body-md text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mb-2" placeholder="" dir="ltr" />
        <p id="tchat-prompt-hint" class="text-body-xs text-muted-foreground mb-4 hidden"></p>
        <p id="tchat-prompt-error" class="text-body-xs text-destructive mb-4 hidden">النص المدخل غير صحيح. يرجى كتابة النص المطلوب بالكامل.</p>
        <div class="flex items-center justify-end gap-2">
          <button type="button" id="tchat-prompt-cancel" class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-body-sm font-medium transition hover:bg-accent hover:text-accent-foreground">
            إلغاء
          </button>
          <button type="button" id="tchat-prompt-submit" class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground transition hover:bg-primary-hover">
            موافق
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function init() {
    createConfirmModal();
    createPromptModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * عرض مودال تأكيد مخصص (بديل confirm)
   * @param {Object} opts
   * @param {string} [opts.title='تأكيد']
   * @param {string} opts.message
   * @param {string} [opts.confirmText='موافق']
   * @param {string} [opts.cancelText='إلغاء']
   * @param {boolean} [opts.danger=false] — إذا true يظهر الزر الرئيسي بلون تحذير
   * @returns {Promise<boolean>} true إذا ضغط موافق، false إذا إلغاء أو إغلاق
   */
  window.showConfirmModal = function (opts) {
    init();
    const el = document.getElementById(CONFIRM_ID);
    const titleEl = document.getElementById('tchat-confirm-title');
    const messageEl = document.getElementById('tchat-confirm-message');
    const cancelBtn = document.getElementById('tchat-confirm-cancel');
    const submitBtn = document.getElementById('tchat-confirm-submit');
    const iconWrap = document.getElementById('tchat-confirm-icon-wrap');
    const iconSpan = document.getElementById('tchat-confirm-icon');

    const title = opts.title != null ? opts.title : 'تأكيد';
    const message = opts.message != null ? opts.message : '';
    const confirmText = opts.confirmText != null ? opts.confirmText : 'موافق';
    const cancelText = opts.cancelText != null ? opts.cancelText : 'إلغاء';
    const danger = !!opts.danger;

    titleEl.textContent = title;
    messageEl.textContent = message;
    cancelBtn.textContent = cancelText;
    submitBtn.textContent = confirmText;

    if (danger) {
      iconSpan.className = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10';
      iconSpan.innerHTML = '<i data-lucide="alert-triangle" class="h-5 w-5 text-destructive"></i>';
      submitBtn.className = 'inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-body-sm font-medium text-destructive-foreground transition hover:bg-destructive/90';
    } else {
      iconSpan.className = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10';
      iconSpan.innerHTML = '<i data-lucide="help-circle" class="h-5 w-5 text-primary"></i>';
      submitBtn.className = 'inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground transition hover:bg-primary-hover';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();

    return new Promise(function (resolve) {
      function finish(value) {
        el.classList.add('hidden');
        el.classList.remove('flex');
        cancelBtn.removeEventListener('click', onCancel);
        submitBtn.removeEventListener('click', onSubmit);
        el.removeEventListener('click', onBackdrop);
          document.removeEventListener('keydown', onKey);
        resolve(value);
      }
      function onCancel() { finish(false); }
      function onSubmit() { finish(true); }
      function onBackdrop(e) { if (e.target === el) finish(false); }
      function onKey(e) {
        if (e.key === 'Escape') finish(false);
      }

      cancelBtn.addEventListener('click', onCancel);
      submitBtn.addEventListener('click', onSubmit);
      el.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);

      el.classList.remove('hidden');
      el.classList.add('flex');
    });
  };

  /**
   * عرض مودال إدخال مخصص (بديل prompt)
   * @param {Object} opts
   * @param {string} [opts.title='إدخال']
   * @param {string} [opts.message='']
   * @param {string} [opts.placeholder='']
   * @param {string} [opts.requiredValue] — إذا وُجد يجب أن يطابق الإدخال (مثلاً DELETE_ALL_CAMPAIGNS)
   * @param {string} [opts.submitText='موافق']
   * @param {string} [opts.cancelText='إلغاء']
   * @returns {Promise<string|null>} القيمة المدخلة أو null عند الإلغاء
   */
  window.showPromptModal = function (opts) {
    init();
    const el = document.getElementById(PROMPT_ID);
    const titleEl = document.getElementById('tchat-prompt-title');
    const messageEl = document.getElementById('tchat-prompt-message');
    const inputEl = document.getElementById('tchat-prompt-input');
    const hintEl = document.getElementById('tchat-prompt-hint');
    const errorEl = document.getElementById('tchat-prompt-error');
    const cancelBtn = document.getElementById('tchat-prompt-cancel');
    const submitBtn = document.getElementById('tchat-prompt-submit');

    const title = opts.title != null ? opts.title : 'إدخال';
    const message = opts.message != null ? opts.message : '';
    const placeholder = opts.placeholder != null ? opts.placeholder : '';
    const requiredValue = opts.requiredValue;
    const submitText = opts.submitText != null ? opts.submitText : 'موافق';
    const cancelText = opts.cancelText != null ? opts.cancelText : 'إلغاء';

    titleEl.textContent = title;
    messageEl.textContent = message;
    inputEl.placeholder = placeholder;
    inputEl.value = '';
    cancelBtn.textContent = cancelText;
    submitBtn.textContent = submitText;
    if (requiredValue) {
      hintEl.textContent = 'للتأكيد اكتب: ' + requiredValue;
      hintEl.classList.remove('hidden');
    } else {
      hintEl.classList.add('hidden');
    }
    errorEl.classList.add('hidden');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    return new Promise(function (resolve) {
      function finish(value) {
        el.classList.add('hidden');
        el.classList.remove('flex');
        cancelBtn.removeEventListener('click', onCancel);
        submitBtn.removeEventListener('click', onSubmit);
        el.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKey);
        inputEl.removeEventListener('keydown', onInputKey);
        resolve(value);
      }
      function onCancel() { finish(null); }
      function onSubmit() {
        const val = inputEl.value.trim();
        if (requiredValue && val !== requiredValue) {
          errorEl.classList.remove('hidden');
          return;
        }
        finish(val);
      }
      function onBackdrop(e) { if (e.target === el) finish(null); }
      function onKey(e) {
        if (e.key === 'Escape') finish(null);
      }
      function onInputKey(e) {
        if (e.key === 'Enter') submitBtn.click();
      }

      cancelBtn.addEventListener('click', onCancel);
      submitBtn.addEventListener('click', onSubmit);
      el.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
      inputEl.addEventListener('keydown', onInputKey);

      el.classList.remove('hidden');
      el.classList.add('flex');
      inputEl.focus();
    });
  };
})();
