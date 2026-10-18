import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../common/DemoBanner';
import {
  ShieldCheck,
  Globe,
  UserCheck,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  FileCheck2,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, quickLogin } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleQuickLogin = async (role: string) => {
    setDemoMenuOpen(false);
    await quickLogin(role);
    if (role === 'ADMIN' || role === 'REVIEWER') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <DemoBanner compact />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-primary-950 flex items-center justify-center shadow-md shadow-primary-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">LandSure</span>
                <span className="text-xs font-black uppercase tracking-wider bg-primary-800 text-emerald-300 px-1.5 py-0.5 rounded">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-none">
                {lang === 'bn' ? 'ডিজিটাল ভূমি রেকর্ড ও জালিয়াতি প্রতিরোধ' : 'Digital Land Ownership & Verification'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-800 rounded-md hover:bg-slate-100 transition">
              {t('navHome')}
            </Link>
            <Link to="/how-it-works" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-800 rounded-md hover:bg-slate-100 transition">
              {t('navHowItWorks')}
            </Link>
            <Link to="/verification-rules" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-800 rounded-md hover:bg-slate-100 transition">
              {t('navVerificationRules')}
            </Link>
            <Link to="/verify/tok-verify-clean-1001" className="px-3 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 rounded-md hover:bg-emerald-50 transition flex items-center gap-1">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              {t('navPublicVerify')}
            </Link>
          </nav>

          {/* Right Actions: Language Switcher, Demo Personas, Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Switch Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-primary-700" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Quick Demo Personas Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-primary-200 bg-primary-50 text-xs font-semibold text-primary-900 hover:bg-primary-100 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-primary-700" />
                <span>{t('btnQuickLogin')}</span>
                <ChevronDown className="w-3 h-3 text-primary-600" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'এক ক্লিকে ডেমো প্রোফাইল' : 'One-Click Demo Personas'}
                  </div>
                  <button
                    onClick={() => handleQuickLogin('CITIZEN')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-900">Tanvir Ahmed (তানভীর আহমেদ)</span>
                    <span className="text-[10px] text-slate-500">Citizen / Seller • 01711000001</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('BUYER')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-900">Farhana Yasmin (ফারহানা ইয়াসমিন)</span>
                    <span className="text-[10px] text-slate-500">Citizen / Buyer • 01711000002</span>
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    onClick={() => handleQuickLogin('ADMIN')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 flex flex-col gap-0.5 text-amber-900"
                  >
                    <span className="font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Anisur Rahman (সিস্টেম অ্যাডমিন)
                    </span>
                    <span className="text-[10px] text-amber-700">Administrator • 01811000001</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('REVIEWER')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 flex flex-col gap-0.5 text-sky-900"
                  >
                    <span className="font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-sky-600" />
                      Shamima Nasreen (তদন্তকারী)
                    </span>
                    <span className="text-[10px] text-sky-700">Authorized Reviewer • 01911000001</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={user?.role === 'ADMIN' || user?.role === 'REVIEWER' ? '/admin' : '/dashboard'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-800 text-white text-xs font-semibold hover:bg-primary-900 transition shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {user?.role === 'ADMIN' ? t('navAdminPanel') : t('navDashboard')}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary-800 hover:bg-primary-900 rounded-lg transition shadow-xs"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            {t('navHome')}
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            {t('navHowItWorks')}
          </Link>
          <Link
            to="/verification-rules"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            {t('navVerificationRules')}
          </Link>
          <Link
            to="/verify/tok-verify-clean-1001"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 hover:bg-emerald-50"
          >
            {t('navPublicVerify')}
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 py-1 text-xs font-bold text-slate-400 uppercase">{t('btnQuickLogin')}:</p>
            <div className="grid grid-cols-2 gap-2 p-1">
              <button
                onClick={() => { setMobileMenuOpen(false); handleQuickLogin('CITIZEN'); }}
                className="text-left p-2 rounded bg-slate-50 text-xs font-medium"
              >
                Tanvir (Seller)
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleQuickLogin('BUYER'); }}
                className="text-left p-2 rounded bg-slate-50 text-xs font-medium"
              >
                Farhana (Buyer)
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleQuickLogin('ADMIN'); }}
                className="text-left p-2 rounded bg-amber-50 text-xs font-medium text-amber-900"
              >
                Anisur (Admin)
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleQuickLogin('REVIEWER'); }}
                className="text-left p-2 rounded bg-sky-50 text-xs font-medium text-sky-900"
              >
                Shamima (Reviewer)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
