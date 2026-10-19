import { generateInitialStudents, initialClasses, initialTeachers } from './initialData';

const baseStudents = generateInitialStudents();

// Generate 12 months fee records
export const generateFeeRecords = () => {
  const months = [
    'October 2026', 'September 2026', 'August 2026', 'July 2026',
    'June 2026', 'May 2026', 'April 2026', 'March 2026',
    'February 2026', 'January 2026', 'December 2025', 'November 2025'
  ];

  const records = [];
  let receiptNo = 40500;

  // Generate for current month (October 2026) for all students
  baseStudents.forEach((st, idx) => {
    let status = st.feeStatus;
    let paid = status === 'Paid' ? st.monthlyFee : (status === 'Partial' ? st.monthlyFee - st.balanceDue : 0);
    let bal = st.monthlyFee - paid;

    records.push({
      id: `FEE-${idx + 1000}`,
      receiptNo: `REC-${receiptNo++}`,
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      class: st.class,
      section: st.section,
      month: 'October 2026',
      amount: st.monthlyFee,
      paidAmount: paid,
      balance: bal,
      status: status,
      paymentDate: status !== 'Unpaid' ? '2026-10-05' : null,
      paymentMethod: status !== 'Unpaid' ? (idx % 3 === 0 ? 'Cash' : (idx % 3 === 1 ? 'Easypaisa' : 'Bank Transfer')) : null,
      lateFine: status === 'Overdue' ? 500 : 0,
      remarks: status === 'Paid' ? 'Full monthly payment cleared' : (status === 'Partial' ? 'First installment' : 'Fee slip issued')
    });
  });

  // Add historical payments for September 2026
  baseStudents.slice(0, 40).forEach((st, idx) => {
    records.push({
      id: `FEE-HIST-${idx + 2000}`,
      receiptNo: `REC-${receiptNo++}`,
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      class: st.class,
      section: st.section,
      month: 'September 2026',
      amount: st.monthlyFee,
      paidAmount: st.monthlyFee,
      balance: 0,
      status: 'Paid',
      paymentDate: '2026-09-08',
      paymentMethod: idx % 2 === 0 ? 'Cash' : 'JazzCash',
      lateFine: 0,
      remarks: 'Paid on time'
    });
  });

  return records;
};

export const initialExpenses = [
  { id: 'EXP-01', title: 'Teacher & Staff Monthly Salaries', category: 'Salaries', amount: 1350000, date: '2026-10-01', paymentMethod: 'Bank Transfer', notes: 'October 2026 Payroll for teaching & administrative staff' },
  { id: 'EXP-02', title: 'Main Campus Electricity Bill (LESCO)', category: 'Electricity', amount: 145000, date: '2026-10-08', paymentMethod: 'Online Bank', notes: 'Monthly electricity consumption for all blocks' },
  { id: 'EXP-03', title: 'Building Lease / Rent (Campus 2)', category: 'Rent', amount: 250000, date: '2026-10-02', paymentMethod: 'Cheque', notes: 'Junior wing campus monthly rent' },
  { id: 'EXP-04', title: 'Exam Question Papers & Answer Booklets Printing', category: 'Stationery', amount: 48000, date: '2026-10-12', paymentMethod: 'Cash', notes: 'Printing of Midterm examination stationery' },
  { id: 'EXP-05', title: 'Science Lab Chemicals & Glassware Refill', category: 'Maintenance', amount: 32000, date: '2026-10-14', paymentMethod: 'Cash', notes: 'Chemistry & Biology lab refurbishment' },
  { id: 'EXP-06', title: 'Annual Sports Gala Ground Booking & Trophies', category: 'Events', amount: 85000, date: '2026-10-16', paymentMethod: 'Bank Transfer', notes: 'Stadium reservation and winners medals' },
  { id: 'EXP-07', title: 'High-speed Fiber Internet & IT Cloud Infrastructure', category: 'Other', amount: 18500, date: '2026-10-05', paymentMethod: 'JazzCash', notes: '100 Mbps dedicated optical fiber line' },
  { id: 'EXP-08', title: 'School Van Fuel & Fleet Servicing', category: 'Maintenance', amount: 64000, date: '2026-10-10', paymentMethod: 'Cash', notes: 'Diesel and engine maintenance for 3 transport vans' }
];

export const initialNotices = [
  { id: 'NOT-1', title: 'First Term Examination Schedule 2026-27', audience: 'All', priority: 'High', date: '2026-10-18', author: 'Principal Office', content: 'Midterm examinations will commence from November 10, 2026. The detailed date sheet and syllabus distribution have been uploaded to the student portal.' },
  { id: 'NOT-2', title: 'Parent-Teacher Meeting (PTM) for Classes 9 & 10', audience: 'Parents', priority: 'Urgent', date: '2026-10-15', author: 'Academic Coordinator', content: 'PTM is scheduled for Saturday, October 24, 2026, from 9:00 AM to 1:00 PM. Parents are requested to attend and review student performance before final board submissions.' },
  { id: 'NOT-3', title: 'Winter Uniform Transition Notice', audience: 'Parents', priority: 'Medium', date: '2026-10-12', author: 'Administration', content: 'From 1st November 2026, all students must adhere strictly to the winter uniform code including official navy blue blazer and school tie.' },
  { id: 'NOT-4', title: 'Staff Training Workshop on Interactive Digital Boards', audience: 'Teachers', priority: 'Medium', date: '2026-10-09', author: 'IT Department', content: 'A hands-on professional development workshop will take place this Thursday at 2:30 PM in the Senior Computer Lab.' }
];

export const initialEvents = [
  { id: 'EVT-1', title: 'Annual Sports Gala 2026', date: '2026-10-28', type: 'Sports', color: '#16A34A', description: 'Inter-house athletic competitions, relay races, and awards ceremony at the main stadium.' },
  { id: 'EVT-2', title: 'Parent Teacher Meeting (PTM)', date: '2026-10-24', type: 'Meeting', color: '#2F6FDE', description: 'Classes 6 to 10 performance review with parents and class instructors.' },
  { id: 'EVT-3', title: 'Iqbal Day Commemoration', date: '2026-11-09', type: 'Holiday', color: '#F59E0B', description: 'National Holiday and commemorative speech contests.' },
  { id: 'EVT-4', title: 'Midterm Examination Start', date: '2026-11-10', type: 'Exam', color: '#DC2626', description: 'First term comprehensive exams for all grade levels.' },
  { id: 'EVT-5', title: 'Annual Science & Robotics Exhibition', date: '2026-11-25', type: 'Exhibition', color: '#8B5CF6', description: 'Student demonstrations of working models, robotic kits, and coding challenges.' }
];

export const initialInquiries = [
  { id: 'INQ-101', studentName: 'Zainab Qasim', fatherName: 'Qasim Farooq', phone: '0300-9871122', classApplying: 'Class 9', stage: 'New Inquiry', date: '2026-10-18', notes: 'Wants admission in Pre-Medical group. Previously in Army Public School.' },
  { id: 'INQ-102', studentName: 'Abdullah Rizwan', fatherName: 'Dr. Rizwan Bashir', phone: '0321-4567890', classApplying: 'Class 6', stage: 'Contacted', date: '2026-10-17', notes: 'Father inquired about transport route to Model Town. Admission test scheduled.' },
  { id: 'INQ-103', studentName: 'Eshal Mansoor', fatherName: 'Mansoor Ahmed', phone: '0333-1122334', classApplying: 'Class 1', stage: 'Visited', date: '2026-10-15', notes: 'Parents visited campus and inspected Montessori labs. Very satisfied.' },
  { id: 'INQ-104', studentName: 'Haris Mehmood', fatherName: 'Mehmood Ul Hassan', phone: '0345-6677889', classApplying: 'Class 10', stage: 'Admitted', date: '2026-10-14', notes: 'Admission test cleared (88% marks). Fees deposited.' },
  { id: 'INQ-105', studentName: 'Mustafa Kamal', fatherName: 'Kamal Pasha', phone: '0312-3344556', classApplying: 'Class 8', stage: 'Rejected', date: '2026-10-10', notes: 'Failed prerequisite math baseline test twice.' }
];

export const initialDocuments = [
  { id: 'DOC-1', name: 'Board_Registration_Class10_BISE.pdf', category: 'Student documents', size: '2.4 MB', uploadDate: '2026-10-15', linkedTo: 'Class 10 Students', type: 'pdf' },
  { id: 'DOC-2', name: 'Faculty_Agreement_Tariq_Math.pdf', category: 'Teacher documents', size: '1.1 MB', uploadDate: '2026-10-02', linkedTo: 'Muhammad Tariq', type: 'pdf' },
  { id: 'DOC-3', name: 'Midterm_Exam_Datesheet_Final.xlsx', category: 'Notices', size: '420 KB', uploadDate: '2026-10-16', linkedTo: 'All Classes', type: 'sheet' },
  { id: 'DOC-4', name: 'Fire_Safety_Inspection_Certificate.pdf', category: 'Others', size: '3.8 MB', uploadDate: '2026-09-20', linkedTo: 'Campus Facilities', type: 'pdf' },
  { id: 'DOC-5', name: 'Student_Code_of_Conduct_Handbook.pdf', category: 'Student documents', size: '1.8 MB', uploadDate: '2026-08-30', linkedTo: 'General Handbook', type: 'pdf' }
];

export const initialAuditLog = [
  { id: 'LOG-1', action: 'Fee Collected', details: 'Collected Rs. 7,000 for Muhammad Bilal (Class 9-A) via JazzCash', timestamp: '2026-10-19 16:35:10', user: 'Admin' },
  { id: 'LOG-2', action: 'Student Added', details: 'Admitted Haris Mehmood into Class 10-A (Roll No: RN-1088)', timestamp: '2026-10-19 14:20:00', user: 'Admin' },
  { id: 'LOG-3', action: 'Attendance Marked', details: 'Marked daily attendance for Class 10-A (21 Present, 2 Absent)', timestamp: '2026-10-19 09:15:22', user: 'Admin' },
  { id: 'LOG-4', action: 'Expense Recorded', details: 'Logged Rs. 85,000 for Sports Gala stadium booking', timestamp: '2026-10-18 17:40:05', user: 'Admin' },
  { id: 'LOG-5', action: 'Notice Published', details: 'First Term Examination Schedule posted for all students', timestamp: '2026-10-18 11:05:40', user: 'Admin' }
];

export const initialExams = [
  { id: 'EXAM-1', name: 'Midterm Examination 2026', class: 'Class 10', date: '2026-11-10', totalMarks: 500, passingPercentage: 40 },
  { id: 'EXAM-2', name: 'Monthly Assessment - September', class: 'Class 9', date: '2026-09-25', totalMarks: 100, passingPercentage: 40 },
  { id: 'EXAM-3', name: 'First Term Evaluation', class: 'Class 8', date: '2026-10-05', totalMarks: 400, passingPercentage: 40 }
];

export const sampleTimetable = {
  'Class 10-A': [
    { period: 1, time: '08:00 - 08:45', monday: 'Mathematics', tuesday: 'Mathematics', wednesday: 'Mathematics', thursday: 'Physics', friday: 'Islamiat' },
    { period: 2, time: '08:45 - 09:30', monday: 'Physics', tuesday: 'Physics', wednesday: 'Chemistry', thursday: 'Chemistry', friday: 'Urdu' },
    { period: 3, time: '09:30 - 10:15', monday: 'Chemistry', tuesday: 'English', wednesday: 'English', thursday: 'Biology/CS', friday: 'English' },
    { period: 4, time: '10:45 - 11:30', monday: 'English', tuesday: 'Urdu', wednesday: 'Biology/CS', thursday: 'Mathematics', friday: 'Pak Studies' },
    { period: 5, time: '11:30 - 12:15', monday: 'Biology/CS', tuesday: 'Pak Studies', wednesday: 'Physics', thursday: 'Computer Lab', friday: 'Sports/PE' },
    { period: 6, time: '12:15 - 01:00', monday: 'Urdu', tuesday: 'Islamiat', wednesday: 'Chemistry Lab', thursday: 'Robotics', friday: 'Library' }
  ]
};
