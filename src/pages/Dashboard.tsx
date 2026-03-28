import React from 'react';
import { Users, BookOpen, MapPin, Clock, ArrowRight, Plus, Edit3, UserPlus, CheckCircle } from 'lucide-react';
import { activities } from '../data';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Giảng viên', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Khóa học', value: '128', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Phòng học', value: '15', subValue: '/24', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Lịch sắp diễn ra', value: '32', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);

  // 👉 Format date về YYYY-MM-DD để so sánh
  const formatDateOnly = (date: string) =>
    new Date(date).toISOString().split('T')[0];

  // 👉 Lấy hôm nay
  const today = new Date().toISOString().split('T')[0];

  async function getAllSessions() {
    try {
      const res = await api.get('/sessions');
      console.log(res.data.data);

      const allSessions = res.data.data;

      // // ✅ FILTER chỉ lấy hôm nay
      // const now = new Date();

      // // 👉 ngày hiện tại (reset về 00:00)
      // const start = new Date(now.setHours(0, 0, 0, 0));

      // // 👉 ngày sau 30 ngày
      // const end = new Date();
      // end.setDate(start.getDate() + 30);

      // // ✅ filter trong khoảng 30 ngày tới
      // const upcomingSessions = allSessions.filter((item: any) => {
      //   const sessionDate = new Date(item.sessionDate);
      //   return sessionDate >= start && sessionDate <= end;
      // });

      // setSessions(upcomingSessions);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllSessions();
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 transition-all duration-300 group cursor-default"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">
              {stat.value}
              {stat.subValue && <span className="text-lg font-medium text-slate-300">{stat.subValue}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Lịch học sắp diễn ra</h2>
              <button onClick={() => navigate('/schedule')} className="cursor-pointer text-sm font-bold text-[#10b77f] hover:text-[#0d9469] flex items-center gap-1.5 group transition-all">
                Xem Toàn bộ
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[600px] table-fixed">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                    <th className="px-8 py-6 bg-slate-50/80 w-[45%] rounded-tl-2xl">Khóa học</th>
                    <th className="px-8 py-6 w-[35%]">Thời gian</th>
                    <th className="px-8 py-6 text-center w-[20%]">Phòng</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-slate-400">
                        Không có lịch hôm nay
                      </td>
                    </tr>
                  ) : (
                    sessions.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">

                        {/* Course */}
                        <td className="px-8 py-9">
                          <div className="font-extrabold text-slate-800 group-hover:text-[#10b77f] transition-colors truncate text-[17px] leading-tight">
                            {item.courseId}
                          </div>
                          <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-2">
                            {new Date(item.sessionDate).toLocaleDateString('vi-VN')}
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-8 py-9 text-[15px] font-bold text-slate-600 truncate">
                          {item.startTime} - {item.endTime}
                        </td>

                        {/* Room */}
                        <td className="px-8 py-9">
                          <div className="flex justify-center">
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[11px] font-black text-slate-700 flex flex-col items-center leading-none shadow-sm group-hover:bg-white transition-all group-hover:shadow-md">
                              <span className="text-[13px]">{item.roomId}</span>
                            </div>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-7 py-7 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Hoạt động Gần đây</h2>
            </div>

            <div className="p-8 flex-1 space-y-10">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 group cursor-default">
                  <div className="shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${activity.type === 'course' ? 'bg-blue-50 text-blue-600' :
                      activity.type === 'schedule' ? 'bg-orange-50 text-orange-600' :
                        activity.type === 'lecturer' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-purple-50 text-purple-600'
                      }`}>
                      {activity.type === 'course' && <Plus className="w-5 h-5" />}
                      {activity.type === 'schedule' && <Edit3 className="w-5 h-5" />}
                      {activity.type === 'lecturer' && <UserPlus className="w-5 h-5" />}
                      {activity.type === 'maintenance' && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] leading-relaxed text-slate-600">
                      <span className="font-bold text-slate-800">{activity.title}:</span> {activity.description}
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 mt-1.5 uppercase tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-50">
              <button className="w-full py-3 text-center text-[11px] font-bold text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-all bg-white border border-slate-100 rounded-xl hover:shadow-md">
                Xem toàn bộ nhật ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}