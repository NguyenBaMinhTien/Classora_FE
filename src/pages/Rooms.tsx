import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Users, Monitor, Wind, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('/locations');
        if (response.data.success) {
          const mappedRooms = response.data.data.map((item: any) => ({
            id: item._id,
            name: item.room_name,
            type: 'Phòng học',
            capacity: 0,
            building: item.location,
            status: 'Trống',
            facilities: []
          }));
          setRooms(mappedRooms);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Quản lý Phòng học</h2>
          <p className="text-slate-500 max-w-3xl text-lg leading-relaxed font-medium">
            Theo dõi tình trạng sử dụng, cơ sở vật chất và lịch trình của các phòng học trong toàn khuôn viên trường.
          </p>
        </div>
        <button className="bg-[#10b77f] hover:bg-[#0d9469] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap">
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
                <th className="px-10 py-6 w-[200px]">Tên Phòng</th>
                <th className="px-10 py-6 w-[250px]">Loại Phòng</th>
                <th className="px-10 py-6 w-[150px]">Sức chứa</th>
                <th className="px-10 py-6 w-[200px]">Trạng thái</th>
                <th className="px-10 py-6 w-[200px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[#10b77f] animate-spin mx-auto" />
                    <p className="text-slate-500 mt-4 font-bold">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-500 font-bold">
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
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{room.building}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-slate-700 font-bold">{room.type}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {room.facilities.length > 0 ? room.facilities.map((f: string) => (
                            <span key={f} className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">
                              {f}
                            </span>
                          )) : (
                            <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">
                              Chưa có
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                          <Users className="w-4 h-4 text-slate-300" />
                          {room.capacity} chỗ
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 py-2 px-5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${room.status === 'Trống'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : room.status === 'Đang sử dụng'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${room.status === 'Trống' ? 'bg-emerald-600 animate-pulse' :
                            room.status === 'Đang sử dụng' ? 'bg-blue-600' : 'bg-orange-400'
                            }`}></span>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
