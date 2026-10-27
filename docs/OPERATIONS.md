# راه‌اندازی، انتشار و نگهداری

## نشانی‌های فنی عمومی

- صفحهٔ کتاب: https://nimania.github.io/nimasdiner/
- سرویس دریافت: https://nimasdiner-delivery.iran.chatgpt.site/
- Sites project: `appgprj_6adf3c1cbcac81918e621e51eb6ee47f`
- Apps Script project: `1O_5QIjbkg7e52Vualbjqta8QZjNtZATyDfq9qF2rLPO-pXYN-STtPIfG`
- endpoint گوگل در `services/delivery/worker/index.js`، `UPSTREAM` است.

این شناسه‌ها مجوز ورود یا کلید نیستند؛ دسترسی مدیریتی نیازمند حساب مجاز است. رمز، OAuth token، source credential یا لینک دریافت مخاطب را به مستندات اضافه نکنید.

## سه انتشار مستقل

### صفحهٔ عمومی

فایل‌های ریشه را تغییر دهید، روی `main` commit/push کنید و موفقیت `.github/workflows/pages.yml` را بررسی کنید. Workflow فقط HTML/CSS/JS مشخص و assets را منتشر می‌کند؛ docs، backend، book و services نباید در خروجی Pages کپی شوند. فرم باید به `/register` سرویس دریافت اشاره کند. حذف فایل از Git به معنی حذف از history نیست.

### Apps Script

1. کد `backend/Code.gs` را در پروژهٔ موجود کپی و Save کنید؛ فایل را کامل جایگزین کنید تا حرف اضافه در ابتدا باقی نماند.
2. راه‌اندازی اولیه: `setup` را با حساب مالک اجرا کنید. مجوزها را مالک بررسی کند. این تابع Sheet و trigger پانزده‌دقیقه‌ای processQueue را می‌سازد؛ اجرای دوباره، راه‌اندازی موجود را دوباره‌سازی نمی‌کند.
3. Script Properties: `SHEET_ID` و `BOOK_FILE_ID` را بررسی کنید. این فایل و شیت باید خصوصی بمانند؛ فایل را Anyone نکنید.
4. Deploy → Manage deployments → Edit → Version → New version → Deploy. گزینه‌ها: Execute as مالک، Who has access: Anyone. پروژه و deployment موجود را حفظ کنید تا UPSTREAM نشکند.
5. صرف Save کردن کد نسخهٔ منتشرشدهٔ `/exec` را عوض نمی‌کند. هر بار نسخهٔ جدید منتشر و آزمایش شود.

### سرویس دریافت Worker

نسخهٔ مرجع در `services/delivery` است. سرویس اجرایی روی Sites و مخزن سورس متصل به همان project ID منتشر می‌شود. این کد به تنهایی با Pages منتشر نمی‌شود.

1. با ابزارهای رسمی Sites پروژهٔ موجود را دریافت کنید و source credential کوتاه‌عمر برای همان پروژه بگیرید. آن را فقط در حافظه/ورودی استاندارد ابزار نگه دارید.
2. فایل‌های services/delivery را در checkout اختصاصی پروژه کپی کنید؛ `.openai/hosting.json` باید project ID موجود را حفظ کند. برای Worker، `static` تنظیم نکنید.
3. `node --check worker/index.js` و `bash scripts/build.sh` را اجرا کنید. خروجی `dist/server/index.js` و `dist/.openai/hosting.json` ساخته می‌شود.
4. همان سورس را در مخزن متصل به Sites push کنید. SHA را ثبت کنید؛ archive باید دقیقاً از همان سورس باشد.
5. archive از ریشهٔ checkout شامل `.openai/hosting.json` و `dist/server/index.js` باشد، نه فقط محتوای داخل dist با مسیر server/index.js. نمونه: `tar -czf delivery.tar.gz .openai dist`.
6. با `save_site_version(project_id, commit_sha, archive)` نسخه ذخیره و با `deploy_site_version` منتشر کنید. وضعیت succeeded و URL را بررسی کنید. مخاطب سرویس عمومی است؛ دسترسی آن را برای انتشار خصوصی نکنید.
7. ND.delivery در Apps Script، action فرم GitHub و origin سرویس باید هماهنگ باشند.

## تعویض کتاب

PDF نهایی را از [راهنمای کتاب](../book/README.md) بسازید، صفحات تغییرکرده و QRها را بررسی کنید، سپس بایت فایل خصوصی Drive موجود را با همان ID جایگزین کنید. لینک‌های معتبر موجود نسخهٔ تازه را دریافت خواهند کرد. اگر فایل جدید ID تازه دارد، BOOK_FILE_ID را با دسترسی مالک تغییر دهید. تعداد صفحات در HTML را نیز هماهنگ کنید. PDF را در assets عمومی نگذارید.

## Gmail و صف

ثبت تازه به مخاطب ایمیل تأیید یا لینک دانلود نمی‌فرستد؛ فایل بلافاصله پس از ثبت فرم دانلود می‌شود. صف Gmail برای اعلان خصوصی مالک و پیام‌های قدیمی در صف نگهداری شده است. `processQueue` هر ۱۵ دقیقه اجرا می‌شود و بعد از ثبت معمول نیز فراخوانی می‌شود. بودجهٔ هر اجرا حداکثر ۱۰ گیرنده با ذخیرهٔ ۱۵ گیرنده از سهمیهٔ جاری است. پس از ۵ خطای ارسال، job به `failed` می‌رود؛ تغییر آن به `pending` فقط پس از بررسی خطا و خطر ارسال تکراری انجام شود. ظرفیت Gmail تضمین ارسال انبوه نیست.

## آزمایش و بازگشت

آزمون‌های محلی، سپس ثبت با ایمیل آزمایشی مالک، دانلود مستقیم PDF، ثبت شمارنده و لینک نامعتبر را بررسی کنید. کاربر تازه نباید ایمیل تأیید یا لینک دانلود جداگانه لازم داشته باشد. لینک‌های تأیید قدیمی باید همچنان کار کنند. آزمایش بدون کوکی/ورود گوگل و روی موبایل ضروری است. برای درخواست مستقیم به Worker در ابزار HTTP، هدر Origin صحیح بفرستید؛ middleware میزبانی ممکن است درخواست فاقد Origin را رد کند. Origin احراز هویت نیست؛ توکن همچنان سمت سرور اعتبارسنجی می‌شود.

برای بازگشت: نسخهٔ قبلی Apps Script deployment و نسخهٔ ذخیره‌شدهٔ Sites را انتخاب کنید و commit صفحه را revert کنید. اگر قالب API/لینک‌ها تغییر کرده، هر سه جزء را هماهنگ برگردانید؛ لینک کاربران را بی‌دلیل invalidate نکنید. بکاپ خصوصی Sheets و PDF پیش از تغییر ساختاری تهیه شود؛ دادهٔ واقعی وارد Git نشود.
