import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
    const navigate = useNavigate();
    const { role } = useAuth();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mb-8"
            >
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full -z-10" />

                <div className="relative">
                    <h1 className="text-[180px] font-black text-slate-900 leading-none tracking-tighter opacity-10 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-32 h-32 bg-white rounded-3xl shadow-2xl shadow-emerald-500/20 flex items-center justify-center border border-slate-100"
                        >
                            <AlertCircle className="w-16 h-16 text-emerald-500" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
            >
                <h2 className="text-3xl font-black text-slate-900 mb-4">
                    Oops! Trang không tồn tại
                </h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Có vẻ như đường dẫn bạn đang truy cập đã bị thay đổi hoặc không còn tồn tại trong hệ thống EduAdmin.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>
                    <button
                        onClick={() => role === 'admin' ? navigate('/dashboard') : navigate('/schedule')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Về trang chủ
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
