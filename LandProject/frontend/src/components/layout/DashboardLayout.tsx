import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../common/DemoBanner';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  FileCheck2,
  ArrowRightLeft,
  ShieldAlert,
  KeyRound,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Upload,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'REVIEWER';

  const navItems = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/dashboard/lands', label: t('navMyLands'), icon: MapPin },
    { to: '/dashboard/lands/new', label: t('navAddLand'), icon: PlusCircle },
    { to: '/dashboard/documents', label: t('navMyDocuments'), icon: FileText },
    { to: '/dashboard/documents/upload', label: t('navUploadDoc'), icon: Upload },
    { to: '/dashboard/verification-reports', label: t('navVerificationReports'), icon: FileCheck2 },
    { to: '/dashboard/transactions', label: t('navTransactions'), icon: ArrowRightLeft },
    { to: '/dashboard/alerts', label: t('navAlerts'), icon: ShieldAlert },
    { to: '/dashboard/consent-requests', label: t('navConsentRequests'), icon: KeyRound }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner compact />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-navy-950 text-slate-300 border-r border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">LandSure BD</span>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700/80 text-emerald-200 font-bold flex items-center justify-center text-sm border border-emerald-500/40">
                {user?.fullName.slice(0, 1) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {user?.role === 'ADMIN' ? t('roleAdmin') : user?.role === 'REVIEWER' ? t('roleReviewer') : t('roleCitizen')}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 truncate">📞 {user?.phone}</p>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Staff Admin Links */}
            {isStaff && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <p className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'প্রশাসনিক ব্যবস্থাপনা' : 'Administrative'}
                </p>
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-300 hover:bg-amber-950/60'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{t('navAdminPanel')}</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 text-slate-400"
              title={t('navLogout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Bar on Mobile & Tablet */}
          <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <span className="font-bold text-slate-900 text-sm">LandSure BD</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLang}
                className="px-2.5 py-1 rounded text-xs border border-slate-200 font-semibold"
              >
                {lang === 'bn' ? 'EN' : 'বাং'}
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-1.5 text-slate-500 hover:text-rose-600"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Drawer */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
              <div className="w-64 bg-navy-950 text-white flex flex-col p-4 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-bold">LandSure BD</span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 mt-4 overflow-y-auto">
                  {navItems.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                        isActive(item.to) ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  {isStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-950/60"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{t('navAdminPanel')}</span>
                    </Link>
                  )}
                </nav>
              </div>
              <div className="flex-1" onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* Dynamic Page Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
