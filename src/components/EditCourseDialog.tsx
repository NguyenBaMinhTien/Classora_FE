import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlignLeft, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface EditCourseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    course: {
        _id: string;
        courseName: string;
        description: string;
    } | null;
}

export default function EditCourseDialog({ isOpen, onClose, onSuccess, course }: EditCourseDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        description: '',
    });

    // 👇 Điền sẵn data khi mở dialog
    useEffect(() => {
        if (course) {
            setFormData({
                courseName: course.courseName || '',
                description: course.description || '',
            });
        }
    }, [course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;

        setIsLoading(true);
        try {
            const res = await api.put(`/courses/${course._id}`, {
                courseName: formData.courseName,
                description: formData.description,
            });

            if (res.data.success) {
                toast.success('Cập nhật khóa học thành công');
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
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Chỉnh sửa khóa học</h3>
                                    <p className="text-slate-500 text-sm font-medium mt-0.5">Cập nhật thông tin học phần.</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1 flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Tên khóa học
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    placeholder="VD: Web Development Fundamentals"
                                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1 flex items-center gap-2">
                                    <AlignLeft className="w-3 h-3" /> Mô tả khóa học
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="VD: Learn the basics of web development..."
                                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none resize-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-4">
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