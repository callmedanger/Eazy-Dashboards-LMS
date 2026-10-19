import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, DollarSign, Users, Award, Percent } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useSchool } from '../context/SchoolContext';
import { useTheme } from '../context/ThemeContext';
import { formatPKR } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Analytics = () => {
  const { students, feeRecords, expenses, classes } = useSchool();
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState('Monthly'); // 'Monthly', 'Quarterly', 'Yearly'

  const totalFeeCollected = feeRecords.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netSurplus = totalFeeCollected - totalExpense;

  // Chart theme colors
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1B2C4D' : '#E5EAF2';
  const textColor = isDark ? '#8FA3C4' : '#64748B';

  const monthlyFinancials = [
    { month: 'May', income: 780000, expense: 540000, profit: 240000 },
    { month: 'Jun', income: 810000, expense: 590000, profit: 220000 },
    { month: 'Jul', income: 650000, expense: 520000, profit: 130000 },
    { month: 'Aug', income: 920000, expense: 610000, profit: 310000 },
    { month: 'Sep', income: 980000, expense: 630000, profit: 350000 },
    { month: 'Oct', income: 1040000, expense: 620000, profit: 420000 },
  ];

  const paymentMethodsData = [
    { name: 'Cash at Counter', value: 45, color: '#10B981' },
    { name: 'Bank Transfer', value: 30, color: '#2F6FDE' },
    { name: 'Easypaisa', value: 15, color: '#F59E0B' },
    { name: 'JazzCash', value: 10, color: '#EC4899' },
  ];

  const genderRatioData = [
    { name: 'Boys', value: students.filter(s => s.gender === 'Male').length, color: '#2F6FDE' },
    { name: 'Girls', value: students.filter(s => s.gender === 'Female').length, color: '#EC4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Analytics & Revenue
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Holistic financial auditing, student growth metrics, and revenue projections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D]">
            {['Monthly', 'Quarterly', 'Yearly'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${timeframe === t ? 'bg-white dark:bg-[#0D1B34] text-blue-600 shadow-2xs' : 'text-slate-400'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => toast.success('Analytics report PDF generated')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] text-white shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Fee Revenue</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatPKR(totalFeeCollected)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">+14.2% YoY Increase</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total School Expenses</span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatPKR(totalExpense)}</h3>
          <p className="text-xs text-slate-400 mt-1">Payroll, utilities & maintenance</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Net Operating Surplus</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatPKR(netSurplus)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">38.5% Profit Margin</p>
        </div>
      </div>

      {/* Income vs Expenses Cashflow Area Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cashflow Analysis (6-Month Trend)</h3>
            <p className="text-xs text-slate-400">Total institutional collections vs disbursements</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyFinancials}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis stroke={textColor} fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(val) => [formatPKR(val)]}
                contentStyle={{ backgroundColor: isDark ? '#0D1B34' : '#FFFFFF', borderColor: gridColor, borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="income" name="Collections" stroke="#2F6FDE" fill="#2F6FDE" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#DC2626" fill="#DC2626" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods and Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods Pie */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Fee Payment Channels Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Share of cash vs digital wallets (Easypaisa / JazzCash / Bank)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodsData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {paymentMethodsData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t">
            {paymentMethodsData.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name} ({p.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Gender Ratio */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Student Gender Ratio</h3>
          <p className="text-xs text-slate-400 mb-4">Demographics across all active enrollments</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderRatioData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {genderRatioData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} Students`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t">
            {genderRatioData.map(g => (
              <div key={g.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="font-semibold">{g.name}: {g.value} Students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
