import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import LocationDialog from '../components/LocationDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import toast from 'react-hot-toast';

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/locations');
      if (response.data.success) {
        const mappedRooms = response.data.data.map((item: any) => ({
          id: item._id,
          name: item.room_name,
          location: item.location
        }));
        setRooms(mappedRooms);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Lỗi khi tải danh sách phòng học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = () => {
    setDialogData(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (roomId: string) => {
    try {
      const response = await api.get(`/locations/${roomId}`);
      if (response.data.success) {
        setDialogData({
          id: response.data.data._id,
          room_name: response.data.data.room_name,
          location: response.data.data.location
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      toast.error('Không thể tải thông tin phòng học');
    }
  };

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(`/locations/${roomToDelete}`);
      if (response.data.success) {
        toast.success('Xóa phòng học thành công');
        setIsDeleteDialogOpen(false);
        setRoomToDelete(null);
        fetchLocations();
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Không thể xóa phòng học này');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Phòng học</h2>
          <p className="mt-2 text-base text-slate-500">
            Theo dõi tình trạng sử dụng, cơ sở vật chất và lịch trình của các phòng học trong toàn khuôn viên trường.
          </p>
        </div>
        <button onClick={handleCreate} className="bg-[#10b77f] hover:bg-[#0d9469] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap">
          <Plus className="w-6 h-6" />
          Thêm phòng mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10b77f] transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm tên phòng, tòa nhà..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium outline-none"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="px-6 py-4 bg-slate-50 border-transparent rounded-2xl text-slate-700 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all">
            <option>Tất cả Tòa nhà</option>
            <option>Nhà A</option>
            <option>Nhà B</option>
            <option>Nhà C</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6 w-[350px]">Tên Phòng</th>
                <th className="px-10 py-6">Vị trí</th>
                <th className="px-10 py-6 w-[200px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[#10b77f] animate-spin mx-auto" />
                    <p className="text-slate-500 mt-4 font-bold">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center text-slate-500 font-bold">
                    Không có dữ liệu phòng học.
                  </td>
                </tr>
              ) : (
                rooms.map((room, i) => {
                  const nameParts = room.name.includes('-')
                    ? room.name.split('-')
                    : room.name.includes(' ')
                      ? room.name.split(' ')
                      : [room.name.substring(0, 3), room.name.substring(3)];

                  const prefix = nameParts[0] + (room.name.includes('-') ? '-' : '');
                  const suffix = nameParts.slice(1).join(room.name.includes('-') ? '-' : ' ');

                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={room.id}
                      className="group hover:bg-slate-50/50 transition-all duration-300"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-black text-slate-700 flex flex-col items-center justify-center leading-tight shadow-sm group-hover:bg-white transition-colors min-w-[50px] min-h-[40px]">
                            <span className="opacity-50">{prefix}</span>
                            <span>{suffix}</span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-lg">{room.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <MapPin className="w-4 h-4 text-[#10b77f]" />
                          {room.location}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => handleEdit(room.id)} className="p-3 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-[#10b77f] transition-all border border-transparent hover:border-emerald-100">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteClick(room.id)} className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LocationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchLocations}
        initialData={dialogData}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa phòng học"
        message="Bạn có chắc chắn muốn xóa phòng học này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
