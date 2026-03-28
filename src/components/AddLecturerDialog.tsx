import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api'; // 👈 Thêm

interface AddLecturerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // 👈 Thêm callback để reload danh sách sau khi thêm
}

export default function AddLecturerDialog({ isOpen, onClose, onSuccess }: AddLecturerDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // 👈 Hiển thị lỗi nếu có
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '' // 👈 Đổi từ phone → phoneNumber cho đúng API
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/users', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber, // 👈 Đúng field name
            });

            if (res.data.success) {
                onClose();
                onSuccess?.(); // 👈 Gọi reload danh sách
                setFormData({ name: '', email: '', password: '', phoneNumber: '' });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.';
            setError(msg); // 👈 Hiển thị lỗi từ server
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Dialog Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 flex items-center justify-between relative">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Thêm Giảng viên</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Nhập thông tin chi tiết để tạo tài khoản mới.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">

                            {/* 👇 Hiển thị lỗi từ server nếu có */}
                            {error && (
                                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Họ và tên</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Nguyễn Văn A"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Email công vụ</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="lecturer@university.edu.vn"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Số điện thoại</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            placeholder="09xx xxx xxx"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Mật khẩu tạm thời</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] py-4 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-xl hover:shadow-emerald-500/20 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Xác nhận thêm
                                            <Plus className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}