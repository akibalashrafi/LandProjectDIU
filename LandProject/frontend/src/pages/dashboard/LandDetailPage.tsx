import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  MapPin,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  Upload,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  Users,
  Lock,
  Plus
} from 'lucide-react';

export const LandDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reChecking, setReChecking] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLandDetail = async () => {
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/lands/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load parcel detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandDetail();
  }, [id]);

  const handleRunFraudCheck = async () => {
    if (!data?.parcel?.id) return;
    setReChecking(true);
    setMessage('');
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/fraud/check/${data.parcel.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setMessage(json.message);
      await fetchLandDetail();
    } catch (err) {
      setMessage('Failed to run check.');
    } finally {
      setReChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        {lang === 'bn' ? 'জমির বিস্তারিত লোড হচ্ছে...' : 'Loading parcel details...'}
      </div>
    );
  }

  if (!data?.parcel) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="font-bold text-slate-800">{lang === 'bn' ? 'জমি পাওয়া যায়নি।' : 'Land parcel not found.'}</p>
        <button
          onClick={() => navigate('/dashboard/lands')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs"
        >
          {lang === 'bn' ? 'ফিরে যান' : 'Go back'}
        </button>
      </div>
    );
  }

  const { parcel, claims, documents, alerts, transactions } = data;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/lands')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {parcel.internalParcelId}
              </span>
              <StatusBadge status={parcel.verificationStatus} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t('fieldPlotNumber')}: {parcel.plotNumber} • {parcel.mouza}, {parcel.upazila}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunFraudCheck}
            disabled={reChecking}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${reChecking ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{t('btnReCheck')}</span>
          </button>
          <Link
            to={`/dashboard/documents/upload?parcelId=${parcel.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('navUploadDoc')}</span>
          </Link>
          <Link
            to={`/dashboard/transactions/new?parcelId=${parcel.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{t('navNewTransaction')}</span>
          </Link>
        </div>
      </div>

      <DemoBanner />

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Cadastral Specs Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'bn' ? 'ক্যাডাস্ট্রাল ও ভৌগোলিক তথ্য' : 'Cadastral & Geographical Attributes'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldDistrict')}</span>
            <span className="font-semibold text-slate-800">{parcel.district}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldUpazila')}</span>
            <span className="font-semibold text-slate-800">{parcel.upazila}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldMouza')}</span>
            <span className="font-semibold text-slate-800">{parcel.mouza}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldJlNumber')}</span>
            <span className="font-semibold text-slate-800">{parcel.jlNumber || 'N/A'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldKhatianNumber')}</span>
            <span className="font-bold text-slate-900 text-sm">{parcel.khatianNumber}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldPlotNumber')}</span>
            <span className="font-bold text-emerald-800 text-sm">{parcel.plotNumber}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldSurveyType')}</span>
            <span className="font-semibold text-slate-800">{parcel.surveyType}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">{t('fieldTotalArea')}</span>
            <span className="font-bold text-slate-900 text-sm">
              {parcel.totalArea} {parcel.areaUnit}
            </span>
          </div>
        </div>

        {parcel.notes && (
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            📝 <strong>{t('fieldNotes')}:</strong> {parcel.notes}
          </p>
        )}
      </div>

      {/* Active Fraud Alerts If Any */}
      {alerts && alerts.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>{lang === 'bn' ? 'সক্রিয় জালিয়াতি বা অসঙ্গতির সতর্কতা' : 'Active Discrepancy & Fraud Alerts'}</span>
            </h3>
            <span className="text-xs font-bold text-rose-800 bg-rose-200 px-2 py-0.5 rounded-full">
              {alerts.length} {lang === 'bn' ? 'সতর্কতা' : 'Alerts'}
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alt: any) => (
              <div key={alt.id} className="bg-white rounded-xl p-4 border border-rose-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">{alt.title}</span>
                  <StatusBadge status={alt.severity} />
                </div>
                <p className="text-slate-700 leading-relaxed">{alt.explanation}</p>
                {alt.conflictingFields && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] font-mono text-slate-700 space-y-1">
                    {Object.entries(alt.conflictingFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-semibold text-slate-800">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ownership Claims & Co-Owners */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'bn' ? 'রেকর্ডভুক্ত মালিকানা হিস্যা ও অংশীদার' : 'Ownership Shares & Claimants'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-100 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">{lang === 'bn' ? 'মালিকের নাম' : 'Owner Name'}</th>
                <th className="py-2.5 px-3">{t('fieldClaimedShare')}</th>
                <th className="py-2.5 px-3">{lang === 'bn' ? 'যাচাইকৃত বৈধ হিস্যা' : 'Verified Share'}</th>
                <th className="py-2.5 px-3">{t('fieldAcquisitionMethod')}</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {c.ownerName || c.userId}
                    {c.ownerPhoneMasked && <span className="block text-[10px] text-slate-400 font-normal">{c.ownerPhoneMasked}</span>}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {c.claimedShare} {parcel.areaUnit}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">
                    {c.recordSupportedShare} {parcel.areaUnit}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{c.acquisitionMethod}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>{t('navMyDocuments')}</span>
          </h3>
          <Link
            to={`/dashboard/documents/upload?parcelId=${parcel.id}`}
            className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('navUploadDoc')}</span>
          </Link>
        </div>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {lang === 'bn' ? 'কোনো দলিল আপলোড করা হয়নি।' : 'No documents attached to this parcel yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((d: any) => (
              <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 font-bold">{d.documentId}</span>
                  <StatusBadge status={d.verificationStatus} />
                </div>
                <h4 className="font-bold text-slate-900 truncate">{d.originalFilename}</h4>
                <p className="font-mono text-[10px] text-slate-500 truncate">
                  SHA-256: {d.sha256Hash}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{d.category}</span>
                  <Link
                    to={`/verify/${d.publicToken}`}
                    target="_blank"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Public QR Verify ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
