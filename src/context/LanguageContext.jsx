import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    classes: 'Classes & Sections',
    teachers: 'Teachers',
    attendance: 'Attendance',
    timetable: 'Timetable',
    exams: 'Exams & Results',
    fees: 'Fee Management',
    expenses: 'Expenses',
    payroll: 'Salary Payroll',
    analytics: 'Analytics & Revenue',
    admissions: 'Admissions',
    notices: 'Notices',
    events: 'Events Calendar',
    documents: 'Documents',
    profile: 'Admin Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcomeBack: 'Good morning, Admin',
    welcomeSubtitle: 'Here is what is happening in the school today.',
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    totalClasses: 'Total Classes',
    feesCollected: 'Fees Collected (This Month)',
    pendingFees: 'Pending Fees',
    todayAttendance: "Today's Attendance",
    searchPlaceholder: 'Search students, teachers, classes... (Ctrl+K)',
    collectFee: 'Collect Fee',
    addStudent: 'Add Student',
    addTeacher: 'Add Teacher',
    markAttendance: 'Mark Attendance',
    recentAdmissions: 'Recent Admissions',
    recentPayments: 'Recent Fee Payments',
    topDefaulters: 'Top Fee Defaulters',
    upcomingEvents: 'Upcoming Events',
    latestNotices: 'Latest Notices',
    birthdaysToday: "Today's Birthdays",
    paid: 'Paid',
    partial: 'Partial',
    unpaid: 'Unpaid',
    overdue: 'Overdue'
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    students: 'طلباء و طالبات',
    classes: 'کلاسیں اور سیکشن',
    teachers: 'اساتذہ کرام',
    attendance: 'حاضری ریکارڈ',
    timetable: 'ٹائم ٹیبل',
    exams: 'امتحانات اور نتائج',
    fees: 'فیس مینجمنٹ',
    expenses: 'اخراجات',
    payroll: 'تنخواہوں کی ادائیگی',
    analytics: 'مالیاتی تجزیات',
    admissions: 'داخلہ انکوائری',
    notices: 'اعلانات و نوٹسز',
    events: 'کیلنڈر و تقاریب',
    documents: 'دستاویزات',
    profile: 'ایڈمن پروفائل',
    settings: 'ترتیبات',
    logout: 'لاگ آؤٹ',
    welcomeBack: 'خوش آمدید، محترم ایڈمن',
    welcomeSubtitle: 'آج کے سکول کا مکمل احوال اور تفصیلات۔',
    totalStudents: 'کل طلباء',
    totalTeachers: 'کل اساتذہ',
    totalClasses: 'کل کلاسیں',
    feesCollected: 'وصول شدہ فیس',
    pendingFees: 'بقایا فیس',
    todayAttendance: 'آج کی حاضری',
    searchPlaceholder: 'تلاش کریں (Ctrl+K)...',
    collectFee: 'فیس وصول کریں',
    addStudent: 'نیا طالب علم شامل کریں',
    addTeacher: 'نیا استاد شامل کریں',
    markAttendance: 'حاضری لگائیں',
    recentAdmissions: 'حالیہ داخلے',
    recentPayments: 'حالیہ ادائیگیاں',
    topDefaulters: 'واجب الادا فیس لسٹ',
    upcomingEvents: 'آئندہ تقاریب',
    latestNotices: 'اہم اعلانات',
    birthdaysToday: 'آج کی سالگرہ',
    paid: 'ادا شدہ',
    partial: 'جزوی',
    unpaid: 'غیر ادا شدہ',
    overdue: 'میعاد ختم'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('eazy_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('eazy_lang', language);
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
