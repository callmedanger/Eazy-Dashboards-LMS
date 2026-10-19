import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  School,
  Receipt,
  AlertCircle,
  CalendarCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  UserPlus,
  CreditCard,
  FileUp,
  Cake,
  Calendar,
  Bell,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useSchool } from '../context/SchoolContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPKR, formatDate } from '../utils/helpers';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { students, teachers, classes, feeRecords, notices, events, collectFee, addStudent, addAuditLog } = useSchool();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Quick Action Modals
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Calculate Metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const currentMonthRecords = feeRecords.filter(r => r.month === 'October 2026');
  const feesCollected = currentMonthRecords.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const pendingFees = currentMonthRecords.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const totalExpectedFees = feesCollected + pendingFees;
  const collectionRate = totalExpectedFees ? Math.round((feesCollected / totalExpectedFees) * 100) : 0;

  // Chart data
  const revenueTrendData = [
    { month: 'May', revenue: 780000, expenses: 540000 },
    { month: 'Jun', revenue: 810000, expenses: 590000 },
    { month: 'Jul', revenue: 650000, expenses: 520000 },
    { month: 'Aug', revenue: 920000, expenses: 610000 },
    { month: 'Sep', revenue: 980000, expenses: 630000 },
    { month: 'Oct', revenue: feesCollected || 940000, expenses: 620000 },
  ];

  const feeStatusData = [
    { name: 'Collected', value: feesCollected, color: '#16A34A' },
    { name: 'Pending', value: pendingFees, color: '#DC2626' },
  ];

  const studentsPerClassData = classes.map(c => ({
    name: c.name.replace('Class ', 'Gr '),
    students: students.filter(s => s.class === c.name).length
  }));

  const attendanceWeekly = [
    { day: 'Mon', attendance: 94 },
    { day: 'Tue', attendance: 96 },
    { day: 'Wed', attendance: 92 },
    { day: 'Thu', attendance: 95 },
    { day: 'Fri', attendance: 91 },
  ];

  // Defaulters list
  const defaulters = students.filter(s => s.feeStatus === 'Overdue' || s.feeStatus === 'Unpaid').slice(0, 5);
  const recentPayments = feeRecords.filter(r => r.status === 'Paid' || r.status === 'Partial').slice(0, 5);
  const recentAdmissions = students.slice(0, 5);

  const handleQuickCollectFee = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !collectAmount) {
      toast.error('Please select a student and enter amount');
      return;
    }

    collectFee({
      studentId: selectedStudentId,
      amount: Number(collectAmount),
      paymentMethod,
      month: 'October 2026',
      remarks: 'Quick collected from dashboard'
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    toast.success('Fee collected successfully! Ledger updated.');
    setIsCollectFeeOpen(false);
    setSelectedStudentId('');
    setCollectAmount('');
  };

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1B2C4D' : '#E5EAF2';
  const textColor = isDark ? '#8FA3C4' : '#64748B';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B2A5B] via-[#1E4A94] to-[#2F6FDE] text-white p-6 sm:p-8 shadow-xl shadow-blue-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-100">
              <Clock className="w-3.5 h-3.5" />
              <span>Session 2026-27 • Campus 1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('welcomeBack')}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              {t('welcomeSubtitle')} Fee collection is trending at <strong>{collectionRate}%</strong> this month with <strong>95%</strong> average student attendance.
            </p>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCollectFeeOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[#0B2A5B] hover:bg-blue-50 shadow-md transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#2F6FDE]" />
              <span>{t('collectFee')}</span>
            </button>
            <button
              onClick={() => navigate('/students')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-900/40 hover:bg-blue-900/70 border border-white/20 text-white backdrop-blur-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addStudent')}</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative blur */}
        <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title={t('totalStudents')}
          value={totalStudents}
          change="+8.4%"
          isPositive={true}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t('totalTeachers')}
          value={totalTeachers}
          change="+2 new"
          isPositive={true}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title={t('totalClasses')}
          value={`${totalClasses} Gr`}
          subtitle="24 Sections"
          icon={School}
          color="blue"
        />
        <StatCard
          title={t('feesCollected')}
          value={formatPKR(feesCollected)}
          change={`+${collectionRate}%`}
          isPositive={true}
          icon={Receipt}
          color="emerald"
        />
        <StatCard
          title={t('pendingFees')}
          value={formatPKR(pendingFees)}
          change="-4.2%"
          isPositive={false}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title={t('todayAttendance')}
          value="94.8%"
          change="+1.5%"
          isPositive={true}
          icon={CalendarCheck}
          color="emerald"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Expenses (Area Chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Revenue & Expenses Overview</h3>
              <p className="text-xs text-slate-500 dark:text-[#8FA3C4]">Monthly cash flow in PKR</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F6FDE]" /> Collections
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6FDE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F6FDE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatPKR(value)]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0D1B34' : '#FFFFFF',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2F6FDE" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Status Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fee Status (October 2026)</h3>
            <p className="text-xs text-slate-500 dark:text-[#8FA3C4]">Collection efficiency this month</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatPKR(value)]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0D1B34' : '#FFFFFF',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{collectionRate}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Recovered</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-3 border-t border-slate-100 dark:border-[#1B2C4D]">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold">{formatPKR(feesCollected)}</p>
              <p className="text-[10px] text-slate-400">Total Collected</p>
            </div>
            <div>
              <p className="text-rose-600 dark:text-rose-400 font-bold">{formatPKR(pendingFees)}</p>
              <p className="text-[10px] text-slate-400">Pending Dues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts: Students Per Class & Weekly Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Per Class Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Student Enrollment by Grade</h3>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mb-4">Distribution across Class 1 to Class 10</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerClassData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} Students`]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0D1B34' : '#FFFFFF',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="students" fill="#2F6FDE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Weekly Attendance Trend (%)</h3>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mb-4">Daily percentage across all sections</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke={textColor} fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(val) => [`${val}% Present`]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0D1B34' : '#FFFFFF',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="attendance" stroke="#16A34A" strokeWidth={3} dot={{ r: 4, fill: '#16A34A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Widgets Grid: Recent Fee Payments, Top Defaulters, Notices, Events, Birthdays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Fee Payments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {t('recentPayments')}
            </h4>
            <button
              onClick={() => navigate('/fees')}
              className="text-xs text-[#2F6FDE] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#12254A]/40 transition">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{p.studentName}</p>
                  <p className="text-[10px] text-slate-400">{p.class}-{p.section} • {p.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(p.paidAmount)}</p>
                  <Badge variant={p.status === 'Paid' ? 'paid' : 'partial'} size="sm">
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fee Defaulters */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {t('topDefaulters')}
            </h4>
            <button
              onClick={() => navigate('/fees')}
              className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>All defaulters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {defaulters.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{d.name}</p>
                  <p className="text-[10px] text-slate-400">{d.class}-{d.section} • {d.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600 dark:text-rose-400">{formatPKR(d.balanceDue)}</p>
                  <span className="text-[10px] text-rose-500 font-medium">Overdue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events & Latest Notices */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {t('upcomingEvents')}
              </h4>
              <button onClick={() => navigate('/events')} className="text-xs text-[#2F6FDE] font-semibold hover:underline">
                Calendar
              </button>
            </div>
            <div className="space-y-2">
              {events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
                  <Calendar className="w-4 h-4 text-[#2F6FDE] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</p>
                    <p className="text-[10px] text-slate-400">{ev.date} • {ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#1B2C4D]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {t('latestNotices')}
              </h4>
              <button onClick={() => navigate('/notices')} className="text-xs text-[#2F6FDE] font-semibold hover:underline">
                Notices
              </button>
            </div>
            <div className="space-y-2">
              {notices.slice(0, 2).map((no) => (
                <div key={no.id} className="p-2 rounded-xl bg-slate-50 dark:bg-[#0A1630] text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{no.title}</p>
                  <p className="text-[10px] text-slate-400">{no.date} • To: {no.audience}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collect Fee Quick Modal */}
      <Modal
        isOpen={isCollectFeeOpen}
        onClose={() => setIsCollectFeeOpen(false)}
        title="Quick Collect Fee"
        subtitle="Record fee installment or full payment instantly into the ledger"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleQuickCollectFee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              required
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find(st => st.id === e.target.value);
                if (s) setCollectAmount(s.balanceDue || s.monthlyFee);
              }}
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
            >
              <option value="">-- Choose student --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.class}-{st.section}) - Due: {formatPKR(st.balanceDue)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount Received (PKR) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={collectAmount}
                onChange={(e) => setCollectAmount(e.target.value)}
                placeholder="5000"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1B2C4D]">
            <button
              type="button"
              onClick={() => setIsCollectFeeOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FDE] hover:bg-blue-600 shadow-md shadow-blue-500/20"
            >
              Confirm Payment & Print Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
