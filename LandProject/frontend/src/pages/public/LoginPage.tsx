import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import { ShieldCheck, Lock, Phone, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('01711000001');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(phone, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      await quickLogin(role);
      navigate(role === 'ADMIN' || role === 'REVIEWER' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary-800 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'লগইন করুন' : 'Sign in to LandSure BD'}
        </h1>
        <p className="text-xs text-slate-500">
          {lang === 'bn' ? 'আপনার ডিজিটাল ভূমি রেকর্ডে প্রবেশ করুন' : 'Access your verified digital land ownership workspace'}
        </p>
      </div>

      <DemoBanner />

      {/* Quick Demo Switcher Card for Judges */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'bn' ? 'এক ক্লিকে ডেমো প্রোফাইল' : 'One-Click Demo Personas'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemo('CITIZEN')}
            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 font-semibold text-slate-800 text-left transition shadow-xs"
          >
            Tanvir Ahmed
            <span className="block text-[10px] text-slate-500 font-normal">Citizen / Seller</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('BUYER')}
            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 font-semibold text-slate-800 text-left transition shadow-xs"
          >
            Farhana Yasmin
            <span className="block text-[10px] text-slate-500 font-normal">Citizen / Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 hover:border-amber-500 font-semibold text-amber-950 text-left transition shadow-xs"
          >
            Anisur Rahman
            <span className="block text-[10px] text-amber-700 font-normal">System Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('REVIEWER')}
            className="p-2.5 rounded-xl bg-sky-50 border border-sky-300 hover:border-sky-500 font-semibold text-sky-950 text-left transition shadow-xs"
          >
            Shamima Nasreen
            <span className="block text-[10px] text-sky-700 font-normal">AC Land Reviewer</span>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary-800 hover:bg-primary-900 text-white font-semibold text-sm transition shadow-md shadow-primary-900/20"
        >
          {loading ? (lang === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...') : t('navLogin')}
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          {lang === 'bn' ? 'নতুন ব্যবহারকারী?' : "Don't have an account?"}{' '}
          <Link to="/register" className="font-bold text-primary-700 hover:underline">
            {t('navRegister')}
          </Link>
        </p>
      </form>
    </div>
  );
};
