import React, { useEffect, useState } from 'react';
import { X, BookOpen, AlignLeft, Trash2, Loader2, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface CourseDetail {
    _id: string;
    courseName: string;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

interface CourseDetailDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string | null;
    onSuccess?: () => void;
}

export default function CourseDetailDeleteDialog({
    isOpen,
    onClose,
    courseId,
    onSuccess,
}: CourseDetailDeleteDialogProps) {
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 👇 Fetch chi tiết khóa học khi mở dialog
    useEffect(() => {
        if (!isOpen || !courseId) return;

        async function fetchCourse() {
            setIsFetching(true);
            try {
                const res = await api.get(`/courses/${courseId}`);
                if (res.data.success) {
                    setCourse(res.data.data);
                }
            } catch (error) {
                console.error('Lỗi lấy chi tiết khóa học:', error);
                toast.error('Không thể tải thông tin khóa học');
                onClose();
            } finally {
                setIsFetching(false);
            }
        }

        fetchCourse();
    }, [isOpen, courseId]);

    // 👇 Xóa khóa học
    async function handleDelete() {
        if (!courseId) return;
        setIsDeleting(true);
        try {
            const res = await api.delete(`/courses/${courseId}`);
            if (res.data.success) {
                toast.success('Xóa khóa học thành công');
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error('Lỗi xóa khóa học:', error);
            toast.error('Xóa khóa học thất bại');
        } finally {
            setIsDeleting(false);
        }
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

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

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Chi tiết khóa học</h3>
                                    <p className="text-slate-500 text-sm font-medium mt-0.5">Xem thông tin trước khi xóa.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-8 space-y-6">
                            {isFetching ? (
                                // Loading skeleton
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded-xl" />
                                    <div className="h-20 w-full bg-slate-100 rounded-xl" />
                                    <div className="h-4 w-1/2 bg-slate-100 rounded-xl" />
                                    <div className="h-4 w-1/2 bg-slate-100 rounded-xl" />
                                </div>
                            ) : course ? (
                                <div className="space-y-4">
                                    {/* Tên khóa học */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                            <BookOpen className="w-3 h-3" /> Tên khóa học
                                        </label>
                                        <div className="px-5 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900">
                                            {course.courseName}
                                        </div>
                                    </div>

                                    {/* Mô tả */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                            <AlignLeft className="w-3 h-3" /> Mô tả
                                        </label>
                                        <div className="px-5 py-3.5 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed">
                                            {course.description}
                                        </div>
                                    </div>

                                    {/* Ngày tạo & Cập nhật */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" /> Ngày tạo
                                            </label>
                                            <div className="px-5 py-3.5 bg-slate-50 rounded-2xl text-sm text-slate-600">
                                                {formatDate(course.createdAt)}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" /> Cập nhật
                                            </label>
                                            <div className="px-5 py-3.5 bg-slate-50 rounded-2xl text-sm text-slate-600">
                                                {formatDate(course.updatedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning */}
                                    <div className="px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
                                        <p className="text-sm text-red-600 font-semibold">
                                            ⚠️ Hành động này không thể hoàn tác. Khóa học sẽ bị xóa vĩnh viễn.
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || isFetching}
                                    className="flex-[2] py-4 bg-red-600 text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-xl hover:shadow-red-500/20 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Xác nhận xóa
                                            <Trash2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}