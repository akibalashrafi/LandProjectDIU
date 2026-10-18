import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ArrowRight,
  Clock,
  Lock
} from 'lucide-react';

export const ConsentRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Modal State
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [challengeId, setChallengeId] = useState('');
  const [mockCode, setMockCode] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/admin/update-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setRequests(json.data);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestOtp = async (req: any) => {
    setActiveRequest(req);
    setOtpLoading(true);
    setOtpError('');
    setSuccessMessage('');
    setInputOtp('');

    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/admin/update-requests/${req.id}/request-otp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setChallengeId(json.data.challengeId);
        if (json.data.mockCode) {
          setMockCode(json.data.mockCode);
          setInputOtp(json.data.mockCode); // auto-fill mock for quick demo
        }
      } else {
        setOtpError(json.message || 'Failed to generate OTP.');
      }
    } catch (err) {
      setOtpError('Failed to request OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest || !challengeId || !inputOtp.trim()) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/admin/update-requests/${activeRequest.id}/confirm-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId,
          code: inputOtp.trim()
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'OTP verification failed.');
      }

      setSuccessMessage(lang === 'bn' ? 'সংশোধন সফলভাবে অনুমোদিত ও প্রয়োগ করা হয়েছে!' : 'Update verified and applied to land parcel!');
      setActiveRequest(null);
      await fetchRequests();
    } catch (err: any) {
      setOtpError(err.message || 'Failed to verify OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('navConsentRequests')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn'
            ? 'প্রশাসনিক কোনো পরিবর্তনের পূর্বে নাগরিকের ওয়ান-টাইম পাসওয়ার্ড (OTP) সম্মতি নিশ্চিতকরণ।'
            : 'Zero silent record updates: Administrators cannot modify records without citizen OTP verification.'}
        </p>
      </div>

      <DemoBanner />

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'অনুরোধ লোড হচ্ছে...' : 'Loading requests...'}
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">
            {lang === 'bn' ? 'কোনো অমীমাংসিত অনুমতি অনুরোধ নেই' : 'No Pending Update Requests'}
          </h3>
          <p className="text-slate-500">
            {lang === 'bn'
              ? 'আপনার রেকর্ডে কোনো পরিবর্তন প্রস্তাব বর্তমানে পেন্ডিং নেই।'
              : 'There are no active administrative change requests awaiting your consent.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const isPending = req.status === 'PENDING_USER_CONSENT';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {req.requestId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {lang === 'bn' ? 'প্রস্তাবিত ফিল্ড সংশোধন:' : 'Proposed Field Correction:'} {req.fieldName}
                    </h3>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {lang === 'bn' ? 'পূর্ববর্তী বর্তমান মান' : 'Current Value'}
                    </span>
                    <span className="font-mono font-bold text-rose-800 text-sm">
                      {req.oldValue || '(None)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                      {lang === 'bn' ? 'প্রশাসনিক প্রস্তাবিত নতুন মান' : 'Proposed New Value'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 text-sm">
                      {req.proposedValue}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p>
                    <strong>{lang === 'bn' ? 'সংশোধনের আইনি কারণ:' : 'Official Reason:'}</strong> {req.reason}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Proposed by Administrator: {req.adminName || req.adminAuthorId}
                  </p>
                </div>

                {isPending && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-amber-950">
                        {lang === 'bn' ? 'নাগরিক ওটিপি (OTP) দ্বারা যাচাই আবশ্যক' : 'Citizen Verification Required'}
                      </p>
                      <p className="text-amber-800 text-[11px]">
                        {lang === 'bn'
                          ? 'আপনার নিবন্ধিত মোবাইল নম্বরে ওটিপি কোড পাঠিয়ে এই পরিবর্তন অনুমোদন করতে পারেন।'
                          : 'You must verify via an expiring one-time code to apply this record update.'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRequestOtp(req)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-xs whitespace-nowrap"
                    >
                      {lang === 'bn' ? 'OTP কোড পাঠান ও অনুমোদন করুন' : 'Request OTP & Consent'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* OTP Challenge Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'bn' ? 'মোবাইল OTP নিশ্চিতকরণ' : 'Mobile OTP Verification'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? `কোড পাঠানো হয়েছে: ${user?.phone}` : `Code dispatched to: ${user?.phone}`}
              </p>
            </div>

            {mockCode && (
              <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-center text-xs text-emerald-900">
                <span className="font-bold">💡 DEV MOCK OTP:</span>{' '}
                <span className="font-mono font-extrabold text-sm text-emerald-950 tracking-wider">
                  {mockCode}
                </span>
              </div>
            )}

            {otpError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {otpError}
              </div>
            )}

            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                  {lang === 'bn' ? '৬-ডিজিট কোড লিখুন' : 'Enter 6-digit Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={inputOtp}
                  onChange={e => setInputOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRequest(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                >
                  {otpLoading ? 'Verifying...' : t('btnVerifyOtp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
