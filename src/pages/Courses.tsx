import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Edit2, Trash2, ChevronLeft, ChevronRight, PlusCircle, Users, Clock, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  maxStudent: number;
  duration: string;
  imgURL: string;
  startDate: string;
  endDate: string;
  numberEnroll: number;
  teacherId: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getAllCourses() {
    try {
      const res = await api.get("/courses");
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách khóa học:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllCourses();
  }, []);

  // Format tiền VNĐ
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Format ngày
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN');

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
            placeholder="Tìm kiếm tên khóa học..."
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
        <div className="overflow-x-auto [overflow-x-auto scrollbar-hide::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[overflow-x-auto scrollbar-hide::-webkit-scrollbar-thumb]:bg-slate-400">
          <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-widest border-b border-slate-100">
                <th className="px-8 py-6 sticky left-0 bg-slate-50 z-20 w-[280px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Tên khóa học</th>
                <th className="px-8 py-6 w-[160px]">Thời hạn</th>
                <th className="px-8 py-6 w-[160px]">Học phí</th>
                <th className="px-8 py-6 w-[180px]">Ngày bắt đầu</th>
                <th className="px-8 py-6 w-[180px]">Ngày kết thúc</th>
                <th className="px-8 py-6 w-[160px]">Học viên</th>
                <th className="px-8 py-6 text-right sticky right-0 bg-slate-50 z-20 w-[140px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6 sticky left-0 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-36 bg-slate-100 rounded" />
                          <div className="h-2 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-8 py-6">
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </td>
                    ))}
                    <td className="px-8 py-6 sticky right-0 bg-white" />
                  </tr>
                ))
              ) : (
                courses.map((course, i) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={course._id}
                    className="group hover:bg-slate-50/50 transition-all duration-300"
                  >
                    {/* Tên khóa học + ảnh */}
                    <td className="px-8 py-6 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-4">
                        {/* <img
                          src={course.imgURL || 'https://placehold.co/48x48/e2e8f0/94a3b8?text=📚'}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e2e8f0/94a3b8?text=📚';
                          }}
                        /> */}
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate max-w-[180px] group-hover:text-[#10b77f] transition-colors">
                            {course.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px] mt-0.5">
                            {course.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Thời hạn */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        {course.duration}
                      </div>
                    </td>

                    {/* Học phí */}
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-emerald-600">
                        {formatPrice(course.price)}
                      </span>
                    </td>

                    {/* Ngày bắt đầu */}
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">{formatDate(course.startDate)}</span>
                    </td>

                    {/* Ngày kết thúc */}
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">{formatDate(course.endDate)}</span>
                    </td>

                    {/* Học viên / Max */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-slate-900">{course.numberEnroll}</span>
                          <span className="text-xs text-slate-400">/{course.maxStudent}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min((course.numberEnroll / course.maxStudent) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="px-8 py-6 text-right sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button className="p-2.5 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-[#10b77f] transition-all border border-transparent hover:border-emerald-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-10 py-7 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-6 bg-slate-50/30">
          <p className="text-sm text-slate-500 font-semibold">
            Hiển thị <span className="text-slate-900 font-bold">1–{courses.length}</span> của <span className="text-slate-900 font-bold">{courses.length}</span> khóa học
          </p>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-400 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#10b77f] text-white font-bold shadow-lg shadow-emerald-100 hover:scale-105 transition-transform">1</button>
            <button className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white text-slate-400 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}