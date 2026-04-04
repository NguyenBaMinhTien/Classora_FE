import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, FileDown, Upload,
  Edit2, Trash2, X, Clock, Loader2, MapPin, User, BookOpen,
  DoorOpen, Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // 👈 Thêm

// ─── Types ────────────────────────────────────────────────────
interface Session {
  _id: string;
  session_date: string;
  time: string;
  roomid: string;
  courseid: string;
  userid: string;
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
  courseName?: string;
  roomName?: string;
  roomLocation?: string;
  userName?: string;
  color: 'emerald' | 'blue' | 'violet' | 'orange';
}

interface Course { _id: string; courseName: string; }
interface Room { _id: string; room_name: string; location: string; }
interface Teacher { _id: string; name: string; }

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-l-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-200' },
  blue: { bg: 'bg-blue-50', border: 'border-l-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400', ring: 'ring-blue-200' },
  violet: { bg: 'bg-violet-50', border: 'border-l-violet-400', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400', ring: 'ring-violet-200' },
  orange: { bg: 'bg-orange-50', border: 'border-l-orange-400', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400', ring: 'ring-orange-200' },
};

const TIME_SLOTS = ['07:00-09:00', '09:00-11:00', '13:00-15:00', '15:00-17:00'];
const COLORS: ScheduleEvent['color'][] = ['emerald', 'blue', 'violet', 'orange'];
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const colorFor = (idx: number): ScheduleEvent['color'] => COLORS[idx % COLORS.length];

// sort by time slot order
const timeOrder = (time: string) => TIME_SLOTS.indexOf(time) ?? 99;

// ─── Session Dialog ───────────────────────────────────────────
interface SessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editSession?: ScheduleEvent | null;
  defaultDate?: string;
  courses: Course[];
  rooms: Room[];
  teachers: Teacher[];
  existingEvents: ScheduleEvent[];
}

function SessionDialog({ isOpen, onClose, onSuccess, editSession, defaultDate, courses, rooms, teachers, existingEvents }: SessionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [form, setForm] = useState({ session_date: defaultDate ?? '', time: '', courseid: '', roomid: '', userid: '' });

  useEffect(() => {
    setConflictError(null);
    if (editSession) {
      setForm({ session_date: editSession.session_date?.slice(0, 10) ?? '', time: editSession.time, courseid: editSession.courseid, roomid: editSession.roomid, userid: editSession.userid });
    } else {
      setForm({ session_date: defaultDate ?? '', time: '', courseid: '', roomid: '', userid: '' });
    }
  }, [editSession, defaultDate, isOpen]);

  const checkConflict = () => {
    if (!form.session_date || !form.time) return null;
    const conflicts = existingEvents.filter(ev => {
      if (editSession && ev._id === editSession._id) return false;
      // So sánh ngày bằng chuỗi "YYYY-MM-DD" để tránh lệch timezone
      const evDateStr = ev.session_date.slice(0, 10);
      const fmDateStr = form.session_date.slice(0, 10);
      const sameDay = evDateStr === fmDateStr;
      return sameDay && ev.time === form.time && (ev.roomid === form.roomid || ev.userid === form.userid);
    });
    if (!conflicts.length) return null;
    const msgs: string[] = [];
    const rc = conflicts.find(e => e.roomid === form.roomid);
    const tc = conflicts.find(e => e.userid === form.userid);
    if (rc) msgs.push(`Phòng "${rc.roomName}" đã có lịch: ${rc.courseName}`);
    if (tc) msgs.push(`Giảng viên "${tc.userName}" đã có lịch dạy`);
    return msgs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);
    const conflicts = checkConflict();
    if (conflicts) { setConflictError(conflicts.join('\n')); return; }
    setIsLoading(true);
    try {
      const body = { session_date: form.session_date, time: form.time, roomid: form.roomid, courseid: form.courseid, userid: form.userid };
      const res = editSession ? await api.put(`/sessions/${editSession._id}`, body) : await api.post('/sessions', body);
      if (res.data.success) {
        toast.success(editSession ? 'Cập nhật lịch học thành công' : 'Tạo lịch học thành công');
        onSuccess(); onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally { setIsLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-8 pt-8 pb-5 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">{editSession ? 'Chỉnh sửa lịch học' : 'Tạo lịch học mới'}</h3>
                <p className="text-slate-400 text-sm mt-0.5">Điền thông tin buổi học</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-5 space-y-5">
              {/* Conflict error */}
              {conflictError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl space-y-1">
                  <p className="text-sm font-black text-red-600 flex items-center gap-2">⚠️ Trùng lịch học!</p>
                  {conflictError.split('\n').map((line, i) => (
                    <p key={i} className="text-xs text-red-500 font-semibold pl-1">• {line}</p>
                  ))}
                </motion.div>
              )}

              {/* Ngày */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" />Ngày học</label>
                <input type="date" required value={form.session_date}
                  onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all" />
              </div>

              {/* Khung giờ */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" />Khung giờ</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => setForm(f => ({ ...f, time: slot }))}
                      className={`py-3.5 rounded-2xl text-sm font-black transition-all border-2
                        ${form.time === slot ? 'bg-[#10b77f] text-white border-[#10b77f] shadow-lg shadow-emerald-500/20 scale-[1.02]' : 'bg-slate-50 text-slate-500 border-transparent hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
                <input type="text" required value={form.time} readOnly className="sr-only" />
              </div>

              {/* Khóa học */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><BookOpen className="w-3 h-3" />Khóa học</label>
                <select required value={form.courseid} onChange={e => setForm(f => ({ ...f, courseid: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all">
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                </select>
              </div>

              {/* Phòng học */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3" />Phòng học</label>
                <select required value={form.roomid} onChange={e => setForm(f => ({ ...f, roomid: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all">
                  <option value="">-- Chọn phòng học --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>{r.room_name} — {r.location}</option>)}
                </select>
              </div>

              {/* Giảng viên */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" />Giảng viên</label>
                <select required value={form.userid} onChange={e => setForm(f => ({ ...f, userid: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all">
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">Hủy</button>
                <button type="submit" disabled={isLoading}
                  className="flex-[2] py-4 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0">
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
function DeleteDialog({ isOpen, onClose, onConfirm, isLoading }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading: boolean; }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto"><Trash2 className="w-7 h-7 text-red-500" /></div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Xóa lịch học?</h3>
              <p className="text-slate-400 text-sm mt-1">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} disabled={isLoading} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50">Hủy</button>
              <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
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
  const { role } = useAuth(); // 👈 Lấy role
  const isAdmin = role === 'admin'; // 👈 Kiểm tra admin
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // 👈 filter by room

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [cRes, rRes, uRes] = await Promise.all([api.get('/courses'), api.get('/locations'), api.get('/users')]);
        if (cRes.data.success) setCourses(cRes.data.data);
        if (rRes.data.success) setRooms(rRes.data.data);
        if (uRes.data.success) setTeachers(uRes.data.data);
      } catch (err) { console.error('Lỗi tải dropdown:', err); }
    }
    loadDropdowns();
  }, []);

  const loadSessions = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await api.get('/sessions');
      console.log(res.data);
      if (res.data.success) {
        const mapped: ScheduleEvent[] = (res.data.data as Session[]).map((s, i) => ({
          _id: s._id, session_date: s.session_date, time: s.time,
          roomid: s.roomid, courseid: s.courseid, userid: s.userid,
          courseName: s.course?.courseName ?? s.courseid,
          roomName: s.location?.room_name ?? s.roomid,
          roomLocation: s.location?.location ?? '',
          userName: s.user?.name ?? s.userid,
          color: colorFor(i),
        }));
        setEvents(mapped);
      }
    } catch (err) { console.error('Lỗi tải lịch học:', err); }
    finally { setIsLoadingEvents(false); }
  };

  useEffect(() => { loadSessions(); }, []);

  // Calendar math
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => currentMonth === 1 ? (setCurrentMonth(12), setCurrentYear(y => y - 1)) : setCurrentMonth(m => m - 1);
  const nextMonth = () => currentMonth === 12 ? (setCurrentMonth(1), setCurrentYear(y => y + 1)) : setCurrentMonth(m => m + 1);

  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();

  // Filter events by selected room + current month
  // Parse ISO date sang local time để tránh lệch timezone UTC+7
  const parseLocalDate = (iso: string) => {
    const d = new Date(iso);
    return { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() };
  };

  const filteredEvents = events.filter(e => {
    const { y, m } = parseLocalDate(e.session_date);
    const inMonth = y === currentYear && m === currentMonth;
    const inRoom = selectedRoomId ? e.roomid === selectedRoomId : true;
    return inMonth && inRoom;
  });

  const eventsForDay = (day: number) =>
    filteredEvents
      .filter(e => parseLocalDate(e.session_date).day === day)
      .sort((a, b) => timeOrder(a.time) - timeOrder(b.time));

  const openAdd = (day: number) => { const d = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`; setSelectedDate(d); setSelectedEvent(null); setAddOpen(true); };
  const openEdit = (ev: ScheduleEvent, e: React.MouseEvent) => { e.stopPropagation(); setSelectedEvent(ev); setEditOpen(true); };
  const openDelete = (ev: ScheduleEvent, e: React.MouseEvent) => { e.stopPropagation(); setSelectedEvent(ev); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/sessions/${selectedEvent._id}`);
      if (res.data.success) { toast.success('Xóa lịch học thành công'); setDeleteOpen(false); setSelectedEvent(null); loadSessions(); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Xóa thất bại'); }
    finally { setIsDeleting(false); }
  };

  const selectedRoom = rooms.find(r => r._id === selectedRoomId);

  // ── Import Excel ──
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/schedule/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Import lịch học thành công!');
      await loadSessions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Import thất bại. Kiểm tra lại file Excel.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Export PDF ──
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const res = await api.post(
        '/schedule/export',
        { teacherIds: teachers.map(t => t._id) }, // xuất tất cả giảng viên
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lich-hoc-${MONTH_NAMES[currentMonth - 1]}-${currentYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xuất PDF thất bại.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#f8fafc]">

      <SessionDialog isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={loadSessions} defaultDate={selectedDate} courses={courses} rooms={rooms} teachers={teachers} existingEvents={events} />
      <SessionDialog isOpen={editOpen} onClose={() => setEditOpen(false)} onSuccess={loadSessions} editSession={selectedEvent} courses={courses} rooms={rooms} teachers={teachers} existingEvents={events} />
      <DeleteDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} isLoading={isDeleting} />

      {/* ── Header ── */}
      <div className="px-8 pt-7 pb-5 bg-white border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý lịch học</h1>
            <p className="mt-2 text-base text-slate-500">Phân bổ giảng viên và phòng học tối ưu.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Month nav */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
              <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-xl transition-colors"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <span className="text-sm font-black text-slate-800 min-w-[130px] text-center">{MONTH_NAMES[currentMonth - 1]} {currentYear}</span>
              <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-xl transition-colors"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            <button onClick={() => { setCurrentMonth(today.getMonth() + 1); setCurrentYear(today.getFullYear()); }}
              className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              Hôm nay
            </button>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportExcel}
            />

            {/* Import Excel */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-blue-200 bg-blue-50 font-bold text-sm text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Đang import...' : 'Import Excel'}
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileDown className="w-4 h-4" />
              {exporting ? 'Đang xuất...' : 'Xuất PDF'}
            </button>
            {/* 👇 Chỉ admin mới thấy nút Tạo lịch */}
            {isAdmin && (
              <button onClick={() => { const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; setSelectedDate(d); setSelectedEvent(null); setAddOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#10b77f] text-white font-bold text-sm hover:translate-y-[-1px] hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 transition-all">
                <Plus className="w-4 h-4" />Tạo lịch
              </button>
            )}
          </div>
        </div>

        {/* ── Room filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest mr-1 flex items-center gap-1.5">
            <DoorOpen className="w-3.5 h-3.5" />Lọc phòng
          </span>
          {/* All rooms pill */}
          <button onClick={() => setSelectedRoomId(null)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border
              ${!selectedRoomId ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}>
            Tất cả phòng
          </button>
          {rooms.map(r => {
            const isSelected = selectedRoomId === r._id;
            const roomEvCount = events.filter(e => {
              const { y, m } = parseLocalDate(e.session_date);
              return e.roomid === r._id && y === currentYear && m === currentMonth;
            }).length;
            return (
              <button key={r._id} onClick={() => setSelectedRoomId(isSelected ? null : r._id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border
                  ${isSelected ? 'bg-[#10b77f] text-white border-[#10b77f] shadow-md shadow-emerald-500/20' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'}`}>
                <span>{r.room_name}</span>
                {roomEvCount > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {roomEvCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected room info bar */}
        {selectedRoom && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DoorOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-800">{selectedRoom.room_name}</p>
              <p className="text-xs text-emerald-600">{selectedRoom.location} · {filteredEvents.length} buổi học trong tháng</p>
            </div>
            <button onClick={() => setSelectedRoomId(null)} className="ml-auto p-1 hover:bg-emerald-100 rounded-lg transition-colors text-emerald-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Calendar ── */}
      <div className="flex-1 p-5">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">

          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-slate-50/80 border-b border-slate-100">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`py-3.5 text-center text-[11px] font-black uppercase tracking-widest
                ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{d}</div>
            ))}
          </div>

          {isLoadingEvents ? (
            <div className="flex-1 flex items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="text-sm font-semibold">Đang tải lịch học...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalCells }).map((_, idx) => {
                const day = idx - firstDay + 1;
                const isValid = day >= 1 && day <= daysInMonth;
                const dayEvs = isValid ? eventsForDay(day) : [];
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                const todayCell = isToday(day);

                return (
                  <div key={idx}
                    onClick={() => isValid && isAdmin && openAdd(day)}
                    className={`border-b border-r border-slate-50 flex flex-col transition-colors
                      ${!isValid ? 'bg-slate-50/40 cursor-default' : isAdmin ? 'cursor-pointer group/cell' : 'cursor-default group/cell'}
                      ${isValid && isWeekend ? 'bg-slate-50/60' : ''}
                      ${isValid && !isWeekend ? 'hover:bg-emerald-50/30' : ''}
                      ${todayCell ? '!bg-emerald-50/50' : ''}`}
                    style={{ minHeight: selectedRoomId ? 'auto' : '110px' }}
                  >
                    {isValid && (
                      <div className="p-2 flex flex-col gap-1 h-full">
                        {/* Day number */}
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-all
                            ${todayCell ? 'bg-[#10b77f] text-white shadow-md shadow-emerald-500/30' : ''}
                            ${isWeekend && !todayCell ? 'text-slate-300' : ''}
                            ${!isWeekend && !todayCell ? 'text-slate-500 group-hover/cell:text-[#10b77f]' : ''}`}>
                            {day}
                          </span>
                          {/* 👇 Chỉ admin mới thấy nút + trên ô ngày */}
                          {isAdmin && (
                            <button onClick={e => { e.stopPropagation(); openAdd(day); }}
                              className="opacity-0 group-hover/cell:opacity-100 transition-all p-1 hover:bg-emerald-100 rounded-lg scale-90 hover:scale-100">
                              <Plus className="w-3 h-3 text-emerald-500" />
                            </button>
                          )}
                        </div>

                        {/* Event cards — sorted by time */}
                        <div className="flex flex-col gap-1">
                          {(selectedRoomId ? dayEvs : dayEvs.slice(0, 3)).map((ev, evIdx) => {
                            const c = COLOR_MAP[ev.color];
                            return (
                              <motion.div key={ev._id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: evIdx * 0.03 }}
                                className={`group/ev relative rounded-xl border-l-4 ${c.bg} ${c.border} overflow-hidden cursor-pointer
                                  hover:shadow-md hover:scale-[1.01] transition-all`}
                                onClick={e => e.stopPropagation()}
                              >
                                <div className={`px-2.5 py-2 ${selectedRoomId ? 'py-3' : ''}`}>
                                  {/* Course name */}
                                  <div className={`text-[10px] font-black truncate ${c.text} leading-tight`}>
                                    {ev.courseName}
                                  </div>

                                  {/* Time badge */}
                                  <div className={`flex items-center gap-1 mt-1 ${selectedRoomId ? 'mt-1.5' : ''}`}>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${c.badge}`}>
                                      {ev.time}
                                    </span>
                                  </div>

                                  {/* Teacher + Room — always shown when room filter active, else hidden */}
                                  <div className={`space-y-0.5 ${selectedRoomId ? 'mt-2' : 'mt-1'}`}>
                                    <div className="flex items-center gap-1 text-[9px] text-slate-500">
                                      <User className="w-2.5 h-2.5 flex-shrink-0 text-slate-400" />
                                      <span className="truncate font-semibold">{ev.userName}</span>
                                    </div>
                                    {!selectedRoomId && (
                                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                        <span className="truncate">{ev.roomName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* 👇 Chỉ admin mới thấy Edit/Delete */}
                                {isAdmin && (
                                  <div className="absolute right-1 top-1 hidden group-hover/ev:flex gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-100 p-0.5 z-10">
                                    <button onClick={e => openEdit(ev, e)} className="p-1.5 hover:bg-blue-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors">
                                      <Edit2 className="w-2.5 h-2.5" />
                                    </button>
                                    <button onClick={e => openDelete(ev, e)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 transition-colors">
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}

                          {/* More indicator (only when no room filter) */}
                          {!selectedRoomId && dayEvs.length > 3 && (
                            <div className="text-[10px] font-bold text-slate-400 pl-1 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              +{dayEvs.length - 3} buổi khác
                            </div>
                          )}
                        </div>
                      </div>
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