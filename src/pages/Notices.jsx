import React, { useState } from 'react';
import { Bell, Plus, Trash2, Tag, Calendar, Users, Send } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Notices = () => {
  const { notices, addNotice, deleteNotice } = useSchool();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    title: '',
    audience: 'All',
    priority: 'Medium',
    author: 'Principal Office',
    content: ''
  });

  const filteredNotices = notices.filter(n => audienceFilter === 'ALL' || n.audience === audienceFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please enter notice title and text');
      return;
    }
    addNotice(formData);
    toast.success('Notice published to school portal');
    setIsAddOpen(false);
    setFormData({
      title: '',
      audience: 'All',
      priority: 'Medium',
      author: 'Principal Office',
      content: ''
    });
  };

  const getPriorityStyle = (p) => {
    switch (p?.toLowerCase()) {
      case 'urgent': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200';
      case 'high': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            School Notices & Circulars
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Broadcast official circulars, exam datesheets, and event reminders
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        {['ALL', 'All', 'Parents', 'Teachers'].map(aud => (
          <button
            key={aud}
            onClick={() => setAudienceFilter(aud)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              audienceFilter === aud
                ? 'bg-[#0B2A5B] dark:bg-[#2F6FDE] text-white shadow-xs'
                : 'bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {aud === 'ALL' ? 'All Notices' : `For ${aud}`}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getPriorityStyle(n.priority)}`}>
                  {n.priority} Priority
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{formatDate(n.date)}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                {n.content}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1B2C4D] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Audience: <strong className="text-slate-700 dark:text-slate-200">{n.audience}</strong>
              </span>

              <button
                onClick={() => {
                  deleteNotice(n.id);
                  toast.success('Notice removed');
                }}
                className="p-1 text-slate-400 hover:text-rose-500 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Publish Official Notice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Winter Vacation Notification 2026"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                <option value="All">All School Community</option>
                <option value="Parents">Parents Only</option>
                <option value="Teachers">Faculty Staff Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent / Important</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Circular Content / Details *</label>
            <textarea
              required
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Type detailed announcement message here..."
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] dark:bg-[#2F6FDE] rounded-xl">
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
