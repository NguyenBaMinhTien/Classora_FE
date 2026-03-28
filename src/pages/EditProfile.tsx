import React from 'react';
import { 
  Camera, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function EditProfile() {
  return (
    <div className="p-10 max-w-[1000px] mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chỉnh sửa hồ sơ</h1>
          <p className="text-slate-500 font-medium mt-1">Cập nhật thông tin cá nhân và chuyên môn của bạn.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Hủy bỏ</button>
          <button className="px-8 py-3 rounded-2xl bg-[#10b77f] text-white font-black shadow-lg shadow-emerald-100 hover:bg-[#0d9469] transition-all flex items-center gap-2">
            <Save className="w-5 h-5" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Avatar Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm text-center sticky top-28">
            <div className="relative inline-block group">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" 
                alt="Sarah Johnson" 
                className="w-48 h-48 rounded-[40px] object-cover border-8 border-slate-50 group-hover:opacity-80 transition-all"
              />
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#10b77f]">
                  <Camera className="w-7 h-7" />
                </div>
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-6 mb-2">TS. Sarah Johnson</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Giảng viên cao cấp</p>
            
            <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
              <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all">Thay đổi ảnh đại diện</button>
              <button className="w-full py-4 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all">Gỡ bỏ ảnh</button>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <User className="w-5 h-5 text-[#10b77f]" />
              Thông tin cơ bản
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Họ và tên</label>
                <input 
                  type="text" 
                  defaultValue="Sarah Johnson"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Học hàm/Học vị</label>
                <input 
                  type="text" 
                  defaultValue="Tiến sĩ"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Email công vụ</label>
                <input 
                  type="email" 
                  defaultValue="sarah.johnson@university.edu"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[#10b77f]" />
              Thông tin chuyên môn
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Khoa/Phòng ban</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800">
                  <option>Khoa Khoa học Máy tính</option>
                  <option>Khoa Kỹ thuật</option>
                  <option>Khoa Toán học</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Giới thiệu ngắn</label>
                <textarea 
                  rows={4}
                  defaultValue="Với hơn 10 năm kinh nghiệm trong lĩnh vực nghiên cứu và giảng dạy Khoa học Máy tính..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#10b77f]" />
              Thông tin liên hệ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Số điện thoại</label>
                <input 
                  type="text" 
                  defaultValue="+84 987 654 321"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Văn phòng làm việc</label>
                <input 
                  type="text" 
                  defaultValue="Phòng 402, Tòa nhà C1"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10b77f] transition-all outline-none font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
