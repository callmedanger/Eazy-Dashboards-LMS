import React, { useState } from 'react';
import { FolderOpen, Upload, Trash2, Download, FileText, FileSpreadsheet, Eye, Plus } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Uploads = () => {
  const { documents, addDocument, deleteDocument } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('Student documents');
  const [linkedTo, setLinkedTo] = useState('General');

  const categories = ['Student documents', 'Teacher documents', 'Notices', 'Others'];

  const filteredDocs = documents.filter(d => selectedCategory === 'ALL' || d.category === selectedCategory);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docName) return;

    setIsSimulatingUpload(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          addDocument({
            name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
            category,
            size: '1.4 MB',
            linkedTo,
            type: 'pdf'
          });
          toast.success('Document uploaded and archived successfully');
          setIsUploadOpen(false);
          setDocName('');
          setUploadProgress(0);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Documents & Cloud Files
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Archived board registrations, staff agreements, policies, and curriculum documents
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${selectedCategory === 'ALL' ? 'bg-[#0B2A5B] dark:bg-[#2F6FDE] text-white shadow-xs' : 'bg-white dark:bg-[#0D1B34] border'}`}
        >
          All Files ({documents.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${selectedCategory === cat ? 'bg-[#0B2A5B] dark:bg-[#2F6FDE] text-white shadow-xs' : 'bg-white dark:bg-[#0D1B34] border'}`}
          >
            {cat} ({documents.filter(d => d.category === cat).length})
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3 line-clamp-1">{doc.name}</h4>
              <p className="text-xs text-slate-400 mt-1">Linked to: <strong className="text-slate-700 dark:text-slate-300">{doc.linkedTo}</strong></p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1B2C4D] flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-mono">{formatDate(doc.uploadDate)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast.success(`Simulating download of ${doc.name}`)}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-slate-100 rounded"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    deleteDocument(doc.id);
                    toast.success('Document deleted');
                  }}
                  className="p-1.5 text-rose-500 hover:bg-slate-100 rounded"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal with simulated progress */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload School Document">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">File Name *</label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Science_Curriculum_Syllabus_2026.pdf"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Linked Entity</label>
              <input
                type="text"
                value={linkedTo}
                onChange={(e) => setLinkedTo(e.target.value)}
                placeholder="e.g. Class 10 Students"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              />
            </div>
          </div>

          {/* Drag & drop simulated box */}
          <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-xs text-slate-500 bg-slate-50 dark:bg-[#0A1630]">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & drop PDF, Word, or Excel file here</p>
            <p className="text-[10px] text-slate-400 mt-1">Maximum upload size 25 MB</p>
          </div>

          {isSimulatingUpload && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-blue-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-2 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsUploadOpen(false)} className="px-4 py-2 text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSimulatingUpload}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] dark:bg-[#2F6FDE] rounded-xl"
            >
              Upload & Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
