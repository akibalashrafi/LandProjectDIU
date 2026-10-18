import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import { MapPin, PlusCircle, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const NewLandPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Mirpur');
  const [mouza, setMouza] = useState('Kallyanpur');
  const [jlNumber, setJlNumber] = useState('JL-145');
  const [khatianNumber, setKhatianNumber] = useState('512');
  const [plotNumber, setPlotNumber] = useState('689');
  const [surveyType, setSurveyType] = useState('BS');
  const [totalArea, setTotalArea] = useState('4.5');
  const [areaUnit, setAreaUnit] = useState<'decimal' | 'acre' | 'sqft'>('decimal');
  const [claimedShare, setClaimedShare] = useState('4.5');
  const [acquisitionMethod, setAcquisitionMethod] = useState('PURCHASE');
  const [acquisitionDate, setAcquisitionDate] = useState('2023-05-10');
  const [sourceDeedRef, setSourceDeedRef] = useState('DEED-DHK-2023-512');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/lands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          district,
          upazila,
          mouza,
          jlNumber,
          khatianNumber,
          plotNumber,
          surveyType,
          totalArea,
          areaUnit,
          claimedShare,
          acquisitionMethod,
          acquisitionDate,
          sourceDeedRef,
          notes
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to register parcel.');
      }

      navigate(`/dashboard/lands/${json.data.parcel.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/lands')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navAddLand')}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'মৌজা, খতিয়ান, দাগ এবং মালিকানার অংশের সঠিক বিবরণ প্রদান করুন।'
              : 'Record a new cadastral land parcel with plot, survey type, and claimed ownership portion.'}
          </p>
        </div>
      </div>

      <DemoBanner />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'bn' ? '১. ভৌগোলিক অবস্থান ও মৌজা' : '1. Geographical Location'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldDistrict')} *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="e.g. Dhaka"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldUpazila')} *
              </label>
              <input
                type="text"
                required
                value={upazila}
                onChange={e => setUpazila(e.target.value)}
                placeholder="e.g. Mirpur"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldMouza')} *
              </label>
              <input
                type="text"
                required
                value={mouza}
                onChange={e => setMouza(e.target.value)}
                placeholder="e.g. Kallyanpur"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'bn' ? '২. খতিয়ান, দাগ ও জরিপের বিবরণ' : '2. Cadastral Survey Identifiers'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldJlNumber')}
              </label>
              <input
                type="text"
                value={jlNumber}
                onChange={e => setJlNumber(e.target.value)}
                placeholder="JL-145"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldKhatianNumber')} *
              </label>
              <input
                type="text"
                required
                value={khatianNumber}
                onChange={e => setKhatianNumber(e.target.value)}
                placeholder="512"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldPlotNumber')} *
              </label>
              <input
                type="text"
                required
                value={plotNumber}
                onChange={e => setPlotNumber(e.target.value)}
                placeholder="689"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldSurveyType')} *
              </label>
              <select
                value={surveyType}
                onChange={e => setSurveyType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="BS">BS (বাংলাদেশ সার্ভে)</option>
                <option value="RS">RS (রিভিশনাল সার্ভে)</option>
                <option value="SA">SA (স্টেট একুইজিশন)</option>
                <option value="CS">CS (ক্যাডাস্ট্রাল সার্ভে)</option>
                <option value="City Survey">City Survey (সিটি সার্ভে)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'bn' ? '৩. জমির আয়তন ও মালিকানার অংশ' : '3. Land Area & Ownership Share'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldTotalArea')} *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={totalArea}
                onChange={e => setTotalArea(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldAreaUnit')} *
              </label>
              <select
                value={areaUnit}
                onChange={e => setAreaUnit(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="decimal">{t('unitDecimal')}</option>
                <option value="acre">{t('unitAcre')}</option>
                <option value="sqft">{t('unitSqft')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldClaimedShare')} *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={claimedShare}
                onChange={e => setClaimedShare(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldAcquisitionMethod')}
              </label>
              <select
                value={acquisitionMethod}
                onChange={e => setAcquisitionMethod(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="PURCHASE">{lang === 'bn' ? 'ক্রয়সূত্রে' : 'Purchase'}</option>
                <option value="INHERITANCE">{lang === 'bn' ? 'ওয়ারিশসূত্রে / উত্তরাধিকার' : 'Inheritance'}</option>
                <option value="GIFT">{lang === 'bn' ? 'দান / হেবা' : 'Gift / Heba'}</option>
                <option value="ALLOTMENT">{lang === 'bn' ? 'সরকারি বরাদ্দ' : 'Government Allotment'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldAcquisitionDate')}
              </label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={e => setAcquisitionDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldDeedRef')}
              </label>
              <input
                type="text"
                value={sourceDeedRef}
                onChange={e => setSourceDeedRef(e.target.value)}
                placeholder="e.g. DEED-2023-512"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t('fieldNotes')}
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={lang === 'bn' ? 'জমির অবস্থান, সীমানা বা প্রাসঙ্গিক প্রমাণাদির বিবরণ...' : 'Boundary, road access or additional notes...'}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard/lands')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('btnCancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
          >
            {loading ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : t('btnSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};
