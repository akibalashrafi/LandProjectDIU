import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  ArrowRightLeft,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const NewTransactionPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultParcelId = searchParams.get('parcelId') || '';

  const [parcels, setParcels] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState(defaultParcelId);
  const [buyerPhone, setBuyerPhone] = useState('01711000002'); // Farhana demo
  const [proposedArea, setProposedArea] = useState('2.0');
  const [transferNotes, setTransferNotes] = useState('Land purchase agreement proposal for residential plot.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/lands', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setParcels(json.data);
          if (!selectedParcelId && json.data.length > 0) {
            setSelectedParcelId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load lands:', err);
      }
    };

    fetchParcels();
  }, []);

  const selectedParcel = parcels.find(p => p.id === selectedParcelId);
  const sellerShare = selectedParcel?.userClaim?.recordSupportedShare ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcelId) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে একটি জমি নির্বাচন করুন।' : 'Please select a land parcel.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          parcelId: selectedParcelId,
          buyerPhone,
          proposedArea: parseFloat(proposedArea),
          transferNotes
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Transaction submission failed.');
      }

      navigate('/dashboard/transactions');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/transactions')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navNewTransaction')}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'আপনার মালিকানাধীন জমি থেকে নির্ধারিত অংশ বিক্রির জন্য প্রস্তাবনা পাঠান।'
              : 'Initiate a land sale proposal to a verified buyer with automated share checks.'}
          </p>
        </div>
      </div>

      <DemoBanner />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Land Parcel Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {lang === 'bn' ? 'বিক্রয়যোগ্য জমি নির্বাচন করুন' : 'Select Land Parcel to Sell From'} *
          </label>
          <select
            value={selectedParcelId}
            onChange={e => setSelectedParcelId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
          >
            {parcels.map(p => (
              <option key={p.id} value={p.id}>
                {p.internalParcelId} • Plot {p.plotNumber} ({p.mouza}) - Verified Share: {p.userClaim?.recordSupportedShare ?? 0} {p.areaUnit}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Parcel Capacity Notice */}
        {selectedParcel && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">
                {lang === 'bn' ? 'মোট জমির পরিমাণ' : 'Total Parcel Area'}
              </span>
              <span className="font-semibold text-slate-800">
                {selectedParcel.totalArea} {selectedParcel.areaUnit}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                {lang === 'bn' ? 'আপনার যাচাইকৃত বৈধ হিস্যা' : 'Your Verified Share'}
              </span>
              <span className="font-bold text-emerald-800 text-sm">
                {sellerShare} {selectedParcel.areaUnit}
              </span>
            </div>
          </div>
        )}

        {/* Proposed Transfer Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {lang === 'bn' ? 'প্রস্তাবিত বিক্রির পরিমাণ (শতাংশ)' : 'Proposed Sale Area (Decimals)'} *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={proposedArea}
            onChange={e => setProposedArea(e.target.value)}
            placeholder="2.0"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
          />
          {selectedParcel && parseFloat(proposedArea) > sellerShare && (
            <p className="text-[11px] text-rose-600 font-bold mt-1">
              ⚠️ {lang === 'bn' ? 'সতর্কতা: বিক্রির পরিমাণ আপনার যাচাইকৃত হিস্যার অতিরিক্ত!' : 'Warning: Proposed area exceeds your verified share!'}
            </p>
          )}
        </div>

        {/* Proposed Buyer Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {lang === 'bn' ? 'প্রস্তাবিত ক্রেতার মোবাইল নম্বর (LandSure BD-তে নিবন্ধিত)' : 'Proposed Buyer Mobile Number'} *
          </label>
          <input
            type="text"
            required
            value={buyerPhone}
            onChange={e => setBuyerPhone(e.target.value)}
            placeholder="017XXXXXXXX"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            💡 {lang === 'bn' ? 'ডেমো ক্রেতা: 01711000002 (ফারহানা ইয়াসমিন)' : 'Demo buyer: 01711000002 (Farhana Yasmin)'}
          </p>
        </div>

        {/* Transfer Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {lang === 'bn' ? 'লেনদেনের বিবরণ ও শর্তাবলী' : 'Transaction Terms & Notes'}
          </label>
          <textarea
            rows={2}
            value={transferNotes}
            onChange={e => setTransferNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard/transactions')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('btnCancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
          >
            {loading ? (lang === 'bn' ? 'প্রস্তাব পাঠানো হচ্ছে...' : 'Submitting proposal...') : t('btnSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};
