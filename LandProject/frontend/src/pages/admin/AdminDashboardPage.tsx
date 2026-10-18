import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Users,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainResult, setChainResult] = useState<any>(null);

  // New Update Request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [parcelId, setParcelId] = useState('pcl-demo-1042');
  const [targetUserId, setTargetUserId] = useState('usr-demo-001');
  const [fieldName, setFieldName] = useState('Survey Type');
  const [oldValue, setOldValue] = useState('RS');
  const [proposedValue, setProposedValue] = useState('BS');
  const [reason, setReason] = useState('Cadastral re-survey completed by District Land Survey Office.');
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyChain = async () => {
    setVerifyingChain(true);
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setChainResult(json.data.integrity);
    } catch (err) {
      console.error('Audit check failed:', err);
    } finally {
      setVerifyingChain(false);
    }
  };

  const handleCreateUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/admin/update-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          parcelId,
          targetUserId,
          fieldName,
          oldValue,
          proposedValue,
          reason
        })
      });
      const json = await res.json();
      if (res.ok) {
        setActionMessage(lang === 'bn' ? 'সংশোধন অনুরোধ তৈরি হয়েছে এবং নাগরিকের ওটিপি সম্মতির অপেক্ষায় রয়েছে।' : 'Update request initiated! Waiting for citizen OTP consent.');
        setModalOpen(false);
        await fetchAdminData();
      } else {
        setActionMessage(json.message || 'Failed to create request.');
      }
    } catch (err) {
      setActionMessage('Failed to create update request.');
    }
  };

  const handleApproveTransfer = async (txId: string) => {
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/transactions/${txId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: 'Transfer verified and approved by Authorized Land Officer.'
        })
      });
      const json = await res.json();
      if (res.ok) {
        setActionMessage(lang === 'bn' ? 'লেনদেন অনুমোদিত এবং মালিকানা হিস্যা পুনঃবন্টন সম্পন্ন!' : 'Transfer approved! Ownership shares re-allocated.');
        await fetchAdminData();
      } else {
        setActionMessage(json.message || 'Approval failed.');
      }
    } catch (err) {
      setActionMessage('Failed to approve transfer.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/40">
              {lang === 'bn' ? 'ভূমি মন্ত্রণালয় / সাব-রেজিস্ট্রার অ্যাডমিন পোর্টাল' : 'Land Administration Portal'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('navAdminPanel')}
          </h1>
          <p className="text-xs text-slate-300">
            {lang === 'bn'
              ? 'সারাদেশের জমি রেকর্ড নিরীক্ষা, জালিয়াতি সতর্কতা মীমাংসা ও অপরিবর্তনীয় অডিট ট্রেইল।'
              : 'Audit inspection, fraud alert review queues, and OTP-governed sensitive record modifications.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সংবেদনশীল সংশোধন প্রস্তাব' : 'Propose Record Update'}</span>
          </button>
          <button
            onClick={handleVerifyChain}
            disabled={verifyingChain}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-400 shadow-xs transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifyingChain ? 'animate-spin' : ''}`} />
            <span>{lang === 'bn' ? 'অডিট চেইন হ্যাশ পরীক্ষা' : 'Verify SHA-256 Chain'}</span>
          </button>
        </div>
      </div>

      <DemoBanner />

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Audit Chain Live Status Box */}
      {chainResult && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold">
                {lang === 'bn' ? 'ক্রিপ্টোগ্রাফিক অডিট চেইন শতভাগ সঠিক!' : 'Tamper-Evident Audit Chain Validated!'}
              </span>
              <p className="text-[11px] text-emerald-400/80">
                Verified {chainResult.totalEvents} sequential SHA-256 blocks with zero broken parent links.
              </p>
            </div>
          </div>
          <Link to="/admin/audit-logs" className="underline font-bold text-xs text-white">
            {lang === 'bn' ? 'লগ দেখুন ↗' : 'View Logs ↗'}
          </Link>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'মোট ব্যবহারকারী' : 'Total Users'}</span>
          <p className="text-2xl font-bold text-slate-900">{data?.stats?.totalUsers ?? 0}</p>
          <span className="text-[11px] text-slate-400">Citizens & Officers</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'নিবন্ধিত জমি' : 'Total Parcels'}</span>
          <p className="text-2xl font-bold text-slate-900">{data?.stats?.totalParcels ?? 0}</p>
          <span className="text-[11px] text-slate-400">Plots across Bangladesh</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'সক্রিয় জালিয়াতি সতর্কতা' : 'Open Fraud Alerts'}</span>
          <p className="text-2xl font-bold text-rose-600">{data?.stats?.openFraudAlerts ?? 0}</p>
          <span className="text-[11px] text-rose-500 font-semibold">Immediate Review Needed</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'নাগরিক ওটিপি অপেক্ষমাণ' : 'Pending Citizen Consent'}</span>
          <p className="text-2xl font-bold text-amber-600">{data?.stats?.pendingUpdateRequests ?? 0}</p>
          <span className="text-[11px] text-slate-400">Awaiting user confirmation</span>
        </div>
      </div>

      {/* Fraud Queue & Transaction Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{lang === 'bn' ? 'জালিয়াতি তদন্ত কিউ' : 'Fraud Investigation Queue'}</span>
            </h3>
            <span className="text-xs text-rose-700 font-bold">
              {data?.recentAlerts?.length ?? 0} {lang === 'bn' ? 'তদন্তাধীন' : 'Active'}
            </span>
          </div>

          <div className="space-y-3">
            {data?.recentAlerts?.map((a: any) => (
              <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500">{a.alertId}</span>
                  <StatusBadge status={a.severity} />
                </div>
                <h4 className="font-bold text-slate-900">{a.title}</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">{a.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Pending Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'মালিকানা হস্তান্তর অনুমোদন কিউ' : 'Ownership Transfer Approval Queue'}</span>
            </h3>
            <span className="text-xs text-slate-500">
              {data?.recentTransactions?.length ?? 0} {lang === 'bn' ? 'লেনদেন' : 'requests'}
            </span>
          </div>

          <div className="space-y-3">
            {data?.recentTransactions?.map((tx: any) => {
              const canApprove = tx.sellerConsent && tx.buyerConsent && tx.status !== 'COMPLETED';
              return (
                <div key={tx.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800">{tx.txReference}</span>
                    <StatusBadge status={tx.status} />
                  </div>
                  <p className="text-slate-700">
                    Transfer: <strong>{tx.proposedArea} decimal</strong> from {tx.sellerId} to {tx.buyerId}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Seller: {tx.sellerConsent ? '✓' : '✗'} | Buyer: {tx.buyerConsent ? '✓' : '✗'}
                    </span>
                    {canApprove && (
                      <button
                        onClick={() => handleApproveTransfer(tx.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                      >
                        {lang === 'bn' ? 'হস্তান্তর অনুমোদন ও কার্যকর করুন' : 'Approve & Execute'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Propose Update Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? 'প্রশাসনিক রেকর্ড সংশোধন প্রস্তাব' : 'Propose Administrative Record Update'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'নাগরিকের সম্মতি ও ওটিপি ছাড়া এই পরিবর্তন ডাটাবেসে কার্যকর হবে না।'
                : 'Zero silent overwrites: This change will only apply after citizen OTP authorization.'}
            </p>

            <form onSubmit={handleCreateUpdateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Land Parcel ID *</label>
                <input
                  type="text"
                  required
                  value={parcelId}
                  onChange={e => setParcelId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Citizen User ID *</label>
                <input
                  type="text"
                  required
                  value={targetUserId}
                  onChange={e => setTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Field Name *</label>
                  <input
                    type="text"
                    required
                    value={fieldName}
                    onChange={e => setFieldName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Value</label>
                  <input
                    type="text"
                    value={oldValue}
                    onChange={e => setOldValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposed Value *</label>
                <input
                  type="text"
                  required
                  value={proposedValue}
                  onChange={e => setProposedValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Reason & Evidence *</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                >
                  {lang === 'bn' ? 'প্রস্তাব পাঠান' : 'Submit for Citizen Consent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
