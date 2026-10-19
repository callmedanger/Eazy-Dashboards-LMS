import React, { useState } from 'react';
import { UserPlus, ArrowRight, CheckCircle, Plus, Phone, Calendar, UserCheck } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Admissions = () => {
  const { inquiries, updateInquiryStage, addInquiry, addStudent } = useSchool();
  const [isAddInqOpen, setIsAddInqOpen] = useState(false);

  const [newInq, setNewInq] = useState({
    studentName: '',
    fatherName: '',
    phone: '0300-1234567',
    classApplying: 'Class 9',
    stage: 'New Inquiry',
    notes: ''
  });

  const stages = ['New Inquiry', 'Contacted', 'Visited', 'Admitted', 'Rejected'];

  const handleStageMove = (id, newStage) => {
    updateInquiryStage(id, newStage);
    toast.success(`Applicant moved to ${newStage}`);
  };

  const handleConvertToStudent = (inq) => {
    // Add student with inquiry details
    addStudent({
      name: inq.studentName,
      fatherName: inq.fatherName,
      gender: 'Male',
      dob: '2012-04-10',
      class: inq.classApplying,
      section: 'A',
      phone: inq.phone,
      whatsapp: inq.phone,
      address: 'Model Town, Lahore',
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee: 7000,
      feeStatus: 'Unpaid'
    });
    updateInquiryStage(inq.id, 'Admitted');
    toast.success(`${inq.studentName} successfully enrolled as student!`);
  };

  const handleCreateInquiry = (e) => {
    e.preventDefault();
    addInquiry(newInq);
    toast.success('Inquiry saved to pipeline');
    setIsAddInqOpen(false);
    setNewInq({
      studentName: '',
      fatherName: '',
      phone: '0300-1234567',
      classApplying: 'Class 9',
      stage: 'New Inquiry',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Admissions & Inquiries Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Kanban pipeline for prospective student inquiries and one-click enrollment
          </p>
        </div>

        <button
          onClick={() => setIsAddInqOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Admission Lead</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageInquiries = inquiries.filter(i => i.stage === stage);

          return (
            <div
              key={stage}
              className="bg-slate-100/70 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] rounded-2xl p-3 flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1B2C4D] mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{stage}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#0D1B34] text-slate-600 dark:text-slate-300 shadow-2xs">
                  {stageInquiries.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-xs hover:shadow-md transition-all space-y-2 text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold">{inq.classApplying}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">{inq.studentName}</h4>
                      <p className="text-[11px] text-slate-400">Father: {inq.fatherName}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{inq.phone}</span>
                    </div>

                    {inq.notes && (
                      <p className="text-[10px] text-slate-500 bg-slate-50 dark:bg-[#0A1630] p-1.5 rounded-lg border">
                        {inq.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-[#1B2C4D] flex flex-col gap-1.5">
                      {stage !== 'Admitted' && (
                        <button
                          onClick={() => handleConvertToStudent(inq)}
                          className="w-full py-1 text-center font-bold text-[11px] text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                        >
                          Convert to Student
                        </button>
                      )}

                      {/* Stage Mover Selector */}
                      <select
                        value={inq.stage}
                        onChange={(e) => handleStageMove(inq.id, e.target.value)}
                        className="w-full text-[10px] rounded-lg bg-slate-50 dark:bg-[#0A1630] border px-2 py-1 text-slate-600 dark:text-slate-300"
                      >
                        {stages.map(s => <option key={s} value={s}>Move to: {s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Inquiry Modal */}
      <Modal isOpen={isAddInqOpen} onClose={() => setIsAddInqOpen(false)} title="New Admission Inquiry">
        <form onSubmit={handleCreateInquiry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Student Candidate Name *</label>
            <input
              type="text"
              required
              value={newInq.studentName}
              onChange={(e) => setNewInq({ ...newInq, studentName: e.target.value })}
              placeholder="e.g. Zainab Qasim"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Father / Guardian Name *</label>
              <input
                type="text"
                required
                value={newInq.fatherName}
                onChange={(e) => setNewInq({ ...newInq, fatherName: e.target.value })}
                placeholder="Qasim Farooq"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Class Applying For</label>
              <select
                value={newInq.classApplying}
                onChange={(e) => setNewInq({ ...newInq, classApplying: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                {Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={newInq.phone}
              onChange={(e) => setNewInq({ ...newInq, phone: e.target.value })}
              placeholder="0300-1234567"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Notes / Inquiries</label>
            <textarea
              rows="3"
              value={newInq.notes}
              onChange={(e) => setNewInq({ ...newInq, notes: e.target.value })}
              placeholder="Previous school background, transport required, etc."
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsAddInqOpen(false)} className="px-4 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] dark:bg-[#2F6FDE] rounded-xl">
              Save Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
