import React, { useState } from 'react';
import { X, Mail, User, Phone, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ViewLecturerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    lecturer: {
        name: string;
        email: string;
        phone?: string;
        avatar?: string | null;
        role?: string;
        createdAt?: string;
    } | null;
}

export default function ViewLecturerDialog({ isOpen, onClose, lecturer }: ViewLecturerDialogProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!lecturer) return null;

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const InfoField = ({ label, value, icon: Icon, canCopy = false }: any) => (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">
                {label}
            </label>

            <div className="relative group">
                <Icon className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-hover:text-[#10b77f] transition-colors" />

                <div className="w-full pl-14 pr-20 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 font-semibold break-words">
                    {value || '—'}
                </div>

                {canCopy && value && (
                    <button
                        onClick={() => copyToClipboard(value, label)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#10b77f] hover:bg-white rounded-xl transition-all"
                    >
                        {copiedField === label
                            ? <Check className="w-4 h-4 text-emerald-500" />
                            : <Copy className="w-4 h-4" />
                        }
                    </button>
                )}
            </div>
        </div>
    );

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


                        <div className="h-32 bg-emerald-500 relative">
                            <div className="absolute -bottom-12 left-8">
                                <img
                                    src={
                                        lecturer.avatar ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(lecturer.name)}`
                                    }
                                    alt={lecturer.name}
                                    className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg object-cover bg-white"
                                />
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-colors text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>


                        <div className="px-8 pt-16 pb-8 space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {lecturer.name}
                                </h3>

                                <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    {lecturer.role === 'teacher' ? 'Giảng viên' : lecturer.role || '—'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <InfoField
                                    label="Họ và tên"
                                    value={lecturer.name}
                                    icon={User}
                                    canCopy
                                />

                                <InfoField
                                    label="Email"
                                    value={lecturer.email}
                                    icon={Mail}
                                    canCopy
                                />

                                <InfoField
                                    label="Số điện thoại"
                                    value={lecturer.phone}
                                    icon={Phone}
                                    canCopy
                                />


                                <InfoField
                                    label="Ngày tạo"
                                    value={formatDate(lecturer.createdAt)}
                                    icon={User}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}