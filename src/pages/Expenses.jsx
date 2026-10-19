import React, { useState } from 'react';
import { TrendingDown, Plus, Filter, Trash2, Download, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { formatPKR, formatDate, downloadCSV } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Expenses = () => {
  const { expenses, addExpense, deleteExpense } = useSchool();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Maintenance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    notes: ''
  });

  const categories = ['Salaries', 'Electricity', 'Rent', 'Stationery', 'Maintenance', 'Events', 'Other'];
  const colors = ['#2F6FDE', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#3B82F6', '#64748B'];

  const filteredExpenses = expenses.filter(e => categoryFilter === 'ALL' || e.category === categoryFilter);
  const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Group by category for pie chart
  const categoryData = categories.map((cat, idx) => {
    const val = expenses.filter(e => e.category === cat).reduce((sum, item) => sum + item.amount, 0);
    return { name: cat, value: val, color: colors[idx % colors.length] };
  }).filter(c => c.value > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Please enter expense title and amount');
      return;
    }
    addExpense(formData);
    toast.success('Expense recorded in ledger');
    setIsAddOpen(false);
    setFormData({
      title: '',
      category: 'Maintenance',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      notes: ''
    });
  };

  const handleExportCSV = () => {
    const headers = ['id', 'title', 'category', 'amount', 'date', 'paymentMethod', 'notes'];
    downloadCSV(`Expenses_${Date.now()}.csv`, filteredExpenses, headers);
    toast.success('Exported expense ledger to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Expenses
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Operational costs, campus utility bills, laboratory maintenance, and supplies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Overview & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Recorded Expenses</span>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {formatPKR(totalExpense)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">October 2026 Accounting Period</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1B2C4D] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Largest Category:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Faculty Salaries (70%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Entries:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{filteredExpenses.length} Records</span>
            </div>
          </div>
        </div>

        {/* Pie Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [formatPKR(v)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 text-xs">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-[#1B2C4D] flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Expense Ledger Table</h3>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border px-3 py-1.5 font-semibold"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 font-bold text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30">
                  <td className="py-3 px-4 font-mono">{formatDate(exp.date)}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{exp.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatPKR(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        deleteExpense(exp.id);
                        toast.success('Expense deleted');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record New Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Expense Title / Description *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Science Lab Refurbishment"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 focus:ring-2 focus:ring-[#2F6FDE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 focus:ring-2 focus:ring-[#2F6FDE]"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Amount (PKR) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="25000"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="JazzCash">JazzCash / Easypaisa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE]">
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
