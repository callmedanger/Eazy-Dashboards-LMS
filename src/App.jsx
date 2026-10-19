import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SchoolProvider } from './context/SchoolContext';
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { StudentDetails } from './pages/StudentDetails';
import { Classes } from './pages/Classes';
import { Teachers } from './pages/Teachers';
import { TeacherDetails } from './pages/TeacherDetails';
import { Fees } from './pages/Fees';
import { Attendance } from './pages/Attendance';
import { Timetable } from './pages/Timetable';
import { Exams } from './pages/Exams';
import { Expenses } from './pages/Expenses';
import { Payroll } from './pages/Payroll';
import { Admissions } from './pages/Admissions';
import { Notices } from './pages/Notices';
import { Events } from './pages/Events';
import { Uploads } from './pages/Uploads';
import { Analytics } from './pages/Analytics';
import { AdminProfile } from './pages/AdminProfile';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SchoolProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#0B2A5B',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#ffffff',
                  },
                }
              }}
            />
            <Routes>
              {/* Public Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Main Admin Dashboard Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="students/:id" element={<StudentDetails />} />
                <Route path="classes" element={<Classes />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="teachers/:id" element={<TeacherDetails />} />
                <Route path="fees" element={<Fees />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="timetable" element={<Timetable />} />
                <Route path="exams" element={<Exams />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="notices" element={<Notices />} />
                <Route path="events" element={<Events />} />
                <Route path="documents" element={<Uploads />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SchoolProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
