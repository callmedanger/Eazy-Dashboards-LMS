import React, { useState } from 'react';
import { User, Shield, Mail, Phone, Lock, Clock, CheckCircle } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const AdminProfile = () => {
  const { currentUser, setCurrentUser, auditLog } = useSchool();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    role: currentUser.role
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      ...formData
    }));
    toast.success('Admin profile credentials updated');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Administrator password updated successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Administrator Profile & Security
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
          Manage system super-user profile, security credentials, and activity audit trails
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card & Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px] rounded-full uppercase">
                {currentUser.role}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">{currentUser.email} • {currentUser.phone}</p>
              <p className="text-[11px] text-slate-400 pt-1">Session ID: #AUTH-PK-98214 (Valid)</p>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Edit Personal Information</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    disabled
                    value={formData.role}
                    className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border p-2.5 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE]"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Security & Authentication</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Live Audit Log / Activity Trail */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Admin Activity Audit Trail</h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">Live Log</span>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {auditLog.map((log) => (
              <div key={log.id} className="relative pl-5 border-l-2 border-blue-500/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8FA3C4] leading-relaxed">{log.details}</p>
                <span className="text-[9px] text-slate-400">By {log.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
