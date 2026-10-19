import React, { useState } from 'react';
import { Settings as SettingsIcon, School, Moon, Sun, Globe, RotateCcw, Download, ShieldCheck } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { schoolSettings, setSchoolSettings, resetDemoData, exportAllData } = useSchool();
  const { theme, setTheme, accentColor, updateAccent } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [formData, setFormData] = useState({ ...schoolSettings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSettingsSave = (e) => {
    e.preventDefault();
    setSchoolSettings(formData);
    toast.success('School institutional parameters updated');
  };

  const accentPresets = [
    { name: 'Eazy Navy (Default)', color: '#2F6FDE' },
    { name: 'Emerald Green', color: '#10B981' },
    { name: 'Royal Purple', color: '#8B5CF6' },
    { name: 'Amber Gold', color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System & School Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
          Campus metadata, fee fine policies, appearance customization, and demo data controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: School Info & Policies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Campus Identity & Information</h3>
            <form onSubmit={handleSettingsSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">School Official Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tagline / Motto</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Helpline Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
              </div>

              {/* Fee Rules */}
              <div className="pt-4 border-t">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Finance Policies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Fee Due Date</label>
                    <input
                      type="text"
                      value={formData.feeDueDate}
                      onChange={(e) => setFormData({ ...formData, feeDueDate: e.target.value })}
                      className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Late Fine Surcharge (PKR)</label>
                    <input
                      type="number"
                      value={formData.lateFineAmount}
                      onChange={(e) => setFormData({ ...formData, lateFineAmount: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Sibling Discount %</label>
                    <input
                      type="number"
                      value={formData.siblingsDiscountPct}
                      onChange={(e) => setFormData({ ...formData, siblingsDiscountPct: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE]"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Appearance & Data Controls */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Theme & Appearance</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Color Scheme</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${theme === 'light' ? 'border-blue-600 bg-blue-50/70 text-blue-800 shadow-xs' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>White Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${theme === 'dark' ? 'border-blue-400 bg-[#0B2247] text-white shadow-xs' : 'text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Blue & White Dark</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Display Language</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${language === 'en' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  English (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ur')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${language === 'ur' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  اردو (RTL)
                </button>
              </div>
            </div>
          </div>

          {/* Backup & Demo Data Management */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live Demo Data Controls</h3>
            <p className="text-xs text-slate-500">
              Download your full database as a JSON snapshot or restore all 160+ mock students, fee records, and timetables back to pristine defaults.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={exportAllData}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-[#1B2C4D] bg-slate-50 dark:bg-[#0A1630] hover:bg-slate-100 transition"
              >
                <Download className="w-4 h-4 text-blue-500" />
                <span>Export All Data (JSON)</span>
              </button>

              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data to Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetDemoData();
          toast.success('Pristine demo dataset reloaded into localStorage');
        }}
        title="Reset Demo Dataset"
        message="Are you sure you want to reset all mock students, teachers, fee records, and expenses? Any changes made during the demo will be restored to factory settings."
      />
    </div>
  );
};
