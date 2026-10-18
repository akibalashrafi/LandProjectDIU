import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  MapPin,
  Calendar,
  AlertTriangle,
  QrCode,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';

export const PublicVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { lang, t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualToken, setManualToken] = useState(token || '');

  const fetchVerification = async (tok: string) => {
    if (!tok.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/public/verify/${encodeURIComponent(tok.trim())}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      } else {
        setError(json.message || (lang === 'bn' ? 'যাচাই টোকেন পাওয়া যায়নি।' : 'Verification token not found.'));
        setData(null);
      }
    } catch (err) {
      setError(lang === 'bn' ? 'সার্ভার সংযোগে ত্রুটি।' : 'Failed to connect to verification service.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVerification(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVerification(manualToken);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <QrCode className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'পাবলিক ডিজিটাল ভেরিফিকেশন পোর্টাল' : 'Public Digital Verification Portal'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navPublicVerify')}
        </h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          {lang === 'bn'
            ? 'সুরক্ষিত QR কোড বা ভেরিফিকেশন টোকেন ব্যবহার করে দলিলের ক্রিপ্টোগ্রাফিক সত্যতা যাচাই করুন।'
            : 'Inspect cryptographic SHA-256 integrity and sanitized cadastral metadata using secure non-guessable tokens.'}
        </p>
      </div>

      <DemoBanner />

      {/* Manual Search Form */}
      <form onSubmit={handleManualSearch} className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <input
          type="text"
          value={manualToken}
          onChange={e => setManualToken(e.target.value)}
          placeholder={lang === 'bn' ? 'ভেরিফিকেশন টোকেন পেস্ট করুন (যেমন: tok-verify-clean-1001)...' : 'Paste verification token (e.g. tok-verify-clean-1001)...'}
          className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-semibold text-xs transition flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>{t('btnVerify')}</span>
        </button>
      </form>

      {/* Results Container */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই হচ্ছে...' : 'Verifying cryptographic integrity...'}
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2 text-rose-900 shadow-xs">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-sm">{lang === 'bn' ? 'রেকর্ড পাওয়া যায়নি' : 'Record Not Found'}</h3>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      ) : data ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-6">
          {/* Status Header */}
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  {data.documentId}
                </span>
                <span className="text-xs text-slate-400">
                  {data.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{data.originalFilename}</h2>
            </div>
            <StatusBadge status={data.verificationStatus} className="text-sm px-3 py-1" />
          </div>

          <div className="px-6 space-y-6">
            {/* Cryptographic SHA-256 Block */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  SHA-256 Digital Fingerprint
                </span>
                <span className="text-[10px] text-emerald-700 font-mono">256-bit Cryptographic Hash</span>
              </div>
              <p className="font-mono text-xs break-all text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                {data.sha256Hash}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn'
                  ? 'এই হ্যাশটি দলিলের প্রতিটি অক্ষরের গাণিতিক প্রতিফলন। মূল ফাইলে সামান্যতম পরিবর্তন থাকলেও এই হ্যাশ বদলে যাবে।'
                  : 'This hash uniquely identifies the digital file. Any alteration to text, stamps, or signatures invalidates this checksum.'}
              </p>
            </div>

            {/* Sanitized Cadastral Summary */}
            {data.parcelSummary && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary-700" />
                  {lang === 'bn' ? 'সংযুক্ত জমির প্রকাশ্য ভৌগোলিক তথ্য' : 'Sanitized Cadastral Location'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldDistrict')}</span>
                    <span className="font-semibold text-slate-800">{data.parcelSummary.district}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldUpazila')}</span>
                    <span className="font-semibold text-slate-800">{data.parcelSummary.upazila}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldMouza')}</span>
                    <span className="font-semibold text-slate-800">{data.parcelSummary.mouza}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldPlotNumber')}</span>
                    <span className="font-bold text-emerald-800 text-sm">{data.parcelSummary.plotNumber}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldKhatianNumber')}</span>
                    <span className="font-semibold text-slate-800">{data.parcelSummary.khatianNumber}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{t('fieldSurveyType')}</span>
                    <span className="font-semibold text-slate-800">{data.parcelSummary.surveyType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Shield Notice */}
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">
                  {lang === 'bn' ? 'ব্যক্তিগত তথ্য সুরক্ষা (Privacy by Design):' : 'Data Minimization & Privacy Protection:'}
                </span>{' '}
                {lang === 'bn'
                  ? 'জাতীয় পরিচয়পত্র নম্বর (NID), ব্যক্তিগত ফোন নম্বর ও মালিকের সম্পূর্ণ প্রোফাইল এই পাবলিক যাচাই পেজে সুরক্ষিত রাখা হয়েছে।'
                  : 'Personal National IDs, contact details, and private financial data are strictly protected from public exposure.'}
              </div>
            </div>
          </div>

          {/* Footer Timestamp */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'bn' ? 'যাচাইকাল:' : 'Verified on:'} {new Date(data.verifiedAt).toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
              Token: {data.publicToken}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
