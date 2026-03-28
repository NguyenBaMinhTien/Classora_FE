import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, isLoading }: any) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 relative z-10"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Xác nhận xóa</h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                                <X />
                            </button>
                        </div>

                        <p className="text-slate-500">
                            Bạn có chắc chắn muốn xóa giảng viên này không?
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                            >
                                {isLoading && (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                Xóa
                            </button>
                        </div>
                    </motion.div>

                </div>
            )}
        </AnimatePresence>
    );
}