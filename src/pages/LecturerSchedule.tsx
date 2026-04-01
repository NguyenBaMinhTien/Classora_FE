import React, { useEffect, useState } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export default function LecturerSchedule() {
    const [sessions, setSessions] = useState<any[]>([]);

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
    // 👉 LẤY NGÀY TRONG TUẦN
    // =========================
    const getWeekDays = () => {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(first + i);
            return d;
        });
    };

    const weekDays = getWeekDays();

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

                console.log('Current User:', currentUserId);
                console.log('Raw:', raw);

                const mapped = raw
                    // ✅ FILTER CHỈ GIẢNG VIÊN HIỆN TẠI
                    .filter((s: any) => {
                        const userId = s.user?._id || s.user?.id || s.userid;
                        return userId === currentUserId;
                    })
                    // ✅ MAP DATA
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
            console.log(err);
        }
    }

    useEffect(() => {
        loadSessions();
    }, []);

    // =========================
    // 👉 FILTER THEO NGÀY
    // =========================
    const getSessionsByDate = (date: Date) => {
        return sessions.filter((s: any) => {
            const d = new Date(s.session_date);

            return (
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
            );
        });
    };

    // =========================
    // 👉 UI
    // =========================
    return (
        <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900">
                        Lịch dạy của tôi
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Lịch giảng dạy trong tuần hiện tại
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="p-3 hover:bg-slate-50 rounded-xl">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </button>

                    <div className="px-4 font-bold text-slate-700">
                        Tuần hiện tại
                    </div>

                    <button className="p-3 hover:bg-slate-50 rounded-xl">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {weekDays.map((date, idx) => {
                    const daySessions = getSessionsByDate(date);
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                        <div key={idx} className="space-y-4">

                            {/* DAY HEADER */}
                            <div className={`text-center py-3 rounded-xl font-black text-[11px] border
                                ${isToday
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow'
                                    : 'bg-white text-slate-400 border-slate-100'
                                }`}>
                                {getDayName(date)}
                            </div>

                            {/* SESSIONS */}
                            <div className="space-y-4">
                                {daySessions.length > 0 ? (
                                    daySessions.map((item: any) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-emerald-500"
                                        >
                                            <div className="space-y-3">

                                                {/* COURSE */}
                                                <div className="font-bold text-slate-800 group-hover:text-emerald-600">
                                                    {item.courseName}
                                                </div>

                                                {/* TEACHER */}
                                                <div className="text-xs text-slate-400">
                                                    👤 {item.userName}
                                                </div>

                                                {/* TIME */}
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                                    <Clock className="w-4 h-4" />
                                                    {item.time}
                                                </div>

                                                {/* ROOM */}
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                                    <MapPin className="w-4 h-4" />
                                                    {item.roomName}
                                                </div>

                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-24 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-xs text-slate-300 font-bold">
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