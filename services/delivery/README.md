# Nima Diner delivery Worker

کد مرجع سرویس دریافت عمومی. GitHub Pages به این سرویس POST می‌زند؛ این سرویس پشت سرور با Google ارتباط دارد. دادهٔ مخاطب در حافظهٔ Worker موقتی است و این کد پایگاه دادهٔ جدا ندارد.

```bash
node --check worker/index.js
bash scripts/build.sh
```

انتشار مستقل از Pages است؛ [راهنمای عملیات](../../docs/OPERATIONS.md) را دنبال کنید. project_id موجود در .openai/hosting.json حفظ شود. credential یا PDF خصوصی در این پوشه قرار نگیرد. تغییر هم‌زمان این کد در مخزن Sites و این مخزن باید با SHA و توضیح نسخه مستند شود تا دو نسخه از هم جدا نشوند.
