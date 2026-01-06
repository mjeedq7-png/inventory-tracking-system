// Internationalization (i18n) system for RTL/Arabic support

export type Language = 'en' | 'ar';

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    inventory: string;
    sales: string;
    purchases: string;
    waste: string;
    reports: string;
    dailyClosing: string;
    logout: string;
  };
  // Actions
  actions: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    submit: string;
    search: string;
    filter: string;
    export: string;
    refresh: string;
    view: string;
    back: string;
  };
  // Common labels
  labels: {
    date: string;
    product: string;
    quantity: string;
    unit: string;
    category: string;
    price: string;
    total: string;
    status: string;
    notes: string;
    reason: string;
    image: string;
    outlet: string;
    all: string;
    today: string;
    thisMonth: string;
    loading: string;
    noData: string;
  };
  // Outlets
  outlets: {
    cafe: string;
    restaurant: string;
    miniMarket: string;
  };
  // User roles
  roles: {
    owner: string;
    purchasing: string;
    outletCafe: string;
    outletRestaurant: string;
    outletMiniMarket: string;
  };
  // Pages
  pages: {
    dashboard: {
      welcome: string;
      subtitle: string;
      totalProducts: string;
      lowStock: string;
      totalSold: string;
      totalWaste: string;
      quickActions: string;
      outletsOverview: string;
      salesOverview: string;
      activeItems: string;
      needsRestock: string;
      unitsSold: string;
      unitsWasted: string;
    };
    inventory: {
      title: string;
      subtitle: string;
      remaining: string;
      purchased: string;
      sold: string;
      wasted: string;
    };
    sales: {
      title: string;
      subtitle: string;
      recordSale: string;
      selectProduct: string;
      enterQuantity: string;
      cardSales: string;
      cashSales: string;
      totalSales: string;
    };
    purchases: {
      title: string;
      subtitle: string;
      recordPurchase: string;
    };
    waste: {
      title: string;
      subtitle: string;
      recordWaste: string;
      uploadImage: string;
      selectReason: string;
    };
    dailyClosing: {
      title: string;
      subtitle: string;
      netCash: string;
      submitClosing: string;
    };
    reports: {
      title: string;
      subtitle: string;
      inventoryReport: string;
      salesReport: string;
      wasteReport: string;
    };
  };
  // Messages
  messages: {
    success: string;
    error: string;
    confirmDelete: string;
    noResults: string;
    loginRequired: string;
    accessDenied: string;
    saved: string;
    deleted: string;
    recordAdded: string;
    recordUpdated: string;
  };
  // Stats
  stats: {
    totalSales: string;
    cardSales: string;
    cashSales: string;
    salesByOutlet: string;
  };
  // Daily closing
  closing: {
    cardSales: string;
    cashSales: string;
    netCash: string;
    date: string;
    notes: string;
  };
  // Categories
  categories: {
    beverages: string;
    food: string;
    snacks: string;
    dairy: string;
    bakery: string;
    other: string;
  };
  // Units
  units: {
    piece: string;
    kg: string;
    gram: string;
    liter: string;
    box: string;
    pack: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      sales: 'Sales',
      purchases: 'Purchases',
      waste: 'Waste',
      reports: 'Reports',
      dailyClosing: 'Daily Closing',
      logout: 'Logout',
    },
    actions: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      refresh: 'Refresh',
      view: 'View',
      back: 'Back',
    },
    labels: {
      date: 'Date',
      product: 'Product',
      quantity: 'Quantity',
      unit: 'Unit',
      category: 'Category',
      price: 'Price',
      total: 'Total',
      status: 'Status',
      notes: 'Notes',
      reason: 'Reason',
      image: 'Image',
      outlet: 'Outlet',
      all: 'All',
      today: 'Today',
      thisMonth: 'This Month',
      loading: 'Loading...',
      noData: 'No data available',
    },
    outlets: {
      cafe: 'Cafe',
      restaurant: 'Restaurant',
      miniMarket: 'Mini Market',
    },
    roles: {
      owner: 'Owner',
      purchasing: 'Purchasing',
      outletCafe: 'Cafe Staff',
      outletRestaurant: 'Restaurant Staff',
      outletMiniMarket: 'Mini Market Staff',
    },
    pages: {
      dashboard: {
        welcome: 'Welcome back',
        subtitle: "Here's what's happening with your inventory today.",
        totalProducts: 'Total Products',
        lowStock: 'Low Stock Alert',
        totalSold: 'Total Sold',
        totalWaste: 'Total Waste',
        quickActions: 'Quick Actions',
        outletsOverview: 'Outlets Overview',
        salesOverview: 'Sales Overview',
        activeItems: 'Active items',
        needsRestock: 'Items need restock',
        unitsSold: 'Units sold',
        unitsWasted: 'Units wasted',
      },
      inventory: {
        title: 'Inventory',
        subtitle: 'Track your inventory across all outlets',
        remaining: 'Remaining',
        purchased: 'Purchased',
        sold: 'Sold',
        wasted: 'Wasted',
      },
      sales: {
        title: 'Sales',
        subtitle: 'Record and track sales',
        recordSale: 'Record Sale',
        selectProduct: 'Select a product',
        enterQuantity: 'Enter quantity',
        cardSales: 'Card Sales',
        cashSales: 'Cash Sales',
        totalSales: 'Total Sales',
      },
      purchases: {
        title: 'Purchases',
        subtitle: 'Record purchases and stock additions',
        recordPurchase: 'Record Purchase',
      },
      waste: {
        title: 'Waste',
        subtitle: 'Track and record waste',
        recordWaste: 'Record Waste',
        uploadImage: 'Upload Image',
        selectReason: 'Select reason',
      },
      dailyClosing: {
        title: 'Daily Closing',
        subtitle: 'End of day cash reconciliation',
        netCash: 'Net Cash',
        submitClosing: 'Submit Daily Closing',
      },
      reports: {
        title: 'Reports',
        subtitle: 'View detailed reports and analytics',
        inventoryReport: 'Inventory Report',
        salesReport: 'Sales Report',
        wasteReport: 'Waste Report',
      },
    },
    messages: {
      success: 'Success',
      error: 'Error',
      confirmDelete: 'Are you sure you want to delete this?',
      noResults: 'No results found',
      loginRequired: 'Please log in to continue',
      accessDenied: 'Access denied',
      saved: 'Changes saved successfully',
      deleted: 'Deleted successfully',
      recordAdded: 'Record added successfully',
      recordUpdated: 'Record updated successfully',
    },
    stats: {
      totalSales: 'Total Sales',
      cardSales: 'Card Sales',
      cashSales: 'Cash Sales',
      salesByOutlet: 'Sales by Outlet',
    },
    closing: {
      cardSales: 'Card Sales',
      cashSales: 'Cash Sales',
      netCash: 'Net Cash',
      date: 'Date',
      notes: 'Notes',
    },
    categories: {
      beverages: 'Beverages',
      food: 'Food',
      snacks: 'Snacks',
      dairy: 'Dairy',
      bakery: 'Bakery',
      other: 'Other',
    },
    units: {
      piece: 'Piece',
      kg: 'Kilogram',
      gram: 'Gram',
      liter: 'Liter',
      box: 'Box',
      pack: 'Pack',
    },
  },
  ar: {
    nav: {
      dashboard: 'لوحة التحكم',
      inventory: 'المخزون',
      sales: 'المبيعات',
      purchases: 'المشتريات',
      waste: 'الهدر',
      reports: 'التقارير',
      dailyClosing: 'الإغلاق اليومي',
      logout: 'تسجيل الخروج',
    },
    actions: {
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      submit: 'إرسال',
      search: 'بحث',
      filter: 'تصفية',
      export: 'تصدير',
      refresh: 'تحديث',
      view: 'عرض',
      back: 'رجوع',
    },
    labels: {
      date: 'التاريخ',
      product: 'المنتج',
      quantity: 'الكمية',
      unit: 'الوحدة',
      category: 'الفئة',
      price: 'السعر',
      total: 'المجموع',
      status: 'الحالة',
      notes: 'ملاحظات',
      reason: 'السبب',
      image: 'الصورة',
      outlet: 'الفرع',
      all: 'الكل',
      today: 'اليوم',
      thisMonth: 'هذا الشهر',
      loading: 'جاري التحميل...',
      noData: 'لا توجد بيانات',
    },
    outlets: {
      cafe: 'الكافيه',
      restaurant: 'المطعم',
      miniMarket: 'الميني ماركت',
    },
    roles: {
      owner: 'المالك',
      purchasing: 'المشتريات',
      outletCafe: 'موظف الكافيه',
      outletRestaurant: 'موظف المطعم',
      outletMiniMarket: 'موظف الميني ماركت',
    },
    pages: {
      dashboard: {
        welcome: 'مرحباً بعودتك',
        subtitle: 'إليك ما يحدث مع مخزونك اليوم.',
        totalProducts: 'إجمالي المنتجات',
        lowStock: 'تنبيه انخفاض المخزون',
        totalSold: 'إجمالي المبيعات',
        totalWaste: 'إجمالي الهدر',
        quickActions: 'إجراءات سريعة',
        outletsOverview: 'نظرة عامة على الفروع',
        salesOverview: 'نظرة عامة على المبيعات',
        activeItems: 'منتجات نشطة',
        needsRestock: 'منتجات تحتاج إعادة تخزين',
        unitsSold: 'وحدات مباعة',
        unitsWasted: 'وحدات مهدرة',
      },
      inventory: {
        title: 'المخزون',
        subtitle: 'تتبع المخزون في جميع الفروع',
        remaining: 'المتبقي',
        purchased: 'المشتريات',
        sold: 'المباع',
        wasted: 'المهدر',
      },
      sales: {
        title: 'المبيعات',
        subtitle: 'تسجيل وتتبع المبيعات',
        recordSale: 'تسجيل بيع',
        selectProduct: 'اختر منتج',
        enterQuantity: 'أدخل الكمية',
        cardSales: 'مبيعات البطاقة',
        cashSales: 'مبيعات النقد',
        totalSales: 'إجمالي المبيعات',
      },
      purchases: {
        title: 'المشتريات',
        subtitle: 'تسجيل المشتريات وإضافات المخزون',
        recordPurchase: 'تسجيل شراء',
      },
      waste: {
        title: 'الهدر',
        subtitle: 'تتبع وتسجيل الهدر',
        recordWaste: 'تسجيل هدر',
        uploadImage: 'رفع صورة',
        selectReason: 'اختر السبب',
      },
      dailyClosing: {
        title: 'الإغلاق اليومي',
        subtitle: 'مطابقة النقد في نهاية اليوم',
        netCash: 'صافي النقد',
        submitClosing: 'تسجيل الإغلاق اليومي',
      },
      reports: {
        title: 'التقارير',
        subtitle: 'عرض التقارير والتحليلات المفصلة',
        inventoryReport: 'تقرير المخزون',
        salesReport: 'تقرير المبيعات',
        wasteReport: 'تقرير الهدر',
      },
    },
    messages: {
      success: 'نجاح',
      error: 'خطأ',
      confirmDelete: 'هل أنت متأكد من الحذف؟',
      noResults: 'لا توجد نتائج',
      loginRequired: 'يرجى تسجيل الدخول للمتابعة',
      accessDenied: 'تم رفض الوصول',
      saved: 'تم حفظ التغييرات بنجاح',
      deleted: 'تم الحذف بنجاح',
      recordAdded: 'تمت إضافة السجل بنجاح',
      recordUpdated: 'تم تحديث السجل بنجاح',
    },
    stats: {
      totalSales: 'إجمالي المبيعات',
      cardSales: 'مبيعات البطاقة',
      cashSales: 'مبيعات النقد',
      salesByOutlet: 'المبيعات حسب الفرع',
    },
    closing: {
      cardSales: 'مبيعات البطاقة',
      cashSales: 'مبيعات النقد',
      netCash: 'صافي النقد',
      date: 'التاريخ',
      notes: 'ملاحظات',
    },
    categories: {
      beverages: 'المشروبات',
      food: 'الطعام',
      snacks: 'الوجبات الخفيفة',
      dairy: 'الألبان',
      bakery: 'المخبوزات',
      other: 'أخرى',
    },
    units: {
      piece: 'قطعة',
      kg: 'كيلوغرام',
      gram: 'غرام',
      liter: 'لتر',
      box: 'صندوق',
      pack: 'عبوة',
    },
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang];
}

export function getDirection(lang: Language): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function getFontFamily(lang: Language): string {
  return lang === 'ar'
    ? "'Noto Sans Arabic', 'Segoe UI', system-ui, sans-serif"
    : "'Inter', 'Segoe UI', system-ui, sans-serif";
}
