export const calculators={
  "foodcost": {
    "title": "فودکاست هر پرس",
    "formula": "هزینهٔ مواد ÷ قیمت فروش × ۱۰۰",
    "fields": [
      {
        "key": "cost",
        "label": "مواد هر پرس",
        "unit": "تومان",
        "example": 42000
      },
      {
        "key": "price",
        "label": "فروش خالص هر پرس",
        "unit": "تومان",
        "example": 120000
      }
    ],
    "note": "مانده پس از مواد، سود خالص نیست؛ هزینه‌های دیگر جدا هستند."
  },
  "breakeven": {
    "title": "نقطهٔ سربه‌سر سفارش‌ها",
    "formula": "هزینهٔ ثابت ÷ (درآمد سفارش − هزینهٔ متغیر)، گرد به بالا",
    "fields": [
      {
        "key": "fixed",
        "label": "هزینهٔ ثابت ماهانه",
        "unit": "تومان",
        "example": 150000000
      },
      {
        "key": "price",
        "label": "درآمد متوسط سفارش",
        "unit": "تومان",
        "example": 200000
      },
      {
        "key": "variable",
        "label": "هزینهٔ متغیر سفارش",
        "unit": "تومان",
        "example": 120000
      },
      {
        "key": "days",
        "label": "روز کاری ماه",
        "unit": "روز",
        "example": 26,
        "max": 31
      }
    ],
    "note": "ترکیب فروش و میانگین هزینه در این سناریو ثابت فرض می‌شود."
  },
  "contribution": {
    "title": "مشارکت هر محصول",
    "formula": "مشارکت واحد = فروش خالص − هزینهٔ متغیر؛ مشارکت کل = مشارکت واحد × تعداد",
    "fields": [
      {
        "key": "price",
        "label": "فروش خالص واحد",
        "unit": "تومان",
        "example": 180000
      },
      {
        "key": "variable",
        "label": "هزینهٔ متغیر واحد",
        "unit": "تومان",
        "example": 100000
      },
      {
        "key": "orders",
        "label": "تعداد فروش",
        "unit": "واحد",
        "example": 120
      }
    ],
    "note": "مشارکت باید هزینه‌های ثابت را هم پوشش بدهد؛ سود خالص نیست."
  },
  "markup": {
    "title": "قیمت با حاشیهٔ هدف",
    "formula": "هزینهٔ مبنا ÷ (۱ − حاشیهٔ هدف ÷ ۱۰۰)",
    "fields": [
      {
        "key": "cost",
        "label": "هزینهٔ مبنای واحد",
        "unit": "تومان",
        "example": 100000
      },
      {
        "key": "margin",
        "label": "حاشیهٔ هدف از قیمت فروش",
        "unit": "درصد",
        "example": 40,
        "max": 100
      }
    ],
    "note": "حاشیه از قیمت فروش با درصد افزایش روی هزینه فرق دارد. هزینه‌های جاافتاده سود نیستند."
  },
  "recipe": {
    "title": "هزینهٔ هر پرس از یک بچ",
    "formula": "هزینهٔ مواد بچ ÷ تعداد پرس قابل فروش + هزینهٔ افزودهٔ هر پرس",
    "fields": [
      {
        "key": "batch",
        "label": "مواد کل بچ",
        "unit": "تومان",
        "example": 1250000
      },
      {
        "key": "portions",
        "label": "پرس قابل فروش",
        "unit": "واحد",
        "example": 10
      },
      {
        "key": "extra",
        "label": "هزینهٔ افزودهٔ هر پرس",
        "unit": "تومان",
        "example": 15000
      }
    ],
    "note": "بازده را با پرس‌های سالم و قابل فروش بسنج."
  },
  "yield": {
    "title": "افت و بهای مقدار قابل مصرف",
    "formula": "قیمت قابل مصرف = قیمت خرید ÷ بازده؛ هزینهٔ پرس = قیمت قابل مصرف × گرم پرس ÷ ۱۰۰۰",
    "fields": [
      {
        "key": "price",
        "label": "قیمت خرید هر کیلو",
        "unit": "تومان",
        "example": 400000
      },
      {
        "key": "yield",
        "label": "بازده قابل مصرف",
        "unit": "درصد",
        "example": 80,
        "max": 100
      },
      {
        "key": "grams",
        "label": "وزن ماده در پرس",
        "unit": "گرم",
        "example": 150
      }
    ],
    "note": "قیمت و بازده باید مربوط به همان مرحله باشند؛ افت پاک‌کردن و پخت را دوباره حساب نکن."
  },
  "inventory": {
    "title": "مصرف واقعی مواد",
    "formula": "مصرف = موجودی آغاز + خرید خالص − موجودی پایان",
    "fields": [
      {
        "key": "opening",
        "label": "ارزش موجودی آغاز",
        "unit": "تومان",
        "example": 20000000
      },
      {
        "key": "purchases",
        "label": "خرید خالص مواد",
        "unit": "تومان",
        "example": 50000000
      },
      {
        "key": "closing",
        "label": "ارزش موجودی پایان",
        "unit": "تومان",
        "example": 15000000
      },
      {
        "key": "sales",
        "label": "فروش خالص مرتبط",
        "unit": "تومان",
        "example": 150000000
      }
    ],
    "note": "ارزش‌گذاری موجودی‌ها باید همسان باشد؛ انتقال و برگشت را منظور کن."
  },
  "waste": {
    "title": "نرخ و ارزش ضایعات",
    "formula": "نرخ = ضایعات ÷ مقدار مبنا × ۱۰۰؛ ارزش = ضایعات × بهای واحد",
    "fields": [
      {
        "key": "made",
        "label": "مقدار تولید یا مبنا",
        "unit": "واحد",
        "example": 100
      },
      {
        "key": "wasted",
        "label": "مقدار ضایعات",
        "unit": "واحد",
        "example": 8
      },
      {
        "key": "unit",
        "label": "بهای هر واحد",
        "unit": "تومان",
        "example": 50000
      }
    ],
    "note": "واحد مقدارها یکسان باشد؛ قیمت فروش را به جای بهای ضایعات نگذار."
  },
  "reorder": {
    "title": "نقطهٔ سفارش",
    "formula": "مصرف روزانه × زمان تحویل + ذخیرهٔ اطمینان",
    "fields": [
      {
        "key": "daily",
        "label": "مصرف روزانه",
        "unit": "واحد",
        "example": 12
      },
      {
        "key": "lead",
        "label": "زمان تحویل",
        "unit": "روز",
        "example": 3
      },
      {
        "key": "safety",
        "label": "ذخیرهٔ اطمینان",
        "unit": "واحد",
        "example": 15
      }
    ],
    "note": "این نقطه، زمان سفارش را مشخص می‌کند؛ مقدار خرید و ماندگاری جدا بررسی شوند."
  },
  "labor": {
    "title": "هزینهٔ نیرو و بهره‌وری ساعت کار",
    "formula": "نسبت نیرو = هزینهٔ نیرو ÷ فروش × ۱۰۰؛ فروش هر ساعت = فروش ÷ نفرساعت",
    "fields": [
      {
        "key": "payroll",
        "label": "هزینهٔ نیرو در دوره",
        "unit": "تومان",
        "example": 80000000
      },
      {
        "key": "sales",
        "label": "فروش خالص دوره",
        "unit": "تومان",
        "example": 400000000
      },
      {
        "key": "hours",
        "label": "مجموع نفرساعت",
        "unit": "ساعت",
        "example": 800
      }
    ],
    "note": "تعریف هزینهٔ نیرو و بازهٔ زمانی را در مقایسه ثابت نگه دار."
  },
  "capacity": {
    "title": "ظرفیت نظری پذیرایی",
    "formula": "صندلی × مدت سرویس ÷ مدت حضور × درصد استفاده",
    "fields": [
      {
        "key": "seats",
        "label": "تعداد صندلی",
        "unit": "واحد",
        "example": 40
      },
      {
        "key": "service",
        "label": "مدت سرویس",
        "unit": "دقیقه",
        "example": 240
      },
      {
        "key": "stay",
        "label": "متوسط حضور مهمان",
        "unit": "دقیقه",
        "example": 60
      },
      {
        "key": "occupancy",
        "label": "درصد استفاده",
        "unit": "درصد",
        "example": 70,
        "max": 100
      }
    ],
    "note": "محدودیت آشپزخانه، چیدمان میز و تقاضای واقعی در این برآورد نیست."
  },
  "discount": {
    "title": "تخفیف و ضریب جبران فروش",
    "formula": "مشارکت تازه = قیمت × (۱ − تخفیف) − هزینهٔ متغیر؛ ضریب جبران = مشارکت پیشین ÷ مشارکت تازه",
    "fields": [
      {
        "key": "price",
        "label": "قیمت پیش از تخفیف",
        "unit": "تومان",
        "example": 200000
      },
      {
        "key": "variable",
        "label": "هزینهٔ متغیر",
        "unit": "تومان",
        "example": 120000
      },
      {
        "key": "discount",
        "label": "تخفیف",
        "unit": "درصد",
        "example": 10,
        "max": 100
      }
    ],
    "note": "هزینهٔ متغیر ثابت فرض شده؛ فروش بیشتر یا وجود ظرفیت تضمین نشده است."
  },
  "delivery": {
    "title": "مشارکت هر سفارش دلیوری",
    "formula": "(قیمت − تخفیف) × (۱ − کارمزد) − مواد − بسته‌بندی − سهم ارسال",
    "fields": [
      {
        "key": "price",
        "label": "قیمت پیش از تخفیف",
        "unit": "تومان",
        "example": 300000
      },
      {
        "key": "discount",
        "label": "تخفیف سهم مجموعه",
        "unit": "تومان",
        "example": 15000
      },
      {
        "key": "fee",
        "label": "کارمزد مؤثر",
        "unit": "درصد",
        "example": 20,
        "max": 100
      },
      {
        "key": "food",
        "label": "هزینهٔ مواد",
        "unit": "تومان",
        "example": 90000
      },
      {
        "key": "pack",
        "label": "بسته‌بندی و هزینهٔ متغیر دیگر",
        "unit": "تومان",
        "example": 20000
      },
      {
        "key": "shipping",
        "label": "سهم مجموعه از ارسال",
        "unit": "تومان",
        "example": 10000
      }
    ],
    "note": "کارمزد این مدل روی فروش پس از تخفیف است؛ مبنای قرارداد خودت را بررسی کن. نتیجه سود خالص نیست."
  },
  "budget": {
    "title": "نقد لازم برای افتتاح و ادامهٔ کار",
    "formula": "ودیعه + آماده‌سازی + تجهیزات + خرید اولیه + نیاز نقدی ماهانه × ماه ذخیره + ذخیرهٔ پیش‌بینی‌نشده",
    "fields": [
      {
        "key": "deposit",
        "label": "ودیعه",
        "unit": "تومان",
        "example": 500000000
      },
      {
        "key": "fitout",
        "label": "آماده‌سازی",
        "unit": "تومان",
        "example": 150000000
      },
      {
        "key": "equipment",
        "label": "تجهیزات",
        "unit": "تومان",
        "example": 250000000
      },
      {
        "key": "stock",
        "label": "خرید اولیه",
        "unit": "تومان",
        "example": 30000000
      },
      {
        "key": "monthly",
        "label": "نیاز نقدی ماهانهٔ سناریو",
        "unit": "تومان",
        "example": 50000000
      },
      {
        "key": "months",
        "label": "مدت ذخیره",
        "unit": "ماه",
        "example": 4
      },
      {
        "key": "buffer",
        "label": "ذخیرهٔ پیش‌بینی‌نشده",
        "unit": "تومان",
        "example": 40000000
      }
    ],
    "note": "ودیعه هزینهٔ مصرف‌شده نیست اما نقد را درگیر می‌کند؛ مدت ذخیره انتخاب سناریویی است."
  },
  "runway": {
    "title": "دوام ماهانهٔ ذخیره",
    "formula": "کسری ماهانه = خروج − ورود؛ دوام = ذخیره ÷ کسری",
    "fields": [
      {
        "key": "cash",
        "label": "نقد قابل استفاده",
        "unit": "تومان",
        "example": 200000000
      },
      {
        "key": "inflow",
        "label": "ورودی ماهانه",
        "unit": "تومان",
        "example": 70000000
      },
      {
        "key": "outflow",
        "label": "خروجی ماهانه",
        "unit": "تومان",
        "example": 120000000
      }
    ],
    "note": "فروش وصول‌نشده ورودی نقد نیست؛ ثابت‌ماندن این سناریو فرض شده است."
  },
  "runwaydaily": {
    "title": "دوام روزانهٔ ذخیره",
    "formula": "کسری روزانه = خروج − ورود؛ دوام = ذخیره ÷ کسری",
    "fields": [
      {
        "key": "cash",
        "label": "نقد قابل استفاده",
        "unit": "تومان",
        "example": 200000000
      },
      {
        "key": "inflow",
        "label": "ورودی روزانه",
        "unit": "تومان",
        "example": 7000000
      },
      {
        "key": "outflow",
        "label": "خروجی روزانه",
        "unit": "تومان",
        "example": 12000000
      }
    ],
    "note": "تعهدهای یک‌باره و تغییر فروش را جدا ببین؛ این برآورد با تکرار همین سناریو است."
  },
  "retention": {
    "title": "بازگشت یک گروه مشتری",
    "formula": "مشتریان همان گروه که برگشته‌اند ÷ کل گروه × ۱۰۰",
    "fields": [
      {
        "key": "cohort",
        "label": "مشتریان یکتای گروه",
        "unit": "واحد",
        "example": 100
      },
      {
        "key": "returned",
        "label": "افراد همان گروه که برگشته‌اند",
        "unit": "واحد",
        "example": 28
      }
    ],
    "note": "بازهٔ بازگشت را ثابت تعریف کن؛ تعداد سفارش، تعداد مشتری یکتا نیست. اطلاعات فردی لازم نیست."
  },
  "weekly": {
    "title": "مقایسهٔ دو دوره",
    "formula": "تغییر = (تازه − پایه) ÷ پایه × ۱۰۰؛ متوسط فاکتور = فروش ÷ سفارش",
    "fields": [
      {
        "key": "oldSales",
        "label": "فروش دورهٔ پایه",
        "unit": "تومان",
        "example": 50000000
      },
      {
        "key": "oldOrders",
        "label": "سفارش دورهٔ پایه",
        "unit": "واحد",
        "example": 250
      },
      {
        "key": "newSales",
        "label": "فروش دورهٔ تازه",
        "unit": "تومان",
        "example": 54000000
      },
      {
        "key": "newOrders",
        "label": "سفارش دورهٔ تازه",
        "unit": "واحد",
        "example": 240
      }
    ],
    "note": "روز کاری، ساعت کار، مناسبت و تغییر قیمت را در تفسیر در نظر بگیر."
  },
  "menu": {
    "title": "مقایسهٔ دو آیتم منو",
    "formula": "مشارکت کل = (قیمت − هزینهٔ متغیر) × تعداد",
    "fields": [
      {
        "key": "aPrice",
        "label": "قیمت الف",
        "unit": "تومان",
        "example": 180000
      },
      {
        "key": "aCost",
        "label": "هزینهٔ متغیر الف",
        "unit": "تومان",
        "example": 140000
      },
      {
        "key": "aQty",
        "label": "تعداد فروش الف",
        "unit": "واحد",
        "example": 120
      },
      {
        "key": "bPrice",
        "label": "قیمت ب",
        "unit": "تومان",
        "example": 250000
      },
      {
        "key": "bCost",
        "label": "هزینهٔ متغیر ب",
        "unit": "تومان",
        "example": 130000
      },
      {
        "key": "bQty",
        "label": "تعداد فروش ب",
        "unit": "واحد",
        "example": 60
      }
    ],
    "note": "این مقایسهٔ دو آیتم است؛ ماتریس کامل منو یا حکم حذف یک غذا نیست."
  },
  "roi": {
    "title": "بازگشت سادهٔ یک سرمایه‌گذاری",
    "formula": "منفعت خالص = منفعت افزوده − هزینهٔ افزوده؛ بازگشت = سرمایهٔ اولیه ÷ منفعت خالص",
    "fields": [
      {
        "key": "investment",
        "label": "سرمایهٔ اولیه",
        "unit": "تومان",
        "example": 120000000
      },
      {
        "key": "benefit",
        "label": "منفعت نقدی افزودهٔ ماهانه",
        "unit": "تومان",
        "example": 15000000
      },
      {
        "key": "extra",
        "label": "هزینهٔ افزودهٔ ماهانه",
        "unit": "تومان",
        "example": 3000000
      }
    ],
    "note": "ارزش زمانی پول، مالیات، ارزش فروش مجدد و ریسک خرابی منظور نشده است."
  },
  "stockcoverage": {
    "title": "روزهای پوشش موجودی",
    "formula": "موجودی قابل استفاده ÷ مصرف روزانه",
    "fields": [
      {
        "key": "stock",
        "label": "موجودی قابل استفاده",
        "unit": "واحد",
        "example": 90
      },
      {
        "key": "daily",
        "label": "مصرف روزانه",
        "unit": "واحد",
        "example": 15
      }
    ],
    "note": "این عدد سلامت یا ماندگاری مواد را مشخص نمی‌کند."
  },
  "cashflow": {
    "title": "تراز نقدی دوره",
    "formula": "ماندهٔ پایان = آغاز + وصولی − خرید پرداخت‌شده − سایر پرداخت‌ها",
    "fields": [
      {
        "key": "opening",
        "label": "ماندهٔ آغاز",
        "unit": "تومان",
        "example": 20000000
      },
      {
        "key": "received",
        "label": "وصولی",
        "unit": "تومان",
        "example": 50000000
      },
      {
        "key": "purchases",
        "label": "پرداخت خرید",
        "unit": "تومان",
        "example": 18000000
      },
      {
        "key": "other",
        "label": "سایر پرداخت‌ها",
        "unit": "تومان",
        "example": 25000000
      }
    ],
    "note": "خرید با مصرف و وصولی با فروش حسابداری برابر نیست؛ نتیجه سود نیست."
  },
  "groupbudget": {
    "title": "مشارکت یک بستهٔ گروهی",
    "formula": "مهمان × (مبلغ هر نفر − هزینهٔ متغیر هر نفر) − هزینهٔ اختصاصی رویداد",
    "fields": [
      {
        "key": "guests",
        "label": "تعداد مهمان",
        "unit": "واحد",
        "example": 30
      },
      {
        "key": "price",
        "label": "دریافت خالص هر نفر",
        "unit": "تومان",
        "example": 400000
      },
      {
        "key": "variable",
        "label": "هزینهٔ متغیر هر نفر",
        "unit": "تومان",
        "example": 220000
      },
      {
        "key": "event",
        "label": "هزینهٔ افزودهٔ رویداد",
        "unit": "تومان",
        "example": 1200000
      }
    ],
    "note": "هزینهٔ ثابت عمومی و فرصت فروش ازدست‌رفته جدا بررسی شود."
  },
  "targetfoodcost": {
    "title": "قیمت با نسبت هدف مواد",
    "formula": "بهای مواد هر پرس ÷ (نسبت هدف ÷ ۱۰۰)",
    "fields": [
      {
        "key": "cost",
        "label": "هزینهٔ مواد",
        "unit": "تومان",
        "example": 42000
      },
      {
        "key": "target",
        "label": "نسبت هدف مواد",
        "unit": "درصد",
        "example": 35,
        "max": 100
      }
    ],
    "note": "نسبت هدف انتخاب توست؛ هزینه‌های دیگر و تناسب قیمت با بازار را جدا بررسی کن."
  },
  "primecost": {
    "title": "مواد و نیروی کار کنار هم",
    "formula": "(مواد مصرف‌شده + هزینهٔ نیرو) ÷ فروش × ۱۰۰",
    "fields": [
      {
        "key": "materials",
        "label": "مواد مصرف‌شده",
        "unit": "تومان",
        "example": 120000000
      },
      {
        "key": "payroll",
        "label": "هزینهٔ نیرو",
        "unit": "تومان",
        "example": 80000000
      },
      {
        "key": "sales",
        "label": "فروش خالص",
        "unit": "تومان",
        "example": 400000000
      }
    ],
    "note": "دوره و تعریف هزینه‌ها یکسان باشد؛ حد ثابت جهانی برای همهٔ مدل‌ها تعیین نمی‌کنیم."
  },
  "priceindex": {
    "title": "تغییر هزینهٔ یک سبد ثابت",
    "formula": "(بهای تازه − بهای پایه) ÷ بهای پایه × ۱۰۰",
    "fields": [
      {
        "key": "base",
        "label": "بهای سبد در تاریخ پایه",
        "unit": "تومان",
        "example": 1000000
      },
      {
        "key": "current",
        "label": "بهای همان سبد در تاریخ تازه",
        "unit": "تومان",
        "example": 1200000
      }
    ],
    "note": "مقدار و کیفیت سبد باید یکسان باشد؛ این شاخص بازار یا نرخ رسمی تورم نیست."
  },
  "par": {
    "title": "سطح هدف و مقدار سفارش",
    "formula": "هدف = مصرف روزانه × فاصلهٔ خرید × (۱ + حاشیه ذخیره)؛ سفارش = بیشینهٔ صفر و (هدف − موجودی)",
    "fields": [
      {
        "key": "daily",
        "label": "مصرف روزانه",
        "unit": "واحد",
        "example": 10
      },
      {
        "key": "interval",
        "label": "فاصلهٔ خرید",
        "unit": "روز",
        "example": 3
      },
      {
        "key": "buffer",
        "label": "حاشیهٔ ذخیره",
        "unit": "درصد",
        "example": 20,
        "max": 100
      },
      {
        "key": "current",
        "label": "موجودی قابل استفاده",
        "unit": "واحد",
        "example": 12
      }
    ],
    "note": "این با نقطهٔ سفارش فرق دارد؛ ماندگاری، فضای انبار و سفارش در راه را جدا ببین."
  },
  "equipment": {
    "title": "مقایسهٔ نقدی دو گزینهٔ تجهیز",
    "formula": "جمع پرداخت = مبلغ اولیه + آماده‌سازی + پرداخت ماهانه × مدت",
    "fields": [
      {
        "key": "initial1",
        "label": "مبلغ اولیهٔ گزینهٔ اول",
        "unit": "تومان",
        "example": 120000000
      },
      {
        "key": "setup1",
        "label": "آماده‌سازی اول",
        "unit": "تومان",
        "example": 0
      },
      {
        "key": "monthly1",
        "label": "ماهانهٔ اول",
        "unit": "تومان",
        "example": 1000000
      },
      {
        "key": "initial2",
        "label": "مبلغ اولیهٔ گزینهٔ دوم",
        "unit": "تومان",
        "example": 0
      },
      {
        "key": "setup2",
        "label": "آماده‌سازی دوم",
        "unit": "تومان",
        "example": 5000000
      },
      {
        "key": "monthly2",
        "label": "ماهانهٔ دوم",
        "unit": "تومان",
        "example": 15000000
      },
      {
        "key": "months",
        "label": "مدت مقایسه",
        "unit": "ماه",
        "example": 12
      }
    ],
    "note": "ودیعهٔ قابل برگشت، فروش مجدد، کیفیت، خرابی، خواب کار و ارزش زمانی پول در این جمع ساده نیست."
  },
  "till": {
    "title": "تطبیق نقد پایان شیفت",
    "formula": "انتظار = نقد آغاز + نقد دریافتی − خروج نقد؛ اختلاف = شمارش واقعی − انتظار",
    "fields": [
      {
        "key": "opening",
        "label": "نقد آغاز",
        "unit": "تومان",
        "example": 5000000
      },
      {
        "key": "received",
        "label": "دریافت نقدی",
        "unit": "تومان",
        "example": 12000000
      },
      {
        "key": "payout",
        "label": "پرداخت و برداشت نقدی",
        "unit": "تومان",
        "example": 3000000
      },
      {
        "key": "actual",
        "label": "شمارش واقعی پایان",
        "unit": "تومان",
        "example": 13800000
      }
    ],
    "note": "کارت و انتقال بانکی جدا تطبیق داده شوند. اختلاف به‌تنهایی دلیل تخلف شخصی نیست."
  },
  "credit": {
    "title": "ماندهٔ نسیه و فاصله تا سقف",
    "formula": "مانده = بدهی آغاز + فروش نسیه − وصولی؛ فاصله = سقف انتخابی − مانده",
    "fields": [
      {
        "key": "opening",
        "label": "بدهی آغاز",
        "unit": "تومان",
        "example": 100000
      },
      {
        "key": "sales",
        "label": "فروش نسیهٔ تازه",
        "unit": "تومان",
        "example": 50000
      },
      {
        "key": "received",
        "label": "وصولی نسیه",
        "unit": "تومان",
        "example": 30000
      },
      {
        "key": "limit",
        "label": "سقف انتخابی اعتبار",
        "unit": "تومان",
        "example": 200000
      }
    ],
    "note": "وصولی دوباره به فروش روز اضافه نمی‌شود؛ نام یا اطلاعات مشتری لازم نیست."
  },
  "rent": {
    "title": "نسبت اجاره به فروش",
    "formula": "اجارهٔ دوره ÷ فروش همان دوره × ۱۰۰",
    "fields": [
      {
        "key": "rent",
        "label": "اجارهٔ دوره",
        "unit": "تومان",
        "example": 30000000
      },
      {
        "key": "sales",
        "label": "فروش دوره",
        "unit": "تومان",
        "example": 300000000
      }
    ],
    "note": "این نسبت به‌تنهایی حکم مناسب‌بودن ملک یا سود نیست؛ مدت و واحد پول یکسان باشند."
  },
  "onlineprice": {
    "title": "قیمت با کارمزد و تخفیف روی قیمت پایه",
    "formula": "(مواد + بسته‌بندی + مشارکت هدف) ÷ (۱ − کارمزد − تخفیف)",
    "fields": [
      {
        "key": "food",
        "label": "مواد هر سفارش",
        "unit": "تومان",
        "example": 90000
      },
      {
        "key": "pack",
        "label": "بسته‌بندی و متغیر دیگر",
        "unit": "تومان",
        "example": 20000
      },
      {
        "key": "target",
        "label": "مشارکت هدف",
        "unit": "تومان",
        "example": 100000
      },
      {
        "key": "fee",
        "label": "کارمزد از قیمت پایه",
        "unit": "درصد",
        "example": 20,
        "max": 100
      },
      {
        "key": "discount",
        "label": "تخفیف از قیمت پایه",
        "unit": "درصد",
        "example": 5,
        "max": 100
      }
    ],
    "note": "فقط وقتی هر دو درصد روی قیمت پایه اعمال می‌شوند. مدل کارمزد پس از تخفیف را با ابزار دلیوری بسنج."
  },
  "budgetsplit": {
    "title": "تقسیم بودجه در پنج سبد",
    "formula": "بودجهٔ پایه = کل پول ÷ (۱ + ذخیره٪)؛ ذخیره = کل − پایه؛ هر سبد = پایه × سهم",
    "fields": [
      {
        "key": "total",
        "label": "کل نقد قابل تخصیص",
        "unit": "تومان",
        "example": 1100000000
      },
      {
        "key": "reserve",
        "label": "درصد ذخیره نسبت به پایه",
        "unit": "درصد",
        "example": 10,
        "max": 100
      },
      {
        "key": "property",
        "label": "سهم ملک",
        "unit": "درصد",
        "example": 30,
        "max": 100
      },
      {
        "key": "equipment",
        "label": "سهم تجهیزات",
        "unit": "درصد",
        "example": 25,
        "max": 100
      },
      {
        "key": "fitout",
        "label": "سهم ساخت و دکور",
        "unit": "درصد",
        "example": 20,
        "max": 100
      },
      {
        "key": "launch",
        "label": "سهم راه‌اندازی",
        "unit": "درصد",
        "example": 10,
        "max": 100
      },
      {
        "key": "working",
        "label": "سهم سرمایهٔ در گردش",
        "unit": "درصد",
        "example": 15,
        "max": 100
      }
    ],
    "note": "جمع پنج سهم باید صد درصد باشد. سهم‌ها فرض آموزشی‌اند؛ آن‌ها را با مدل و محدودیت‌های خودت جایگزین کن."
  }
};
export function parseAmount(value){const s=String(value??'').trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[٬,\s]/g,'').replace(/٫/g,'.');if(!/^\d+(?:\.\d+)?$/.test(s))return null;const n=Number(s);return Number.isFinite(n)&&n>=0&&n<=1e15?n:null;}
const need=(v,label)=>{if(v<=0)throw Error(label+' باید بیشتر از صفر باشد.');return v;};
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const row=(label,value,unit='تومان')=>({label,value,unit});
export function calculate(key,values){
 const t=calculators[key];if(!t)throw Error('ابزار شناخته‌شده نیست.');const x={};for(const f of t.fields){const n=typeof values[f.key]==='number'?values[f.key]:parseAmount(values[f.key]);check(n!==null&&Number.isFinite(n)&&n>=0&&n<=1e15,'برای «'+f.label+'» یک عدد نامنفی معتبر وارد کن.');if(f.max!==undefined)check(n<=f.max,'«'+f.label+'» نباید بیشتر از '+f.max+' باشد.');x[f.key]=n;}
 let out;
 switch(key){
 case 'foodcost':out=[row('نسبت مواد',x.cost/need(x.price,'قیمت')*100,'٪'),row('مانده پس از مواد',x.price-x.cost)];break;
 case 'breakeven':{check(x.price>x.variable,'مشارکت هر سفارش باید مثبت باشد.');need(x.days,'روز کاری');const n=Math.ceil(x.fixed/(x.price-x.variable));out=[row('سفارش ماهانه',n,'سفارش'),row('میانگین هدف روزانه',Math.ceil(n/x.days),'سفارش'),row('فروش متناظر',n*x.price)];break;}
 case 'contribution':out=[row('مشارکت واحد',x.price-x.variable),row('نسبت مشارکت',(x.price-x.variable)/need(x.price,'قیمت')*100,'٪'),row('مشارکت کل',(x.price-x.variable)*x.orders)];break;
 case 'markup':{check(x.margin<100,'حاشیهٔ هدف باید کمتر از صد درصد باشد.');need(x.cost,'هزینه');const p=x.cost/(1-x.margin/100);out=[row('قیمت محاسباتی',p),row('مانده نسبت به هزینه',p-x.cost),row('افزایش روی هزینه',(p-x.cost)/x.cost*100,'٪')];break;}
 case 'recipe':out=[row('مواد هر پرس',x.batch/need(x.portions,'پرس قابل فروش')),row('هزینهٔ متغیر پرس',x.batch/x.portions+x.extra)];break;
 case 'yield':{const p=x.price/(need(x.yield,'بازده')/100);out=[row('بهای کیلو قابل مصرف',p),row('بهای این ماده در پرس',p*x.grams/1000)];break;}
 case 'inventory':{check(x.closing<=x.opening+x.purchases,'موجودی پایان بیشتر از آغاز و خرید است؛ انتقال و ارزش‌گذاری را بررسی کن.');const u=x.opening+x.purchases-x.closing;out=[row('بهای مصرف',u),row('نسبت مصرف به فروش',u/need(x.sales,'فروش')*100,'٪')];break;}
 case 'waste':need(x.made,'مقدار مبنا');check(x.wasted<=x.made,'ضایعات بیشتر از مقدار مبناست.');out=[row('نرخ ضایعات',x.wasted/x.made*100,'٪'),row('ارزش ضایعات',x.wasted*x.unit)];break;
 case 'reorder':out=[row('موجودی محرک سفارش',x.daily*x.lead+x.safety,'واحد ماده')];break;
 case 'labor':out=[row('نسبت هزینهٔ نیرو',x.payroll/need(x.sales,'فروش')*100,'٪'),row('فروش هر نفرساعت',x.sales/need(x.hours,'نفرساعت'),'تومان در ساعت'),row('هزینهٔ هر نفرساعت',x.payroll/x.hours,'تومان در ساعت')];break;
 case 'capacity':out=[row('مهمان در این سناریو',Math.floor(x.seats*x.service/need(x.stay,'زمان حضور')*x.occupancy/100),'نفر'),row('گردش نظری صندلی',x.service/x.stay,'بار')];break;
 case 'discount':{need(x.price,'قیمت');const n=x.price*(1-x.discount/100),b=x.price-x.variable,a=n-x.variable;out=[row('قیمت پس از تخفیف',n),row('مشارکت تازه',a),row('ضریب فروش جبرانی',b>0&&a>0?b/a:'با این مفروضات قابل محاسبه نیست',b>0&&a>0?'برابر':'')];break;}
 case 'delivery':{check(x.discount<=x.price,'تخفیف بیشتر از قیمت است.');const fee=(x.price-x.discount)*x.fee/100;out=[row('کارمزد',fee),row('مشارکت سفارش',x.price-x.discount-fee-x.food-x.pack-x.shipping)];break;}
 case 'budget':{const o=x.deposit+x.fitout+x.equipment+x.stock,r=x.monthly*x.months+x.buffer;out=[row('نقد درگیر افتتاح',o),row('ذخیرهٔ ادامهٔ کار',r),row('کل نقد لازم',o+r)];break;}
 case 'runway':case 'runwaydaily':{const b=x.outflow-x.inflow;out=[row(key==='runway'?'کسری ماهانه':'کسری روزانه',b),row('دوام ذخیره',b>0?x.cash/b:'در این سناریو کسری تکرارشونده وجود ندارد',b>0?(key==='runway'?'ماه':'روز'):'')];break;}
 case 'retention':need(x.cohort,'اندازهٔ گروه');check(x.returned<=x.cohort,'برگشته‌ها بیشتر از گروه اولیه‌اند.');out=[row('نرخ بازگشت',x.returned/x.cohort*100,'٪'),row('بدون بازگشت ثبت‌شده',x.cohort-x.returned,'نفر')];break;
 case 'weekly':need(x.oldSales,'فروش پایه');need(x.oldOrders,'سفارش پایه');need(x.newOrders,'سفارش تازه');out=[row('تغییر فروش',(x.newSales-x.oldSales)/x.oldSales*100,'٪'),row('تغییر سفارش',(x.newOrders-x.oldOrders)/x.oldOrders*100,'٪'),row('متوسط فاکتور پایه',x.oldSales/x.oldOrders),row('متوسط فاکتور تازه',x.newSales/x.newOrders)];break;
 case 'menu':out=[row('مشارکت واحد الف',x.aPrice-x.aCost),row('مشارکت کل الف',(x.aPrice-x.aCost)*x.aQty),row('مشارکت واحد ب',x.bPrice-x.bCost),row('مشارکت کل ب',(x.bPrice-x.bCost)*x.bQty)];break;
 case 'roi':{const n=x.benefit-x.extra;out=[row('منفعت خالص ماهانه',n),row('بازگشت ساده',n>0?x.investment/n:'با منفعت غیرمثبت بازگشت محاسبه نمی‌شود',n>0?'ماه':'')];break;}
 case 'stockcoverage':out=[row('پوشش موجودی',x.stock/need(x.daily,'مصرف روزانه'),'روز')];break;
 case 'cashflow':out=[row('جریان نقدی خالص',x.received-x.purchases-x.other),row('ماندهٔ پایان',x.opening+x.received-x.purchases-x.other)];break;
 case 'groupbudget':out=[row('فروش گروه',x.guests*x.price),row('مشارکت پس از هزینهٔ اختصاصی',x.guests*(x.price-x.variable)-x.event)];break;
 case 'targetfoodcost':out=[row('قیمت متناظر',x.cost/(need(x.target,'نسبت هدف')/100))];break;
 case 'primecost':need(x.sales,'فروش');out=[row('نسبت مواد و نیرو',(x.materials+x.payroll)/x.sales*100,'٪'),row('سهم مواد',x.materials/x.sales*100,'٪'),row('سهم نیرو',x.payroll/x.sales*100,'٪')];break;
 case 'priceindex':out=[row('تغییر مبلغ سبد',x.current-x.base),row('تغییر نسبت به پایه',(x.current-x.base)/need(x.base,'بهای پایه')*100,'٪')];break;
 case 'par':{const p=x.daily*x.interval*(1+x.buffer/100);out=[row('سطح هدف',p,'واحد ماده'),row('مقدار سفارش',Math.max(0,p-x.current),'واحد ماده')];break;}
 case 'equipment':{const a=x.initial1+x.setup1+x.monthly1*x.months,b=x.initial2+x.setup2+x.monthly2*x.months;out=[row('جمع پرداخت اول',a),row('جمع پرداخت دوم',b),row('پرداخت بیشتر دوم نسبت به اول',b-a)];break;}
 case 'till':{const e=x.opening+x.received-x.payout;out=[row('نقد مورد انتظار',e),row('اختلاف شمارش با انتظار',x.actual-e)];break;}
 case 'credit':{check(x.received<=x.opening+x.sales,'وصولی بیشتر از بدهی است؛ پیش‌دریافت را جدا ثبت کن.');const d=x.opening+x.sales-x.received;out=[row('ماندهٔ نسیه',d),row('فاصله تا سقف؛ منفی یعنی عبور از سقف',x.limit-d)];break;}
 case 'rent':out=[row('نسبت اجاره به فروش',x.rent/need(x.sales,'فروش')*100,'٪')];break;
 case 'onlineprice':{check(x.fee+x.discount<100,'جمع کارمزد و تخفیف باید کمتر از صد درصد باشد.');const p=(x.food+x.pack+x.target)/(1-(x.fee+x.discount)/100);out=[row('قیمت پایهٔ محاسباتی',p),row('کارمزد روی قیمت پایه',p*x.fee/100),row('تخفیف روی قیمت پایه',p*x.discount/100)];break;}
 case 'budgetsplit':{const sum=x.property+x.equipment+x.fitout+x.launch+x.working;check(Math.abs(sum-100)<0.0001,'جمع سهم پنج سبد باید صد درصد باشد.');const b=x.total/(1+x.reserve/100);out=[row('بودجهٔ قابل برنامه',b),row('ذخیره',x.total-b),row('سبد ملک',b*x.property/100),row('سبد تجهیزات',b*x.equipment/100),row('سبد ساخت و دکور',b*x.fitout/100),row('سبد راه‌اندازی',b*x.launch/100),row('سبد گردش',b*x.working/100)];break;}
 }
 check(out?.every(r=>typeof r.value!=='number'||Number.isFinite(r.value)),'با این ورودی‌ها نتیجهٔ معتبر به دست نمی‌آید.');return out;
}
