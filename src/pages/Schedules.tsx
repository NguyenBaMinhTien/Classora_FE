import React from 'react';
import { 
  Calendar, 
  ChevronRight, 
  FileDown, 
  Plus, 
  Search, 
  Bell, 
  Settings,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  Users,
  DoorOpen,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Schedules() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            <span>Quản lý</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#10b77f]">Lịch học</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Quản lý lịch học</h1>
          <p className="text-slate-500 font-medium">Phân bổ giảng viên và phòng học tối ưu cho học kỳ mới.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
            <FileDown className="w-5 h-5" />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#10b77f] text-white font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 transition-all">
            <Plus className="w-5 h-5" />
            Tạo lịch mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Học kỳ</span>
          <select className="border-none bg-transparent focus:ring-0 text-sm font-bold p-0 min-w-[180px] cursor-pointer outline-none">
            <option>Học kỳ I 2023-2024</option>
            <option>Học kỳ II 2023-2024</option>
          </select>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Khoa</span>
          <select className="border-none bg-transparent focus:ring-0 text-sm font-bold p-0 min-w-[200px] cursor-pointer outline-none">
            <option>Công nghệ thông tin</option>
            <option>Kinh tế đối ngoại</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Create Schedule Form */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm sticky top-28 transition-all hover:shadow-md">
            <h3 className="text-xl font-extrabold mb-8 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#10b77f]">
                <Calendar className="w-6 h-6" />
              </span>
              Thiết lập lịch mới
            </h3>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2.5 px-1 tracking-wider group-focus-within:text-[#10b77f] transition-colors">Lớp học</label>
                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none">
                  <option>Chọn lớp học</option>
                  <option>D20CNTT01 - Kỹ thuật phần mềm</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2.5 px-1 tracking-wider group-focus-within:text-[#10b77f] transition-colors">Giảng viên</label>
                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none">
                  <option>Chọn giảng viên</option>
                  <option>ThS. Nguyễn Văn A</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2.5 px-1 tracking-wider group-focus-within:text-[#10b77f] transition-colors">Phòng học</label>
                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none">
                  <option>Chọn phòng học</option>
                  <option>Phòng 201 - Nhà A1</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2.5 px-1 tracking-wider group-focus-within:text-[#10b77f] transition-colors">Thứ</label>
                  <select className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none">
                    <option>Thứ 2</option>
                    <option>Thứ 3</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2.5 px-1 tracking-wider group-focus-within:text-[#10b77f] transition-colors">Ca học</label>
                  <select className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none">
                    <option>07:00 - 09:00</option>
                    <option>09:15 - 11:15</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 transition-all mt-4">
                Thêm vào thời khóa biểu
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Preview Table */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="p-8 px-10 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-800">Lịch tuần hiện tại</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b77f] animate-pulse"></span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Tiết hiện tại</span>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white shadow-sm text-[#10b77f] transition-all">Tuần này</button>
                  <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Tuần sau</button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full border-collapse min-w-[1200px] table-fixed">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 sticky left-0 bg-slate-50 z-20 w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Thời gian</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-100 w-[260px]">Thứ 2</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-100 w-[260px]">Thứ 3</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-100 w-[260px]">Thứ 4</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-100 w-[260px]">Thứ 5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="px-8 py-10 whitespace-nowrap text-xs font-bold text-slate-400 bg-slate-50/20 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">07:00 - 09:00</td>
                    <td className="px-4 py-4">
                      <div className="bg-emerald-50 border-l-4 border-[#10b77f] p-5 rounded-2xl group hover:shadow-md hover:translate-y-[-4px] transition-all cursor-pointer">
                        <p className="text-[10px] font-black text-[#10b77f] mb-1.5 uppercase tracking-wider">D20CNTT01</p>
                        <p className="text-base font-extrabold text-slate-800 leading-tight mb-3">Cấu trúc dữ liệu</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <User className="w-3.5 h-3.5" />
                            ThS. Nguyễn Văn A
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            P.201
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4">
                      <div className="bg-slate-50 border-l-4 border-slate-300 p-5 rounded-2xl group hover:shadow-md hover:translate-y-[-4px] transition-all cursor-pointer">
                        <p className="text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">D20CNTT02</p>
                        <p className="text-base font-extrabold text-slate-800 leading-tight mb-3">Mạng máy tính</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <User className="w-3.5 h-3.5" />
                            TS. Trần Thị B
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            P.405
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Management Summary Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Tổng số lớp', value: '124', icon: BookOpen },
          { label: 'Giảng viên', value: '86', icon: Users },
          { label: 'Phòng trống', value: '12', icon: DoorOpen },
          { label: 'Trùng lịch', value: '0', icon: AlertTriangle },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={item.label} 
            className="bg-white p-10 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-[#10b77f]">
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{item.label}</p>
              <p className="text-3xl font-black text-slate-800">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
