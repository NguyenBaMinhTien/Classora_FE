import React, { useEffect, useState } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export default function LecturerSchedule() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [weekOffset, setWeekOffset] = useState(0); // 👈 0 = tuần hiện tại, -1 = tuần trước, +1 = tuần sau

    // =========================
    // 👉 LẤY USER ID TỪ TOKEN
    // =========================
    const getCurrentUserId = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.id || decoded._id || decoded.userId;
        } catch {
            return null;
        }
    };

    // =========================
    // 👉 LẤY NGÀY TRONG TUẦN (theo offset)
    // =========================
    const getWeekDays = (offset: number) => {
        const today = new Date();
        // Ngày đầu tuần (Thứ 2) của tuần hiện tại + offset tuần
        const monday = new Date(today);
        const dayOfWeek = today.getDay(); // 0=CN, 1=T2...
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(today.getDate() + diffToMonday + offset * 7);
        monday.setHours(0, 0, 0, 0);

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays(weekOffset);

    // Label tuần hiển thị
    const weekLabel = (() => {
        const first = weekDays[0];
        const last = weekDays[6];
        const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        if (weekOffset === 0) return `Tuần này (${fmt(first)} - ${fmt(last)})`;
        if (weekOffset === -1) return `Tuần trước (${fmt(first)} - ${fmt(last)})`;
        if (weekOffset === 1) return `Tuần sau (${fmt(first)} - ${fmt(last)})`;
        return `${fmt(first)} - ${fmt(last)}`;
    })();

    const getDayName = (date: Date) => {
        const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return days[date.getDay()];
    };

    // =========================
    // 👉 LOAD + FILTER DATA
    // =========================
    async function loadSessions() {
        try {
            const res = await api.get('/sessions');
            if (res.data.success) {
                const raw = res.data.data;
                const currentUserId = getCurrentUserId();

                const mapped = raw
                    .filter((s: any) => {
                        const userId = s.user?._id || s.user?.id || s.userid;
                        return userId === currentUserId;
                    })
                    .map((s: any) => ({
                        _id: s._id,
                        session_date: s.session_date,
                        time: s.time,
                        courseName: s.course?.courseName ?? s.courseid,
                        userName: s.user?.name ?? s.userid,
                        roomName: s.location?.room_name ?? s.roomid,
                    }));

                setSessions(mapped);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadSessions();
    }, []);

    // =========================
    // 👉 FILTER THEO NGÀY (dùng local time)
    // =========================
    const getSessionsByDate = (date: Date) => {
        return sessions
            .filter((s: any) => {
                const d = new Date(s.session_date); // local time
                return (
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                );
            })
            .sort((a: any, b: any) => {
                // Sort theo thứ tự khung giờ
                const order = ['07:00-09:00', '09:00-11:00', '13:00-15:00', '15:00-17:00'];
                return order.indexOf(a.time) - order.indexOf(b.time);
            });
    };

    const isToday = (date: Date) => new Date().toDateString() === date.toDateString();

    // =========================
    // 👉 UI
    // =========================
    return (
        <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Lịch dạy của tôi</h2>
                    <p className="mt-2 text-base text-slate-500">Lịch giảng dạy theo tuần</p>
                </div>

                {/* Week navigator */}
                <div className="flex items-center gap-3 bg-white px-2 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => setWeekOffset(w => w - 1)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </button>

                    <span className="px-4 font-bold text-slate-700 text-sm min-w-[260px] text-center">
                        {weekLabel}
                    </span>

                    <button
                        onClick={() => setWeekOffset(w => w + 1)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>

                    {/* Reset về tuần hiện tại */}
                    {weekOffset !== 0 && (
                        <button
                            onClick={() => setWeekOffset(0)}
                            className="ml-1 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-100"
                        >
                            Hôm nay
                        </button>
                    )}
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {weekDays.map((date, idx) => {
                    const daySessions = getSessionsByDate(date);
                    const today = isToday(date);

                    return (
                        <div key={idx} className="space-y-3">

                            {/* DAY HEADER */}
                            <div className={`text-center py-3 px-2 rounded-xl border transition-all
                                ${today
                                    ? 'bg-[#10b77f] text-white border-[#10b77f] shadow-md shadow-emerald-500/20'
                                    : 'bg-white text-slate-400 border-slate-100'
                                }`}>
                                <div className="text-[11px] font-black uppercase tracking-widest">
                                    {getDayName(date)}
                                </div>
                                <div className={`text-lg font-black mt-0.5 ${today ? 'text-white' : 'text-slate-700'}`}>
                                    {date.getDate()}
                                </div>
                                <div className={`text-[10px] font-semibold ${today ? 'text-emerald-100' : 'text-slate-300'}`}>
                                    {date.getMonth() + 1}/{date.getFullYear()}
                                </div>
                            </div>

                            {/* SESSIONS */}
                            <div className="space-y-3">
                                {daySessions.length > 0 ? (
                                    daySessions.map((item: any) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-emerald-500"
                                        >
                                            <div className="space-y-2">
                                                <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors leading-tight">
                                                    {item.courseName}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.time}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.roomName}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-20 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-[11px] text-slate-300 font-bold">
                                        Trống
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}