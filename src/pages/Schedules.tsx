import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileDown,
  Edit2,
  Trash2,
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Mock data ────────────────────────────────────────────────
interface ScheduleEvent {
  id: string;
  date: number; // day of month
  month: number;
  year: number;
  subject: string;
  class: string;
  teacher: string;
  room: string;
  time: string;
  color: 'emerald' | 'blue' | 'violet' | 'orange';
}

const MOCK_EVENTS: ScheduleEvent[] = [
  { id: '1', date: 3, month: 3, year: 2026, subject: 'Cấu trúc dữ liệu', class: 'D20CNTT01', teacher: 'ThS. Nguyễn Văn A', room: 'P.201', time: '07:00–09:00', color: 'emerald' },
  { id: '2', date: 3, month: 3, year: 2026, subject: 'Mạng máy tính', class: 'D20CNTT02', teacher: 'TS. Trần Thị B', room: 'P.405', time: '09:15–11:15', color: 'blue' },
  { id: '3', date: 5, month: 3, year: 2026, subject: 'Lập trình Web', class: 'D21CNTT03', teacher: 'ThS. Lê Văn C', room: 'P.301', time: '13:00–15:00', color: 'violet' },
  { id: '4', date: 10, month: 3, year: 2026, subject: 'Cơ sở dữ liệu', class: 'D20CNTT01', teacher: 'TS. Phạm Thị D', room: 'P.102', time: '07:00–09:00', color: 'orange' },
  { id: '5', date: 12, month: 3, year: 2026, subject: 'Giải thuật', class: 'D21CNTT02', teacher: 'ThS. Nguyễn Văn A', room: 'P.201', time: '09:15–11:15', color: 'emerald' },
  { id: '6', date: 17, month: 3, year: 2026, subject: 'Trí tuệ nhân tạo', class: 'D20CNTT03', teacher: 'TS. Trần Thị B', room: 'P.501', time: '13:00–15:00', color: 'blue' },
  { id: '7', date: 19, month: 3, year: 2026, subject: 'Lập trình hướng đối tượng', class: 'D21CNTT01', teacher: 'ThS. Lê Văn C', room: 'P.301', time: '07:00–09:00', color: 'violet' },
  { id: '8', date: 24, month: 3, year: 2026, subject: 'Hệ điều hành', class: 'D20CNTT02', teacher: 'TS. Phạm Thị D', room: 'P.405', time: '09:15–11:15', color: 'orange' },
  { id: '9', date: 26, month: 3, year: 2026, subject: 'Công nghệ phần mềm', class: 'D20CNTT01', teacher: 'ThS. Nguyễn Văn A', room: 'P.201', time: '13:00–15:00', color: 'emerald' },
];

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-400' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-700', dot: 'bg-violet-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', dot: 'bg-orange-400' },
};

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

// ─── Add/Edit Dialog ──────────────────────────────────────────
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  editEvent?: ScheduleEvent | null;
  onSave: (ev: Omit<ScheduleEvent, 'id'>) => void;
  defaultDate?: number;
  month: number;
  year: number;
}

function ScheduleDialog({ isOpen, onClose, editEvent, onSave, defaultDate, month, year }: DialogProps) {
  const [form, setForm] = useState({
    subject: editEvent?.subject ?? '',
    class: editEvent?.class ?? '',
    teacher: editEvent?.teacher ?? '',
    room: editEvent?.room ?? '',
    time: editEvent?.time ?? '',
    date: editEvent?.date ?? defaultDate ?? 1,
    color: (editEvent?.color ?? 'emerald') as ScheduleEvent['color'],
  });

  React.useEffect(() => {
    if (editEvent) {
      setForm({ subject: editEvent.subject, class: editEvent.class, teacher: editEvent.teacher, room: editEvent.room, time: editEvent.time, date: editEvent.date, color: editEvent.color });
    } else {
      setForm({ subject: '', class: '', teacher: '', room: '', time: '', date: defaultDate ?? 1, color: 'emerald' });
    }
  }, [editEvent, defaultDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, month, year });
    onClose();
  };

  const colors: ScheduleEvent['color'][] = ['emerald', 'blue', 'violet', 'orange'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-8 pt-8 pb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">{editEvent ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{MONTH_NAMES[month - 1]} {year}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
              {/* Color picker */}
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${COLOR_MAP[c].dot} ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60 hover:opacity-100'}`} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Ngày</label>
                  <input type="number" min={1} max={31} required value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: +e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Ca học</label>
                  <input type="text" placeholder="07:00–09:00" required value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>

              {[
                { key: 'subject', label: 'Môn học', icon: BookOpen, placeholder: 'Cấu trúc dữ liệu' },
                { key: 'class', label: 'Lớp học', icon: User, placeholder: 'D20CNTT01' },
                { key: 'teacher', label: 'Giảng viên', icon: User, placeholder: 'ThS. Nguyễn Văn A' },
                { key: 'room', label: 'Phòng học', icon: MapPin, placeholder: 'P.201' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                    <Icon className="w-3 h-3" />{label}
                  </label>
                  <input type="text" required placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300" />
                </div>
              ))}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
                  Hủy
                </button>
                <button type="submit"
                  className="flex-[2] py-3.5 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                  {editEvent ? 'Lưu thay đổi' : 'Thêm lịch học'}
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
function DeleteDialog({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
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
              <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Hủy</button>
              <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">Xóa</button>
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
  const [events, setEvents] = useState<ScheduleEvent[]>(MOCK_EVENTS);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Calendar math
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

  const eventsForDay = (day: number) =>
    events.filter(e => e.date === day && e.month === currentMonth && e.year === currentYear);

  const handleSave = (data: Omit<ScheduleEvent, 'id'>) => {
    if (selectedEvent) {
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...data, id: selectedEvent.id } : e));
    } else {
      setEvents(prev => [...prev, { ...data, id: Date.now().toString() }]);
    }
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    if (selectedEvent) setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
    setDeleteOpen(false);
    setSelectedEvent(null);
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

  const openAdd = (day: number) => {
    setSelectedDate(day);
    setSelectedEvent(null);
    setAddOpen(true);
  };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#f8fafc]">

      {/* ── Dialogs ── */}
      <ScheduleDialog isOpen={addOpen} onClose={() => setAddOpen(false)}
        onSave={handleSave} defaultDate={selectedDate ?? 1} month={currentMonth} year={currentYear} />
      <ScheduleDialog isOpen={editOpen} onClose={() => setEditOpen(false)}
        editEvent={selectedEvent} onSave={handleSave} month={currentMonth} year={currentYear} />
      <DeleteDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} />

      {/* ── Header ── */}
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

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            Xuất
          </button>

          <button onClick={() => { setSelectedDate(today.getDate()); setAddOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#10b77f] text-white font-bold text-sm hover:translate-y-[-1px] hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 transition-all">
            <Plus className="w-4 h-4" />
            Tạo lịch
          </button>
        </div>
      </div>

      {/* ── Calendar ── */}
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

          {/* Calendar grid */}
          <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}>
            {Array.from({ length: totalCells }).map((_, idx) => {
              const day = idx - firstDay + 1;
              const isValid = day >= 1 && day <= daysInMonth;
              const dayEvents = isValid ? eventsForDay(day) : [];
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;

              return (
                <div
                  key={idx}
                  onClick={() => isValid && openAdd(day)}
                  className={`border-b border-r border-slate-50 p-2 flex flex-col gap-1 min-h-[100px] transition-colors cursor-pointer group/cell
                    ${!isValid ? 'bg-slate-50/30' : isWeekend ? 'bg-slate-50/20 hover:bg-emerald-50/20' : 'hover:bg-emerald-50/20'}
                    ${isToday(day) ? 'bg-emerald-50/30' : ''}`}
                >
                  {isValid && (
                    <>
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-colors
                          ${isToday(day) ? 'bg-[#10b77f] text-white' : isWeekend ? 'text-slate-400' : 'text-slate-600 group-hover/cell:text-[#10b77f]'}`}>
                          {day}
                        </span>
                        {/* Add button on hover */}
                        <button onClick={e => { e.stopPropagation(); openAdd(day); }}
                          className="opacity-0 group-hover/cell:opacity-100 transition-opacity p-1 hover:bg-emerald-100 rounded-lg">
                          <Plus className="w-3 h-3 text-emerald-500" />
                        </button>
                      </div>

                      {/* Events */}
                      <div className="flex flex-col gap-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(ev => {
                          const c = COLOR_MAP[ev.color];
                          return (
                            <motion.div
                              key={ev.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`group/ev relative px-2 py-1 rounded-lg border-l-2 ${c.bg} ${c.border} cursor-pointer hover:shadow-sm transition-all`}
                              onClick={e => e.stopPropagation()}
                            >
                              <div className={`text-[10px] font-black truncate ${c.text}`}>{ev.subject}</div>
                              <div className="text-[9px] text-slate-400 truncate flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 flex-shrink-0" />{ev.time}
                              </div>

                              {/* Edit / Delete on hover */}
                              <div className="absolute right-1 top-1 hidden group-hover/ev:flex gap-0.5 bg-white rounded-md shadow-md border border-slate-100 p-0.5">
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
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400 pl-1">+{dayEvents.length - 3} khác</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}