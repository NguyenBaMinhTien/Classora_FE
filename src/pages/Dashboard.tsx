import React, { useEffect, useState } from 'react';
import { Users, BookOpen, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: 'Giảng viên', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Khóa học', value: '0', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Phòng học', value: '0', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Lịch hôm nay', value: '0', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]);

  const getTodayStr = () => new Date().toLocaleDateString('en-CA');

  // ─── Status ─────────────────
  const getStatus = (time: string) => {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const [start, end] = time.split('-');
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (current < startMin) return 'upcoming';
    if (current >= startMin && current <= endMin) return 'current';
    return 'past';
  };

  // ─── Load data ─────────────
  async function loadData() {
    try {
      const [uRes, cRes, rRes, sRes] = await Promise.all([
        api.get('/users'),
        api.get('/courses'),
        api.get('/locations'),
        api.get('/sessions'),
      ]);

      const users = uRes.data.data || [];
      const courses = cRes.data.data || [];
      const rooms = rRes.data.data || [];
      const all = sRes.data.data || [];

      const todayStr = getTodayStr();

      const todaySessions = all
        .filter((s: any) =>
          new Date(s.session_date).toLocaleDateString('en-CA') === todayStr
        )
        .sort((a: any, b: any) => {
          const getStart = (t: string) => t.split('-')[0];
          return getStart(a.time).localeCompare(getStart(b.time));
        });

      setSessions(todaySessions);

      setStats([
        { label: 'Giảng viên', value: users.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Khóa học', value: courses.length.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Phòng học', value: rooms.length.toString(), icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Lịch hôm nay', value: todaySessions.length.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
      ]);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Lịch học hôm nay</h2>

          <button
            onClick={() => navigate('/schedule')}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            {/* Header */}
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50">
                <th className="px-8 py-4">Khóa học</th>
                <th className="px-8 py-4">Thời gian</th>
                <th className="px-8 py-4 text-center">Phòng</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-slate-400">
                    Không có lịch hôm nay
                  </td>
                </tr>
              ) : (
                sessions.map((item) => {
                  const status = getStatus(item.time);

                  return (
                    <tr
                      key={item._id}
                      className={`
                        group transition-all duration-200
                        hover:bg-slate-50 hover:scale-[1.01]

                        ${status === 'past' ? 'opacity-40' : ''}
                        ${status === 'current' ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}
                        ${status === 'upcoming' ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}
                      `}
                    >

                      {/* Course */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-[15px]">
                              {item.course?.courseName || item.courseid}
                            </span>

                            {status === 'current' && (
                              <span className="text-[10px] font-bold bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                                Đang học
                              </span>
                            )}

                            {status === 'upcoming' && (
                              <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                Sắp diễn ra
                              </span>
                            )}
                          </div>

                          <span className="text-xs text-slate-400">
                            👤 {item.user?.name || item.userid}
                          </span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-8 py-6">
                        <span className="font-semibold text-slate-700 text-sm flex items-center gap-1">
                          {item.time}
                        </span>
                      </td>

                      {/* Room */}
                      <td className="px-8 py-6 text-center">
                        <span className="
                          inline-block
                          px-3 py-1.5
                          rounded-xl
                          bg-slate-100
                          text-slate-700
                          text-xs
                          font-semibold
                          shadow-sm
                          group-hover:bg-white
                          group-hover:shadow
                          transition-all
                        ">
                          {item.location?.room_name || item.roomid}
                        </span>
                      </td>

                    </tr>
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