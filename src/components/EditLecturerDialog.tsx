import React, { useState, useEffect } from 'react';
import { X, Mail, User, Phone, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface EditLecturerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    lecturer: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        phoneNumber?: string;
    } | null;
}

export default function EditLecturerDialog({ isOpen, onClose, onSuccess, lecturer }: EditLecturerDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (lecturer) {
            setFormData({
                name: lecturer.name || '',
                email: lecturer.email || '',
                phoneNumber: lecturer.phoneNumber || lecturer.phone || '',
            });
        }
    }, [lecturer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lecturer) return;

        setIsLoading(true);
        try {
            const res = await api.put(`/users/${lecturer._id}`, {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            });

            if (res.data.success) {
                toast.success('Cập nhật giảng viên thành công');
                onSuccess?.();
                onClose();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Cập nhật thất bại, vui lòng thử lại.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Chỉnh sửa Giảng viên</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Cập nhật thông tin cá nhân của giảng viên.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Họ và tên</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Nguyễn Văn A"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Email công vụ</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="lecturer@university.edu.vn"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Số điện thoại</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="09xx xxx xxx"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                    />
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
                                    className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-500/20 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Lưu thay đổi
                                            <Save className="w-5 h-5" />
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