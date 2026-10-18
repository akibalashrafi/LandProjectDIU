import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  MapPin,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  KeyRound,
  PlusCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [recentLands, setRecentLands] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const [meRes, landsRes, alertsRes] = await Promise.all([
          fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/lands', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/fraud/alerts', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setStats(meData.data.stats);
        }
        if (landsRes.ok) {
          const landsData = await landsRes.json();
          setRecentLands(landsData.data.slice(0, 3));
        }
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setRecentAlerts(alertsData.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'bn' ? `স্বাগতম, ${user?.fullName}` : `Welcome, ${user?.fullName}`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'আপনার ডিজিটাল জমি ও দলিলের সম্পূর্ণ ওভারভিউ ও নিরাপত্তা নিরীক্ষা।'
              : 'Digital land records overview, cryptographic verification, and pending transactions.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/lands/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('navAddLand')}</span>
          </Link>
          <Link
            to="/dashboard/documents/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>{t('navUploadDoc')}</span>
          </Link>
        </div>
      </div>

      <DemoBanner />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lands */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('cardTotalLands')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalParcels ?? 0}</p>
          <p className="text-[11px] text-slate-400">
            {stats?.totalOwnedArea ?? 0} {lang === 'bn' ? 'শতাংশ হিস্যা' : 'decimals recorded'}
          </p>
        </div>

        {/* Documents */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('cardDocumentsSubmitted')}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalDocuments ?? 0}</p>
          <p className="text-[11px] text-slate-400">
            {stats?.pendingDocuments ?? 0} {lang === 'bn' ? 'যাচাই অপেক্ষমাণ' : 'pending review'}
          </p>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('cardPendingTransactions')}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.pendingTransactions ?? 0}</p>
          <p className="text-[11px] text-slate-400">
            {stats?.completedTransactions ?? 0} {lang === 'bn' ? 'সম্পন্ন লেনদেন' : 'completed'}
          </p>
        </div>

        {/* Active Fraud Alerts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('cardActiveAlerts')}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600">{stats?.activeAlertsCount ?? 0}</p>
          <p className="text-[11px] text-slate-400">
            {lang === 'bn' ? 'তদন্তাধীন অমিল বা অভিযোগ' : 'conflicts requiring review'}
          </p>
        </div>
      </div>

      {/* Citizen Consent Alert if Any */}
      {stats?.pendingConsentRequests > 0 && (
        <div className="bg-amber-500/15 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {lang === 'bn' ? 'প্রশাসনিক পরিবর্তন অনুরোধ অপেক্ষমাণ' : 'Pending Administrative Update Request'}
              </h4>
              <p className="text-xs text-amber-800">
                {lang === 'bn'
                  ? 'আপনার একটি জমির রেকর্ডে সংশোধনের জন্য আপনার ওটিপি (OTP) সম্মতি চাওয়া হয়েছে।'
                  : 'An administrator proposed a record correction requiring your OTP consent.'}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/consent-requests"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap transition"
          >
            {lang === 'bn' ? 'অনুমতি দেখুন ও OTP দিন' : 'Review & Verify OTP'}
          </Link>
        </div>
      )}

      {/* Recent Lands & Active Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Lands */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{t('navMyLands')}</span>
            </h3>
            <Link to="/dashboard/lands" className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1">
              {lang === 'bn' ? 'সব দেখুন' : 'View all'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLands.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {lang === 'bn' ? 'কোনো জমি নিবন্ধিত নেই।' : 'No land parcels recorded yet.'}
              </p>
            ) : (
              recentLands.map(parcel => (
                <Link
                  key={parcel.id}
                  to={`/dashboard/lands/${parcel.id}`}
                  className="block p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {parcel.internalParcelId} • {t('fieldPlotNumber')}: {parcel.plotNumber}
                    </span>
                    <StatusBadge status={parcel.verificationStatus} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {parcel.mouza}, {parcel.upazila}, {parcel.district}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                    <span>{t('fieldSurveyType')}: {parcel.surveyType}</span>
                    <span className="font-semibold text-emerald-800">
                      {parcel.userClaim?.claimedShare ?? parcel.totalArea} {parcel.areaUnit}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Active Fraud Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{t('navAlerts')}</span>
            </h3>
            <Link to="/dashboard/alerts" className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1">
              {lang === 'bn' ? 'সব সতর্কতা' : 'View alerts'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="font-medium text-slate-700">
                  {lang === 'bn' ? 'কোনো সক্রিয় সতর্কতা নেই' : 'No active fraud alerts'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'সকল জমি ও দলিলের রেকর্ড সামঞ্জস্যপূর্ণ।' : 'All recorded claims are structurally consistent.'}
                </p>
              </div>
            ) : (
              recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-900">{alert.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{alert.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
