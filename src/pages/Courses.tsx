import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, PlusCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import AddCourseDialog from '../components/AddCourseDialog';
import EditCourseDialog from '../components/EditCourseDialog';
import CourseDetailDeleteDialog from '../components/CourseDetailDeleteDialog';

interface Course {
  _id: string;
  courseName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  async function getAllCourses() {
    try {
      const res = await api.get("/courses");
      if (res.data.success) setCourses(res.data.data);
    } catch (error) {
      console.error("Lỗi tải danh sách khóa học:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function openEditDialog(course: Course) {
    setEditingCourse(course);
    setIsEditOpen(true);
  }

  function openDeleteDialog(id: string) {
    setSelectedCourseId(id);
    setIsDeleteOpen(true);
  }

  useEffect(() => { getAllCourses(); }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN');

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">

      <AddCourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={getAllCourses}
      />

      <EditCourseDialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingCourse(null); }}
        onSuccess={getAllCourses}
        course={editingCourse}
      />

      <CourseDetailDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedCourseId(null); }}
        courseId={selectedCourseId}
        onSuccess={getAllCourses}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Danh sách khóa học</h2>
          <p className="mt-2 text-base text-slate-500">
            Hệ thống quản lý thông tin các môn học, tín chỉ và trạng thái vận hành của các học phần trong chương trình đào tạo.
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#10b77f] hover:bg-[#0d9469] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap"
        >
          <PlusCircle className="w-6 h-6" />
          Thêm khóa học mới
        </button>
      </div>

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
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-widest border-b border-slate-100">
                <th className="px-8 py-6 sticky left-0 bg-slate-50 z-20 w-[320px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Tên khóa học</th>
                <th className="px-8 py-6 w-[380px]">Mô tả</th>
                <th className="px-8 py-6 w-[180px]">Ngày tạo</th>
                <th className="px-8 py-6 w-[180px]">Cập nhật</th>
                <th className="px-8 py-6 text-right sticky right-0 bg-slate-50 z-20 w-[140px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6 sticky left-0 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
                        <div className="h-3 w-36 bg-slate-100 rounded" />
                      </div>
                    </td>
                    <td className="px-8 py-6"><div className="h-3 w-48 bg-slate-100 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-3 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-3 w-24 bg-slate-100 rounded" /></td>
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
                    <td className="px-8 py-6 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-sm font-bold text-slate-900 truncate max-w-[220px] group-hover:text-[#10b77f] transition-colors">
                          {course.courseName}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-500 truncate max-w-[340px]">{course.description}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">{formatDate(course.createdAt)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">{formatDate(course.updatedAt)}</span>
                    </td>
                    <td className="px-8 py-6 text-right sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => openEditDialog(course)}
                          className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(course._id)}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                        >
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