import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Edit3, 
  Share2,
  Download,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  return (
    <div className="p-10 max-w-[1200px] mx-auto space-y-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-[#10b77f] to-emerald-400 relative">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="px-12 pb-12 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" 
                alt="Sarah Johnson" 
                className="w-44 h-44 rounded-[40px] border-8 border-white shadow-2xl object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-400 hover:text-[#10b77f] transition-all">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">TS. Sarah Johnson</h1>
                <span className="px-4 py-1.5 bg-emerald-50 text-[#10b77f] text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Đang hoạt động</span>
              </div>
              <p className="text-lg font-bold text-slate-500 mb-6">Giảng viên cao cấp • Khoa Khoa học Máy tính</p>
              
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#10b77f] text-white font-bold rounded-2xl hover:bg-[#0d9469] transition-all shadow-lg shadow-emerald-100">
                  <Edit3 className="w-5 h-5" />
                  Chỉnh sửa hồ sơ
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100">
                  <Share2 className="w-6 h-6" />
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100">
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Info */}
        <div className="space-y-10">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Thông tin liên hệ</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-sm font-bold text-slate-800">sarah.johnson@university.edu</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Số điện thoại</p>
                  <p className="text-sm font-bold text-slate-800">+84 987 654 321</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Văn phòng</p>
                  <p className="text-sm font-bold text-slate-800">Phòng 402, Tòa nhà C1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Học vấn & Bằng cấp</h3>
            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-slate-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#10b77f] ring-4 ring-emerald-50"></div>
                <p className="text-sm font-black text-slate-800 mb-1">Tiến sĩ Khoa học Máy tính</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Đại học Stanford • 2015</p>
                <p className="text-xs text-slate-500 leading-relaxed">Chuyên ngành Trí tuệ nhân tạo và Học máy.</p>
              </div>
              <div className="relative pl-8 border-l-2 border-slate-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-slate-50"></div>
                <p className="text-sm font-black text-slate-800 mb-1">Thạc sĩ Kỹ thuật Phần mềm</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Đại học Quốc gia • 2011</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Giới thiệu bản thân</h3>
            <p className="text-slate-600 leading-loose font-medium">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực nghiên cứu và giảng dạy Khoa học Máy tính, tôi tập trung vào việc phát triển các thuật toán học máy tiên tiến và ứng dụng chúng vào giải quyết các vấn đề thực tiễn. Tôi luôn nỗ lực truyền cảm hứng cho sinh viên thông qua các dự án thực tế và phương pháp giảng dạy tương tác.
            </p>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Khóa học đang giảng dạy</h3>
              <button className="text-xs font-black text-[#10b77f] uppercase tracking-widest hover:text-[#0d9469] transition-colors">Xem tất cả</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Cấu trúc Dữ liệu', code: 'CS-302', students: 45, time: 'Thứ 2, 09:00' },
                { name: 'Trí tuệ Nhân tạo', code: 'CS-405', students: 38, time: 'Thứ 4, 14:00' },
              ].map((course) => (
                <div key={course.code} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{course.code}</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Đang mở
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-4 group-hover:text-[#10b77f] transition-colors">{course.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock className="w-4 h-4" />
                      {course.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Users className="w-4 h-4" />
                      {course.students} SV
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Thành tích & Giải thưởng</h3>
            <div className="space-y-6">
              {[
                { title: 'Giảng viên xuất sắc nhất năm', year: '2023', org: 'Đại học Công nghệ' },
                { title: 'Giải thưởng Nghiên cứu Khoa học', year: '2021', org: 'Bộ Giáo dục & Đào tạo' },
              ].map((award) => (
                <div key={award.title} className="flex items-center gap-6 p-6 rounded-2xl hover:bg-slate-50 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800 mb-1">{award.title}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{award.org} • {award.year}</p>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
