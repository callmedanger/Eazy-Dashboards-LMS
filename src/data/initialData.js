// High-reliability clean avatar SVGs / dummy placeholders with initials
const getDummyAvatar = (name, isMale) => {
  const bg = isMale ? '0B2A5B' : 'BE185D';
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bg}&color=fff&size=150&bold=true&rounded=true`;
};

export const initialTeachers = [
  { id: 'T-101', name: 'Muhammad Tariq', email: 'tariq@eazyschool.edu.pk', phone: '0300-4829101', subject: 'Mathematics', qualification: 'M.Sc Mathematics (Punjab Univ)', salary: 75000, joiningDate: '2019-03-15', assignedClasses: ['Class 9-A', 'Class 10-A', 'Class 10-B'], status: 'Active', photo: getDummyAvatar('Muhammad Tariq', true) },
  { id: 'T-102', name: 'Ayesha Siddiqua', email: 'ayesha.s@eazyschool.edu.pk', phone: '0321-7654321', subject: 'Physics', qualification: 'M.Phil Physics (QAU Islamabad)', salary: 82000, joiningDate: '2018-08-10', assignedClasses: ['Class 9-A', 'Class 10-A'], status: 'Active', photo: getDummyAvatar('Ayesha Siddiqua', false) },
  { id: 'T-103', name: 'Kashif Mehmood', email: 'kashif@eazyschool.edu.pk', phone: '0333-8899112', subject: 'Chemistry', qualification: 'M.Sc Chemistry (UET Lahore)', salary: 70000, joiningDate: '2020-01-12', assignedClasses: ['Class 9-B', 'Class 10-B'], status: 'Active', photo: getDummyAvatar('Kashif Mehmood', true) },
  { id: 'T-104', name: 'Farzana Parveen', email: 'farzana@eazyschool.edu.pk', phone: '0302-3344556', subject: 'Biology', qualification: 'M.Sc Botany', salary: 68000, joiningDate: '2021-04-01', assignedClasses: ['Class 9-A', 'Class 9-C'], status: 'Active', photo: getDummyAvatar('Farzana Parveen', false) },
  { id: 'T-105', name: 'Zahid Hussain', email: 'zahid.h@eazyschool.edu.pk', phone: '0345-1234567', subject: 'English', qualification: 'M.A English Literature (GCU)', salary: 72000, joiningDate: '2017-09-01', assignedClasses: ['Class 7-A', 'Class 8-A', 'Class 9-A'], status: 'Active', photo: getDummyAvatar('Zahid Hussain', true) },
  { id: 'T-106', name: 'Saima Khan', email: 'saima.k@eazyschool.edu.pk', phone: '0312-9876543', subject: 'Urdu', qualification: 'M.A Urdu', salary: 62000, joiningDate: '2021-08-15', assignedClasses: ['Class 6-A', 'Class 7-B', 'Class 8-C'], status: 'Active', photo: getDummyAvatar('Saima Khan', false) },
  { id: 'T-107', name: 'Syed Bilal Shah', email: 'bilal.shah@eazyschool.edu.pk', phone: '0308-5566778', subject: 'Computer Science', qualification: 'BS Computer Science (FAST-NUCES)', salary: 85000, joiningDate: '2022-02-01', assignedClasses: ['Class 8-A', 'Class 9-A', 'Class 10-A'], status: 'Active', photo: getDummyAvatar('Bilal Shah', true) },
  { id: 'T-108', name: 'Naveed Akhtar', email: 'naveed@eazyschool.edu.pk', phone: '0301-4455667', subject: 'Islamiat & Pak Studies', qualification: 'M.A Islamic Studies', salary: 60000, joiningDate: '2019-11-01', assignedClasses: ['Class 9-B', 'Class 10-A'], status: 'Active', photo: getDummyAvatar('Naveed Akhtar', true) },
  { id: 'T-109', name: 'Rabia Noreen', email: 'rabia.n@eazyschool.edu.pk', phone: '0334-2233445', subject: 'General Science', qualification: 'B.Sc / B.Ed', salary: 55000, joiningDate: '2023-01-15', assignedClasses: ['Class 5-A', 'Class 5-B'], status: 'Active', photo: getDummyAvatar('Rabia Noreen', false) },
  { id: 'T-110', name: 'Usman Ali', email: 'usman.ali@eazyschool.edu.pk', phone: '0322-1122334', subject: 'Physical Education / PTI', qualification: 'M.Sc Sports Sciences', salary: 52000, joiningDate: '2020-03-01', assignedClasses: ['All Classes'], status: 'Active', photo: getDummyAvatar('Usman Ali', true) },
  { id: 'T-111', name: 'Hina Fatima', email: 'hina.f@eazyschool.edu.pk', phone: '0305-6677889', subject: 'Art & Design', qualification: 'BFA (NCA Lahore)', salary: 58000, joiningDate: '2022-09-01', assignedClasses: ['Class 4-A', 'Class 6-B'], status: 'Active', photo: getDummyAvatar('Hina Fatima', false) },
  { id: 'T-112', name: 'Abdul Rasheed', email: 'rasheed@eazyschool.edu.pk', phone: '0315-7788990', subject: 'Social Studies', qualification: 'M.A History', salary: 56000, joiningDate: '2021-02-10', assignedClasses: ['Class 6-A', 'Class 7-A'], status: 'Active', photo: getDummyAvatar('Abdul Rasheed', true) },
  { id: 'T-113', name: 'Zainab Bibi', email: 'zainab.b@eazyschool.edu.pk', phone: '0343-8899001', subject: 'Primary English', qualification: 'B.A / Montessori Trained', salary: 48000, joiningDate: '2023-04-01', assignedClasses: ['Class 1-A', 'Class 2-A'], status: 'Active', photo: getDummyAvatar('Zainab Bibi', false) },
  { id: 'T-114', name: 'Imran Ashraf', email: 'imran.ashraf@eazyschool.edu.pk', phone: '0320-9988776', subject: 'Mathematics', qualification: 'B.Sc Mathematics & Stats', salary: 64000, joiningDate: '2021-10-15', assignedClasses: ['Class 6-B', 'Class 7-B', 'Class 8-A'], status: 'Active', photo: getDummyAvatar('Imran Ashraf', true) },
  { id: 'T-115', name: 'Mariam Jameel', email: 'mariam.j@eazyschool.edu.pk', phone: '0304-1122445', subject: 'Primary Mathematics', qualification: 'B.Sc', salary: 46000, joiningDate: '2023-08-01', assignedClasses: ['Class 3-A', 'Class 3-B'], status: 'Active', photo: getDummyAvatar('Mariam Jameel', false) },
  { id: 'T-116', name: 'Dr. Shakeel Ahmed', email: 'shakeel.a@eazyschool.edu.pk', phone: '0332-4455778', subject: 'Biology & Health', qualification: 'MBBS / Guest Lecturer', salary: 90000, joiningDate: '2016-01-10', assignedClasses: ['Class 10-A'], status: 'Active', photo: getDummyAvatar('Shakeel Ahmed', true) },
  { id: 'T-117', name: 'Nazia Tabassum', email: 'nazia.t@eazyschool.edu.pk', phone: '0313-5566889', subject: 'Arabic & Quranic Studies', qualification: 'Shahadat-ul-Almiya / M.A Arabic', salary: 50000, joiningDate: '2022-03-01', assignedClasses: ['Class 4-B', 'Class 5-A', 'Class 6-A'], status: 'Active', photo: getDummyAvatar('Nazia Tabassum', false) },
  { id: 'T-118', name: 'Hamza Ghani', email: 'hamza.g@eazyschool.edu.pk', phone: '0309-8877665', subject: 'Robotics & AI Lab', qualification: 'BS Mechatronics', salary: 78000, joiningDate: '2023-09-01', assignedClasses: ['Class 7-A', 'Class 8-A', 'Class 9-A'], status: 'Active', photo: getDummyAvatar('Hamza Ghani', true) },
  { id: 'T-119', name: 'Samina Qureshi', email: 'samina.q@eazyschool.edu.pk', phone: '0323-9900112', subject: 'Junior Science', qualification: 'B.Sc General', salary: 47000, joiningDate: '2024-01-10', assignedClasses: ['Class 2-B', 'Class 3-A'], status: 'Active', photo: getDummyAvatar('Samina Qureshi', false) },
  { id: 'T-120', name: 'Waseem Akram', email: 'waseem.a@eazyschool.edu.pk', phone: '0342-1239874', subject: 'Commerce & Economics', qualification: 'M.Com', salary: 71000, joiningDate: '2020-07-20', assignedClasses: ['Class 9-C', 'Class 10-C'], status: 'Active', photo: getDummyAvatar('Waseem Akram', true) }
];

export const initialClasses = [
  { id: 'C-1', name: 'Class 1', sections: ['A', 'B'], monthlyFee: 4500, classTeacher: 'Zainab Bibi', roomNo: 'Room 101' },
  { id: 'C-2', name: 'Class 2', sections: ['A', 'B'], monthlyFee: 4500, classTeacher: 'Samina Qureshi', roomNo: 'Room 102' },
  { id: 'C-3', name: 'Class 3', sections: ['A', 'B'], monthlyFee: 4800, classTeacher: 'Mariam Jameel', roomNo: 'Room 103' },
  { id: 'C-4', name: 'Class 4', sections: ['A', 'B'], monthlyFee: 5000, classTeacher: 'Hina Fatima', roomNo: 'Room 104' },
  { id: 'C-5', name: 'Class 5', sections: ['A', 'B'], monthlyFee: 5200, classTeacher: 'Rabia Noreen', roomNo: 'Room 105' },
  { id: 'C-6', name: 'Class 6', sections: ['A', 'B', 'C'], monthlyFee: 5500, classTeacher: 'Saima Khan', roomNo: 'Room 201' },
  { id: 'C-7', name: 'Class 7', sections: ['A', 'B', 'C'], monthlyFee: 5800, classTeacher: 'Zahid Hussain', roomNo: 'Room 202' },
  { id: 'C-8', name: 'Class 8', sections: ['A', 'B', 'C'], monthlyFee: 6200, classTeacher: 'Imran Ashraf', roomNo: 'Room 203' },
  { id: 'C-9', name: 'Class 9', sections: ['A', 'B', 'C'], monthlyFee: 7000, classTeacher: 'Muhammad Tariq', roomNo: 'Room 301' },
  { id: 'C-10', name: 'Class 10', sections: ['A', 'B', 'C'], monthlyFee: 7500, classTeacher: 'Ayesha Siddiqua', roomNo: 'Room 302' },
];

const pakistaniFirstNamesMale = [
  'Muhammad', 'Ahmed', 'Ali', 'Hamza', 'Bilal', 'Usman', 'Hassan', 'Husnain', 'Zubair', 'Danish',
  'Talha', 'Abdullah', 'Saad', 'Mustafa', 'Farhan', 'Omer', 'Zayan', 'Shahzaib', 'Rayan', 'Haris',
  'Taha', 'Subhan', 'Ayan', 'Shahmeer', 'Arham', 'Rohail', 'Rehan', 'Zeeshan', 'Adnan', 'Salman'
];

const pakistaniFirstNamesFemale = [
  'Fatima', 'Ayesha', 'Zainab', 'Khadija', 'Maryam', 'Noor', 'Anaya', 'Hoorain', 'Manahil', 'Eman',
  'Hiba', 'Laiba', 'Dua', 'Alishba', 'Aleena', 'Rameen', 'Areeba', 'Mahnoor', 'Hafsa', 'Iqra',
  'Sadia', 'Bushra', 'Kinza', 'Nabiha', 'Meerab', 'Bareera', 'Hania', 'Aima', 'Zoya', 'Sana'
];

const pakistaniLastNames = [
  'Khan', 'Malik', 'Chaudhry', 'Bhatti', 'Sheikh', 'Qureshi', 'Raza', 'Shah', 'Siddiqui', 'Abbasi',
  'Mirza', 'Butt', 'Dar', 'Ansari', 'Farooqi', 'Hashmi', 'Gillani', 'Baig', 'Tariq', 'Nawaz'
];

const fatherNames = [
  'Tariq Mehmood', 'Shahid Iqbal', 'Rashid Minhas', 'Asif Ali', 'Javed Akhtar', 'Muhammad Ashraf',
  'Naveed Anjum', 'Khalid Masood', 'Irfan Ullah', 'Nasir Hussain', 'Zia-ur-Rehman', 'Tanveer Ahmed',
  'Kamran Afzal', 'Waqar Younis', 'Munir Ahmed', 'Liaquat Ali', 'Sohail Tanvir', 'Ghulam Mustafa'
];

// Generate 160 realistic students with clean dummy avatars
export const generateInitialStudents = () => {
  const students = [];
  let rollCounter = 1001;

  const classesList = [
    { name: 'Class 1', fee: 4500, sections: ['A', 'B'] },
    { name: 'Class 2', fee: 4500, sections: ['A', 'B'] },
    { name: 'Class 3', fee: 4800, sections: ['A', 'B'] },
    { name: 'Class 4', fee: 5000, sections: ['A', 'B'] },
    { name: 'Class 5', fee: 5200, sections: ['A', 'B'] },
    { name: 'Class 6', fee: 5500, sections: ['A', 'B', 'C'] },
    { name: 'Class 7', fee: 5800, sections: ['A', 'B', 'C'] },
    { name: 'Class 8', fee: 6200, sections: ['A', 'B', 'C'] },
    { name: 'Class 9', fee: 7000, sections: ['A', 'B', 'C'] },
    { name: 'Class 10', fee: 7500, sections: ['A', 'B', 'C'] },
  ];

  let idIdx = 1;

  for (const c of classesList) {
    for (const sec of c.sections) {
      const count = (c.name === 'Class 9' || c.name === 'Class 10') ? 7 : 6;
      for (let s = 0; s < count; s++) {
        const isMale = (idIdx % 2 === 1);
        const fName = isMale
          ? pakistaniFirstNamesMale[(idIdx * 3 + s) % pakistaniFirstNamesMale.length]
          : pakistaniFirstNamesFemale[(idIdx * 5 + s) % pakistaniFirstNamesFemale.length];
        const lName = pakistaniLastNames[(idIdx * 7 + s) % pakistaniLastNames.length];
        const fullName = `${fName} ${lName}`;
        const father = fatherNames[(idIdx + s) % fatherNames.length];

        let feeStatus = 'Paid';
        let balance = 0;
        if (idIdx % 7 === 0) {
          feeStatus = 'Overdue';
          balance = c.fee * 2;
        } else if (idIdx % 5 === 0) {
          feeStatus = 'Unpaid';
          balance = c.fee;
        } else if (idIdx % 9 === 0) {
          feeStatus = 'Partial';
          balance = Math.round(c.fee * 0.4);
        }

        const student = {
          id: `STD-${idIdx.toString().padStart(4, '0')}`,
          rollNo: `RN-${rollCounter++}`,
          name: fullName,
          fatherName: father,
          gender: isMale ? 'Male' : 'Female',
          dob: `201${Math.max(0, 5 - Math.floor(idIdx / 20))}-0${(s % 9) + 1}-1${(s % 8) + 2}`,
          class: c.name,
          section: sec,
          phone: `03${(idIdx % 4) + 0}${s + 1}-${Math.floor(1000000 + Math.random() * 9000000)}`,
          whatsapp: `03${(idIdx % 4) + 0}${s + 1}-${Math.floor(1000000 + Math.random() * 9000000)}`,
          address: `House #${(idIdx * 4) % 150 + 1}, Street ${(idIdx % 12) + 1}, Sector ${(idIdx % 5) + 1}, Lahore`,
          admissionDate: `2023-04-1${(idIdx % 9)}`,
          monthlyFee: c.fee,
          feeStatus: feeStatus,
          balanceDue: balance,
          attendancePct: Math.floor(82 + ((idIdx * 13) % 18)),
          photo: getDummyAvatar(fullName, isMale)
        };

        students.push(student);
        idIdx++;
      }
    }
  }

  return students;
};
