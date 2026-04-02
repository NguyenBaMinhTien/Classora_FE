import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Lecturers from './pages/Lecturers';
import Courses from './pages/Courses';
import Schedules from './pages/Schedules';
import Rooms from './pages/Rooms';
import LecturerSchedule from './pages/LecturerSchedule';
import Login from './pages/Login';
import NotFound from './pages/NotFoundPage';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';


export default function App() {
  const { isAuthenticated, isLoading, logout } = useAuth(); // 👈 Thêm isLoading
  const location = useLocation();

  // 👇 Chờ check token xong, không render gì cả — tránh chớp về login
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Login />;
  }

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Bảng điều khiển';
    if (path === '/lecturers') return 'Quản lý Giảng viên';
    if (path === '/courses') return 'Quản lý Khóa học';
    if (path === '/schedule') return 'Lịch học & Giảng dạy';
    if (path === '/rooms') return 'Quản lý Phòng học';
    if (path === '/profile') return 'Hồ sơ cá nhân';
    if (path === '/edit-profile') return 'Chỉnh sửa hồ sơ';
    if (path === '/lecturer-schedule') return 'Lịch dạy của tôi';
    return 'EduAdmin';
  };

  const showSearch = ['/lecturers', '/courses'].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar onLogout={logout} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title={getTitle()} showSearch={showSearch} />

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lecturers" element={<Lecturers />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/schedule" element={<Schedules />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/lecturer-schedule" element={<LecturerSchedule />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}