import React from 'react';
import { Calendar, Clock, MapPin, BookOpen, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const mySchedule = [
    { id: '1', courseName: 'Lập trình Web nâng cao', courseCode: 'IT4440', time: '07:00 - 09:30', room: 'LAB-04', day: 'Thứ 2', date: '2024-03-25' },
    { id: '2', courseName: 'Cơ sở dữ liệu', courseCode: 'IT3080', time: '13:00 - 15:30', room: 'B-102', day: 'Thứ 2', date: '2024-03-25' },
    { id: '3', courseName: 'An toàn thông tin', courseCode: 'IT4480', time: '09:45 - 12:15', room: 'C-205', day: 'Thứ 4', date: '2024-03-27' },
    { id: '4', courseName: 'Lập trình Web nâng cao', courseCode: 'IT4440', time: '07:00 - 09:30', room: 'LAB-04', day: 'Thứ 6', date: '2024-03-29' },
];

export default function LecturerSchedule() {
    return (
        <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Lịch dạy của tôi</h2>
                    <p className="text-slate-500 max-w-3xl text-lg leading-relaxed font-medium">
                        Chào giảng viên <span className="text-[#10b77f] font-bold">Alex Rivera</span>, đây là lịch trình giảng dạy của bạn trong tuần này.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="px-4 font-bold text-slate-700">Tuần 12 (25/03 - 31/03)</div>
                    <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Số tiết dạy tuần này', value: '12', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Lớp học tiếp theo', value: 'IT4440 - 07:00', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Phòng học sắp tới', value: 'LAB-04', icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                            <div className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day, idx) => {
                    const classes = mySchedule.filter(s => s.day === day);
                    const isToday = day === 'Thứ 2'; // Mocking today as Monday

                    return (
                        <div key={day} className="space-y-4">
                            <div className={`text-center py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border ${isToday ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-white text-slate-400 border-slate-100'
                                }`}>
                                {day}
                            </div>

                            <div className="space-y-4">
                                {classes.length > 0 ? (
                                    classes.map((c) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={c.id}
                                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-[#10b77f]"
                                        >
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-black text-[#10b77f] uppercase tracking-wider">{c.courseCode}</div>
                                                <div className="font-bold text-slate-800 leading-tight group-hover:text-[#10b77f] transition-colors">{c.courseName}</div>

                                                <div className="pt-2 space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {c.time}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        Phòng {c.room}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-24 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        Trống
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* List View for Mobile/Detail */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết học phần</h3>
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#10b77f] transition-colors">
                        <Filter className="w-4 h-4" />
                        Lọc theo kỳ học
                    </button>
                </div>
                <div className="divide-y divide-slate-50">
                    {mySchedule.map((item) => (
                        <div key={item.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10b77f] group-hover:bg-[#10b77f] group-hover:text-white transition-all">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-800">{item.courseName}</div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.courseCode}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-xs font-bold text-[#10b77f] uppercase tracking-widest">Học kỳ 2023.2</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Thời gian</div>
                                    <div className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-300" />
                                        {item.day}, {item.time}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Địa điểm</div>
                                    <div className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-300" />
                                        Phòng {item.room}
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-xl hover:bg-[#10b77f] hover:text-white transition-all text-sm">
                                    Xem tài liệu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
