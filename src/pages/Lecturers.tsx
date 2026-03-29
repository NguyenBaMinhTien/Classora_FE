import React, { useEffect, useState } from 'react';
import { Search, User, UserPlus, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import AddLecturerDialog from '../components/AddLecturerDialog';
import ViewLecturerDialog from '../components/ViewLecturerDialog';
import EditLecturerDialog from '../components/EditLecturerDialog'; // 👈 Thêm
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import toast from 'react-hot-toast';

interface Lecturer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Lecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // 👇 Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function getAllLectures() {
    try {
      const res = await api.get("/users");
      if (res.data.success) {
        setLecturers(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách giảng viên:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getLecturerById(id: string) {
    try {
      const res = await api.get(`/users/${id}`);
      console.log(res.data.data);
      if (res.data.success) {
        const data = res.data.data;
        setSelectedLecturer({
          name: data.name,
          email: data.email,
          phone: data.phone || data.phoneNumber,
          avatar: null,
          role: data.role,
          createdAt: data.createdAt
        });
        setIsViewOpen(true);
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết giảng viên:", error);
    }
  }

  // 👇 Mở Edit dialog với lecturer được chọn
  function openEditDialog(lecturer: Lecturer) {
    setEditingLecturer(lecturer);
    setIsEditOpen(true);
  }

  function openDeleteDialog(id: string) {
    setSelectedId(id);
    setIsDeleteOpen(true);
  }

  async function handleDelete() {
    if (!selectedId) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/users/${selectedId}`);
      if (res.data.success) {
        setLecturers(prev => prev.filter(l => l._id !== selectedId));
        toast.success("Xóa giảng viên thành công");
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Xóa thất bại");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    getAllLectures();
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">

      <AddLecturerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={getAllLectures}
      />

      <ViewLecturerDialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        lecturer={selectedLecturer}
      />

      {/* 👇 EditLecturerDialog */}
      <EditLecturerDialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingLecturer(null); }}
        onSuccess={getAllLectures}
        lecturer={editingLecturer}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Giảng viên</h1>
          <p className="mt-2 text-base text-slate-500">Danh sách đầy đủ tất cả giảng viên, đơn vị trực thuộc và trạng thái tài khoản.</p>
        </div>
        <div className="mt-6 sm:mt-0 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-emerald-100 text-white bg-[#10b77f] hover:bg-[#0d9469] transition-all"
          >
            <UserPlus className="-ml-1 mr-2 h-5 w-5" />
            Thêm Giảng viên Mới
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[
          { label: 'Tổng số Giảng viên', value: lecturers.length.toString(), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Tài khoản Hoạt động', value: lecturers.filter(l => l.role === 'teacher').length.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bg} rounded-xl p-3.5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</dt>
                <dd className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</dd>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm border border-slate-100 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none h-full w-10 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email"
              className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b77f] sm:text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full divide-y divide-slate-100 min-w-[1100px] table-fixed">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-widest sticky left-0 bg-slate-50 z-20 w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Họ tên</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-widest w-[250px]">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-widest w-[180px]">Số điện thoại</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-widest w-[180px]">Vai trò</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-widest sticky right-0 bg-slate-50 z-20 w-[150px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-slate-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5 sticky left-0 bg-white"></td>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5 sticky right-0 bg-white" />
                  </tr>
                ))
              ) : (
                lecturers.map((lecturer, i) => (
                  <motion.tr
                    key={lecturer._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {lecturer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{lecturer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-600 truncate">{lecturer.email}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lecturer.phoneNumber || lecturer.phone}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {lecturer.role === 'teacher' ? 'Giảng viên' : lecturer.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => getLecturerById(lecturer._id)}
                          className="p-2 text-slate-400 hover:text-[#10b77f] hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <User className="h-4 w-4" />
                        </button>

                        {/* 👇 Click Edit → openEditDialog */}
                        <button
                          onClick={() => openEditDialog(lecturer)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => openDeleteDialog(lecturer._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}