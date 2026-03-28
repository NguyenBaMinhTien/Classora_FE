import React from 'react';
import { Search, Filter, Download, Edit2, Trash2, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { courses } from '../data';
import { motion } from 'motion/react';

export default function Courses() {
  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Danh sách khóa học</h2>
          <p className="text-slate-500 max-w-3xl text-lg leading-relaxed font-medium">
            Hệ thống quản lý thông tin các môn học, tín chỉ và trạng thái vận hành của các học phần trong chương trình đào tạo.
          </p>
        </div>
        <button className="bg-[#10b77f] hover:bg-[#0d9469] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap">
          <PlusCircle className="w-6 h-6" />
          Thêm khóa học mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10b77f] transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã môn hoặc tên môn học..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium outline-none"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-7 py-4 bg-white rounded-2xl flex items-center justify-center gap-2 text-slate-700 font-bold hover:bg-slate-50 transition-all border border-slate-100 shadow-sm hover:shadow-md">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </button>
          <button className="flex-1 md:flex-none px-7 py-4 bg-white rounded-2xl flex items-center justify-center gap-2 text-slate-700 font-bold hover:bg-slate-50 transition-all border border-slate-100 shadow-sm hover:shadow-md">
            <Download className="w-5 h-5" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-widest border-b border-slate-100">
                <th className="px-10 py-6 sticky left-0 bg-slate-50 z-20 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Mã môn học</th>
                <th className="px-10 py-6 w-[350px]">Tên môn học</th>
                <th className="px-10 py-6 w-[180px]">Số tín chỉ</th>
                <th className="px-10 py-6 w-[200px]">Trạng thái</th>
                <th className="px-10 py-6 text-right sticky right-0 bg-slate-50 z-20 w-[170px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {courses.map((course, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={course.id} 
                  className="group hover:bg-slate-50/50 transition-all duration-300"
                >
                  <td className="px-10 py-6 font-bold text-slate-900 group-hover:text-[#10b77f] transition-colors sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{course.code}</td>
                  <td className="px-10 py-6 text-slate-600 truncate">{course.name}</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wide border border-transparent group-hover:border-slate-200 transition-all">
                      {course.credits} tín chỉ
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 py-2 px-5 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all ${
                      course.status === 'Đang mở' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : course.status === 'Tạm dừng'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        course.status === 'Đang mở' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                      }`}></span>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-3 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-[#10b77f] transition-all border border-transparent hover:border-emerald-100">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-10 py-7 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-6 bg-slate-50/30">
          <p className="text-sm text-slate-500 font-semibold">
            Hiển thị <span className="text-slate-900 font-bold">1-5</span> của <span className="text-slate-900 font-bold">24</span> khóa học
          </p>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-400 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#10b77f] text-white font-bold shadow-lg shadow-emerald-100 hover:scale-105 transition-transform">1</button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-700 font-bold transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">2</button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-700 font-bold transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">3</button>
            <span className="px-2 text-slate-400 font-bold">...</span>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-700 font-bold transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">5</button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-400 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
