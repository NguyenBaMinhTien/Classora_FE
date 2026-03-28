import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; // 👈 Thêm

export default function Login() {
  const { login } = useAuth(); // 👈 Lấy login từ useAuth
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log(res.data);
      if (res.data.success) {
        login(res.data.data.token)
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] bg-white rounded-[40px] shadow-2xl shadow-emerald-500/5 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-[#10b77f] p-12 md:p-20 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">EduAdmin Portal</h1>
            <p className="text-emerald-50/80 text-lg font-medium leading-relaxed max-w-sm">
              Hệ thống quản lý đào tạo thông minh dành cho giảng viên và cán bộ quản lý đại học.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Quản lý tập trung</p>
                <p className="text-xs text-emerald-50/60">Tất cả dữ liệu trong một nền tảng</p>
              </div>
            </div>
            <p className="text-xs font-bold text-emerald-100/40 uppercase tracking-[0.2em]">© 2024 University Admin System</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Chào mừng trở lại!</h2>
              <p className="text-slate-500 font-medium">Vui lòng đăng nhập để tiếp tục quản lý.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">Tên đăng nhập</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@university.edu"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Mật khẩu</label>
                  <button type="button" className="text-[11px] font-black uppercase text-[#10b77f] hover:text-[#0d9469] tracking-widest transition-colors">Quên mật khẩu?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#10b77f] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-slate-900 placeholder:text-slate-300 transition-all font-semibold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-5 h-5 rounded-lg border-slate-200 text-[#10b77f] focus:ring-[#10b77f] transition-all cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Ghi nhớ đăng nhập</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#10b77f] text-white font-black rounded-2xl hover:translate-y-[-2px] hover:shadow-xl hover:shadow-emerald-500/20 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Đăng nhập ngay
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm font-bold text-slate-400">
                Chưa có tài khoản? <button className="text-[#10b77f] hover:text-[#0d9469] transition-colors">Liên hệ quản trị viên</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}