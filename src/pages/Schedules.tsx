import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, FileDown,
  Edit2, Trash2, X, Clock, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────
interface Session {
  _id: string;
  session_date: string;
  time: string;
  roomid: string;
  courseid: string;
  userid: string;
  // 👇 Populated fields từ GET /sessions
  location?: { room_name: string; location: string; };
  course?: { courseName: string; description: string; };
  user?: { name: string; };
  createdAt?: string;
  updatedAt?: string;
}

interface ScheduleEvent {
  _id: string;
  session_date: string;
  time: string;
  roomid: string;
  courseid: string;
  userid: string;
  // display helpers (resolved from lookups)
  courseName?: string;
  roomName?: string;
  userName?: string;
  color: 'emerald' | 'blue' | 'violet' | 'orange';
}

interface Course { _id: string; courseName: string; }
interface Room { _id: string; room_name: string; location: string; }
interface Teacher { _id: string; name: string; }

const formatDateLocal = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-400' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-700', dot: 'bg-violet-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', dot: 'bg-orange-400' },
};
const COLORS: ScheduleEvent['color'][] = ['emerald', 'blue', 'violet', 'orange'];
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

// assign color by index
const colorFor = (idx: number): ScheduleEvent['color'] => COLORS[idx % COLORS.length];

// ─── Session Dialog (Add / Edit) ──────────────────────────────
interface SessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editSession?: ScheduleEvent | null;
  defaultDate?: string;
  courses: Course[];
  rooms: Room[];
  teachers: Teacher[];
  existingEvents: ScheduleEvent[]; // 👈 để kiểm tra trùng lịch
}

function SessionDialog({ isOpen, onClose, onSuccess, editSession, defaultDate, courses, rooms, teachers, existingEvents }: SessionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null); // 👈
  const [color, setColor] = useState<ScheduleEvent['color']>('emerald');
  const [form, setForm] = useState({
    session_date: defaultDate ?? '',
    time: '',
    courseid: '',
    roomid: '',
    userid: '',
  });

  useEffect(() => {
    if (editSession) {
      setForm({
        session_date: editSession.session_date,
        time: editSession.time,
        courseid: editSession.courseid,
        roomid: editSession.roomid,
        userid: editSession.userid,
      });
      setColor(editSession.color);
    } else {
      setForm({ session_date: defaultDate ?? '', time: '', courseid: '', roomid: '', userid: '' });
      setColor('emerald');
    }
  }, [editSession, defaultDate, isOpen]);

  const checkConflict = () => {
    if (!form.session_date || !form.time) return null;

    const conflicts = existingEvents.filter(ev => {
      if (editSession && ev._id === editSession._id) return false;

      return (
        formatDateLocal(ev.session_date) === form.session_date &&
        ev.time === form.time
      );
    });

    const roomConflict = conflicts.find(ev => ev.roomid === form.roomid);
    const teacherConflict = conflicts.find(ev => ev.userid === form.userid);

    if (roomConflict || teacherConflict) {
      let msg = 'Trùng lịch:\n';

      if (roomConflict) {
        msg += `• Phòng đã có lớp (${roomConflict.roomName})\n`;
      }

      if (teacherConflict) {
        msg += `• Giảng viên đã có lớp (${teacherConflict.userName})`;
      }

      return msg;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const conflict = checkConflict();
    if (conflict) {
      setConflictError(conflict);
      return;
    } else {
      setConflictError(null);
    }

    setIsLoading(true);
    try {
      const body = {
        session_date: form.session_date,
        time: form.time,
        roomid: form.roomid,
        courseid: form.courseid,
        userid: form.userid,
      };

      if (editSession) {
        // PUT /sessions/{id}
        const res = await api.put(`/sessions/${editSession._id}`, body);
        if (res.data.success) {
          toast.success('Cập nhật lịch học thành công');
          onSuccess();
          onClose();
        }
      } else {
        // POST /sessions
        const res = await api.post('/sessions', body);
        if (res.data.success) {
          toast.success('Tạo lịch học thành công');
          onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const roomLabel = (r: Room) => r.room_name ? `${r.room_name} — ${r.location}` : r._id;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editSession ? 'Chỉnh sửa lịch học' : 'Tạo lịch học mới'}
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">Điền thông tin buổi học</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
              {/* Conflict error */}
              {conflictError && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-2xl">
                  {conflictError.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm font-semibold ${i === 0 ? "text-red-600" : "text-red-500 mt-1"}`}>{line}</p>
                  ))}
                </div>
              )}

              {/* Color picker */}
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${COLOR_MAP[c].dot}
                      ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-50 hover:opacity-100'}`} />
                ))}
              </div>

              {/* Ngày */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Ngày học</label>
                <input type="date" required value={form.session_date}
                  onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>

              {/* Thời gian */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Khung giờ</label>
                <div className="grid grid-cols-2 gap-2">
                  {['07:00-09:00', '09:00-11:00', '13:00-15:00', '15:00-17:00'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, time: slot }))}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border-2
                        ${form.time === slot
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-50 text-slate-600 border-transparent hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {/* Hidden input để vẫn trigger required validation */}
                <input type="text" required value={form.time} readOnly className="sr-only" />
              </div>

              {/* Khóa học */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Khóa học</label>
                <select required value={form.courseid}
                  onChange={e => setForm(f => ({ ...f, courseid: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.courseName}</option>
                  ))}
                </select>
              </div>

              {/* Phòng học */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Phòng học</label>
                <select required value={form.roomid}
                  onChange={e => setForm(f => ({ ...f, roomid: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">-- Chọn phòng học --</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>{roomLabel(r)}</option>
                  ))}
                </select>
              </div>

              {/* Giảng viên */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Giảng viên</label>
                <select required value={form.userid}
                  onChange={e => setForm(f => ({ ...f, userid: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
                  Hủy
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-[2] py-3.5 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editSession ? 'Lưu thay đổi' : 'Tạo lịch học')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────
function DeleteDialog({ isOpen, onClose, onConfirm, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Xóa lịch học?</h3>
              <p className="text-slate-400 text-sm mt-1">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} disabled={isLoading}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50">
                Hủy
              </button>
              <button onClick={onConfirm} disabled={isLoading}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xóa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function Schedules() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Data
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // ── Load dropdowns once ──────────────────────────────────────
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [cRes, rRes, uRes] = await Promise.all([
          api.get('/courses'),
          api.get('/locations'),
          api.get('/users'),
        ]);
        if (cRes.data.success) setCourses(cRes.data.data);
        if (rRes.data.success) setRooms(rRes.data.data);
        if (uRes.data.success) setTeachers(uRes.data.data);
      } catch (err) {
        console.error('Lỗi tải dropdown:', err);
      }
    }
    loadDropdowns();
  }, []);

  // ── Load sessions for current month ─────────────────────────
  const loadSessions = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await api.get('/sessions');
      if (res.data.success) {
        const raw: Session[] = res.data.data;

        // 👇 Dùng trực tiếp populated fields từ API — không cần lookup map
        const mapped: ScheduleEvent[] = raw.map((s, i) => ({
          _id: s._id,
          session_date: s.session_date,
          time: s.time,
          roomid: s.roomid,
          courseid: s.courseid,
          userid: s.userid,
          courseName: s.course?.courseName ?? s.courseid,
          roomName: s.location?.room_name ?? s.roomid,
          userName: s.user?.name ?? s.userid,
          color: colorFor(i),
        }));

        setEvents(mapped);
      }
    } catch (err) {
      console.error('Lỗi tải lịch học:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // 👇 Load sessions ngay khi mount — không phụ thuộc vào dropdowns
  useEffect(() => {
    loadSessions();
  }, []);

  // ── Calendar math ────────────────────────────────────────────
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const eventsForDay = (day: number) => {
    return events.filter(e => {
      const d = new Date(e.session_date);
      return d.getFullYear() === currentYear &&
        d.getMonth() + 1 === currentMonth &&
        d.getDate() === day;
    });
  };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();

  // ── Handlers ─────────────────────────────────────────────────
  const openAdd = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setSelectedEvent(null);
    setAddOpen(true);
  };

  const openEdit = (ev: ScheduleEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(ev);
    setEditOpen(true);
  };

  const openDelete = (ev: ScheduleEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(ev);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/sessions/${selectedEvent._id}`);
      if (res.data.success) {
        toast.success('Xóa lịch học thành công');
        setDeleteOpen(false);
        setSelectedEvent(null);
        loadSessions();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-screen bg-[#f8fafc]">

      {/* Dialogs */}
      <SessionDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={loadSessions}
        defaultDate={selectedDate}
        courses={courses} rooms={rooms} teachers={teachers}
        existingEvents={events}
      />
      <SessionDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={loadSessions}
        editSession={selectedEvent}
        courses={courses} rooms={rooms} teachers={teachers}
        existingEvents={events}
      />
      <DeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex flex-wrap items-center justify-between gap-4 bg-white border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Quản lý lịch học</h1>
          <p className="text-slate-400 text-sm font-medium mt-0.5">Phân bổ giảng viên và phòng học tối ưu.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month navigator */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-black text-slate-800 min-w-[120px] text-center">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => { setCurrentMonth(today.getMonth() + 1); setCurrentYear(today.getFullYear()); }}
            className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            Hôm nay
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            Xuất
          </button>

          {/* 👇 Nút Tạo lịch → POST /sessions */}
          <button
            onClick={() => {
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              setSelectedDate(todayStr);
              setSelectedEvent(null);
              setAddOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#10b77f] text-white font-bold text-sm hover:translate-y-[-1px] hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 transition-all">
            <Plus className="w-4 h-4" />
            Tạo lịch
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`py-3 text-center text-[11px] font-black uppercase tracking-widest
                ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Loading overlay */}
          {isLoadingEvents && (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">Đang tải lịch học...</span>
            </div>
          )}

          {/* Calendar grid */}
          {!isLoadingEvents && (
            <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalCells }).map((_, idx) => {
                const day = idx - firstDay + 1;
                const isValid = day >= 1 && day <= daysInMonth;
                const dayEvs = isValid ? eventsForDay(day) : [];
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                return (
                  <div key={idx}
                    onClick={() => isValid && openAdd(day)}
                    className={`border-b border-r border-slate-50 p-2 flex flex-col gap-1 min-h-[100px] transition-colors cursor-pointer group/cell
                      ${!isValid ? 'bg-slate-50/30 cursor-default' : ''}
                      ${isValid && isWeekend ? 'bg-slate-50/20 hover:bg-emerald-50/20' : ''}
                      ${isValid && !isWeekend ? 'hover:bg-emerald-50/20' : ''}
                      ${isToday(day) ? 'bg-emerald-50/30' : ''}`}
                  >
                    {isValid && (
                      <>
                        {/* Day number + add button */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-colors
                            ${isToday(day) ? 'bg-[#10b77f] text-white' : isWeekend ? 'text-slate-400' : 'text-slate-600 group-hover/cell:text-[#10b77f]'}`}>
                            {day}
                          </span>
                          {/* 👇 Plus icon → POST /sessions */}
                          <button
                            onClick={e => { e.stopPropagation(); openAdd(day); }}
                            className="opacity-0 group-hover/cell:opacity-100 transition-opacity p-1 hover:bg-emerald-100 rounded-lg">
                            <Plus className="w-3 h-3 text-emerald-500" />
                          </button>
                        </div>

                        {/* Session cards */}
                        <div className="flex flex-col gap-1 overflow-hidden">
                          {dayEvs.slice(0, 3).map(ev => {
                            const c = COLOR_MAP[ev.color];
                            return (
                              <motion.div key={ev._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`group/ev relative px-2 py-1 rounded-lg border-l-2 ${c.bg} ${c.border} cursor-pointer hover:shadow-sm transition-all`}
                                onClick={e => e.stopPropagation()}
                              >
                                <div className={`text-[10px] font-black truncate ${c.text}`}>
                                  {ev.courseName}
                                </div>
                                <div className="text-[9px] text-slate-400 truncate flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 flex-shrink-0" />{ev.time}
                                </div>
                                <div className="text-[9px] text-slate-400 truncate">
                                  👤 {ev.userName}
                                </div>
                                <div className="text-[9px] text-slate-400 truncate">
                                  📍 {ev.roomName}
                                </div>

                                {/* 👇 Edit → GET /sessions/{id} + PUT, Delete → DELETE /sessions/{id} */}
                                <div className="absolute right-1 top-1 hidden group-hover/ev:flex gap-0.5 bg-white rounded-md shadow-md border border-slate-100 p-0.5 z-10">
                                  <button onClick={e => openEdit(ev, e)}
                                    className="p-1 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition-colors">
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  <button onClick={e => openDelete(ev, e)}
                                    className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                          {dayEvs.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400 pl-1">+{dayEvs.length - 3} khác</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}