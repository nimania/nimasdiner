# Gmail / Sheets / Drive backend

سورس اجرایی در `Code.gs` است. مسیر مستقیم گوگل دیگر مقصد فرم یا ایمیل جدید نیست؛ Worker عمومی بین مرورگر و Google قرار دارد.

مستندات مرجع: [معماری](../docs/ARCHITECTURE.md)، [انتشار](../docs/OPERATIONS.md)، [داده‌ها](../docs/DATA.md)، [عیب‌یابی](../docs/TROUBLESHOOTING.md).

آزمون بدون پیام واقعی:

```bash
node backend/tests/flow.cjs
```

تغییر سورس در GitHub، نسخهٔ منتشرشدهٔ Google Apps Script را خودکار تغییر نمی‌دهد.
