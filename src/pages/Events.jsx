import React, { useState } from 'react';
import { Calendar as CalIcon, Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Events = () => {
  const { events, addEvent, deleteEvent } = useSchool();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Sports',
    color: '#16A34A',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addEvent(formData);
    toast.success('Event scheduled on school calendar');
    setIsAddOpen(false);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Sports',
      color: '#16A34A',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Events & Academic Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Key annual milestones, sports festivals, examinations, and official holidays
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Grid / Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase"
                  style={{ backgroundColor: ev.color || '#2F6FDE' }}
                >
                  {ev.type}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-[#8FA3C4] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(ev.date)}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">{ev.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {ev.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1B2C4D] flex justify-end">
              <button
                onClick={() => {
                  deleteEvent(ev.id);
                  toast.success('Event cancelled');
                }}
                className="p-1 text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Academic Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Science Fair & Robotics Exhibition"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Event Category</label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const t = e.target.value;
                  let c = '#2F6FDE';
                  if (t === 'Sports') c = '#16A34A';
                  if (t === 'Holiday') c = '#F59E0B';
                  if (t === 'Exam') c = '#DC2626';
                  setFormData({ ...formData, type: t, color: c });
                }}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                <option value="Sports">Sports Day</option>
                <option value="Meeting">Parent Teacher Meeting</option>
                <option value="Holiday">Official Holiday</option>
                <option value="Exam">Examination Schedule</option>
                <option value="Exhibition">Exhibition / Gala</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Event Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Event Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about venue, timings, participating classes..."
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] dark:bg-[#2F6FDE] rounded-xl">
              Add to Calendar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
