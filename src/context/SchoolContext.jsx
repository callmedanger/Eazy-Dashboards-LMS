import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialClasses, initialTeachers, generateInitialStudents } from '../data/initialData';
import {
  generateFeeRecords,
  initialExpenses,
  initialNotices,
  initialEvents,
  initialInquiries,
  initialDocuments,
  initialAuditLog,
  initialExams,
  sampleTimetable
} from '../data/secondaryData';

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  // State Initialization from LocalStorage or Defaults
  const [students, setStudents] = useState(() => {
    // Generate fresh initial students with dummy avatars
    const saved = localStorage.getItem('eazy_students_v2');
    return saved ? JSON.parse(saved) : generateInitialStudents();
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('eazy_teachers_v2');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('eazy_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [feeRecords, setFeeRecords] = useState(() => {
    const saved = localStorage.getItem('eazy_fee_records');
    return saved ? JSON.parse(saved) : generateFeeRecords();
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('eazy_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('eazy_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('eazy_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('eazy_inquiries');
    return saved ? JSON.parse(saved) : initialInquiries;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('eazy_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [auditLog, setAuditLog] = useState(() => {
    const saved = localStorage.getItem('eazy_audit_log');
    return saved ? JSON.parse(saved) : initialAuditLog;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('eazy_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [timetables, setTimetables] = useState(() => {
    const saved = localStorage.getItem('eazy_timetables');
    return saved ? JSON.parse(saved) : sampleTimetable;
  });

  const [academicYear, setAcademicYear] = useState(() => {
    return localStorage.getItem('eazy_academic_year') || '2026 - 2027';
  });

  const [schoolSettings, setSchoolSettings] = useState(() => {
    const saved = localStorage.getItem('eazy_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Eazy Grammar High School',
      tagline: 'Excellence in Modern Education',
      address: 'Main Campus, Canal Road, Lahore, Pakistan',
      phone: '+92 (42) 35889900',
      email: 'admin@eazyschool.edu.pk',
      website: 'www.eazyschool.edu.pk',
      currency: 'PKR',
      feeDueDate: '10th of every month',
      lateFineAmount: 500,
      siblingsDiscountPct: 15
    };
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eazy_user');
    return saved ? JSON.parse(saved) : {
      name: 'Muhammad Tariq Khan',
      role: 'Principal & Super Admin',
      email: 'admin@eazyschool.edu.pk',
      phone: '0300-1234567',
      avatar: 'https://ui-avatars.com/api/?name=Muhammad+Tariq&background=0B2A5B&color=fff&size=150&bold=true&rounded=true',
      notificationsEnabled: true
    };
  });

  // Persist State to LocalStorage
  useEffect(() => { localStorage.setItem('eazy_students_v2', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('eazy_teachers_v2', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('eazy_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('eazy_fee_records', JSON.stringify(feeRecords)); }, [feeRecords]);
  useEffect(() => { localStorage.setItem('eazy_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('eazy_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('eazy_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('eazy_inquiries', JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem('eazy_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('eazy_audit_log', JSON.stringify(auditLog)); }, [auditLog]);
  useEffect(() => { localStorage.setItem('eazy_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('eazy_timetables', JSON.stringify(timetables)); }, [timetables]);
  useEffect(() => { localStorage.setItem('eazy_settings', JSON.stringify(schoolSettings)); }, [schoolSettings]);
  useEffect(() => { localStorage.setItem('eazy_academic_year', academicYear); }, [academicYear]);
  useEffect(() => { localStorage.setItem('eazy_user', JSON.stringify(currentUser)); }, [currentUser]);

  // Log an Audit Entry
  const addAuditLog = (action, details) => {
    const newEntry = {
      id: `LOG-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleString(),
      user: currentUser.name
    };
    setAuditLog(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  // Student CRUD
  const addStudent = (studentData) => {
    const bg = studentData.gender === 'Female' ? 'BE185D' : '0B2A5B';
    const newStudent = {
      ...studentData,
      id: `STD-${Date.now().toString().slice(-4)}`,
      rollNo: studentData.rollNo || `RN-${1000 + students.length + 1}`,
      feeStatus: studentData.feeStatus || 'Unpaid',
      balanceDue: studentData.balanceDue !== undefined ? Number(studentData.balanceDue) : Number(studentData.monthlyFee || 5000),
      attendancePct: studentData.attendancePct || 95,
      photo: studentData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=${bg}&color=fff&size=150&bold=true&rounded=true`
    };
    setStudents(prev => [newStudent, ...prev]);

    // Create fee record for current month
    const newFeeRecord = {
      id: `FEE-${Date.now()}`,
      receiptNo: `REC-${50000 + feeRecords.length + 1}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      rollNo: newStudent.rollNo,
      class: newStudent.class,
      section: newStudent.section,
      month: 'October 2026',
      amount: Number(newStudent.monthlyFee),
      paidAmount: 0,
      balance: Number(newStudent.monthlyFee),
      status: 'Unpaid',
      paymentDate: null,
      paymentMethod: null,
      lateFine: 0,
      remarks: 'Admission fee voucher generated'
    };
    setFeeRecords(prev => [newFeeRecord, ...prev]);

    addAuditLog('Student Added', `Admitted ${newStudent.name} into ${newStudent.class}-${newStudent.section}`);
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    addAuditLog('Student Updated', `Updated profile of student ID: ${id}`);
  };

  const deleteStudent = (id) => {
    const s = students.find(item => item.id === id);
    setStudents(prev => prev.filter(item => item.id !== id));
    setFeeRecords(prev => prev.filter(item => item.studentId !== id));
    addAuditLog('Student Deleted', `Removed student: ${s ? s.name : id}`);
  };

  const bulkDeleteStudents = (ids) => {
    setStudents(prev => prev.filter(item => !ids.includes(item.id)));
    setFeeRecords(prev => prev.filter(item => !ids.includes(item.studentId)));
    addAuditLog('Bulk Delete Students', `Removed ${ids.length} students`);
  };

  // Teacher CRUD
  const addTeacher = (teacherData) => {
    const newTeacher = {
      ...teacherData,
      id: `T-${100 + teachers.length + 1}`,
      photo: teacherData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherData.name)}&background=0B2A5B&color=fff&size=150&bold=true&rounded=true`,
      status: 'Active'
    };
    setTeachers(prev => [newTeacher, ...prev]);
    addAuditLog('Teacher Added', `Hired ${newTeacher.name} for ${newTeacher.subject}`);
    return newTeacher;
  };

  const updateTeacher = (id, updatedFields) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    addAuditLog('Teacher Updated', `Updated faculty record: ${id}`);
  };

  const deleteTeacher = (id) => {
    const t = teachers.find(item => item.id === id);
    setTeachers(prev => prev.filter(item => item.id !== id));
    addAuditLog('Teacher Deleted', `Removed teacher: ${t ? t.name : id}`);
  };

  // Class CRUD
  const addClass = (classData) => {
    const newClass = {
      ...classData,
      id: `C-${Date.now().toString().slice(-4)}`,
      sections: classData.sections || ['A']
    };
    setClasses(prev => [...prev, newClass]);
    addAuditLog('Class Added', `Created new class: ${newClass.name}`);
  };

  const updateClass = (id, updatedFields) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addAuditLog('Class Updated', `Updated class structure: ${id}`);
  };

  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    addAuditLog('Class Deleted', `Removed class ID: ${id}`);
  };

  // Fee Collection
  const collectFee = ({ studentId, amount, paymentMethod, discount = 0, lateFine = 0, remarks = '', month = 'October 2026' }) => {
    const numAmount = Number(amount);
    const numLateFine = Number(lateFine);
    const numDiscount = Number(discount);
    const effectivePaid = numAmount - numLateFine + numDiscount;

    let updatedRecord = null;

    setFeeRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.month === month);
      if (existingIdx >= 0) {
        const old = prev[existingIdx];
        const newPaid = old.paidAmount + effectivePaid;
        const newBal = Math.max(0, old.amount - newPaid);
        const newStatus = newBal === 0 ? 'Paid' : 'Partial';

        updatedRecord = {
          ...old,
          paidAmount: newPaid,
          balance: newBal,
          status: newStatus,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod,
          lateFine: numLateFine,
          remarks: remarks || old.remarks
        };

        const copy = [...prev];
        copy[existingIdx] = updatedRecord;
        return copy;
      } else {
        const student = students.find(s => s.id === studentId);
        const feeAmount = student ? student.monthlyFee : 5000;
        const newBal = Math.max(0, feeAmount - effectivePaid);

        updatedRecord = {
          id: `FEE-${Date.now()}`,
          receiptNo: `REC-${50000 + prev.length + 1}`,
          studentId,
          studentName: student ? student.name : 'Unknown',
          rollNo: student ? student.rollNo : 'RN-000',
          class: student ? student.class : 'Class 1',
          section: student ? student.section : 'A',
          month,
          amount: feeAmount,
          paidAmount: effectivePaid,
          balance: newBal,
          status: newBal === 0 ? 'Paid' : 'Partial',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          lateFine: numLateFine,
          remarks: remarks || 'Fee payment'
        };
        return [updatedRecord, ...prev];
      }
    });

    // Also update student fee status in students table
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const studentFee = s.monthlyFee;
        const bal = Math.max(0, studentFee - effectivePaid);
        return {
          ...s,
          feeStatus: bal === 0 ? 'Paid' : 'Partial',
          balanceDue: bal
        };
      }
      return s;
    }));

    const studentObj = students.find(s => s.id === studentId);
    addAuditLog('Fee Collected', `Collected Rs. ${numAmount.toLocaleString()} for ${studentObj ? studentObj.name : studentId} via ${paymentMethod}`);

    return updatedRecord;
  };

  // Expenses CRUD
  const addExpense = (expenseData) => {
    const newExp = {
      ...expenseData,
      id: `EXP-${Date.now().toString().slice(-4)}`,
      amount: Number(expenseData.amount)
    };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('Expense Added', `Recorded ${expenseData.title} - Rs. ${expenseData.amount}`);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog('Expense Deleted', `Removed expense: ${id}`);
  };

  // Notices CRUD
  const addNotice = (noticeData) => {
    const newNotice = {
      ...noticeData,
      id: `NOT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
    addAuditLog('Notice Published', `Posted: ${noticeData.title}`);
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    addAuditLog('Notice Deleted', `Removed notice: ${id}`);
  };

  // Events CRUD
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `EVT-${Date.now().toString().slice(-4)}`
    };
    setEvents(prev => [...prev, newEvent]);
    addAuditLog('Event Scheduled', `Added: ${eventData.title}`);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    addAuditLog('Event Removed', `Removed event: ${id}`);
  };

  // Inquiry pipeline
  const updateInquiryStage = (inquiryId, newStage) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, stage: newStage } : inq));
    addAuditLog('Inquiry Stage Changed', `Inquiry ${inquiryId} moved to ${newStage}`);
  };

  const addInquiry = (inq) => {
    const newInq = {
      ...inq,
      id: `INQ-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setInquiries(prev => [newInq, ...prev]);
    addAuditLog('Inquiry Created', `New applicant: ${inq.studentName}`);
  };

  // Documents
  const addDocument = (doc) => {
    const newDoc = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('Document Uploaded', `Uploaded: ${doc.name}`);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addAuditLog('Document Deleted', `Deleted doc: ${id}`);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem('eazy_students_v2');
    localStorage.removeItem('eazy_teachers_v2');
    localStorage.removeItem('eazy_classes');
    localStorage.removeItem('eazy_fee_records');
    localStorage.removeItem('eazy_expenses');
    localStorage.removeItem('eazy_notices');
    localStorage.removeItem('eazy_events');
    localStorage.removeItem('eazy_inquiries');
    localStorage.removeItem('eazy_documents');
    localStorage.removeItem('eazy_audit_log');
    localStorage.removeItem('eazy_exams');
    localStorage.removeItem('eazy_timetables');

    setStudents(generateInitialStudents());
    setTeachers(initialTeachers);
    setClasses(initialClasses);
    setFeeRecords(generateFeeRecords());
    setExpenses(initialExpenses);
    setNotices(initialNotices);
    setEvents(initialEvents);
    setInquiries(initialInquiries);
    setDocuments(initialDocuments);
    setAuditLog(initialAuditLog);
    setExams(initialExams);
    setTimetables(sampleTimetable);
    addAuditLog('Demo Reset', 'Reset all demo data back to pristine state');
  };

  // Export all data JSON
  const exportAllData = () => {
    const fullBackup = {
      schoolSettings,
      academicYear,
      students,
      teachers,
      classes,
      feeRecords,
      expenses,
      notices,
      events,
      inquiries,
      documents,
      auditLog
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EazySchool_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <SchoolContext.Provider
      value={{
        students,
        teachers,
        classes,
        feeRecords,
        expenses,
        notices,
        events,
        inquiries,
        documents,
        auditLog,
        exams,
        timetables,
        setTimetables,
        academicYear,
        setAcademicYear,
        schoolSettings,
        setSchoolSettings,
        currentUser,
        setCurrentUser,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkDeleteStudents,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        collectFee,
        addExpense,
        deleteExpense,
        addNotice,
        deleteNotice,
        addEvent,
        deleteEvent,
        updateInquiryStage,
        addInquiry,
        addDocument,
        deleteDocument,
        resetDemoData,
        exportAllData,
        addAuditLog
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool must be used within SchoolProvider');
  return context;
};
