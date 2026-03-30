import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  DoorOpen,
  LogOut,
  SquareUser
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Sidebar() {
  const { logout, role } = useAuth();

  const allMenuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, path: '/dashboard', roles: ['admin'] },          // ❌ Bỏ teacher
    { id: 'lecturers', label: 'Giảng viên', icon: Users, path: '/lecturers', roles: ['admin'] },
    { id: 'courses', label: 'Khóa học', icon: BookOpen, path: '/courses', roles: ['admin'] },
    { id: 'schedule', label: 'Lịch học', icon: CalendarDays, path: '/schedule', roles: ['admin', 'teacher'] }, // ✅ Thêm teacher
    { id: 'rooms', label: 'Phòng học', icon: DoorOpen, path: '/rooms', roles: ['admin'] },
    { id: 'lecturer-schedule', label: 'Lịch dạy của tôi', icon: CalendarDays, path: '/lecturer-schedule', roles: ['teacher'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role ?? ''));

  const handleLogout = () => logout();

  const displayName =
    role === 'admin' ? 'Quản trị viên' :
      role === 'teacher' ? 'Giảng viên' : 'Người dùng';

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">

      <NavLink to="/dashboard" className="p-8 flex items-center gap-3 hover:opacity-90 transition">
        <div className="w-15 h-15 rounded-xl overflow-hidden shadow-lg">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">Classora</span>
      </NavLink>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-emerald-50 text-[#10b77f] font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#10b77f]' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-5 bg-[#10b77f] rounded-full" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm ${role === 'admin' ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <SquareUser className={`w-5 h-5 ${role === 'admin' ? 'text-red-600' : 'text-emerald-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}