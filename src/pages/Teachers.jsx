import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  DollarSign,
  Grid,
  List,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge } from '../components/Badge';
import { formatPKR, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Teachers = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '0300-1234567',
    subject: 'Mathematics',
    qualification: 'M.Sc (Punjab University)',
    salary: 70000,
    joiningDate: '2022-08-15',
    assignedClasses: ['Class 9-A', 'Class 10-A'],
    status: 'Active',
    photo: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science', 'Islamiat & Pak Studies'];

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'ALL' || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
      toast.success('Teacher record updated');
      setEditingTeacher(null);
    } else {
      addTeacher(formData);
      toast.success('Faculty member added successfully');
      setIsAddModalOpen(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Teachers & Faculty Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Total {teachers.length} certified teachers and instructors on school payroll
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTeacher(null);
            setFormData({
              name: '',
              email: '',
              phone: '0300-1234567',
              subject: 'Mathematics',
              qualification: 'M.Sc (Punjab University)',
              salary: 70000,
              joiningDate: '2022-08-15',
              assignedClasses: ['Class 9-A'],
              status: 'Active',
              photo: ''
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by teacher name, department, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Departments</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0A1630] rounded-xl border border-slate-200 dark:border-[#1B2C4D] shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'cards' ? 'bg-white dark:bg-[#0D1B34] text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Cards Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'table' ? 'bg-white dark:bg-[#0D1B34] text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teachers View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <Badge variant="success" size="sm">{t.status}</Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-1 text-slate-400 hover:text-amber-500 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center mt-3 mb-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md mb-2"
                  />
                  <h3
                    onClick={() => navigate(`/teachers/${t.id}`)}
                    className="font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#2F6FDE]">{t.subject}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.qualification}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-[#1B2C4D] pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] truncate">{t.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Monthly Salary:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(t.salary)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1B2C4D] flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Joined: {formatDate(t.joiningDate)}</span>
                <button
                  onClick={() => navigate(`/teachers/${t.id}`)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p onClick={() => navigate(`/teachers/${t.id}`)} className="font-bold text-slate-900 dark:text-white cursor-pointer hover:underline">{t.name}</p>
                          <p className="text-[10px] text-slate-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">{t.subject}</td>
                    <td className="py-3 px-4">{t.qualification}</td>
                    <td className="py-3 px-4 font-mono">{t.phone}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{formatPKR(t.salary)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">{t.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => navigate(`/teachers/${t.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-amber-500">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTargetId(t.id)} className="p-1.5 text-slate-400 hover:text-rose-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher Record' : 'Add New Faculty Member'}
        subtitle="Instructor credentials, subject department, and salary package"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Muhammad Tariq"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Mathematics"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0300-1234567"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="teacher@eazyschool.edu.pk"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="M.Sc / M.Phil"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (PKR) *</label>
              <input
                type="number"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                placeholder="75000"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 shadow-md"
            >
              {editingTeacher ? 'Save Changes' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          deleteTeacher(deleteTargetId);
          toast.success('Teacher record removed');
        }}
        title="Delete Teacher Record"
        message="Are you sure you want to remove this faculty member from the directory?"
      />
    </div>
  );
};
